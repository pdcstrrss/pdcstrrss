import { Prisma } from "@prisma/client";

export interface IAuthenticationCookie {
  id: string;
  accessToken: string;
}

export interface IRepositoryFilters {
  offset?: number;
  limit?: number;
  orderBy?: Prisma.Enumerable<Prisma.EpisodeOrderByWithRelationInput>;
}

export type IRequiredRepositoryFilters<K> = K & Pick<Required<IRepositoryFilters>, 'offset' | 'limit' | 'orderBy'>
