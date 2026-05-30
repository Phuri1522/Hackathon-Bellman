import ViewPostButton from "./ViewPostButton";
import ApplyButton from "./ApplyButton";
import { useState } from "react";

const POST_DETAILS = {
    animalType: "Wolf",
    mutantType: "Fire",
    requiredClass: "Fighter",
    reward: "Water",
    description: "Optional notes / test description",
    distance: "0.0 km from pin",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
};

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div className="mb-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-[#9ca3af]">
                {label}
            </p>
            <div className="rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-[#e5e7eb]">
                {value}
            </div>
        </div>
    );
}

export default function HunterPostDetails() {
    const [showSuccess, setShowSuccess] = useState(false);
    function handleSubmit() {
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    }

    return (
        <>
            {showSuccess && (
                <div className="fixed right-5 top-5 z-50 rounded border border-[#39ff14] bg-[#0f1115] px-5 py-3 text-sm text-[#39ff14] shadow-[0_0_14px_rgba(57,255,20,0.35)]">
                    Room applied
                </div>
            )}
            <h1 className="text-2xl font-bold text-[#39ff14] md:text-4xl">
                POST MUTANT DETAILS
            </h1>

            <div className="mb-5 mt-4 overflow-hidden rounded border border-[#2d3748] bg-[#050505]">
                <img
                    src={POST_DETAILS.imageUrl}
                    alt={`${POST_DETAILS.mutantType} ${POST_DETAILS.animalType}`}
                    className="h-56 w-full object-cover"
                />
            </div>

            <DetailField label="Animal Type" value={POST_DETAILS.animalType} />
            <DetailField label="Mutant Type" value={POST_DETAILS.mutantType} />
            <DetailField label="Required Class" value={POST_DETAILS.requiredClass} />
            <DetailField label="Reward" value={POST_DETAILS.reward} />
            <DetailField label="Description" value={POST_DETAILS.description} />

            <p className="mb-6 text-sm text-[#e5e7eb]">
                Distance:{" "}
                <span className="text-[#39ff14]">
                    {POST_DETAILS.distance}
                </span>
            </p>

            <div className="mt-4 flex gap-4">
                <ViewPostButton label="View Map" />
                <ApplyButton onClick={handleSubmit}/>
            </div>
        </>
    );
}
