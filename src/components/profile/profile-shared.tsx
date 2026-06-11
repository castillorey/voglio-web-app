import { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="px-[14px] py-[8px] rounded-full text-sm text-[#5E6173] bg-[#F7F7FA] border border-[#ECECF2]">
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-[24px] p-5 border border-[#F0F1F6] ${className}`}
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,.04)" }}
    >
      {children}
    </div>
  );
}

export function ProfileRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F3F4F7] last:border-b-0">
      <span className="text-sm text-[#8C8F9E]">{label}</span>
      <span className="text-sm font-medium text-[#1B1B2D]">{value}</span>
    </div>
  );
}
