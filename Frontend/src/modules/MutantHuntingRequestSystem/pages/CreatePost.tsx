import LocationPicker from "../components/LocationPicker";
import SelectInput from "../components/SelectInput";
import CancelButton from "../components/CancelButton";
import SubmitSightingButton from "../components/SubmitSightingButton"
import ImageUplodaBox from "../components/ImageUploadBox"

import {
    ANIMAL_TYPES,
    MUTANT_TYPES,
    HUNTER_CLASSES,
} from "../types/mutantHunting.type";

export default function CreatePostPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-[#e5e7eb]">
            <div className="flex h-screen overflow-hidden">
                <LocationPicker />

                <section className="w-[40%] h-screen overflow-y-auto bg-[#0f1115] px-10 py-6">
                    <h1 className="text-3xl font-bold text-[#39ff14]">
                        POST MUTANT SIGHTING
                    </h1>

                    {/* Animal Type */}
                    <div className="mb-3 mt-2">
                        <SelectInput
                            label="Animal Type"
                            options={ANIMAL_TYPES}
                        />
                    </div>

                    {/* Mutant Type */}
                    <div className="mb-2">
                        <SelectInput
                            label="Mutant Type"
                            options={MUTANT_TYPES}
                        />
                    </div>

                    {/* Required Class */}
                    <div className="mb-2">
                        <SelectInput
                            label="Required Classes"
                            options={HUNTER_CLASSES}
                        />
                    </div>

                    {/* Image Upload */}
                    <ImageUplodaBox />

                    {/* Reward */}
                    <div className="mb-3">
                        <label className="mb-2 block text-xs text-[#e5e7eb]">
                            Reward
                        </label>
                        <input
                            className="w-full rounded border border-[#2d3748] bg-[#050505] px-4 py-2 text-white"
                            placeholder="Water, Food, Medicine..."
                        />
                    </div>

                    {/* Description */}
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

                    {/* Distance */}
                    <p className="mb-6 text-sm text-[#39ff14]">
                        Distance (auto): 0.0 km from pin
                    </p>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-4">
                        <CancelButton />
                        <SubmitSightingButton />
                    </div>
                </section>
            </div>
        </main>
    );
}