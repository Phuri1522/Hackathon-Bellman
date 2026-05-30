import { useNavigate } from "react-router-dom";

export default function CancelButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex-1 rounded border border-[#9ca3af] py-2 text-[#e5e7eb] transition-all duration-200 hover:border-[#e5e7eb] hover:bg-[#111827]"
        >
            Cancel
        </button>
    );
}