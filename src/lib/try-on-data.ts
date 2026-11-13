import {
  Circle,
  CircleDot,
  Crown,
  Gem,
  Glasses,
  Paintbrush,
  Shirt,
  Watch,
  Waves,
  type LucideIcon,
} from "lucide-react";

export type TryOnCategory = {
  name: string;
  icon: LucideIcon;
  samples: readonly string[];
};

export type TryOnColor = { name: string; className: string };

export const defaultTryOnCategory: TryOnCategory = {
  name: "Kacamata",
  icon: Glasses,
  samples: ["Bingkai klasik", "Sehari-hari", "Lensa lembut"],
};

export const tryOnCategories = [
  defaultTryOnCategory,
  { name: "Rambut", icon: Waves, samples: ["Gelombang lembut", "Lurus rapi", "Alami"] },
  { name: "Topi", icon: Crown, samples: ["Topi kasual", "Tepi lebar", "Bucket lembut"] },
  { name: "Kalung", icon: Gem, samples: ["Liontin mini", "Rantai berlapis", "Rangkaian mutiara"] },
  { name: "Pakaian", icon: Shirt, samples: ["Rajut esensial", "Kemeja santai", "Jaket studio"] },
  { name: "Jam Tangan", icon: Watch, samples: ["Dial minimalis", "Logam modern", "Klasik sporty"] },
  { name: "Gelang", icon: CircleDot, samples: ["Rantai ramping", "Manik-manik", "Gelang lembut"] },
  { name: "Cincin", icon: Circle, samples: ["Kubah pahatan", "Cincin susun", "Signet klasik"] },
  { name: "Kuku", icon: Paintbrush, samples: ["Almond pendek", "Kotak lembut", "Bulat klasik"] },
] as const satisfies readonly [TryOnCategory, ...TryOnCategory[]];

export const tryOnColors: readonly TryOnColor[] = [
  { name: "Lilac", className: "bg-swatch-lilac" },
  { name: "Mawar", className: "bg-swatch-rose" },
  { name: "Hitam", className: "bg-swatch-ink" },
  { name: "Sage", className: "bg-swatch-sage" },
  { name: "Perak", className: "bg-swatch-silver" },
  { name: "Amber", className: "bg-swatch-amber" },
];

export const hairColors: readonly TryOnColor[] = [
  { name: "Hitam", className: "bg-swatch-ink" },
  { name: "Cokelat", className: "bg-swatch-amber" },
  { name: "Mawar", className: "bg-swatch-rose" },
  { name: "Lilac", className: "bg-swatch-lilac" },
  { name: "Sage", className: "bg-swatch-sage" },
];

export function getDefaultTryOnSelection() {
  return {
    category: defaultTryOnCategory,
    sample: defaultTryOnCategory.samples[0],
    color: tryOnColors[0],
  };
}