import * as unpacker from 'unpacker';

import { flags } from '@/main/targets';
import { makeEmbed } from '@/providers/base';

const packedRegex = /(eval\(function\(p,a,c,k,e,d\).*\)\)\))/;
const linkRegex = /src:"(https:\/\/[^"]+)"/;

export const streamvidScraper = makeEmbed({
  id: 'streamvid',
  name: 'Streamvid',
  rank: 215,
  async scrape(ctx) {
    // Example url: https://streamvid.net/fu1jaf96vofx
    const streamRes = await ctx.proxiedFetcher<string>(ctx.url);
    const packed = streamRes.match(packedRegex);

    if (!packed) throw new Error('streamvid packed not found');

    const unpacked = unpacker.unpack(packed[1]);
    const link = unpacked.match(linkRegex);

    if (!link) throw new Error('streamvid link not found');
    return {
      stream: {
        type: 'hls',
        playlist: link[1],
        flags: [flags.NO_CORS],
        captions: [],
      },
    };
  },
});
