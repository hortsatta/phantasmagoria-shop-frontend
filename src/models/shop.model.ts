import { Card } from 'models';

export type CardProduct = {
  id: number;
  price: number;
  card: Card;
  slug?: string;
};
