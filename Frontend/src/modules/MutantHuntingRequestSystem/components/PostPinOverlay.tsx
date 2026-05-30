import type { MouseEvent } from "react";

type PostPinOverlayProps = {
  onViewPost?: (e: MouseEvent) => void;
  mode?: "default" | "preview";
  image?: string | null;
  title?: string;
};

export default function PostPinOverlay({
  onViewPost,
  mode = "default",
  image,
  title,
}: PostPinOverlayProps) {
  const overlayImage =
    image || "https://images.unsplash.com/photo-1546182990-dffeafbe841d";
  const overlayTitle = title || "Shadow Lion";
  const imageClassName =
    mode === "preview"
      ? "h-28 w-full rounded-lg object-cover"
      : "h-28 w-full rounded-lg object-cover";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onViewPost?.(e);
      }}
      className="w-52 rounded-xl border border-[#2d3748] bg-[#0f1115] p-3 text-[#e5e7eb] shadow-[0_0_18px_rgba(57,255,20,0.25)] transition-all duration-200 hover:border-[#39ff14]"
    >
      <img
        src={overlayImage}
        alt={overlayTitle}
        className={imageClassName}
        onError={(event) => {
          event.currentTarget.src =
            "https://images.unsplash.com/photo-1546182990-dffeafbe841d";
        }}
      />

      <h2 className="mt-3 text-center text-lg font-bold text-[#39ff14]">
        {overlayTitle}
      </h2>
    </button>
  );
}
