import { Auditable } from './auditable';
import { Author } from './author';
import { Type } from './type';
import { Link } from './link';
import { Kind } from './kind';

export interface Series extends Auditable {
  name: string;
  year: number;
  summary?: string;
  picture?: string;
  type: Link<Type>;
  authors: Link<Author>[];
  kinds: Link<Kind>[];
}
