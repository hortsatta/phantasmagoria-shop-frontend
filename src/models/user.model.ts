import { AuditTrail } from 'models';

type User = {
  id: string;
  email: string;
  role: number;
};

type Address = {
  fullName: string;
  phoneNumber: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  zipCode: number;
  addressLine: string;
  isDefault: boolean;
};

type UserAccount = AuditTrail & {
  user: User;
  fullName: string;
  displayName?: string;
  addresses?: Address[];
};

export type { User, UserAccount, Address };
