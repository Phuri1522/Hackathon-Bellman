import { useState } from "react";
import type { ChangeEvent } from "react";

type ImageUploadBoxProps = {
  preview?: string | null;
  onImageChange?: (imageUrl: string) => void;
  onPreviewChange?: (previewUrl: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  onUploadError?: (message: string) => void;
};

const UPLOAD_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/upload/image`;

export default function ImageUploadBox({
  preview: controlledPreview,
  onImageChange,
  onPreviewChange,
  onUploadingChange,
  onUploadError,
}: ImageUploadBoxProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const preview = controlledPreview ?? localPreview;

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = typeof reader.result === "string" ? reader.result : null;
      if (previewUrl) {
        setLocalPreview(previewUrl);
        onPreviewChange?.(previewUrl);
      }
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const result = await response.json();
      if (!result.url) {
        throw new Error("Cloudinary did not return an image URL");
      }

      setLocalPreview(result.url);
      onImageChange?.(result.url);
    } catch (error) {
      console.error("Failed to upload image to Cloudinary", error);
      onUploadError?.("Image upload failed. Please try another image.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="mb-3">
      <label className="mb-2 block text-xs text-[#e5e7eb]">
        Picture *
      </label>

      <label className="relative flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-[#39ff14] bg-[#050505] transition-all duration-200 hover:border-[#52ff2f] hover:bg-[#0b0f0b] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)]">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-[#9ca3af]">
            {isUploading ? "Uploading..." : "Upload Photo"}
          </span>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-xs text-[#39ff14]">Uploading to Cloudinary...</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
