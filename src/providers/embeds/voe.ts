import { flags } from '@/main/targets';
import { makeEmbed } from '@/providers/base';

const linkRegex = /'hls': ?'(http.*?)',/;

export const voeScraper = makeEmbed({
  id: 'voe',
  name: 'voe.sx',
  rank: 180,
  async scrape(ctx) {
    const embed = await ctx.proxiedFetcher<string>(ctx.url);

    const playerSrc = embed.match(linkRegex) ?? [];

    const streamUrl = playerSrc[1];
    if (!streamUrl) throw new Error('Stream url not found in embed code');

    return {
      stream: {
        type: 'hls',
        playlist: streamUrl,
        flags: [flags.NO_CORS],
        captions: [],
      },
    };
  },
});
