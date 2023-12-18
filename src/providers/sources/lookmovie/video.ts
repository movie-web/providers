import { MovieMedia, ShowMedia } from '@/main/media';
import { ScrapeContext } from '@/utils/context';

import { StreamsDataResult } from './type';

export async function getVideoSources(
  ctx: ScrapeContext,
  id: string,
  media: MovieMedia | ShowMedia,
): Promise<StreamsDataResult> {
  // Fetch video sources

  let path = '';
  if (media.type === 'show') {
    path = `/v1/episodes/view`;
  } else if (media.type === 'movie') {
    path = `/v1/movies/view`;
  }
  const data = await ctx.fetcher<StreamsDataResult>(path, {
    baseUrl: 'https://lmscript.xyz',
    query: { expand: 'streams', id },
  });
  return data;
}

export async function getVideoUrl(
  ctx: ScrapeContext,
  id: string,
  media: MovieMedia | ShowMedia,
): Promise<string | null> {
  // Get sources
  const data = await getVideoSources(ctx, id, media);
  const videoSources = data.streams;

  // Find video URL and return it
  const opts = [
    'auto',
    '4K',
    '4k',
    '1080p',
    '1080',
    '720p',
    '720',
    '480p',
    '480',
    '240p',
    '240',
    '360p',
    '360',
    '144',
    '144p',
  ];

  let videoUrl: string | null = null;
  for (const res of opts) {
    if (videoSources[res] && !videoUrl) {
      videoUrl = videoSources[res];
    }
  }

  return videoUrl;
}
