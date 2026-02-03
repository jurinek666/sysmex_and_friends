export type PlacementToneVariant = "light" | "dark";

const lightTone = {
  gold: "bg-[#F6E08C] border-[#F1C84B]",
  silver: "bg-[#E2E6EE] border-[#B9C0CC]",
  bronze: "bg-[#E6B07A] border-[#C46B2C]",
  other: "bg-gray-50 border-gray-200",
} as const;

const darkTone = {
  gold: "bg-[#F1C84B]/25 border-[#F1C84B]/80",
  silver: "bg-[#B9C0CC]/25 border-[#B9C0CC]/70",
  bronze: "bg-[#C46B2C]/25 border-[#C46B2C]/80",
  other: "bg-white/5 border-white/10",
} as const;

export function getPlacementTone(placement: number, variant: PlacementToneVariant) {
  const tones = variant === "light" ? lightTone : darkTone;

  if (placement === 1) return tones.gold;
  if (placement === 2) return tones.silver;
  if (placement === 3) return tones.bronze;
  return tones.other;
}
