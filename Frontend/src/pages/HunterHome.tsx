import { useState } from "react";
import HunterMap from "../components/HunterMap";

//MOCK MOCK
const MOCK_HUNTER_PROFILE = {
  name: "HUNTER_01",
  avatarUrl: "https://i.pravatar.cc/150?img=11",
  rank: "B",
  class: "Sword",
  gender: "Male",
  age: 26,
  rankScore: 1240,
  requests: 8,
  completed: 5,
  autoMatch: true,
  myRequests: [
    { id: 1, target: "Wolf", element: "Fire", status: "PENDING" },
    { id: 2, target: "Bear", element: "Ice", status: "ACCEPTED" },
  ]
};

//MOCK MOCK
const MOCK_NEARBY_TASKS = [
  { id: 101, target: "Wolf", element: "Fire", status: "OPEN", classReq: "Fighter", distance: "0.4 km", reward: "glass of water" },
  { id: 102, target: "Bear", element: "Ice", status: "OPEN", classReq: "Tanker", distance: "1.2 km", reward: "24 rounds of ammo" },
];

export default function HunterHome() {
  const [isAutoMatch, setIsAutoMatch] = useState(MOCK_HUNTER_PROFILE.autoMatch);

  return (
    <div className="flex h-screen bg-[#0d0e12] font-['Fira_Code'] text-white overflow-hidden">
      
      <main className="flex-1 relative">
        <HunterMap />
      </main>

      <aside className="w-[350px] bg-[#11131a] border-l border-[#00ff66]/30 flex flex-col shadow-[-5px_0_15px_rgba(0,255,102,0.1)] z-10">
        
        {/*Profile Section*/}
        <div className="p-5 border-b border-gray-800 flex items-center gap-4">

            {/* Check profile picture (Also MOCK) */}
            <div className="w-14 h-14 rounded-full border-2 border-[#00ff66] flex items-center justify-center bg-black overflow-hidden shrink-0">
            {MOCK_HUNTER_PROFILE.avatarUrl ? (
              <img 
                src={MOCK_HUNTER_PROFILE.avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#00ff66] text-xl"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-['Orbitron'] font-bold text-lg tracking-wider">{MOCK_HUNTER_PROFILE.name}</h2>
              <span className="border border-[#cda434] text-[#cda434] text-xs px-2 py-0.5 rounded">
                {MOCK_HUNTER_PROFILE.rank}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              [{MOCK_HUNTER_PROFILE.class}] • {MOCK_HUNTER_PROFILE.gender} • Age {MOCK_HUNTER_PROFILE.age}
            </p>
          </div>
        </div>

        {/* Stat Section */}
        <div className="flex justify-between text-center p-5 border-b border-gray-800">
          <div>
            <div className="text-[#00ff66] text-xl font-bold">{MOCK_HUNTER_PROFILE.rankScore}</div>
            <div className="text-[10px] text-gray-500 tracking-widest mt-1">RANK SCORE</div>
          </div>
          <div>
            <div className="text-[#00ff66] text-xl font-bold">{MOCK_HUNTER_PROFILE.requests}</div>
            <div className="text-[10px] text-gray-500 tracking-widest mt-1">REQUESTS</div>
          </div>
          <div>
            <div className="text-[#00ff66] text-xl font-bold">{MOCK_HUNTER_PROFILE.completed}</div>
            <div className="text-[10px] text-gray-500 tracking-widest mt-1">COMPLETED</div>
          </div>
        </div>

        {/* Auto-Match Toggle Button */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <span className="text-sm text-gray-300 tracking-widest">AUTO-MATCH</span>
          <button 
            onClick={() => setIsAutoMatch(!isAutoMatch)}
            className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${
              isAutoMatch ? "bg-[#00ff66]" : "bg-gray-600"
            }`}
          >
            <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              isAutoMatch ? "translate-x-6" : "translate-x-0"
            }`} />
          </button>
        </div>

        {/* To make My request & Nearby task can Scholl */}
        <div className="flex-1 overflow-y-auto">
          
          {/* My Request Section */}
          <div className="p-5">
            <h3 className="text-[#00ff66] font-['Orbitron'] mb-4 tracking-widest">MY REQUESTS</h3>
            <div className="space-y-3">
              {MOCK_HUNTER_PROFILE.myRequests.map((req) => (
                <div key={req.id} className="flex justify-between items-center p-3 border border-gray-800 rounded bg-[#0d0e12]">
                  <div className="border border-gray-600 text-xs px-2 py-1 rounded text-gray-300">
                    {req.target} • <span className={req.element === 'Fire' ? 'text-red-400' : 'text-blue-400'}>{req.element}</span>
                  </div>
                  <div className={`text-[10px] border px-2 py-1 rounded tracking-widest ${
                    req.status === 'PENDING' ? 'border-yellow-500 text-yellow-500' : 'border-[#00ff66] text-[#00ff66]'
                  }`}>
                    {req.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby task Section */}
          <div className="p-5 border-t border-gray-800">
            <h3 className="text-[#00ff66] font-['Orbitron'] mb-4 tracking-widest">NEARBY TASKS</h3>
            <div className="space-y-4">
              {MOCK_NEARBY_TASKS.map((task) => (
                <div 
                  key={task.id} 
                  className="p-4 border border-[#00ff66]/60 rounded-xl bg-[#0d0e12] hover:bg-[#00ff66]/5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.05)]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="border border-gray-600 text-xs px-2 py-1 rounded text-gray-300">
                      {task.target} • <span className={task.element === 'Fire' ? 'text-red-400' : 'text-blue-400'}>{task.element}</span>
                    </div>
                    <div className="text-[10px] border px-2 py-1 rounded tracking-widest border-[#00ff66] text-[#00ff66]">
                      {task.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="text-gray-500">[{task.classReq}]</span> <span className="text-[#00ff66]">{task.distance}</span>
                  </div>
                  <div className="text-xs text-[#cda434]">
                    Reward: {task.reward}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}