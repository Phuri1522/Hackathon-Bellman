type ApplicantStatus = "accepted" | "pending" | "declined";

type ApplicantCardProps = {
  name?: string;
  rank?: string;
  status?: ApplicantStatus;
};

export default function ApplicantCard({
  name = "HUNTER_01",
  rank = "B",
  status = "accepted",
}: ApplicantCardProps) {
  const statusStyle = {
    accepted: "border-[#39ff14] text-[#39ff14]",
    pending: "border-[#facc15] text-[#facc15]",
    declined: "border-[#b7410e] text-[#b7410e]",
  };

  return (
    <div className="mb-3 flex items-center justify-between rounded-lg bg-[#050505] p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d3748] text-[#9ca3af]">
          ♞
        </div>

        <p className="font-mono text-sm text-[#e5e7eb]">{name}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-[#f59e0b] px-2 py-0.5 text-xs text-[#f59e0b]">
          {rank}
        </span>

        <span
          className={`w-24 text-center rounded border px-3 py-1 text-xs uppercase ${statusStyle[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}