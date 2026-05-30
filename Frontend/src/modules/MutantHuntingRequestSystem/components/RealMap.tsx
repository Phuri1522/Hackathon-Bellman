import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import type { MapPoint } from "../types/mutantHunting.type";
import PostPinOverlay from "./PostPinOverlay";
import type { MouseEvent } from "react";

type RealMapProps = {
  userLocation: MapPoint;
  selectedPin?: MapPoint | null;
  onMapClick?: (point: MapPoint) => void;
  showPreviewOverlay?: boolean;
  previewImage?: string | null;
  previewTitle?: string;
  onPreviewClick?: (e: MouseEvent) => void;
  zoom?: number;
  markerLabel?: string;
};

const userIcon = divIcon({
  className: "",
  html: '<div style="height:16px;width:16px;border-radius:9999px;background:#39ff14;border:2px solid #050505;box-shadow:0 0 18px #39ff14;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const mutantIcon = divIcon({
  className: "",
  html: '<div style="height:18px;width:18px;border-radius:9999px;background:#b7410e;border:2px solid #050505;box-shadow:0 0 18px #b7410e;"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapClickHandler({
  onMapClick,
}: Pick<RealMapProps, "onMapClick">) {
  useMapEvents({
    click(event) {
      onMapClick?.({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapCenterUpdater({ center, zoom }: { center: MapPoint; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, map, zoom]);

  return null;
}

function PreviewOverlayMarker({
  selectedPin,
  image,
  title,
  onPreviewClick,
  isVisible,
}: {
  selectedPin: MapPoint;
  image?: string | null;
  title?: string;
  onPreviewClick?: (e: MouseEvent) => void;
  isVisible: boolean;
}) {
  const map = useMap();
  const [position, setPosition] = useState(() =>
    map.latLngToContainerPoint([selectedPin.lat, selectedPin.lng])
  );

  function updatePosition() {
    setPosition(map.latLngToContainerPoint([selectedPin.lat, selectedPin.lng]));
  }

  useEffect(() => {
    updatePosition();
  }, [selectedPin.lat, selectedPin.lng]);

  useMapEvents({
    move: updatePosition,
    zoom: updatePosition,
    resize: updatePosition,
  });

  return (
    <div
      className={
        isVisible
          ? "pointer-events-auto absolute z-[500] -translate-x-1/2 -translate-y-[calc(100%+34px)] opacity-100 transition-all duration-200"
          : "pointer-events-none absolute z-[500] -translate-x-1/2 -translate-y-[calc(100%+34px)] opacity-0 transition-all duration-200"
      }
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <PostPinOverlay
        mode="preview"
        image={image}
        title={title}
        onViewPost={onPreviewClick}
      />
    </div>
  );
}

export default function RealMap({
  userLocation,
  selectedPin,
  onMapClick,
  showPreviewOverlay = false,
  previewImage,
  previewTitle,
  onPreviewClick,
  zoom = 14,
  markerLabel = "Mutant sighting",
}: RealMapProps) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={zoom}
      scrollWheelZoom
      zoomControl
      attributionControl={false}
      className="h-full w-full"
    >
      <MapCenterUpdater center={userLocation} zoom={zoom} />
      <MapClickHandler onMapClick={onMapClick} />

      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Tooltip direction="top" offset={[0, -8]}>
          Your location
        </Tooltip>
      </Marker>

      {selectedPin && (
        <Marker position={[selectedPin.lat, selectedPin.lng]} icon={mutantIcon}>
          <Tooltip direction="top" offset={[0, -8]}>
            {markerLabel}
          </Tooltip>
        </Marker>
      )}

      {selectedPin && previewImage && (
        <PreviewOverlayMarker
          selectedPin={selectedPin}
          image={previewImage}
          title={previewTitle}
          onPreviewClick={onPreviewClick}
          isVisible={showPreviewOverlay}
        />
      )}
    </MapContainer>
  );
}
