import PostPinOverlay from "./PostPinOverlay";
import RealMap from "./RealMap";
import type { MouseEvent } from "react";
import type { MapPoint } from "../types/mutantHunting.type";

type LocationPickerProps = {
  showMiniOverlay?: boolean;
  showOverlay?: boolean;
  onPinClick?: (e: MouseEvent) => void;
  onMiniClick?: (e: MouseEvent) => void;
  userLocation?: MapPoint;
  selectedPin?: MapPoint | null;
  onMapClick?: (point: MapPoint) => void;
  showPreviewOverlay?: boolean;
  previewImage?: string | null;
  previewTitle?: string;
  onPreviewClick?: (e: MouseEvent) => void;
  zoom?: number;
  markerLabel?: string;
};

export default function LocationPicker({
  onPinClick,
  onMiniClick,
  showMiniOverlay = false,
  showOverlay,
  userLocation,
  selectedPin,
  onMapClick,
  showPreviewOverlay,
  previewImage,
  previewTitle,
  onPreviewClick,
  zoom,
  markerLabel,
}: LocationPickerProps) {
  const shouldShowMiniOverlay = showMiniOverlay || showOverlay;

  if (userLocation) {
    return (
      <section className="relative h-full w-full overflow-hidden border border-[#39ff14]/40 bg-[#06140b]">
        <RealMap
          userLocation={userLocation}
          selectedPin={selectedPin}
          onMapClick={onMapClick}
          showPreviewOverlay={showPreviewOverlay}
          previewImage={previewImage}
          previewTitle={previewTitle}
          onPreviewClick={onPreviewClick}
          zoom={zoom}
          markerLabel={markerLabel}
        />
      </section>
    );
  }

  return (
    <section className="relative h-full w-full overflow-hidden border border-[#39ff14]/40 bg-[#06140b]">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)",
          backgroundSize: "180px 180px",
        }}
      />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-[#050505]/40" />

      {/* center pin + overlay */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        {shouldShowMiniOverlay && (
          <div
            className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2 animate-[fadeUpOverlay_0.22s_ease-out]"
          >
            <PostPinOverlay onViewPost={onMiniClick} />
          </div>
        )}

        <button
          type="button"
          onClick={onPinClick}
          className="mx-auto mb-2 h-4 w-4 rounded-full bg-[#39ff14] shadow-[0_0_18px_#39ff14] transition-all duration-200 hover:scale-125"
        />

        <p className="font-mono text-xs text-[#39ff14]">
          [ TACTICAL MAP VIEW ]
        </p>

        <p className="mt-1 font-mono text-[10px] text-[#39ff14]">
          YOUR LOCATION
        </p>
      </div>
    </section>
  );
}
