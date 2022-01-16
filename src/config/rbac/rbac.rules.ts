import { CardProductRbacType, CardRbacType, CartRbacType, OrderRbacType } from './rbac.types';

export const rbacRules: any = {
  '0': {
    roleName: 'Guest',
    static: [CardProductRbacType.READ, CardRbacType.READ, ...Object.values(CartRbacType)]
  },
  '1': {
    roleName: 'Regular',
    static: [
      CardProductRbacType.READ,
      CardRbacType.READ,
      ...Object.values(CartRbacType),
      ...Object.values(OrderRbacType)
    ]
  },
  '3': {
    roleName: 'Administrator',
    static: [
      ...Object.values(CardProductRbacType),
      ...Object.values(CardRbacType),
      ...Object.values(CartRbacType),
      ...Object.values(OrderRbacType)
    ]
  }
};
