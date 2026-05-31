// components/SidebarLayout.tsx
import { useState } from "react";

interface Props {
  map: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function SidebarLayout({ map, sidebar }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] relative">

      {/* Map area */}
      <div className="relative z-0 flex-1 h-full">
        {map}
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9997] bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed bottom-0 left-0 right-0 h-[75vh] z-[9998]
        md:relative md:w-80 md:h-full md:translate-y-0
        bg-[#0f1115] border-t md:border-t-0 md:border-l border-[#2d3748]
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"}
      `}>
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-2 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-[#2d3748]" />
        </div>

        {sidebar}
      </div>

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-[#39ff14] text-black flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

    </div>
  );
}
