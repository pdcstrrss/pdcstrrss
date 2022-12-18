import { EpisodeStatus } from '@prisma/client';
import { getEpisodesData, updateEpisodeStatus } from '@pdcstrrss/core';
import { FORM_ACTIONS, FORM_SUBJECTS } from '@pdcstrrss/ui';
import type { AstroGlobal } from 'astro';
import isNumeric from 'validator/lib/isNumeric';
import { z } from 'zod';
import { getUserFromRequest } from './useUser';

export const getEpisodes = async (astro: Readonly<AstroGlobal<Record<string, any>>>) => {
  try {
    const url = new URL(astro.url.href);
    let limit: number | undefined;
    let offset: number | undefined;
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');

    if (limitParam) {
      limit = isNumeric(limitParam) ? Number(limitParam) : undefined;
    }

    if (offsetParam) {
      offset = isNumeric(offsetParam) ? Number(offsetParam) : undefined;
    }

    const user = await getUserFromRequest({ request: astro.request });
    if (!user?.id) throw new Response('User not found', { status: 401 });

    const episodesData = await getEpisodesData({ userId: user.id, limit, offset });
    return episodesData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.error(error);
    throw new Error(error.message || error);
  }
};

const formPostSchema = z.object({
  action: z.nativeEnum(FORM_ACTIONS),
  subject: z.nativeEnum(FORM_SUBJECTS),
});

const toggleEpisodeSchema = formPostSchema.extend({
  status: z.nativeEnum(EpisodeStatus),
  id: z.string(),
});

export const updateEpisodes = async (astro: Readonly<AstroGlobal<Record<string, any>>>) => {
  try {
    if (astro.request.method === 'POST') {
      const dataEntries = await astro.request.formData();
      const data = formPostSchema.parse(Object.fromEntries(dataEntries));
      if (data.action === FORM_ACTIONS.STATUS && data.subject === FORM_SUBJECTS.EPISODE) {
        const user = await getUserFromRequest({ request: astro.request });
        if (!user?.id) throw new Response('User not found', { status: 401 });
        const { id, status } = toggleEpisodeSchema.parse(Object.fromEntries(dataEntries));
        console.log({
          id,
          userId: user?.id,
          status,
        });
        await updateEpisodeStatus(id, user?.id, status);
      }
    }
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};
