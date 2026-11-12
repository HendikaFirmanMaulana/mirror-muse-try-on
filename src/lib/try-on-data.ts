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

export const tryOnCategories = [
  { name: "Glasses", icon: Glasses, samples: ["Sculpted", "Everyday", "Soft tint"] },
  { name: "Hair", icon: Waves, samples: ["Soft wave", "Sleek", "Natural"] },
  { name: "Hat", icon: Crown, samples: ["Weekend cap", "Wide brim", "Soft bucket"] },
  { name: "Necklace", icon: Gem, samples: ["Mini pendant", "Layered chain", "Pearl strand"] },
  { name: "Clothes", icon: Shirt, samples: ["Essential knit", "Relaxed shirt", "Studio jacket"] },
  { name: "Watch", icon: Watch, samples: ["Minimal dial", "Modern metal", "Sport classic"] },
  { name: "Bracelet", icon: CircleDot, samples: ["Slim chain", "Beaded", "Soft cuff"] },
  { name: "Ring", icon: Circle, samples: ["Sculpted dome", "Stacking", "Classic signet"] },
  { name: "Nails", icon: Paintbrush, samples: ["Short almond", "Soft square", "Classic round"] },
] as const satisfies readonly [TryOnCategory, ...TryOnCategory[]];

export const tryOnColors = [
  { name: "Lilac", className: "bg-swatch-lilac" },
  { name: "Rose", className: "bg-swatch-rose" },
  { name: "Ink", className: "bg-swatch-ink" },
  { name: "Sage", className: "bg-swatch-sage" },
  { name: "Silver", className: "bg-swatch-silver" },
  { name: "Amber", className: "bg-swatch-amber" },
] as const;