import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    sameSite: "strict",
    secrets: [process.env.SIGNING_SECRET || ""],
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
});
