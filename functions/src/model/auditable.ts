import { Timestamp } from 'firebase-admin/firestore';

export interface Auditable {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
