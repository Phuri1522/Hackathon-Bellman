export type MutantHuntingRequestStatus =
  | "MATCHMAKING"
  | "PUBLIC"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface CreateMutantHuntingRequestBody {
  userId?: number;
  animalType: string;
  mutantType: string;
  requiredClass?: string;
  reward?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  status?: MutantHuntingRequestStatus;
}

export interface DeleteMutantHuntingRequestBody {
  userId?: number;
}

export interface AcceptMutantHuntingRequestBody {
  hunterId?: number;
}

export interface CompleteMutantHuntingRequestBody {
  hunterId?: number;
}
