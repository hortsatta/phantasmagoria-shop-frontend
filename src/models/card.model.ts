export type Card = {
  id: number;
  name: string;
  description: string;
  attributes: {
    offense: number;
    defense: number;
    cost: number;
  };
  rarity: number;
  category: number;
  type: number[];
  image?: string;
  coverImage?: string;
  slug?: string;
};
