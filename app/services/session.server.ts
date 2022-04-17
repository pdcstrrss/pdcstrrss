import { createSessionStorage, SessionData } from "@remix-run/node";
import { db } from "./database.server";

function createDatabaseSessionStorage({ cookie }: { cookie: any }) {
  return createSessionStorage({
    cookie,
    async createData(data: any) {
      const { id } = await db.session.create({ data: { data } });
      return id;
    },
    async readData(id) {
      const session = await db.session.findUnique({ where: { id } });
      return (session?.data as SessionData) || null;
    },
    async updateData(id, data) {
      await db.session.upsert({ where: { id }, create: { data }, update: { data } });
    },
    async deleteData(id) {
      await db.session.delete({ where: { id } });
    },
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
