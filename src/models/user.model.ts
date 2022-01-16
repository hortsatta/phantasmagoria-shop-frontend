import { AuditTrail } from './core.model';

type UserRole = {
  id: string;
};

type User = {
  id: string;
  email: string;
  role: UserRole;
};

type Address = {
  id: string;
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
  id: string;
  user: User;
  fullName: string;
  displayName?: string;
  addresses?: Address[];
};

type PhRegion = {
  code: string;
  name: string;
};

type PhProvince = PhRegion;
type PhCity = PhRegion;
type PhBarangay = PhRegion;

export type { User, UserAccount, Address, PhRegion, PhProvince, PhCity, PhBarangay };
