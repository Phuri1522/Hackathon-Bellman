export default function ImageUploadBox() {
    return (
        <div className="mb-2">
            <label className="mb-2 block text-xs text-[#e5e7eb]">
                Picture *
            </label>

            <div className="flex h-24 items-center justify-center rounded border border-dashed border-[#39ff14]
                      bg-[#050505] cursor-pointer transition-all duration-200 hover:bg-[#0b0f0b]
                      hover:shadow-[0_0_12px_rgba(57,255,20,0.35)] hover:border-[#52ff2f]">
                Upload Photo
            </div>
        </div>
    );
}