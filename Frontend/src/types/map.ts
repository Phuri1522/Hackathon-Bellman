export interface MapMarkerData {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  animalType: string;
  mutantType: string;
  classRequired: string;
  status: string;
  reward: string | null;
  description: string | null;
  picture: string | null;
  createdAt: string;
}