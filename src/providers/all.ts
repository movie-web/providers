import { Embed, Sourcerer } from '@/providers/base';
import { doodScraper } from '@/providers/embeds/dood';
import { febboxHlsScraper } from '@/providers/embeds/febbox/hls';
import { febboxMp4Scraper } from '@/providers/embeds/febbox/mp4';
import { mixdropScraper } from '@/providers/embeds/mixdrop';
import { mp4uploadScraper } from '@/providers/embeds/mp4upload';
import { streambucketScraper } from '@/providers/embeds/streambucket';
import { streamsbScraper } from '@/providers/embeds/streamsb';
import { upcloudScraper } from '@/providers/embeds/upcloud';
import { upstreamScraper } from '@/providers/embeds/upstream';
import { vidsrcembedScraper } from '@/providers/embeds/vidsrc';
import { flixhqScraper } from '@/providers/sources/flixhq/index';
import { goMoviesScraper } from '@/providers/sources/gomovies/index';
import { kissAsianScraper } from '@/providers/sources/kissasian/index';
import { lookmovieScraper } from '@/providers/sources/lookmovie';
import { remotestreamScraper } from '@/providers/sources/remotestream';
import { showboxScraper } from '@/providers/sources/showbox/index';
import { vidsrcScraper } from '@/providers/sources/vidsrc/index';
import { zoechipScraper } from '@/providers/sources/zoechip';

import { closeLoadScraper } from './embeds/closeload';
import { fileMoonScraper } from './embeds/filemoon';
import { ridooScraper } from './embeds/ridoo';
import { smashyStreamDScraper } from './embeds/smashystream/dued';
import { smashyStreamFScraper } from './embeds/smashystream/video1';
import { vidCloudScraper } from './embeds/vidcloud';
import { vidplayScraper } from './embeds/vidplay';
import { wootlyScraper } from './embeds/wootly';
import { goojaraScraper } from './sources/goojara';
import { hdRezkaScraper } from './sources/hdrezka';
import { nepuScraper } from './sources/nepu';
import { primewireScraper } from './sources/primewire';
import { ridooMoviesScraper } from './sources/ridomovies';
import { smashyStreamScraper } from './sources/smashystream';
import { vidSrcToScraper } from './sources/vidsrcto';

export function gatherAllSources(): Array<Sourcerer> {
  // all sources are gathered here
  return [
    flixhqScraper,
    remotestreamScraper,
    kissAsianScraper,
    showboxScraper,
    goMoviesScraper,
    zoechipScraper,
    vidsrcScraper,
    lookmovieScraper,
    smashyStreamScraper,
    ridooMoviesScraper,
    vidSrcToScraper,
    nepuScraper,
    goojaraScraper,
    hdRezkaScraper,
    primewireScraper,
  ];
}

export function gatherAllEmbeds(): Array<Embed> {
  // all embeds are gathered here
  return [
    upcloudScraper,
    vidCloudScraper,
    mp4uploadScraper,
    streamsbScraper,
    upstreamScraper,
    febboxMp4Scraper,
    febboxHlsScraper,
    mixdropScraper,
    vidsrcembedScraper,
    streambucketScraper,
    smashyStreamFScraper,
    smashyStreamDScraper,
    ridooScraper,
    closeLoadScraper,
    fileMoonScraper,
    vidplayScraper,
    wootlyScraper,
    doodScraper,
  ];
}
