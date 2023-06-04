import { Episode } from '@prisma/client';
import { db } from './database.service';

export async function deleteEpisodesByIds(episodeIds: Episode['id'][]) {
  return db.episode.deleteMany({ where: { id: { in: episodeIds } } });
}
