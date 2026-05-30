import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HunterMap from "../components/HunterMap";

// MOCK DATA
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

// MOCK DATA
const MOCK_NEARBY_TASKS = [
  { id: 101, target: "Wolf", element: "Fire", status: "OPEN", classReq: "Fighter", distance: "0.4 km", reward: "500" },
  { id: 102, target: "Bear", element: "Ice", status: "OPEN", classReq: "Tanker", distance: "1.2 km", reward: "1,000" },
  { id: 103, target: "Snake", element: "Poison", status: "OPEN", classReq: "Ranger", distance: "2.1 km", reward: "750" },
];

const TaskCard = ({ task }: { task: any }) => (
  <div className="p-4 border border-[#00ff66]/60 rounded-xl bg-[#0d0e12] hover:bg-[#00ff66]/10 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.05)]">
    <div className="flex justify-between items-start mb-3">
      <div className="border border-gray-600 text-xs px-2 py-1 rounded text-gray-300">
        {task.target} • <span className={
          task.element === 'Fire' ? 'text-[#bf6142]' : 
          task.element === 'Ice' ? 'text-[#4287f5]' : 
          'text-[#8c42f5]' // Poison
        }>{task.element}</span>
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
);

const RequestCard = ({ req }: { req: any }) => (
  <div className="flex justify-between items-center p-3 border border-gray-800 rounded bg-[#0d0e12] hover:border-gray-600 transition-colors cursor-pointer">
    <div className="border border-gray-600 text-xs px-2 py-1 rounded text-gray-300">
      {req.target} • <span className={
        req.element === 'Fire' ? 'text-[#bf6142]' : 
        req.element === 'Ice' ? 'text-[#4287f5]' : 
        'text-[#8c42f5]'
      }>{req.element}</span>
    </div>
    <div className={`text-[10px] border px-2 py-1 rounded tracking-widest ${
      req.status === 'PENDING' ? 'border-[#cda434] text-[#cda434]' : 'border-[#00ff66] text-[#00ff66]'
    }`}>
      {req.status}
    </div>
  </div>
);

export default function HunterHome() {
  const [isAutoMatch, setIsAutoMatch] = useState(MOCK_HUNTER_PROFILE.autoMatch);
  // State to manage mobile tab
  const [mobileTab, setMobileTab] = useState<'NEARBY' | 'REQUESTS'>('NEARBY');
  //Logout
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div 
      className="relative h-screen w-full bg-[#0d0e12] text-white overflow-hidden flex flex-col md:flex-row"
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      
      {/* MAP */}
      <main className="absolute inset-0 md:relative md:flex-1 z-0">
        <HunterMap />
      </main>

      {/* Mobile UI */}
      
      {/* Rank & Point */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 md:hidden">
        <h2 className="font-bold text-lg tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {MOCK_HUNTER_PROFILE.name}
        </h2>
        <div className="border border-[#cda434] text-[#cda434] text-xs px-2 py-0.5 rounded font-bold bg-black/60 backdrop-blur-sm">
          {MOCK_HUNTER_PROFILE.rank}
        </div>
        <div className="text-[#00ff66] text-sm font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
          {MOCK_HUNTER_PROFILE.rankScore} pts
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 z-10 text-white text-xs tracking-wider transition-all hover:text-red-500 hover:underline md:hidden bg-black/40 px-3 py-1.5 rounded backdrop-blur-sm border border-gray-800"
      >
        Log out
      </button>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 w-full z-10 bg-[#11131a]/95 backdrop-blur-md rounded-t-3xl border-t border-gray-800 flex flex-col h-[60vh] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        
        {/* Menu Tabs */}
        <div className="flex border-b border-gray-800 pt-6 px-2">
          <button 
            className={`flex-1 pb-4 text-sm font-bold tracking-[0.1em] transition-colors ${
              mobileTab === 'NEARBY' ? 'text-[#00ff66] border-b-2 border-[#00ff66]' : 'text-gray-500 hover:text-gray-400'
            }`}
            onClick={() => setMobileTab('NEARBY')}
          >
            NEARBY
          </button>
          <button 
            className={`flex-1 pb-4 text-sm font-bold tracking-[0.1em] transition-colors ${
              mobileTab === 'REQUESTS' ? 'text-[#00ff66] border-b-2 border-[#00ff66]' : 'text-gray-500 hover:text-gray-400'
            }`}
            onClick={() => setMobileTab('REQUESTS')}
          >
            REQUESTS
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {mobileTab === 'NEARBY' && MOCK_NEARBY_TASKS.map((task) => (
            <TaskCard key={`mobile-task-${task.id}`} task={task} />
          ))}
          {mobileTab === 'REQUESTS' && MOCK_HUNTER_PROFILE.myRequests.map((req) => (
            <RequestCard key={`mobile-req-${req.id}`} req={req} />
          ))}
        </div>
      </div>

      {/* Desktop UI */}
      <aside className="hidden md:flex w-[350px] bg-[#11131a] border-l border-[#00ff66]/30 flex-col shadow-[-5px_0_15px_rgba(0,255,102,0.1)] z-10">
        
        {/* Profile Section */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-[#00ff66] flex items-center justify-center bg-black overflow-hidden shrink-0">
              {MOCK_HUNTER_PROFILE.avatarUrl ? (
                <img src={MOCK_HUNTER_PROFILE.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#00ff66] text-xl"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-lg tracking-wider">{MOCK_HUNTER_PROFILE.name}</h2>
                <span className="border border-[#cda434] text-[#cda434] text-xs px-2 py-0.5 rounded">
                  {MOCK_HUNTER_PROFILE.rank}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 tracking-wider">
                [{MOCK_HUNTER_PROFILE.class}] • {MOCK_HUNTER_PROFILE.gender} • Age {MOCK_HUNTER_PROFILE.age}
              </p>
            </div>
          </div>

          {/* Logout Button Desktop side */}
          <button 
            onClick={handleLogout}
            className="text-white text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-red-500 hover:underline"
          >
            Log out
          </button>

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

        {/* Auto-Match Toggle */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <span className="text-sm text-gray-300 tracking-widest font-bold">AUTO-MATCH</span>
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

        {/* Scrollable Lists */}
        <div className="flex-1 overflow-y-auto">
          
          {/* My Request */}
          <div className="p-5">
            <h3 className="text-[#00ff66] text-[12px] font-bold tracking-[0.1em] mb-4 uppercase">MY REQUESTS</h3>
            <div className="space-y-3">
              {MOCK_HUNTER_PROFILE.myRequests.map((req) => (
                <RequestCard key={`desktop-req-${req.id}`} req={req} />
              ))}
            </div>
          </div>

          {/* Nearby task */}
          <div className="p-5 border-t border-gray-800">
            <h3 className="text-[#00ff66] text-[12px] font-bold tracking-[0.1em] mb-4 uppercase">NEARBY TASKS</h3>
            <div className="space-y-4">
              {MOCK_NEARBY_TASKS.map((task) => (
                <TaskCard key={`desktop-task-${task.id}`} task={task} />
              ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}