import { useCallback, useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import LocationPicker from "../components/LocationPicker";
import CreatePostForm from "../components/CreatePostForm";
import UserPostDetails from "../components/UserPostDetails";
import HunterPostDetails from "../components/HunterPostDetails";
import type { MapPoint, MutantPostPreview } from "../types/mutantHunting.type";

const BANGKOK_LOCATION: MapPoint = {
  lat: 13.7563,
  lng: 100.5018,
};

type Role = "user" | "hunter";

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(from: MapPoint, to: MapPoint) {
  const earthRadiusKm = 6371;
  const latDistance = toRadians(to.lat - from.lat);
  const lngDistance = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export default function CreatePostPage() {
  const [userLocation, setUserLocation] = useState<MapPoint>(BANGKOK_LOCATION);
  const [selectedPin, setSelectedPin] = useState<MapPoint | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);
  const [preview, setPreview] = useState<MutantPostPreview>({
    imagePreview: null,
    animalType: "Wolf",
    mutantType: "Fire",
    reward: "",
    requiredClasses: ["Fighter", "Ranger"],
  });
  const [role] = useState<Role>("user");
  const distanceKm = useMemo(() => {
    if (!selectedPin) return 0;

    return calculateDistanceKm(userLocation, selectedPin);
  }, [selectedPin, userLocation]);
  const generatedName = `${preview.mutantType} ${preview.animalType}`;

  const handlePreviewChange = useCallback((nextPreview: MutantPostPreview) => {
    setPreview(nextPreview);
  }, []);

  function handleMapClick(point: MapPoint) {
    if (showDetails) {
      setShowDetails(false);
      setShowPreviewOverlay(false);
      return;
    }

    setSelectedPin(point);
    setShowPreviewOverlay(Boolean(preview.imagePreview));
  }

  function handlePreviewClick(e: MouseEvent) {
    e.stopPropagation();
    setShowDetails(true);
    setShowPreviewOverlay(true);
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(BANGKOK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserLocation(BANGKOK_LOCATION);
      },
    );
  }, []);

  useEffect(() => {
    setShowPreviewOverlay(Boolean(selectedPin && preview.imagePreview));
  }, [preview.imagePreview, selectedPin]);

  return (
    <main className="h-screen overflow-hidden bg-[#050505] text-[#e5e7eb]">
      <div className="relative flex h-full min-w-0 flex-col overflow-x-hidden md:flex-row">
        <div className="h-[42vh] min-h-[260px] w-full min-w-0 md:h-full md:min-h-0 md:w-[60%]">
          <LocationPicker
            userLocation={userLocation}
            selectedPin={selectedPin}
            onMapClick={handleMapClick}
            showPreviewOverlay={showPreviewOverlay}
            previewImage={preview.imagePreview}
            previewTitle={generatedName}
            onPreviewClick={handlePreviewClick}
            zoom={14}
            markerLabel="Mutant sighting"
          />
        </div>
        <section className="h-[58vh] w-full min-w-0 overflow-y-auto overflow-x-hidden bg-[#0f1115] px-5 py-5 md:h-full md:w-[40%] md:px-10 md:py-6">
          {showDetails ? (
            role === "user" ? <UserPostDetails /> : <HunterPostDetails />
          ) : (
            <CreatePostForm
              selectedPin={selectedPin}
              distanceKm={distanceKm}
              onPreviewChange={handlePreviewChange}
            />
          )}
        </section>
      </div>
    </main>
  );
}
