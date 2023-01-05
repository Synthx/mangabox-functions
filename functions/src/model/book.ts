import { Auditable } from './auditable';
import { Timestamp } from 'firebase-admin/firestore';
import { Link } from './link';
import { Edition } from './edition';

export interface Book extends Auditable {
  name: string;
  volume: number;
  publicationDate: Timestamp;
  isbn: string;
  asin?: string;
  summary?: string;
  picture?: string;
  lastAddedAt?: Timestamp;
  edition: Link<Edition>;
}
