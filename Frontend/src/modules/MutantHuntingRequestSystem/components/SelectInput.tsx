type SelectInputProps = {
  label: string;
  options: string[];
};

export default function SelectInput({
  label,
  options,
}: SelectInputProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-xs text-[#e5e7eb]">
        {label}
      </label>

      <select className="w-full rounded border border-[#2d3748] bg-[#050505] p-3 text-white">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}