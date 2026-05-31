type ApplyButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  disabledLabel?: string;
  label?: string;
};

export default function ApplyButton({
  onClick,
  disabled = false,
  disabledLabel = "Applying...",
  label = "Apply",
}: ApplyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded bg-[#39ff14] py-2 text-sm font-semibold text-[#050505] transition-all duration-200 hover:bg-[#52ff2f] hover:shadow-[0_0_12px_#39ff14] disabled:cursor-not-allowed disabled:bg-[#2d3748] disabled:text-[#9ca3af] disabled:hover:shadow-none"
    >
      {disabled ? disabledLabel : label}
    </button>
  );
}
