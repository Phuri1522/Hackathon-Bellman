import { useState } from "react";
import HunterMap from "../components/HunterMap";

//Mock Data
const MOCK_USER_PROFILE = {
  name: "CITIZEN_42",
  avatarUrl: "",
  role: "USER",
  activePosts: 3,
};

//Mock Data
const MOCK_USER_POSTS = [
  { id: 1, target: "Wolf", element: "Fire", status: "OPEN", classReq: "Fighter", distance: "0.8 km", reward: "500" },
  { id: 2, target: "Bear", element: "Ice", status: "MATCHED", classReq: "Fighter", distance: "0.8 km", reward: "500" },
  { id: 3, target: "Snake", element: "Poison", status: "COMPLETED", classReq: "Fighter", distance: "0.8 km", reward: "500" },
];

export default function UserHome() {
  return (
    <div className="flex h-screen bg-[#0d0e12] font-['Fira_Code'] text-white overflow-hidden">
      
      {/*MAP*/}
      <main className="flex-1 relative">
        <HunterMap isHunter={false} />
      </main> 

      {/*Sidebar*/}
      <aside className="w-[380px] bg-[#11131a] border-l border-[#39FF14] flex flex-col z-10 shadow-[-5px_0_15px_rgba(57,255,20,0.05)]">
        
        {/*Profile*/}
        <div className="px-6 pt-8 pb-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#cda434] overflow-hidden bg-black shrink-0 flex items-center justify-center">
            {MOCK_USER_PROFILE.avatarUrl ? (
              <img src={MOCK_USER_PROFILE.avatarUrl} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#4287f5] text-xl"></span>
            )}
          </div>
          <div>
            <h2 className="font-['Orbitron'] font-bold text-lg tracking-wider text-white mb-1">
              {MOCK_USER_PROFILE.name}
            </h2>
            <p className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">
              {MOCK_USER_PROFILE.role} • {MOCK_USER_PROFILE.activePosts} active posts
            </p>
          </div>
        </div>

        {/*Post Button*/}
        <div className="px-6 pb-6 border-b border-gray-800/50">
          <button className="w-full bg-[#39FF14] text-black hover:bg-[#2ce010] py-3 rounded-md text-sm font-bold tracking-[0.1em] transition-all">
            + POST MUTANT SIGHTING
          </button>
        </div>

        {/*My posts*/}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <h3 className="text-[#39FF14] text-[12px] font-bold tracking-[0.1em] mb-4 uppercase">
            My Posts
          </h3>
          
          <div className="space-y-4">
            {MOCK_USER_POSTS.map((post) => (
              <div key={post.id} className="p-5 border border-gray-800 rounded-xl bg-[#0d0e12] relative group hover:border-[#39FF14]/50 transition-colors">
                
                {/*Target & Status*/}
                <div className="flex justify-between items-start mb-4">
                  <div className="border border-gray-700 text-gray-300 text-[10px] px-3 py-1.5 rounded">
                    {post.target} • <span className={post.element === 'Fire' ? 'text-[#bf6142]' : post.element === 'Ice' ? 'text-[#4287f5]' : 'text-[#8c42f5]'}>{post.element}</span>
                  </div>
                  <div className={`text-[9px] px-3 py-1.5 rounded tracking-[0.1em] font-bold border ${
                    post.status === 'OPEN' ? 'border-[#39FF14] text-[#39FF14]' : 
                    post.status === 'MATCHED' ? 'border-[#cda434] text-[#cda434]' : 
                    'border-gray-600 text-gray-500'
                  }`}>
                    {post.status}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mt-2">
                  <p className="text-[12px] text-gray-400">
                    [{post.classReq}] <span className="text-[#39FF14]">{post.distance}</span>
                  </p>
                  <p className="text-[12px] text-[#cda434]">
                    Reward: {post.reward}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </aside>
    </div>
  );
}