import { AuditTrail, Card } from 'models';

export type CardProduct = AuditTrail & {
  id: string;
  name: string;
  price: number;
  cards: Card[];
  description?: string;
  image?: any;
  slug?: string;
};
