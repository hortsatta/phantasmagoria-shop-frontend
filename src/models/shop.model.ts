import { AuditTrail, Card } from 'models';

export type CardProduct = AuditTrail & {
  id: string;
  price: number;
  card: Card;
  slug?: string;
};
