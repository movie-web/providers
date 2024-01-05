import { load } from 'cheerio';

import { flags } from '@/entrypoint/utils/targets';
import { SourcererEmbed, makeSourcerer } from '@/providers/base';
import { closeLoadScraper } from '@/providers/embeds/closeload';
import { ridooScraper } from '@/providers/embeds/ridoo';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';
import { NotFoundError } from '@/utils/errors';

import { IframeSourceResult, SearchResult } from './types';

const ridoMoviesBase = `https://ridomovies.tv`;
const ridoMoviesApiBase = `${ridoMoviesBase}/core/api`;

const universalScraper = async (ctx: MovieScrapeContext | ShowScrapeContext) => {
  const searchResult = await ctx.proxiedFetcher<SearchResult>('/search', {
    baseUrl: ridoMoviesApiBase,
    query: {
      q: ctx.media.title,
    },
  });
  const show = searchResult.data.items[0];
  if (!show) throw new NotFoundError('No watchable item found');

  let iframeSourceUrl = `/${show.fullSlug}/videos`;

  if (ctx.media.type === 'show') {
    const showPageResult = await ctx.proxiedFetcher<string>(`/${show.fullSlug}`, {
      baseUrl: ridoMoviesBase,
    });
    const fullEpisodeSlug = `${show.fullSlug}/season-${ctx.media.season.number}/episode-${ctx.media.episode.number}`;
    const regexPattern = new RegExp(
      `\\\\"id\\\\":\\\\"(\\d+)\\\\"(?=.*?\\\\\\"fullSlug\\\\\\":\\\\\\"${fullEpisodeSlug}\\\\\\")`,
      'g',
    );
    const matches = [...showPageResult.matchAll(regexPattern)];
    const episodeIds = matches.map((match) => match[1]);
    if (episodeIds.length === 0) throw new NotFoundError('No watchable item found');
    const episodeId = episodeIds.at(-1);
    iframeSourceUrl = `/episodes/${episodeId}/videos`;
  }

  const iframeSource = await ctx.proxiedFetcher<IframeSourceResult>(iframeSourceUrl, {
    baseUrl: ridoMoviesApiBase,
  });
  const iframeSource$ = load(iframeSource.data[0].url);
  const iframeUrl = iframeSource$('iframe').attr('data-src');
  if (!iframeUrl) throw new NotFoundError('No watchable item found');

  const embeds: SourcererEmbed[] = [];
  if (iframeUrl.includes('closeload')) {
    embeds.push({
      embedId: closeLoadScraper.id,
      url: iframeUrl,
    });
  }
  if (iframeUrl.includes('ridoo')) {
    embeds.push({
      embedId: ridooScraper.id,
      url: iframeUrl,
    });
  }
  return {
    embeds,
  };
};

export const ridooMoviesScraper = makeSourcerer({
  id: 'ridomovies',
  name: 'RidoMovies',
  rank: 105,
  flags: [flags.CORS_ALLOWED],
  scrapeMovie: universalScraper,
  scrapeShow: universalScraper,
});
