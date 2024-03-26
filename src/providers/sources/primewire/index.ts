import { load } from 'cheerio';

import { flags } from '@/entrypoint/utils/targets';
import { makeSourcerer } from '@/providers/base';
import { ScrapeContext } from '@/utils/context';
import { NotFoundError } from '@/utils/errors';

import { getLinks } from './blowfish';
import { primewireApiKey, primewireBase } from './common';

async function search(ctx: ScrapeContext, imdbId: string) {
  const searchResult = await ctx.proxiedFetcher<{
    id: string;
  }>('/api/v1/show/', {
    baseUrl: primewireBase,
    query: {
      key: primewireApiKey,
      imdb_id: imdbId,
    },
  });

  return searchResult.id;
}

async function getStreams(title: string) {
  const titlePage = load(title);
  const userData = titlePage('#user-data').attr('v');
  if (!userData) throw new NotFoundError('No user data found');

  const links = getLinks(userData);

  const embeds = [];

  for (const link in links) {
    if (link.includes(link)) {
      const element = titlePage(`.propper-link[link_version='${link}']`);
      const sourceName = element.parent().parent().parent().find('.version-host').text().trim();
      let embedId;
      switch (sourceName) {
        case 'mixdrop.co':
          embedId = 'mixdrop';
          break;
        case 'voe.sx':
          embedId = 'voe';
          break;
        case 'upstream.to':
          embedId = 'upstream';
          break;
        case 'streamvid.net':
          embedId = 'streamvid';
          break;
        default:
          embedId = null;
      }
      if (!embedId) continue;
      embeds.push({
        url: `https://www.primewire.tf/links/go/${links[link]}`,
        embedId,
      });
    }
  }

  return embeds;
}

export const primewireScraper = makeSourcerer({
  id: 'primewire',
  name: 'Primewire',
  rank: 250,
  flags: [flags.CORS_ALLOWED],
  async scrapeMovie(ctx) {
    if (!ctx.media.imdbId) throw new Error('No imdbId provided');
    const searchResult = await search(ctx, ctx.media.imdbId);

    const title = await ctx.fetcher<string>(`movie/${searchResult}`, {
      baseUrl: primewireBase,
    });

    const embeds = await getStreams(title);

    return {
      embeds,
    };
  },
  async scrapeShow(ctx) {
    if (!ctx.media.imdbId) throw new Error('No imdbId provided');
    const searchResult = await search(ctx, ctx.media.imdbId);

    const season = await ctx.fetcher<string>(`tv/${searchResult}`, {
      baseUrl: primewireBase,
    });

    const seasonPage = load(season);

    const episodeLink = seasonPage(`.show_season[data-id='${ctx.media.season.number}'] > div > a`)
      .toArray()
      .find((link) => {
        return link.attribs.href.includes(`-episode-${ctx.media.episode.number}`);
      })?.attribs.href;

    if (!episodeLink) throw new NotFoundError('No episode links found');

    const title = await ctx.fetcher<string>(episodeLink, {
      baseUrl: primewireBase,
    });

    const embeds = await getStreams(title);

    return {
      embeds,
    };
  },
});
