export async function getLinks(input: string): Promise<string[]> {
  // eslint-disable-next-line
  // @ts-ignore
  const { getLinks: getLinkFunc } = await import('./blowfish.js');
  return getLinkFunc(input);
}
