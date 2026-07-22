export type SizingFormat = "US" | "EU" | "UK";

export const SIZING_FORMATS: { label: string; value: SizingFormat }[] = [
  { label: "US", value: "US" },
  { label: "EU", value: "EU" },
  { label: "UK", value: "UK" },
];

interface SizeSet {
  shirt: string[];
  pants: string[];
  shoe: string[];
}

export const SIZES: Record<SizingFormat, SizeSet> = {
  US: {
    shirt: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    pants: ["28", "29", "30", "31", "32", "33", "34", "36", "38", "40"],
    shoe: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"],
  },
  EU: {
    shirt: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    pants: ["42", "44", "46", "48", "50", "52", "54", "56", "58", "60"],
    shoe: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"],
  },
  UK: {
    shirt: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    pants: ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46"],
    shoe: ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
  },
};
