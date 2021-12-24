import { AuditTrail } from './core.model';
import { CardProduct } from './shop.model';

export type CartItem = AuditTrail & {
  id: string;
  quantity: number;
  cardProduct: CardProduct;
};
