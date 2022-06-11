import { createCookie } from "@remix-run/node";

export const redirectCookie = createCookie('pdcstrrss.redirect', {
  httpOnly: true,
  secrets: [process.env.SIGNING_SECRET || ''],
  secure: process.env.NODE_ENV === 'production',
});

export const passedIndexCookie = createCookie('pdcstrrss.passedIndex', {
  httpOnly: true,
  secrets: [process.env.SIGNING_SECRET || ''],
  secure: process.env.NODE_ENV === 'production',
});
