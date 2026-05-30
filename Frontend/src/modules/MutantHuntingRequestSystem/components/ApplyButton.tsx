type ApplyButtonProps = {
  onClick?: () => void;
};

export default function ApplyButton({
  onClick,
}: ApplyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded bg-[#39ff14] py-2 text-sm font-semibold text-[#050505] transition-all duration-200 hover:bg-[#52ff2f] hover:shadow-[0_0_12px_#39ff14]"
    >
      Apply
    </button>
  );
}