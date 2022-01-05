import { AuditTrail } from './core.model';
import { CartItem } from './cart.model';
import { Address, UserAccount } from './user.model';

export type Order = AuditTrail & {
  id: string;
  date: Date;
  totalPrice: number;
  address: Omit<Address, 'id'>;
  cartItems: CartItem[];
  userAccount: UserAccount;
};
