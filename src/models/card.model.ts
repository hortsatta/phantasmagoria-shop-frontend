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
  coverImage: string;
  rarity: number;
  category: number;
  type: number;
};
