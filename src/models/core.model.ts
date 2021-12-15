import { User } from './user.model';

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

type SelectOption = {
  value: string | number;
  label: string;
};

export type { AppModule, AuditTrail, SelectOption, UpdatedBy };
