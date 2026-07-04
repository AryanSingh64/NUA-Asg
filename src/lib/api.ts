export type ApiProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

const BASE = "https://fakestoreapi.com";

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  return res.json();
}

export async function fetchProduct(id: number | string): Promise<ApiProduct> {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to load product ${id} (${res.status})`);
  const data = await res.json();
  if (!data || !data.id) throw new Error("Product not found");
  return data;
}

export const CATEGORY_META: Record<
  string,
  { title: string; eyebrow: string; blurb: string; order: number }
> = {
  "women's clothing": {
    order: 1,
    eyebrow: "Chapter 01",
    title: "For Her, In Bloom",
    blurb:
      "Sheer layers, garden-soft silhouettes. Pieces meant to move with the season.",
  },
  "men's clothing": {
    order: 2,
    eyebrow: "Chapter 02",
    title: "For Him, Grounded",
    blurb:
      "Considered basics and outerwear built for weekdays that feel like weekends.",
  },
  jewelery: {
    order: 3,
    eyebrow: "Chapter 03",
    title: "Everyday Talismans",
    blurb: "Small objects meant to be worn until they feel like part of you.",
  },
  electronics: {
    order: 4,
    eyebrow: "Chapter 04",
    title: "Quiet Utility",
    blurb: "The tools that live on the desk, in the bag, in the everyday.",
  },
};

export function sortCategories(cats: string[]): string[] {
  return [...cats].sort(
    (a, b) => (CATEGORY_META[a]?.order ?? 99) - (CATEGORY_META[b]?.order ?? 99),
  );
}
