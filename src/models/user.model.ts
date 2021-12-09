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

type PhRegion = {
  code: string;
  name: string;
};

type PhProvince = PhRegion;
type PhCity = PhRegion;
type PhBarangay = PhRegion;

export type { User, UserAccount, Address, PhRegion, PhProvince, PhCity, PhBarangay };
