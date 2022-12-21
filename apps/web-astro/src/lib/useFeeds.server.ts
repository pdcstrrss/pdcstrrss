import { addFeedsToUser, createFeedByUrl, getFeedByUrl, getFeedsOfUser } from '@pdcstrrss/core';
import { formPostSchema, FORM_ACTIONS, FORM_SUBJECTS } from '@pdcstrrss/ui';
import { z } from 'zod';
import type { UserFromRequest } from './useUser';

export const getFeeds = async ({ url, user }: { url: string; user: UserFromRequest }) => {
  // const { limit, offset } = getPaginationFromUrl({ url });
  const feedsData = await getFeedsOfUser({ userId: user.id });
  return feedsData;
};

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
  let feed = await getFeedByUrl(url, { userId: user.id });
  if (!feed) feed = await createFeedByUrl(url);
  if (!feed) throw new Error('Feed could not be retrieved');
  await addFeedsToUser({ userId: user.id, feedIds: [feed.id] });
};
