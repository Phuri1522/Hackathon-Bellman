type DeleteButtonProps = {
  onClick?: () => void;
};

export default function DeleteButton({
  onClick,
}: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded bg-[#b7410e] py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d34f18] hover:shadow-[0_0_12px_#b7410e]"
    >
      Delete
    </button>
  );
}