type SubmitSightingButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
};

export default function SubmitSightingButton({
    onClick,
    disabled = false,
}: SubmitSightingButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex-1 rounded bg-[#39ff14] py-2 text-black transition-all duration-200 hover:bg-[#52ff2f] hover:shadow-[0_0_12px_#39ff14] disabled:cursor-not-allowed disabled:bg-[#2d3748] disabled:text-[#9ca3af] disabled:hover:shadow-none"
        >
            Submit Sighting
        </button>
    );
}
