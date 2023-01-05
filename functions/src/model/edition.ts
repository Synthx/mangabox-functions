import { Auditable } from './auditable';
import { Link } from './link';
import { Series } from './series';
import { Publisher } from './publisher';

export interface Edition extends Auditable {
  name: string;
  status: EditionStatus;
  picture?: string;
  publisher: Link<Publisher>;
  series: Link<Series>;
}

export enum EditionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  STOPPED = 'STOPPED',
}
