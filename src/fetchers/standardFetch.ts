import { serializeBody } from '@/fetchers/body';
import { makeFullUrl } from '@/fetchers/common';
import { FetchLike } from '@/fetchers/fetch';
import { Fetcher } from '@/fetchers/types';

export function makeStandardFetcher(f: FetchLike): Fetcher {
  const normalFetch: Fetcher = async (url, ops) => {
    const fullUrl = makeFullUrl(url, ops);
    const seralizedBody = serializeBody(ops.body);

    const res = await f(fullUrl, {
      method: ops.method,
      headers: {
        ...seralizedBody.headers,
        ...ops.headers,
      },
      body: seralizedBody.body,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (isJson) return res.json();

    return res.text();
  };

  return normalFetch;
}
