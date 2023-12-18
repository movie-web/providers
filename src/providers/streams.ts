import { Flags } from '@/main/targets';
import { Caption } from '@/providers/captions';

export type StreamFile = {
  type: 'mp4';
  url: string;
  headers?: Record<string, string>;
};

export type Qualities = 'unknown' | '360' | '480' | '720' | '1080' | '4K';

export type FileBasedStream = {
  type: 'file';
  flags: Flags[];
  qualities: Partial<Record<Qualities, StreamFile>>;
  captions: Caption[];
};

export type HlsBasedStream = {
  type: 'hls';
  flags: Flags[];
  playlist: string;
  captions: Caption[];
};

export type Stream = FileBasedStream | HlsBasedStream;
