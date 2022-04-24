import { createSession, getSessionById, upsertSessionById, deleteSessionById } from "@pdcstrrss/database";
import { createSessionStorage, SessionData } from "@remix-run/node";

function createDatabaseSessionStorage({ cookie }: { cookie: any }) {
  return createSessionStorage({
    cookie,
    createData: createSession,
    async readData(id) {
      const session = await getSessionById(id);
      return (session?.data as SessionData) || null;
    },
    updateData: upsertSessionById,
    deleteData: deleteSessionById,
  });
}

export const sessionStorage = createDatabaseSessionStorage({
  cookie: {
    name: "__session",
    sameSite: "strict",
    secrets: [process.env.SIGNING_SECRET],
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
});

export const { commitSession, getSession, destroySession } = sessionStorage;
