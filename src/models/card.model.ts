export enum CardRarity {
  COMMON = 1,
  UNCOMMON,
  RARE,
  LEGENDARY
}

export enum CardCategory {
  BODY = 1,
  COSMIC,
  MONSTER,
  PARANORMAL,
  SLASHER
}

export enum CardType {
  ALIEN = 1,
  DEMON,
  GHOST,
  SERIAL_KILLER,
  VAMPIRE,
  WITCH,
  ZOMBIE
}

export type Card = {
  id: string;
  name: string;
  description: string;
  attributes: {
    offense: number;
    defense: number;
    cost: number;
  };
  image: string;
  rarity: CardRarity | string;
  category: CardCategory;
  type: CardType;
};
