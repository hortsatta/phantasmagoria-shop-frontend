export type NavItem = {
  path: string;
  label: string;
  iconName?: string;
  hidden?: boolean;
  children?: { [x: string]: NavItem };
};
