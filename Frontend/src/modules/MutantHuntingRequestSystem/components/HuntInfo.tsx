export default function HuntInfo() {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded border border-[#b7410e] px-3 py-1 text-xs text-[#b7410e]">
          Wolf • Fire
        </span>

        <span className="rounded border border-[#facc15] px-3 py-1 text-xs text-[#facc15]">
          WATCHED
        </span>
      </div>

      <div className="text-sm text-[#9ca3af]">
        Required Class:
        <span className="ml-2 text-[#e5e7eb]">[Fighter]</span>

        <span className="mx-3">•</span>

        Reward:
        <span className="ml-2 text-[#e5e7eb]">500</span>
      </div>

      <div className="mt-8 border-t border-[#2d3748]" />
    </div>
  );
}