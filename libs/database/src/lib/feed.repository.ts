import { Feed } from '@prisma/client';
import { db } from './database.service';

// Get

export async function getFeedsWithIdUrl() {
  return db.feed.findMany({ select: { id: true, url: true } });
}

export async function getFeedsWithEpisodeIds(feedIds: Feed['id'][]) {
  return db.feed.findMany({
    where: { id: { in: feedIds } },
    include: { episodes: { select: { id: true, users: { select: { userId: true } } } } },
  });
}

export async function deleteFeedsByIds(feedIds: Feed['id'][]) {
  return db.feed.deleteMany({ where: { id: { in: feedIds } } });
}
