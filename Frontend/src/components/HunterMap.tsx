import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function HunterMap() {
  const defaultCenter: [number, number] = [13.7563, 100.5018]

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
      </MapContainer>
    </div>
  )
}