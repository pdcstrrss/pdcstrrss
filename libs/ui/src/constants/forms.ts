import z from 'zod';

export enum FORM_ACTIONS {
  STATUS = 'STATUS',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}
export enum FORM_SUBJECTS {
  EPISODE = 'EPISODE',
  FEED = 'FEED',
  USER = 'USER',
}

export const formPostSchema = z.object({
  action: z.nativeEnum(FORM_ACTIONS),
  subject: z.nativeEnum(FORM_SUBJECTS),
});
