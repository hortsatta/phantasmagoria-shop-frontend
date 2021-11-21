import { AuditTrail } from 'models';

export type User = AuditTrail & {
  id: string;
  email: string;
  role: number;
};
