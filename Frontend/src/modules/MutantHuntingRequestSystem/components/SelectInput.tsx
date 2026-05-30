type SelectInputProps = {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectInput({
  label,
  options,
  value,
  onChange,
}: SelectInputProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-xs text-[#e5e7eb]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded border border-[#2d3748] bg-[#050505] p-3 text-white"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
