import { AuditTrail } from './core.model';
import { CardProduct } from './shop.model';

type CartItem = AuditTrail & {
  id: string;
  quantity: number;
  cardProduct: CardProduct;
};

type Cart = AuditTrail & {
  id: string;
  cartItems: CartItem[];
};

export type { Cart, CartItem };
