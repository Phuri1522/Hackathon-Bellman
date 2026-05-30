import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { api } from "../apis/axios";

//To chack user or hunter if you are hunter popup will have a accept button
interface HunterMapProps {
  isHunter?: boolean; //if it true(Hunter) will show accept button
}

export interface MapMarkerData {
  id: number;
  latitude: number;
  longitude: number;
  animalType: string;
  mutantType: string;
  classRequired: string;
  status: string;
  reward: string | null;
  element?: string;
  distance?: string;
}

//use css to draw a custom icon
const mutantIcon = L.divIcon({
  className: "custom-mutant-icon",
  html: `<div style="
    width: 20px; 
    height: 20px; 
    background-color: #39FF14; 
    border-radius: 50%; 
    box-shadow: 0 0 10px #39FF14, 0 0 20px #39FF14;
    border: 2px solid #111111;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

//Hunter Icon
const userIcon = L.divIcon({
  className: "custom-user-icon",
  html: `<div style="
    width: 16px; 
    height: 16px; 
    background-color: #00e5ff; 
    border-radius: 50%; 
    box-shadow: 0 0 10px #00e5ff, 0 0 20px #00e5ff;
    border: 2px solid #111111;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

//Mock Data for testing
const MOCK_MARKERS: MapMarkerData[] = [
  {
    id: 1,
    latitude: 13.7563,
    longitude: 100.5018,
    animalType: "Wild Boar",
    mutantType: "Iron-Tusk Behemoth",
    classRequired: "Heavy Assault",
    status: "OPEN",
    reward: "A Cup of Jelly",
    element: "Fire",
    distance: "0.4 km away",
  },
  {
    id: 2,
    latitude: 13.7450,
    longitude: 100.5230,
    animalType: "Stray Dog",
    mutantType: "Shadow Hound",
    classRequired: "Sniper",
    status: "OPEN",
    reward: "Medkit",
    element: "Poison",
    distance: "0.7 km away",
  }
];

export default function HunterMap({ isHunter = true }: HunterMapProps) {
  const [markers, setMarkers] = useState<MapMarkerData[]>([]);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  //number, number == latitude, longitude
  const defaultCenter: [number, number] = [13.7563, 100.5018]; //Bangkok

  const fetchMapData = async () => {
    /*
  try {
    // api.get 
    const response = await api.get<MapMarkerData[]>("/posts?status=OPEN");
    setMarkers(response.data);
  } catch (error) {
    console.error("Failed to fetch mutant locations:", error);
  }
    */
   setMarkers(MOCK_MARKERS);
};

  useEffect(() => {
    fetchMapData(); //first fetch
    const intervalId = setInterval(fetchMapData, 1000); //fetch every 1 second


    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[var(--bg-color)]">
      
      {/*To delete default leaflet style, Force CSS style to replace default leaflet*/}
      <style>{`
        .tactical-popup .leaflet-popup-tip-container { display: none !important; }
        .tactical-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        .tactical-popup .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .tactical-popup .leaflet-popup-close-button {
          top: 20px !important;
          right: 20px !important;
          color: #39FF14 !important;
          font-size: 20px !important;
          opacity: 0.7;
        }
        .tactical-popup .leaflet-popup-close-button:hover { background: transparent !important; opacity: 1; }
      `}</style>

      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        attributionControl={false} //To delete Leftlet credit in the right corner
      >
        {/*To Make the map change color to dark mode*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {/* Draw a Hunter Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup className="tactical-popup user-popup" closeButton={false}>
              <div className="bg-[#11131a] p-3 rounded-lg border border-[#00e5ff] font-['Fira_Code'] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <span className="text-[#00e5ff] font-bold tracking-widest text-sm">ME</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Maker Maker */}
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.latitude, marker.longitude]} 
            icon={mutantIcon}
          >
            {/* Pop up */}
            <Popup className="tactical-popup">
              
              <div className="bg-[#11131a] p-6 rounded-2xl border border-[#39FF14] w-[320px] font-['Fira_Code'] shadow-[0_0_20px_rgba(57,255,20,0.15)]">
                
                {/* Tag */}
                <div className="flex justify-start gap-3 items-center mb-5">
                  <div className="border border-[#bf6142] text-[#bf6142] px-3 py-1.5 rounded-lg text-sm">
                    {marker.animalType} {marker.element && <>• <span className="font-bold">{marker.element}</span></>}
                  </div>
                  <div className="border border-[#39FF14] text-[#39FF14] px-3 py-1.5 rounded-lg text-sm uppercase">
                    {marker.status}
                  </div>
                </div>

                {/* Information (distance required reward) */}
                <div className="space-y-4 mb-6">
                  {marker.distance && (
                    <div className="flex items-center gap-2">
                      <div className="w-0.5 h-8 bg-[#39FF14]"></div>
                      <p className="text-[#39FF14] text-2xl font-bold tracking-tight">
                        {marker.distance}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-gray-400 text-sm">
                    Required: [{marker.classRequired}]
                  </p>
                  
                  {marker.reward && (
                    <p className="text-[#cda434] text-sm">
                      Reward: {marker.reward}
                    </p>
                  )}
                </div>

                {/* Accept Button */}
                {isHunter && (
                  <button className="w-full bg-[#39FF14] hover:bg-[#2ce010] text-black py-3 rounded-xl text-lg font-extrabold uppercase transition-colors flex items-center justify-center gap-2">
                    ACCEPT →
                  </button>
                )}
              </div>

            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}