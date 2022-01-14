import { AuditTrail } from './core.model';
import { Address, UserAccount } from './user.model';
import { CartItem } from './cart.model';

type OrderItem = CartItem & {
  price: number;
};

type Order = AuditTrail & {
  id: string;
  date: Date;
  totalPrice: number;
  address: Omit<Address, 'id'> & { id?: string };
  orderItems: OrderItem[];
  userAccount: UserAccount;
  paymentIntent: string;
};

export type { Order, OrderItem };
