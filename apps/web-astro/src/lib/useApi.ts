export function $fetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
  return new Promise((resolve, reject) => {
    return fetch(input, init)
      .then((res) => resolve(res))
      .catch((error) => {
        console.error('API error: ', error);
        reject(error);
      });
  });
}
