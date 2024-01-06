export function $fetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(input, init);
      return resolve(res);
    } catch (error) {
      console.error('API error: ', error);
      reject(error);
    }
  });
}
