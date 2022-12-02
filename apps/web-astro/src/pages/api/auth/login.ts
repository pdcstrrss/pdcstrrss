import type { APIRoute } from 'astro';

function throwError(err: any) {
  return new Response(JSON.stringify(err), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const get: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const response = await fetch(url.origin + '/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ provider: 'github' }),
  });
  const data = await response.json();
  if (!response.ok) throwError(data);
  return redirect(data.loginURL);
};
