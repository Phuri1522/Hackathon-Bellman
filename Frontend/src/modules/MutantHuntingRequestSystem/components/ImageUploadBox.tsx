import { useState } from "react";
import type { ChangeEvent } from "react";

type ImageUploadBoxProps = {
  preview?: string | null;
  onImageChange?: (imageUrl: string) => void;
};

export default function ImageUploadBox({
  preview: controlledPreview,
  onImageChange,
}: ImageUploadBoxProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const preview = controlledPreview ?? localPreview;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const rawImageUrl = typeof reader.result === "string" ? reader.result : null;

      if (!rawImageUrl) return;

      const image = new Image();
      image.onload = () => {
        const maxSize = 420;
        const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/jpeg", 0.62);

        setLocalPreview(imageUrl);
        onImageChange?.(imageUrl);
      };
      image.src = rawImageUrl;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mb-3">
      <label className="mb-2 block text-xs text-[#e5e7eb]">
        Picture *
      </label>

      <label className="flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-[#39ff14] bg-[#050505] transition-all duration-200 hover:border-[#52ff2f] hover:bg-[#0b0f0b] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)]">
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
