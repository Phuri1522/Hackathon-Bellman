import { useState } from "react";

type PostPinOverlayProps = {
    role: "user" | "hunter";
};

export default function PostPinOverlay({ role }: PostPinOverlayProps) {
    const [visible, setVisible] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState("");

    const isUser = role === "user";

    if (!visible) return null;

    function handleDeleteClick() {
        setConfirmDelete(true);
    }

    function handleConfirmDelete() {
        setMessage("Post deleted successfully");

        setTimeout(() => {
            setVisible(false);
        }, 1200);
    }

    function handleApply() {
        setMessage("Application accepted");

        setTimeout(() => {
            setVisible(false);
        }, 1200);
    }

    function handleCancelDelete() {
        setConfirmDelete(false);
    }

    return (
        <>
            {
                message && (
                    <div className="fixed left-1/2 top-6 z-[999] -translate-x-1/2 animate-[fadeIn_0.2s_ease-out] rounded border border-[#39ff14] bg-[#0f1115] px-5 py-3 text-center text-sm text-[#39ff14] shadow-[0_0_18px_rgba(57,255,20,0.35)]">
                        {message}
                    </div>
                )
            }

            <div className="w-[320px] rounded-xl border border-[#2d3748] bg-[#0f1115] p-4 text-[#e5e7eb] shadow-[0_0_18px_rgba(57,255,20,0.18)]">
                <div className="mb-3 h-36 overflow-hidden rounded-lg border border-[#2d3748] bg-[#050505]">
                    <img
                        src="https://images.unsplash.com/photo-1546182990-dffeafbe841d"
                        alt="Mutant"
                        className="h-full w-full object-cover"
                    />
                </div>

                <h2 className="text-xl font-bold text-[#39ff14]">Shadow Wolf</h2>

                <div className="mt-3 space-y-1 text-sm">
                    <p>
                        Reward: <span className="text-[#39ff14]">Water</span>
                    </p>
                    <p>
                        Required: <span className="text-[#39ff14]">Fighter</span>
                    </p>
                    <p>
                        Distance: <span className="text-[#39ff14]">2.0 km</span>
                    </p>
                </div>

                <p className="mt-3 text-xs text-[#9ca3af]">
                    Aggressive mutant spotted near the abandoned zone.
                </p>

                {confirmDelete ? (
                    <div className="mt-4">
                        <p className="mb-3 text-center text-sm text-[#e5e7eb]">
                            Delete this post?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 rounded border border-[#9ca3af] py-2 text-sm text-[#e5e7eb] transition-all duration-200 hover:border-[#e5e7eb] hover:bg-[#111827]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 rounded bg-[#b7410e] py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d34f18]"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={isUser ? handleDeleteClick : undefined}
                            className="flex-1 rounded border border-[#9ca3af] py-2 text-sm text-[#e5e7eb] transition-all duration-200 hover:border-[#e5e7eb] hover:bg-[#111827]"
                        >
                            {isUser ? "Delete" : "View Map"}
                        </button>

                        <button
                            onClick={isUser ? undefined : handleApply}
                            className="flex-1 rounded bg-[#39ff14] py-2 text-sm font-semibold text-[#050505] transition-all duration-200 hover:bg-[#52ff2f] hover:shadow-[0_0_12px_#39ff14]"
                        >
                            {isUser ? "View Map" : "Apply"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}