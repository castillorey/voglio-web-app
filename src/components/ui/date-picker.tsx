import { Label } from "@/components/ui/label";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1899 }, (_, i) => String(1900 + i));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

interface DatePickerProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  id?: string;
}

export function DatePicker({ value, onChange, label, id }: DatePickerProps) {
  const parts = value ? value.split("-") : [];
  const year = parts[0] || "";
  const month = parts[1] || "";
  const day = parts[2] || "";

  const handleChange = (y: string, m: string, d: string) => {
    if (y && m && d) {
      onChange(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    } else {
      onChange("");
    }
  };

  const selectClass = "flex h-9 w-full rounded-md border border-[#F0F1F6] bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B61FF]";

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="text-xs text-[#8C8F9E]">{label}</Label>
      )}
      <div className="mt-1 grid grid-cols-3 gap-2">
        <select
          value={month}
          onChange={(e) => handleChange(year, e.target.value, day)}
          className={selectClass}
        >
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={String(i + 1)}>{m}</option>
          ))}
        </select>
        <select
          value={day}
          onChange={(e) => handleChange(year, month, e.target.value)}
          className={selectClass}
        >
          <option value="">Day</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => handleChange(e.target.value, month, day)}
          className={selectClass}
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
