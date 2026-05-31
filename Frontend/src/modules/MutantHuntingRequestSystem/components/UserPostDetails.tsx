import ViewPostButton from "./ViewPostButton";
import DeleteButton from "./DeleteButton";
import type { MutantHuntingRequest } from "../types/mutantHunting.type";

const POST_DETAILS = {
    animalType: "Wolf",
    mutantType: "Fire",
    requiredClass: "Fighter",
    reward: "Water",
    description: "Optional notes / test description",
    distance: "0.0 km from pin",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
};

type PostDetailsProps = {
    post?: MutantHuntingRequest | null;
    distance?: string;
    onViewMap?: () => void;
    onDelete?: () => void;
};

function displayValue(value: string | null | undefined, fallback = "-") {
    return value?.trim() ? value : fallback;
}

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div className="mb-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-[#9ca3af]">
                {label}
            </p>
            <div className="flex min-h-10 items-center rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-[#e5e7eb]">
                {displayValue(value)}
            </div>
        </div>
    );
}

export default function UserPostDetails({
    post,
    distance,
    onViewMap,
    onDelete,
}: PostDetailsProps) {
    const details = {
        animalType: post?.animalType ?? POST_DETAILS.animalType,
        mutantType: post?.mutantType ?? POST_DETAILS.mutantType,
        requiredClass: post?.classRequired ?? POST_DETAILS.requiredClass,
        reward: post ? displayValue(post.reward) : POST_DETAILS.reward,
        description: post ? displayValue(post.description) : POST_DETAILS.description,
        distance: distance ?? POST_DETAILS.distance,
        imageUrl: post?.picture ?? post?.imageUrl ?? POST_DETAILS.imageUrl,
    };
    function handleSubmit() {
        onDelete?.();
    }

    return (
        <>
            <h1
                className="whitespace-nowrap text-2xl font-bold leading-tight text-[#39ff14] md:text-3xl"
                style={{ fontFamily: "Orbitron, monospace" }}
            >
                POST MUTANT DETAILS
            </h1>

            <div className="mb-5 mt-4 overflow-hidden rounded border border-[#2d3748] bg-[#050505]">
                <img
                    src={details.imageUrl}
                    alt={`${details.mutantType} ${details.animalType}`}
                    className="h-56 w-full object-cover"
                    onError={(event) => {
                        event.currentTarget.src =
                            "https://images.unsplash.com/photo-1546182990-dffeafbe841d";
                    }}
                />
            </div>

            <DetailField label="Animal Type" value={details.animalType} />
            <DetailField label="Mutant Type" value={details.mutantType} />
            <DetailField label="Required Class" value={details.requiredClass} />
            <DetailField label="Reward" value={details.reward} />
            <DetailField label="Description" value={details.description} />

            <p className="mb-6 text-sm text-[#e5e7eb]">
                Distance:{" "}
                <span className="text-[#39ff14]">
                    {details.distance}
                </span>
            </p>

            <div className="mt-4 flex gap-4">
                <ViewPostButton label="View Map" onClick={onViewMap} />
                <DeleteButton onClick={handleSubmit}/>
            </div>
        </>
    );
}
