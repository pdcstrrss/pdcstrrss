import type { APIRoute } from 'astro';

function throwError(err: any) {
  return new Response(JSON.stringify(err), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const get: APIRoute = async ({ request, redirect, cookies }) => {
  try {
    const referer = request.headers.get('referer');
    const url = new URL(request.url);

    if (referer && referer?.includes(url.origin)) {
      const { pathname } = new URL(referer);
      if (['/app/account'].includes(pathname)) {
        cookies.set('pdcstrrss.redirect', pathname);
      }
    }

    const response = await fetch(url.origin + '/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ provider: 'github' }),
    });
    const data = await response.json();
    if (!response.ok) throwError(data);
    return redirect(data.loginURL);
  } catch (error) {
    return throwError(error);
  }
};
