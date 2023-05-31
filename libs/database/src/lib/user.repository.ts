import { db } from './database.service';

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      accounts: {
        select: {
          provider: true,
          providerAccountId: true,
          access_token: true,
        },
      },
    },
  });
}
