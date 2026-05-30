import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getMapMarkers } from "../apis/map";
import type { MapMarkerData } from "../types/map";

// ─── Props ───────────────────────────────────────────────────────────────────
interface HunterMapProps {
  isHunter?: boolean;
}

// ─── Leaflet Custom Icons ─────────────────────────────────────────────────────
// ใช้ divIcon เหมือนกับที่เพื่อนออกแบบใน RealMap.tsx (สีส้ม = mutant marker)
const mutantIcon = divIcon({
  className: "",
  html: `<div style="
    height:18px;
    width:18px;
    border-radius:9999px;
    background:#b7410e;
    border:2px solid #050505;
    box-shadow:0 0 18px #b7410e;
    cursor:pointer;
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// ─── Overlay Component ────────────────────────────────────────────────────────
// แปลง lat/lng → pixel แล้ว render PostPinOverlay style popup ลอยเหนือ marker
function PostOverlay({
  marker,
  isHunter,
  onClose,
  onViewPost,
}: {
  marker: MapMarkerData;
  isHunter: boolean;
  onClose: () => void;
  onViewPost: (id: number) => void;
}) {
  const map = useMap();
  const [pos, setPos] = useState(() =>
    map.latLngToContainerPoint([marker.latitude, marker.longitude])
  );

  // อัพเดทตำแหน่ง overlay ตามเมื่อ map ขยับ/ซูม
  function update() {
    setPos(map.latLngToContainerPoint([marker.latitude, marker.longitude]));
  }

  useEffect(() => {
    update();
  }, [marker.latitude, marker.longitude]);

  useMapEvents({ move: update, zoom: update, resize: update });

  const fallbackImage =
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400";
  const image = marker.picture || fallbackImage;
  const title = `${marker.mutantType} ${marker.animalType}`;

  return (
    // ใช้ pointer-events-none บน container หลักเพื่อไม่ให้บัง map
    // แต่ pointer-events-auto บน card เพื่อให้กดได้
    <div
      className="pointer-events-none absolute z-[500]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, calc(-100% - 20px))",
      }}
    >
      {/* Card ── ใช้ design เดียวกับ PostPinOverlay ของเพื่อน */}
      <div className="pointer-events-auto w-52 rounded-xl border border-[#2d3748] bg-[#0f1115] p-3 text-[#e5e7eb] shadow-[0_0_18px_rgba(57,255,20,0.25)] transition-all duration-200 hover:border-[#39ff14]">
        
        {/* ปุ่มปิด */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1f2e] text-xs text-[#9ca3af] hover:text-white"
        >
          ✕
        </button>

        {/* รูปภาพ */}
        <img
          src={image}
          alt={title}
          className="h-28 w-full rounded-lg object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        {/* ชื่อ mutant ── เขียวเรือง เหมือน design เดิม */}
        <h2 className="mt-3 text-center text-lg font-bold text-[#39ff14]">
          {title}
        </h2>

        {/* รายละเอียด */}
        <div className="mt-2 space-y-1 text-xs">
          <p>
            <span className="text-[#9ca3af]">Class: </span>
            <span className="text-[#e5e7eb]">{marker.classRequired}</span>
          </p>
          {marker.reward && (
            <p className="font-semibold text-[#39ff14]">
              Reward: {marker.reward}
            </p>
          )}
          {marker.description && (
            <p className="line-clamp-2 text-[#9ca3af]">{marker.description}</p>
          )}
        </div>

        {/* ปุ่ม Hunt! โชว์เฉพาะ Hunter */}
        {isHunter && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewPost(marker.id);
            }}
            className="mt-3 w-full rounded bg-red-600 py-1 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Hunt!
          </button>
        )}
      </div>

      {/* Arrow ชี้ลงหา marker */}
      <div
        className="mx-auto h-0 w-0"
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #2d3748",
        }}
      />
    </div>
  );
}

// ─── Click-outside handler ────────────────────────────────────────────────────
function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click() {
      onMapClick();
    },
  });
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HunterMap({ isHunter = false }: HunterMapProps) {
  const defaultCenter: [number, number] = [13.7563, 100.5018]; // กรุงเทพฯ
  const [markers, setMarkers] = useState<MapMarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูล markers จาก Backend และ poll ทุก 3 วินาที
  useEffect(() => {
    let isFirstFetch = true;

    const fetchMarkers = async () => {
      try {
        // แสดง loading spinner เฉพาะครั้งแรก ครั้งถัดไป update เงียบๆ
        if (isFirstFetch) setLoading(true);
        const data = await getMapMarkers();
        setMarkers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching map markers:", err);
        // แสดง error เฉพาะครั้งแรก ไม่ให้ทำลาย UX ระหว่าง poll
        if (isFirstFetch) setError("ไม่สามารถโหลดข้อมูล Post บน Map ได้");
      } finally {
        if (isFirstFetch) {
          setLoading(false);
          isFirstFetch = false;
        }
      }
    };

    fetchMarkers();
    const interval = setInterval(fetchMarkers, 3000);

    // cleanup เมื่อ component unmount
    return () => clearInterval(interval);
  }, []);

  // นำ Hunter ไปหน้า HuntRoomDetails เมื่อกด Hunt!
  const handleViewPost = (postId: number) => {
    window.location.href = `/hunter/hunt-room/${postId}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-[#050505]/80">
          <p className="font-mono text-sm text-[#39ff14] animate-pulse">
            [ LOADING MAP DATA... ]
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute top-4 left-1/2 z-[999] -translate-x-1/2 rounded border border-red-600/50 bg-[#0f1115] px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        attributionControl={false}
      >
        {/* Dark map tile เหมือนกับที่เพื่อนใช้ใน RealMap.tsx */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* ปิด overlay เมื่อ click บน map */}
        <MapClickHandler onMapClick={() => setSelectedMarker(null)} />

        {/* วาง Marker บน map ทุก Post ที่ status=OPEN */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={mutantIcon}
            eventHandlers={{
              click: (e) => {
                // หยุด event ไม่ให้ไปถึง MapClickHandler
                e.originalEvent.stopPropagation();
                setSelectedMarker(
                  selectedMarker?.id === marker.id ? null : marker
                );
              },
            }}
          />
        ))}

        {/* Overlay popup แบบ custom ── แสดงเมื่อ marker ถูกเลือก */}
        {selectedMarker && (
          <PostOverlay
            marker={selectedMarker}
            isHunter={isHunter}
            onClose={() => setSelectedMarker(null)}
            onViewPost={handleViewPost}
          />
        )}
      </MapContainer>
    </div>
  );
}
