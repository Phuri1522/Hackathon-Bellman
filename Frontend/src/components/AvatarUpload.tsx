interface Props {
  preview?: string
  accentColor?: string
  onFileChange: (file: File, previewUrl: string) => void
}

export default function AvatarUpload({ preview, accentColor = "#39ff14", onFileChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileChange(file, URL.createObjectURL(file))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label
        className="cursor-pointer border border-dashed rounded-lg p-4 w-full text-center transition-colors hover:opacity-80"
        style={{ borderColor: accentColor }}
      >
        <p className="text-xs mb-1" style={{ color: accentColor, fontFamily: "Fira Code, monospace" }}>
          Click to select image
        </p>
        <p className="text-[#4b5563] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
          JPG, PNG, WEBP
        </p>
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </label>
    </div>
  )
}