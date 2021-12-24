import { AuditTrail } from './core.model';
import { Card } from './card.model';

export type CardProduct = AuditTrail & {
  id: string;
  name: string;
  price: number;
  cards: Card[];
  isActive: boolean;
  description?: string;
  image?: any;
  slug?: string;
  favorites?: any[];
};
