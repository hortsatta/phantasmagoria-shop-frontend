import { AuditTrail } from './core.model';

type CardRarity = AuditTrail & {
  id: string;
  name: string;
  slug: string;
};

type CardCategory = AuditTrail & {
  id: string;
  name: string;
  slug: string;
};

type CardType = AuditTrail & {
  id: string;
  name: string;
  slug: string;
};

type Card = AuditTrail & {
  id: string;
  name: string;
  description: string;
  attr: {
    offense: number;
    defense: number;
    cost: number;
  };
  rarity: CardRarity;
  category: CardCategory;
  types: CardType[];
  isActive: boolean;
  image?: any;
  coverImage?: any;
  slug?: string;
};

export type { CardRarity, CardCategory, CardType, Card };
