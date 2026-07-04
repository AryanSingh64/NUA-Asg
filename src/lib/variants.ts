export type StockState = "available" | "low" | "sold-out";

export type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

export type SizeOption = {
  id: string;
  label: string;
  stock: StockState;
};

export type VariantMatrix = {
  colors: ColorOption[];
  sizes: SizeOption[];
};

const PALETTE: ColorOption[] = [
  { id: "moss", name: "Moss", hex: "#4a6741" },
  { id: "sand", name: "Sand", hex: "#c9b99a" },
  { id: "ivory", name: "Ivory", hex: "#f5f0e6" },
  { id: "clay", name: "Clay", hex: "#a05a3c" },
  { id: "ink", name: "Ink", hex: "#1e2418" },
];

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];
const ACCESSORY_SIZES = ["One Size"];
const SHOE_SIZES = ["7", "8", "9", "10", "11"];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSizes(category: string): string[] {
  const c = category.toLowerCase();
  if (c.includes("jewel")) return ACCESSORY_SIZES;
  if (c.includes("electronic")) return ACCESSORY_SIZES;
  if (c.includes("shoe")) return SHOE_SIZES;
  return APPAREL_SIZES;
}

export function getVariants(
  productId: number,
  category: string,
): VariantMatrix {
  const rand = mulberry32(productId * 9973 + 1);

  const colorCount = 2 + Math.floor(rand() * 3);
  const shuffled = [...PALETTE];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const colors = shuffled.slice(0, colorCount);

  const sizeLabels = pickSizes(category);
  const sizes: SizeOption[] = sizeLabels.map((label) => {
    const r = rand();
    let stock: StockState = "available";
    if (r < 0.18) stock = "sold-out";
    else if (r < 0.38) stock = "low";
    return { id: label.toLowerCase().replace(/\s+/g, "-"), label, stock };
  });

  if (!sizes.some((s) => s.stock !== "sold-out")) {
    sizes[0].stock = "available";
  }

  return { colors, sizes };
}

export function getSalePrice(price: number, productId: number): number | null {
  return productId % 5 < 2 ? +(price * 0.8).toFixed(2) : null;
}
