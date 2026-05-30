import { MapContainer, TileLayer } from "react-leaflet";

export default function HunterMap() {
  // [latitude, longitude] == Bangkok
  const defaultCenter: [number, number] = [13.7563, 100.5018]; 

  return (
    <div 
      className="relative w-full h-[calc(100vh-64px)] bg-[var(--bg-color)]"
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        attributionControl={false} //To delete Leaflet credit in the right corner
      >
        {/*To Make the map change color to dark mode*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
      </MapContainer>
    </div>
  );
}