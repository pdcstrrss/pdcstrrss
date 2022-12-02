import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const response = await fetch(url.origin + '/api/auth/signout', {
    method: 'DELETE',
  });
  // const data = await response.json();
  return redirect('/', 308);
  // return {
  //   status: 200,
  //   body: 'Logged out',
  // }
};
