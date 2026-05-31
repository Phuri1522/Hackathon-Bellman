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

export type MutantHuntingRequestStatus =
  | "MATCHMAKING"
  | "PUBLIC"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED";

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

export type MutantHuntingRequest = {
  id: number;
  userId: number;
  animalType: string;
  mutantType: string;
  latitude: number;
  longitude: number;
  picture?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  classRequired: string;
  reward?: string | null;
  status: MutantHuntingRequestStatus;
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string | null;
  acceptedById?: number | null;
  hunterId?: number | null;
  huntRequests?: {
    id: number;
    hunterId?: number | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    acceptedAt?: string | null;
  }[];
};
