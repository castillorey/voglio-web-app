import { useEffect, useState } from "react";
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

function parseDate(value: string) {
  const parts = value ? value.split("-") : [];
  return {
    year: parts[0] || "",
    month: parts[1] ? String(Number(parts[1])) : "",
    day: parts[2] ? String(Number(parts[2])) : "",
  };
}

export function DatePicker({ value, onChange, label, id }: DatePickerProps) {
  const [draft, setDraft] = useState(() => parseDate(value));

  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed.year && parsed.month && parsed.day) {
      setDraft(parsed);
    }
  }, [value]);

  const { year, month, day } = draft;

  const handleChange = (part: "year" | "month" | "day", next: string) => {
    const nextDraft = { ...draft, [part]: next };
    setDraft(nextDraft);
    if (nextDraft.year && nextDraft.month && nextDraft.day) {
      onChange(`${nextDraft.year}-${nextDraft.month.padStart(2, "0")}-${nextDraft.day.padStart(2, "0")}`);
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
          aria-label="Month"
          value={month}
          onChange={(e) => handleChange("month", e.target.value)}
          className={selectClass}
        >
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={String(i + 1)}>{m}</option>
          ))}
        </select>
        <select
          aria-label="Day"
          value={day}
          onChange={(e) => handleChange("day", e.target.value)}
          className={selectClass}
        >
          <option value="">Day</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          aria-label="Year"
          value={year}
          onChange={(e) => handleChange("year", e.target.value)}
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
