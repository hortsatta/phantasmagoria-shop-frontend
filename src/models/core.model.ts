import { User } from 'models';

type AppModule = {
  key: string;
  path: string;
  label: string;
  iconName?: string;
  hidden?: boolean;
  children?: { [x: string]: AppModule };
};

type UpdatedBy = {
  user: User;
  date: Date;
};

type AuditTrail = {
  createdAt?: Date;
  updatedAt?: UpdatedBy[];
  publishedAt?: Date;
};

type PhRegion = {
  code: string;
  name: string;
};

type PhProvince = PhRegion;
type PhCity = PhRegion;
type PhBarangay = PhRegion;

export type { AppModule, AuditTrail, PhRegion, PhProvince, PhCity, PhBarangay, UpdatedBy };
