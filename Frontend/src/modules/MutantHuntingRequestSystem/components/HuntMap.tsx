export default function HuntMap() {
  return (
    <section className="relative h-[42vh] w-full overflow-hidden border border-[#39ff14]/40 bg-[#06140b] md:h-full w-full md:w-[58%] h-[40vh] md:h-full">
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

      {/* live tracking marker */}
      <div className="absolute left-1/2 top-[35%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="relative mx-auto mb-4 h-14 w-14 rounded-full border border-[#b7410e] bg-[#b7410e]/20">
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b7410e] shadow-[0_0_18px_#b7410e]" />
          <div className="absolute left-[55%] top-[62%] h-4 w-4 rounded-full bg-[#39ff14] shadow-[0_0_18px_#39ff14]" />
        </div>

        <p className="font-mono text-[10px] text-[#b7410e]">
          LIVE TRACKING
        </p>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 text-center">
        <p className="font-mono text-xs text-[#39ff14]">
          [ TACTICAL MAP VIEW ]
        </p>
      </div>
    </section>
  );
}