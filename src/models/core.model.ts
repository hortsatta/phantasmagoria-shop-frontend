type NavItem = {
  key: string;
  path: string;
  label: string;
  iconName?: string;
  hidden?: boolean;
  children?: { [x: string]: NavItem };
};

type AuditTrail = {
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
};

export type { NavItem, AuditTrail };
