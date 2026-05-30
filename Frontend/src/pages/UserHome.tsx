import { useState } from "react";
import HunterMap from "../components/HunterMap";

// Mock Data
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

//for mobile responsive
const PostCard = ({ post }: { post: any }) => {
  const borderStatusColor = 
    post.status === 'OPEN' ? 'border-[#39FF14]/60 hover:border-[#39FF14]' : 
    post.status === 'MATCHED' ? 'border-[#cda434]/60 hover:border-[#cda434]' : 
    'border-gray-700 hover:border-gray-500';

  const textStatusColor = 
    post.status === 'OPEN' ? 'border-[#39FF14] text-[#39FF14]' : 
    post.status === 'MATCHED' ? 'border-[#cda434] text-[#cda434]' : 
    'border-gray-600 text-gray-500';

  const elementColor = 
    post.element === 'Fire' ? 'text-[#bf6142]' : 
    post.element === 'Ice' ? 'text-[#4287f5]' : 
    'text-[#8c42f5]';

  return (
    <div className={`p-5 border rounded-xl bg-[#0d0e12] relative transition-colors ${borderStatusColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="border border-gray-700 text-gray-300 text-[10px] px-3 py-1.5 rounded">
          {post.target} • <span className={elementColor}>{post.element}</span>
        </div>
        <div className={`text-[9px] px-3 py-1.5 rounded tracking-[0.1em] font-bold border ${textStatusColor}`}>
          {post.status}
        </div>
      </div>
      <div className="space-y-1.5 mt-2">
        <p className="text-[12px] text-gray-400">
          [{post.classReq}] <span className="text-[#39FF14]">{post.distance}</span>
        </p>
        <p className="text-[12px] text-[#cda434]">
          Reward: {post.reward}
        </p>
      </div>
    </div>
  );
};

//For setting Mobile tab
export default function UserHome() {
  const [mobileTab, setMobileTab] = useState<'MY_POSTS' | 'MAP'>('MY_POSTS');

  return (
    <div className="relative h-screen w-full bg-[#0d0e12] font-['Orbitron'] text-white overflow-hidden flex flex-col md:flex-row">
      
      <main className="absolute inset-0 md:relative md:flex-1 z-0">
        <HunterMap isHunter={false} />
      </main> 
      
      {/* Mobile UI */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4 md:hidden">
        <h2 className="font-bold text-lg tracking-widest text-white drop-shadow-md">
          {MOCK_USER_PROFILE.name}
        </h2>
        <button className="bg-[#39FF14] text-black hover:bg-[#2ce010] px-4 py-1.5 rounded-md text-sm font-bold tracking-[0.1em] transition-all shadow-[0_0_10px_rgba(57,255,20,0.3)]">
          + POST
        </button>
      </div>

      {/* Tab up/down */}
      <div className={`absolute bottom-0 left-0 w-full z-10 bg-[#11131a]/95 backdrop-blur-sm rounded-t-3xl border-t border-gray-800 flex flex-col transition-all duration-300 ease-in-out md:hidden ${
        mobileTab === 'MY_POSTS' ? 'h-[60vh]' : 'h-[80px]'
      }`}>
        
        {/* ขีดลากด้านบน (Visual Design) */}
        <div 
          className="w-full flex justify-center py-3 cursor-pointer"
          onClick={() => setMobileTab(mobileTab === 'MY_POSTS' ? 'MAP' : 'MY_POSTS')}
        >
          <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
        </div>

        {/* Tab Menu */}
        <div className="flex border-b border-gray-800">
          <button 
            className={`flex-1 pb-3 text-sm font-bold tracking-[0.1em] transition-colors ${
              mobileTab === 'MY_POSTS' ? 'text-[#cda434]' : 'text-gray-500'
            }`}
            onClick={() => setMobileTab('MY_POSTS')}
          >
            MY POSTS
          </button>
          <button 
            className={`flex-1 pb-3 text-sm font-bold tracking-[0.1em] transition-colors ${
              mobileTab === 'MAP' ? 'text-[#cda434]' : 'text-gray-500'
            }`}
            onClick={() => setMobileTab('MAP')}
          >
            MAP
          </button>
        </div>

        {/* รายการโพสต์ (แสดงเมื่อเลือกแท็บ MY POSTS เท่านั้น) */}
        {mobileTab === 'MY_POSTS' && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {MOCK_USER_POSTS.map((post) => (
              <PostCard key={`mobile-${post.id}`} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop UI */}
      <aside className="hidden md:flex w-[380px] bg-[#11131a] border-l border-[#39FF14] flex-col z-10 shadow-[-5px_0_15px_rgba(57,255,20,0.05)]">
        
        {/* Profile */}
        <div className="px-6 pt-8 pb-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#cda434] overflow-hidden bg-black shrink-0 flex items-center justify-center">
            {MOCK_USER_PROFILE.avatarUrl ? (
              <img src={MOCK_USER_PROFILE.avatarUrl} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#4287f5] text-xl">👤</span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-wider text-white mb-1">
              {MOCK_USER_PROFILE.name}
            </h2>
            <p className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">
              {MOCK_USER_PROFILE.role} • {MOCK_USER_PROFILE.activePosts} active posts
            </p>
          </div>
        </div>

        {/* Post Button */}
        <div className="px-6 pb-6 border-b border-gray-800/50">
          <button className="w-full bg-[#39FF14] text-black hover:bg-[#2ce010] py-3 rounded-md text-sm font-bold tracking-[0.1em] transition-all">
            + POST MUTANT SIGHTING
          </button>
        </div>

        {/* My Posts */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <h3 className="text-[#39FF14] text-[12px] font-bold tracking-[0.1em] mb-4 uppercase">
            My Posts
          </h3>
          <div className="space-y-4">
            {MOCK_USER_POSTS.map((post) => (
              <PostCard key={`desktop-${post.id}`} post={post} />
            ))}
          </div>
        </div>

      </aside>

    </div>
  );
}