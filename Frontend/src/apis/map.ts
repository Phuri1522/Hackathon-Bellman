import { api } from "./axios";
import type { MapMarkerData } from "../types/map";

/**
 * ดึงข้อมูล Post ทั้งหมดที่มีสถานะ OPEN
 * พร้อม lat/lng สำหรับแสดงบน Map
 */
export const getMapMarkers = async (): Promise<MapMarkerData[]> => {
  const response = await api.get<MapMarkerData[]>("/map");
  return response.data;
};