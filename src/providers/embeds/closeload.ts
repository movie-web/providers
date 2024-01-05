import { load } from 'cheerio';
import { unpack } from 'unpacker';

import { flags } from '@/entrypoint/utils/targets';
import { NotFoundError } from '@/utils/errors';

import { makeEmbed } from '../base';
import { Caption, getCaptionTypeFromUrl, labelToLanguageCode } from '../captions';

const referer = 'https://ridomovies.tv/';

export const closeLoadScraper = makeEmbed({
  id: 'closeload',
  name: 'CloseLoad',
  rank: 106,
  async scrape(ctx) {
    const baseUrl = new URL(ctx.url).origin;

    const iframeRes = await ctx.proxiedFetcher<string>(ctx.url, {
      headers: { referer },
    });
    const iframeRes$ = load(iframeRes);
    const captions: Caption[] = iframeRes$('track')
      .map((_, el) => {
        const track = iframeRes$(el);
        const url = `${baseUrl}${track.attr('src')}`;
        const label = track.attr('label') ?? '';
        const language = labelToLanguageCode(label);
        const captionType = getCaptionTypeFromUrl(url);

        if (!language || !captionType) return null;
        return {
          id: url,
          language,
          hasCorsRestrictions: false,
          type: captionType,
          url,
        };
      })
      .get()
      .filter((x) => x !== null);

    const evalCode = iframeRes$('script')
      .filter((_, el) => {
        const script = iframeRes$(el);
        return (script.attr('type') === 'text/javascript' && script.html()?.includes('eval')) ?? false;
      })
      .html();
    if (!evalCode) throw new Error("Couldn't find eval code");
    const decoded = unpack(evalCode);
    const regexPattern = /var\s+(\w+)\s*=\s*"([^"]+)";/g;
    const base64EncodedUrl = regexPattern.exec(decoded)?.[2];
    if (!base64EncodedUrl) throw new NotFoundError('Unable to find source url');
    const url = atob(base64EncodedUrl);
    return {
      stream: [
        {
          id: 'primary',
          type: 'hls',
          playlist: url,
          captions,
          flags: [flags.IP_LOCKED],
        },
      ],
    };
  },
});
