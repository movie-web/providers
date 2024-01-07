import { flags } from '@/entrypoint/utils/targets';
import { SourcererOutput, makeSourcerer } from '@/providers/base';
import { MovieScrapeContext, ScrapeContext, ShowScrapeContext } from '@/utils/context';
import { NotFoundError } from '@/utils/errors';

import { clearTrash, extractTitleAndYear, generateUUID, parseSubtitleLinks, parseVideoLinks } from './utils';

interface MovieData {
  url: string;
  title: string;
  id: string | null;
  year: number | null;
  titleAndYear: string;
  type: 'show' | 'movie';
}

interface SeasonData {
  number: number;
  tmdbId: string;
}

interface RequestData {
  id: string | null | undefined;
  translator_id: number;
  season: number | SeasonData;
  episode: number | SeasonData;
  favs: string;
  action: string;
}

const rezkaBase = 'https://rezka.ag';

async function searchAndFindMedia({
  type,
  title,
  releaseYear,
  ctx,
}: {
  type: 'show' | 'movie';
  title: string;
  releaseYear: number;
  ctx: ScrapeContext;
}): Promise<MovieData | null> {
  const itemRegexPattern = /<a href="([^"]+)"><span class="enty">([^<]+)<\/span> \(([^)]+)\)/g;
  const idRegexPattern = /\/(\d+)-[^/]+\.html$/;

  try {
    const searchData = await ctx.proxiedFetcher<string>(`/engine/ajax/search.php?q=${encodeURIComponent(title)}`, {
      baseUrl: rezkaBase,
    });

    const movieData: MovieData[] = [];

    for (const match of searchData.matchAll(itemRegexPattern)) {
      const url = match[1];
      const titleAndYear = match[3];

      const result = extractTitleAndYear(titleAndYear);
      if (result !== null) {
        const { title: movieTitle, year } = result;
        const id = url.match(idRegexPattern)?.[1] || null;

        movieData.push({ url, title: movieTitle, id, year, titleAndYear, type });
      }
    }

    const filteredItems = movieData.filter((item) => item.type === type && item.year === releaseYear);

    return filteredItems.length > 0 ? filteredItems[0] : null;
  } catch (error) {
    throw new NotFoundError('No result found');
  }
}

async function getStream(requestData: RequestData, ctx: ScrapeContext): Promise<any> {
  try {
    const response = await ctx.proxiedFetcher<string>('/ajax/get_cdn_series/', {
      baseUrl: rezkaBase,
      method: 'POST',
      body: new URLSearchParams({
        id: requestData.id || '',
        translator_id: requestData.translator_id.toString(),
        season: requestData.season.toString(),
        episode: requestData.episode.toString(),
        favs: requestData.favs,
        action: requestData.action,
      }).toString(),
      headers: {
        // Content-type is needed to fetch
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    // Turns response string to JSON
    return JSON.parse(response);
  } catch (error) {
    throw new NotFoundError('Could not fetch the stream data');
  }
}

const universalScraper = async (ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> => {
  const foundMedia = await searchAndFindMedia({
    type: ctx.media.type === 'show' ? 'show' : 'movie',
    title: ctx.media.title,
    releaseYear: ctx.media.releaseYear,
    ctx,
  });

  const requestData = {
    id: foundMedia?.id,
    translator_id: 238, // Standard value for original language
    season: ctx.media.type === 'show' ? ctx.media.season : 1,
    episode: ctx.media.type === 'show' ? ctx.media.episode : 1,
    favs: generateUUID(), // Random UUID
    action: ctx.media.type === 'show' ? 'get_episodes' : 'get_movie',
  };
  const { url: streamUrl, subtitle: streamSubtitle } = await getStream(requestData, ctx);
  const parsedVideos = parseVideoLinks(clearTrash(streamUrl));
  const parsedSubtitles = parseSubtitleLinks(streamSubtitle);

  return {
    embeds: [],
    stream: [
      {
        id: 'primary',
        type: 'file',
        flags: [flags.CORS_ALLOWED],
        captions: parsedSubtitles,
        qualities: parsedVideos,
      },
    ],
  };
};

export const rezkaScraper = makeSourcerer({
  id: 'rezka',
  name: 'Rezka HD',
  rank: 195,
  flags: [flags.CORS_ALLOWED],
  scrapeShow: universalScraper,
  scrapeMovie: universalScraper,
});
