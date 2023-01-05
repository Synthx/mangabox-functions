import { Auditable } from './auditable';

export interface Author extends Auditable {
  name: string;
  biography?: string;
}
