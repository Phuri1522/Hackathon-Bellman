type ViewPostButtonProps = {
  onClick?: () => void;
  label?: string;
};

export default function ViewPostButton({
  onClick,
  label = "View Post",
}: ViewPostButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded border border-[#9ca3af] py-2 text-sm text-[#e5e7eb] transition-all duration-200 hover:border-[#e5e7eb] hover:bg-[#111827]"
    >
      {label}
    </button>
  );
}
