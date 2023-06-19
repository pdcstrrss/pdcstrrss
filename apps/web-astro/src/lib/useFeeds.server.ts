import type { Feed } from '@prisma/client';
import { createFeedByForUser, getFeedsOfUser, deleteFeedsOfUser } from '@pdcstrrss/core';
import { formPostSchema, FORM_ACTIONS, FORM_SUBJECTS } from '@pdcstrrss/ui';
import { z } from 'zod';
import type { UserFromRequest } from './useUser';

export const getFeeds = async ({ url, user }: { url: string; user: UserFromRequest }) => {
  // const { limit, offset } = getPaginationFromUrl({ url });
  const feedsData = await getFeedsOfUser({ userId: user.id });
  return feedsData;
};

//
// Create
//
const createFeedSchema = formPostSchema.extend({
  url: z.string().url(),
  action: z.literal(FORM_ACTIONS.CREATE),
  subject: z.literal(FORM_SUBJECTS.FEED),
});

export const createFeed = async ({ request, user }: { request: Request; user: UserFromRequest }) => {
  const dataEntries = await request.formData();
  const data = formPostSchema.safeParse(Object.fromEntries(dataEntries));
  if (!data.success) throw new Error('Invalid form data');
  const { url } = createFeedSchema.parse(Object.fromEntries(dataEntries));
  await createFeedByForUser({ url, userId: user.id });
};

//
// Delete
//
const deleteFeedSchema = formPostSchema.extend({
  action: z.literal(FORM_ACTIONS.DELETE),
  subject: z.literal(FORM_SUBJECTS.FEED),
});

export const deleteFeed = async ({
  request,
  id,
  user,
}: {
  request: Request;
  id: Feed['id'];
  user: UserFromRequest;
}) => {
  const dataEntries = await request.formData();
  const data = formPostSchema.safeParse(Object.fromEntries(dataEntries));
  if (!data.success) throw new Error('Invalid form data');
  deleteFeedSchema.parse(Object.fromEntries(dataEntries));
  await deleteFeedsOfUser({ feedIds: [id], userId: user.id });
};
