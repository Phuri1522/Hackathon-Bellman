export const ANIMAL_TYPES = [
  "Wolf",
  "Cat",
  "Bear",
  "Bird",
  "Snake",
  "Lizard",
  "Spider",
  "Shark",
  "Boar",
  "Monkey",
];

export const MUTANT_TYPES = [
  "Fire",
  "Ice",
  "Electric",
  "Poison",
  "Shadow",
];

export const HUNTER_CLASSES = [
  "Fighter",
  "Tanker",
  "Ranger",
];

export type CreateMutantHuntingRequestPayload = {
  userId: number;
  animalType: string;
  mutantType: string;
  requiredClass?: string;
  requiredClasses?: string[];
  reward: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
};

export type MapPoint = {
  lat: number;
  lng: number;
};

export type MutantPostPreview = {
  imagePreview: string | null;
  animalType: string;
  mutantType: string;
  reward: string;
  requiredClasses: string[];
};
