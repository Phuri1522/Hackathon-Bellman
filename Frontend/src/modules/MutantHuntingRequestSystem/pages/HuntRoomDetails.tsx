import { useState } from "react";
import type { MouseEvent } from "react";
import LocationPicker from "../components/LocationPicker";
import UserPostDetails from "../components/UserPostDetails";
import HunterPostDetails from "../components/HunterPostDetails";

type Role = "user" | "hunter";

export default function HuntRoomDetails() {
    const [showMiniOverlay, setShowMiniOverlay] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [role] = useState<Role>("hunter");

    function handleMapClick() {
        setShowMiniOverlay(false);
        setShowDetails(false);
    }

    function handlePinClick(e: MouseEvent) {
        e.stopPropagation();
        const shouldShow = !showMiniOverlay;
        setShowMiniOverlay(shouldShow);
        setShowDetails(shouldShow);
    }

    return (
        <main className="h-screen overflow-hidden bg-[#050505] text-[#e5e7eb]">
            <div className="flex h-full flex-col md:flex-row">
                <div
                    onClick={handleMapClick}
                    className={
                        showDetails
                            ? "h-[42vh] w-full transition-all duration-300 md:h-full md:w-[60%]"
                            : "h-full w-full transition-all duration-300"
                    }
                >
                    <LocationPicker
                        showMiniOverlay={showMiniOverlay}
                        onPinClick={handlePinClick}
                    />
                </div>

                {showDetails && (
                    <section className="h-[58vh] w-full animate-[fadeInRight_0.25s_ease-out] overflow-y-auto bg-[#0f1115] px-5 py-5 md:h-full md:w-[40%] md:px-10 md:py-6">
                        {role === "user" ? <UserPostDetails /> : <HunterPostDetails />}
                    </section>
                )}
            </div>
        </main>
    );
}
