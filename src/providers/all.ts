import { Embed, Sourcerer } from '@/providers/base';
import { febBoxScraper } from '@/providers/embeds/febBox';
import { mixdropScraper } from '@/providers/embeds/mixdrop';
import { mp4uploadScraper } from '@/providers/embeds/mp4upload';
import { streamsbScraper } from '@/providers/embeds/streamsb';
import { streamvidScraper } from '@/providers/embeds/streamvid';
import { upcloudScraper } from '@/providers/embeds/upcloud';
import { upstreamScraper } from '@/providers/embeds/upstream';
import { voeScraper } from '@/providers/embeds/voe';
import { flixhqScraper } from '@/providers/sources/flixhq/index';
import { goMoviesScraper } from '@/providers/sources/gomovies/index';
import { kissAsianScraper } from '@/providers/sources/kissasian/index';
import { lookmovieScraper } from '@/providers/sources/lookmovie';
import { primewireScraper } from '@/providers/sources/primewire';
import { remotestreamScraper } from '@/providers/sources/remotestream';
import { showBoxScraper } from '@/providers/sources/showbox';
import { superStreamScraper } from '@/providers/sources/superstream/index';
import { zoechipScraper } from '@/providers/sources/zoechip';

export function gatherAllSources(): Array<Sourcerer> {
  // all sources are gathered here
  return [
    flixhqScraper,
    remotestreamScraper,
    kissAsianScraper,
    superStreamScraper,
    goMoviesScraper,
    zoechipScraper,
    lookmovieScraper,
    showBoxScraper,
    primewireScraper,
  ];
}

export function gatherAllEmbeds(): Array<Embed> {
  // all embeds are gathered here
  return [
    upcloudScraper,
    mp4uploadScraper,
    streamsbScraper,
    febBoxScraper,
    mixdropScraper,
    upstreamScraper,
    streamvidScraper,
    voeScraper,
  ];
}
