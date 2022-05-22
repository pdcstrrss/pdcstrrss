import { createCookie } from "@remix-run/node";

export const redirectCookie = createCookie('pdcstrrss.redirect', {
  httpOnly: true,
  secrets: [process.env.SIGNING_SECRET || ''],
  secure: true,
});
