import { SessionData } from "@remix-run/node";
import { db } from "~/services/database.server";

export async function getSessionById(id: string) {
  return db.session.findUnique({ where: { id } });
}

export async function createSession(sessionData: SessionData, expires?: Date | undefined) {
  const { id } = await db.session.create({ data: { data: sessionData } });
  return id;
}

export async function upsertSessionById(id: string, sessionData: SessionData) {
  await db.session.upsert({ where: { id }, create: { data: sessionData }, update: { data: sessionData } });
}

export async function deleteSessionById(id: string) {
  await db.session.delete({ where: { id } });
}
