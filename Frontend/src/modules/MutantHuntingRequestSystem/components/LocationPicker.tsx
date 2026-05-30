import PostPinOverlay from "./PostPinOverlay";

type LocationPickerProps = {
  onPinClick?: () => void;
  showOverlay?: boolean;
};

export default function LocationPicker({
  onPinClick,
  showOverlay = false,
}: LocationPickerProps) {
  return (
    <section className="relative h-[42vh] w-full overflow-hidden border border-[#39ff14]/40 bg-[#06140b] md:h-full md:w-[60%]">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)",
          backgroundSize: "180px 180px",
        }}
      />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-[#050505]/40" />

      {/* center pin + overlay */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        {showOverlay && (
          <div className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2">
            <PostPinOverlay role="hunter" />
          </div>
        )}

        <button
          onClick={onPinClick}
          className="mx-auto mb-2 h-4 w-4 rounded-full bg-[#39ff14] shadow-[0_0_18px_#39ff14] transition-all duration-200 hover:scale-125"
        />

        <p className="font-mono text-xs text-[#39ff14]">
          [ TACTICAL MAP VIEW ]
        </p>

        <p className="mt-1 font-mono text-[10px] text-[#39ff14]">
          YOUR LOCATION
        </p>
      </div>
    </section>
  );
}