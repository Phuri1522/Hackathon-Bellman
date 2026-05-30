import SelectInput from "./SelectInput";
import ImageUploadBox from "./ImageUploadBox";
import CancelButton from "./CancelButton";
import SubmitSightingButton from "./SubmitSightingButton";

import {
    ANIMAL_TYPES,
    MUTANT_TYPES,
    HUNTER_CLASSES,
} from "../types/mutantHunting.type";

export default function CreatePostForm() {
    return (
        <>
            <h1 className="text-2xl font-bold text-[#39ff14] md:text-4xl">
                POST MUTANT SIGHTING
            </h1>

            <div className="mb-3 mt-2">
                <SelectInput label="Animal Type" options={ANIMAL_TYPES} />
            </div>

            <div className="mb-2">
                <SelectInput label="Mutant Type" options={MUTANT_TYPES} />
            </div>

            <div className="mb-2">
                <SelectInput label="Required Classes" options={HUNTER_CLASSES} />
            </div>

            <ImageUploadBox />

            <div className="mb-3">
                <label className="mb-2 block text-xs text-[#e5e7eb]">Reward</label>
                <input
                    className="w-full rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-white"
                    placeholder="Water, Food, Medicine..."
                />
            </div>

            <div className="mb-3">
                <label className="mb-2 block text-xs text-[#e5e7eb]">
                    Description
                </label>
                <textarea
                    rows={4}
                    className="w-full rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-white"
                    placeholder="Optional notes..."
                />
            </div>

            <p className="mb-6 text-sm text-[#e5e7eb]">
                Distance (auto):{" "}
                <span className="text-[#39ff14]">
                    0.0 km from pin
                </span>
            </p>

            <div className="mt-4 flex gap-4">
                <CancelButton />
                <SubmitSightingButton />
            </div>
        </>
    );
}