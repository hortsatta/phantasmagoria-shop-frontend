type AppModule = {
  key: string;
  path: string;
  label: string;
  iconName?: string;
  hidden?: boolean;
  children?: { [x: string]: AppModule };
};

type AuditTrail = {
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
};

export type { AppModule, AuditTrail };
