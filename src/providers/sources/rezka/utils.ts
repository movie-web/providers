import { Caption, getCaptionTypeFromUrl, labelToLanguageCode } from '@/providers/captions';
import { NotFoundError } from '@/utils/errors';

interface VideoQuality {
  type: string;
  url: string;
}

// Patterns to remove from the encoded stream data
const TRASH_LIST = [
  '//_//QEBAQEAhIyMhXl5e',
  '//_//Xl5eIUAjIyEhIyM=',
  '//_//JCQhIUAkJEBeIUAjJCRA',
  '//_//IyMjI14hISMjIUBA',
  '//_//JCQjISFAIyFAIyM=',
];

// Removes 'trash' from the getStream() response and decodes it
const clearTrash = (data: string): string => {
  try {
    const trashPattern = new RegExp(TRASH_LIST.join('|'), 'g');
    const cleanedData = data.replace(trashPattern, '').replace('#h', '');
    const decodedData = atob(cleanedData);
    return decodedData || '';
  } catch (error) {
    throw new NotFoundError('Error decoding data:');
  }
};

function mapNumericQualityToQualities(numericQuality: number): string {
  switch (numericQuality) {
    case 360:
      return '360';
    case 480:
      return '480';
    case 720:
      return '720';
    case 1080:
      return '1080';
    case 1440:
      // Does not exist in Qualities - still used
      return '1440';
    case 2160:
      return '4k';
    default:
      return 'unknown';
  }
}

// Generates a unique favs value for each request
function generateUUID(): string {
  const randomHex = () => Math.floor(Math.random() * 16).toString(16);
  const generateSegment = (length: number) => Array.from({ length }, randomHex).join('');

  return `${generateSegment(8)}-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(
    12,
  )}`;
}

function parseSubtitleLinks(inputString: string): Caption[] {
  const linksArray = inputString.split(',');
  const captions: Caption[] = [];

  linksArray.forEach((link) => {
    const match = link.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);

    if (match) {
      const type = getCaptionTypeFromUrl(match[2]);
      if (!type) return;
      const language = labelToLanguageCode(match[1]);
      if (!language) return;

      captions.push({
        id: match[2],
        language,
        hasCorsRestrictions: false,
        type,
        url: match[2],
      });
    }
  });

  return captions;
}

function parseVideoLinks(inputString: string): Record<string, VideoQuality> {
  const linksArray = inputString.split(',');
  const result: Record<string, VideoQuality> = {};
  console.log(inputString);
  linksArray.forEach((link) => {
    const match = link.match(/\[(\d+p)](https?:\/\/[^\s,]+\.mp4)/);
    if (match) {
      const quality = match[1];
      const mp4Url = match[2];

      const numericQuality = parseInt(quality, 10);
      const matchedQuality: string = mapNumericQualityToQualities(numericQuality);

      result[matchedQuality] = { type: 'mp4', url: mp4Url };
    }
  });

  return result;
}

// Example 'Titanic, 1997' = { title: 'Titanic', year: 1997 }
const extractTitleAndYear = (input: string) => {
  const regex = /^(.*?),.*?(\d{4})/;
  const match = input.match(regex);

  if (match) {
    const title = match[1];
    const year = match[2];
    return { title: title.trim(), year: year ? parseInt(year, 10) : null };
  }
  return null;
};

export { clearTrash, extractTitleAndYear, parseSubtitleLinks, parseVideoLinks, generateUUID };
