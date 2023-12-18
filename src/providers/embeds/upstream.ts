import * as unpacker from 'unpacker';

import { flags } from '@/main/targets';
import { makeEmbed } from '@/providers/base';

const packedRegex = /(eval\(function\(p,a,c,k,e,d\).*\)\)\))/;
const linkRegex = /sources:\[{file:"(.*?)"/;

export const upstreamScraper = makeEmbed({
  id: 'upstream',
  name: 'UpStream',
  rank: 199,
  async scrape(ctx) {
    // Example url: https://upstream.to/embed-omscqgn6jc8r.html
    const streamRes = await ctx.proxiedFetcher<string>(ctx.url);
    const packed = streamRes.match(packedRegex);

    if (packed) {
      const unpacked = unpacker.unpack(packed[1]);

      const link = unpacked.match(linkRegex);

      if (link) {
        return {
          stream: {
            type: 'hls',
            playlist: link[1].startsWith('http') ? link[1] : `https://s30.upstreamcdn.co${link[1]}`,
            flags: [flags.NO_CORS],
            captions: [],
          },
        };
      }
    }

    throw new Error('upstream source not found');
  },
});
