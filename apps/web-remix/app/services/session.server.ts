import { createSession, getSessionById, upsertSessionById, deleteSessionById } from '@pdcstrrss/database';
import { createSessionStorage, SessionData, CookieOptions, Cookie } from '@remix-run/node';

type ICreateSessionStorageCookie =
  | Cookie
  | (CookieOptions & {
      name?: string;
    });

function createDatabaseSessionStorage({ cookie }: { cookie: ICreateSessionStorageCookie }) {
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

interface ICreateAppSessionStorageParams {
  signingSecret?: string;
}

export const createAppSessionStorage = ({ signingSecret }: ICreateAppSessionStorageParams) => {
  if (!signingSecret) {
    throw new Error('signingSecret is required');
  }

  return createDatabaseSessionStorage({
    cookie: {
      name: '__session',
      sameSite: 'lax',
      secrets: [signingSecret],
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  });
};

export const sessionStorage = createAppSessionStorage({
  signingSecret: process.env.SIGNING_SECRET,
});

export const { commitSession, getSession, destroySession } = sessionStorage;
