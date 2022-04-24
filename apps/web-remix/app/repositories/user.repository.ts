import { OauthSession, User } from "@prisma/client";
import { db } from "~/services/database.server";

type UserUpsert = Pick<User, "email" | "githubId" | "image" | "displayName">;
type UserOauthSessionUpsert = Pick<OauthSession, "accessToken" | "refreshToken">;
type UserWithOAuthSessionUpsert = UserUpsert & UserOauthSessionUpsert;

export async function getById(id: string) {
  return db.user.findUnique({ where: { id } });
}

export async function upsert(newUserData: UserUpsert) {
  return db.user.upsert({
    where: {
      githubId: newUserData.githubId,
    },
    update: newUserData,
    create: newUserData,
  });
}

export async function upsertWithOAuthSession({
  accessToken,
  refreshToken,
  ...newUserData
}: UserWithOAuthSessionUpsert) {
  const oauthSessionData = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  }

  return db.user
    .upsert({
      where: {
        githubId: newUserData.githubId,
      },
      update: {
        ...newUserData,
        oauthSessions: {
          updateMany: {
            where: {
              accessToken,
            },
            data: oauthSessionData,
          },
        },
      },
      create: {
        ...newUserData,
        oauthSessions: {
          create: oauthSessionData,
        },
      },
    })
    .catch((error) => {
      console.error(error);
    });
}
