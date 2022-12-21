import { EpisodeStatus } from '@prisma/client';
import { getEpisodesData, updateEpisodeStatus } from '@pdcstrrss/core';
import { FORM_ACTIONS, FORM_SUBJECTS } from '@pdcstrrss/ui';
import type { AstroGlobal } from 'astro';
import isNumeric from 'validator/lib/isNumeric';
import { z } from 'zod';
import type { getUserFromRequest, UserFromRequest } from './useUser';
import { getPaginationFromUrl } from './usePagination';

export const getEpisodes = async ({ url, user }: { url: string; user: UserFromRequest }) => {
  const { limit, offset } = getPaginationFromUrl({ url });
  const episodesData = await getEpisodesData({ userId: user.id, limit, offset });
  return episodesData;
};

const formPostSchema = z.object({
  action: z.nativeEnum(FORM_ACTIONS),
  subject: z.nativeEnum(FORM_SUBJECTS),
});

const toggleEpisodeSchema = formPostSchema.extend({
  status: z.nativeEnum(EpisodeStatus),
  id: z.string(),
});

export const updateEpisodes = async ({ request, user }: { request: Request; user: UserFromRequest }) => {
  const dataEntries = await request.formData();
  const data = formPostSchema.parse(Object.fromEntries(dataEntries));
  if (data.action === FORM_ACTIONS.STATUS && data.subject === FORM_SUBJECTS.EPISODE) {
    const { id, status } = toggleEpisodeSchema.parse(Object.fromEntries(dataEntries));
    console.log({
      id,
      userId: user?.id,
      status,
    });
    await updateEpisodeStatus(id, user?.id, status);
  }
};
