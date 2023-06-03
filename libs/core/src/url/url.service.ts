export async function normalizeUrl(url: string) {
  try {
    const { default: normalizeUrl } = await import('normalize-url').catch(() => {
      throw new Error('Failed to import normalize-url');
    });
    return normalizeUrl(url);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to normalize url');
  }
}

export async function isEqualUrl(a: string, b: string) {
  try {
    return (await normalizeUrl(a)) === (await normalizeUrl(b));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to compare urls');
  }
}
