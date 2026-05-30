import { useState } from "react";

export default function ImageUploadBox() {
  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  }

  return (
    <div className="mb-3">
      <label className="mb-2 block text-xs text-[#e5e7eb]">
        Picture *
      </label>

      <label className="flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-[#39ff14] bg-[#050505] transition-all duration-200 hover:border-[#52ff2f] hover:bg-[#0b0f0b] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)]">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span>Upload Photo</span>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
}