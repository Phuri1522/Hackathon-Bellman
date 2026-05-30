import SelectInput from "./SelectInput";
import ImageUploadBox from "./ImageUploadBox";
import CancelButton from "./CancelButton";
import SubmitSightingButton from "./SubmitSightingButton";
import { useEffect, useMemo, useState } from "react";
import { createMutantHuntingRequest } from "../mutantHunting.api";

import {
    ANIMAL_TYPES,
    MUTANT_TYPES,
    type MutantPostPreview,
    type MapPoint,
} from "../types/mutantHunting.type";

const DEFAULT_IMAGE_URL = "https://example.com/mutant.jpg";
const STATIC_USER_ID = 1;

type HunterClass = "FIGHTER" | "TANKER" | "RANGER";

const REQUIRED_CLASS_BY_ANIMAL: Record<string, HunterClass[]> = {
    WOLF: ["FIGHTER", "RANGER"],
    BEAR: ["TANKER"],
    SHARK: ["TANKER", "RANGER"],
    BOAR: ["TANKER", "FIGHTER"],
    SNAKE: ["RANGER"],
    LIZARD: ["RANGER", "FIGHTER"],
    BIRD: ["RANGER"],
    CAT: ["FIGHTER", "RANGER"],
    SPIDER: ["RANGER", "TANKER"],
    MONKEY: ["FIGHTER", "RANGER", "TANKER"],
};

function toDisplayClass(hunterClass: HunterClass) {
    return hunterClass.charAt(0) + hunterClass.slice(1).toLowerCase();
}

function calculateRequiredClasses(animalType: string) {
    const animal = animalType.trim().toUpperCase();
    const requiredClasses = REQUIRED_CLASS_BY_ANIMAL[animal] ?? ["FIGHTER"];

    return [...new Set(requiredClasses)].map(toDisplayClass);
}

type CreatePostFormProps = {
    selectedPin: MapPoint | null;
    distanceKm: number;
    onPreviewChange?: (preview: MutantPostPreview) => void;
};

export default function CreatePostForm({
    selectedPin,
    distanceKm,
    onPreviewChange,
}: CreatePostFormProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Failed to submit post");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animalType, setAnimalType] = useState(ANIMAL_TYPES[0]);
    const [mutantType, setMutantType] = useState(MUTANT_TYPES[0]);
    const [reward, setReward] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_URL);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const requiredClasses = useMemo(
        () => calculateRequiredClasses(animalType),
        [animalType]
    );
    const requiredClass = requiredClasses.join(",");

    useEffect(() => {
        onPreviewChange?.({
            imagePreview,
            animalType,
            mutantType,
            reward,
            requiredClasses,
        });
    }, [animalType, imagePreview, mutantType, onPreviewChange, requiredClasses, reward]);

    function resetForm() {
        setAnimalType(ANIMAL_TYPES[0]);
        setMutantType(MUTANT_TYPES[0]);
        setReward("");
        setDescription("");
        setImageUrl(DEFAULT_IMAGE_URL);
        setImagePreview(null);
    }

    async function handleSubmit() {
        if (isSubmitting) return;

        setShowSuccess(false);
        setShowError(false);

        if (!selectedPin) {
            setErrorMessage("Please select a mutant sighting pin on the map");
            setShowError(true);

            setTimeout(() => {
                setShowError(false);
            }, 2500);
            return;
        }

        setIsSubmitting(true);

        try {
            await createMutantHuntingRequest({
                userId: STATIC_USER_ID,
                animalType,
                mutantType,
                requiredClass,
                reward,
                description,
                imageUrl,
                latitude: selectedPin.lat,
                longitude: selectedPin.lng,
            });

            resetForm();
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 2500);
        } catch {
            setErrorMessage("Failed to submit post");
            setShowError(true);

            setTimeout(() => {
                setShowError(false);
            }, 2500);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {showSuccess && (
                <div className="fixed right-5 top-5 z-50 rounded border border-[#39ff14] bg-[#0f1115] px-5 py-3 text-sm text-[#39ff14] shadow-[0_0_14px_rgba(57,255,20,0.35)]">
                    Post submitted successfully
                </div>
            )}
            {showError && (
                <div className="fixed right-5 top-5 z-50 rounded border border-[#b7410e] bg-[#0f1115] px-5 py-3 text-sm text-[#ff7a45] shadow-[0_0_14px_rgba(183,65,14,0.35)]">
                    {errorMessage}
                </div>
            )}
            <h1 className="text-2xl font-bold text-[#39ff14] md:text-4xl">
                POST MUTANT SIGHTING
            </h1>

            <div className="mb-3 mt-2">
                <SelectInput
                    label="Animal Type"
                    options={ANIMAL_TYPES}
                    value={animalType}
                    onChange={setAnimalType}
                />
            </div>

            <div className="mb-2">
                <SelectInput
                    label="Mutant Type"
                    options={MUTANT_TYPES}
                    value={mutantType}
                    onChange={setMutantType}
                />
            </div>

            <div className="mb-4">
                <div className="mb-2">
                    <label className="mb-2 block text-xs text-[#e5e7eb]">
                        Required Classes
                    </label>

                    <div className="flex min-h-11 w-full flex-wrap gap-2 rounded border border-[#2d3748] bg-[#050505] px-4 py-2">
                        {requiredClasses.map((hunterClass) => (
                            <span
                                key={hunterClass}
                                className="rounded border border-[#2d3748] bg-[#050505] px-3 py-1 text-sm font-semibold text-[#39ff14]"
                            >
                                {hunterClass}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <label className="mb-2 block text-xs text-[#e5e7eb]">Reward</label>
                <input
                    value={reward}
                    onChange={(event) => setReward(event.target.value)}
                    className="w-full rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-white"
                    placeholder="Water, Food, Medicine..."
                />
            </div>

            <div className="mb-3">
                <label className="mb-2 block text-xs text-[#e5e7eb]">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="w-full rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-white"
                    placeholder="Optional notes..."
                />
            </div>

            <ImageUploadBox
                preview={imagePreview}
                onImageChange={(nextImageUrl) => {
                    setImagePreview(nextImageUrl);
                    setImageUrl(DEFAULT_IMAGE_URL);
                }}
            />

            <p className="mb-6 text-sm text-[#e5e7eb]">
                Distance (auto):{" "}
                <span className="text-[#39ff14]">
                    {distanceKm.toFixed(1)} km from pin
                </span>
            </p>

            <div className="mt-4 flex gap-4">
                <CancelButton />
                <SubmitSightingButton onClick={handleSubmit} disabled={isSubmitting} />
            </div>
        </>
    );
}
