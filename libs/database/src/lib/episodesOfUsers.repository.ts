import { EpisodesOfUsers } from '@prisma/client';
import { db } from './database.service';

export function getEpisodesOfUsersByEpisodeIds(episodeIds: EpisodesOfUsers['episodeId'][]) {
  return db.episodesOfUsers.findMany({ where: { episodeId: { in: episodeIds } } });
}

export function updateEpisodesOfUsersEpisodeId(
  userId: EpisodesOfUsers['userId'],
  episodeId: EpisodesOfUsers['episodeId'],
  updatedEpisodeId: EpisodesOfUsers['episodeId']
) {
  return db.episodesOfUsers.update({
    where: { userId_episodeId: { userId, episodeId } },
    data: { episodeId: updatedEpisodeId },
  });
}
