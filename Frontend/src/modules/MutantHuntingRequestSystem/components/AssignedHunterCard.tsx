export default function AssignedHunterCard() {
  return (
    <div className="mb-6">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-[#9ca3af]">
        Assigned Hunter
      </p>

      <div className="flex flex-col gap-3 md:flex-row md:items-center rounded-lg bg-[#050505] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#39ff14] text-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.35)]">
          ♞
        </div>

        <div>
          <p className="font-mono text-sm font-semibold text-[#e5e7eb]">
            HUNTER_01
            <span className="ml-2 rounded border border-[#f59e0b] px-2 py-0.5 text-xs text-[#f59e0b]">
              B
            </span>
          </p>

          <p className="mt-1 font-mono text-xs text-[#9ca3af]">
            [Sword] • Score: 1240
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#2d3748]" />
    </div>
  );
}