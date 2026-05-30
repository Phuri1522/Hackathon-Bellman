type SubmitSightingButtonProps = {
    onClick?: () => void;
};

export default function SubmitSightingButton({
    onClick,
}: SubmitSightingButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex-1 rounded bg-[#39ff14] py-2 text-black transition-all duration-200 hover:bg-[#52ff2f] hover:shadow-[0_0_12px_#39ff14]"
        >
            Submit Sighting
        </button>
    );
}