import { Auditable } from './auditable';

export type Link<T extends Auditable> = Omit<T, 'createdAt' | 'updatedAt'>;
