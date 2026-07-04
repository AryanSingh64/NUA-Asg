import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { fetchProducts, sortCategories } from "../lib/api";
import { Hero } from "../components/Hero/Hero";
import { CategorySection } from "../components/CategorySection/CategorySection";
import { Footer } from "../components/Footer/Footer";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: fetchProducts,
  staleTime: 5 * 60_000,
});

export const Route = createFileRoute("/")({
  component: HomePage,
  errorComponent: ({ error }) => (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <p>Could not load the collection: {error.message}</p>
    </div>
  ),
  pendingComponent: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <p style={{ color: "var(--fg-muted)", letterSpacing: "0.2em" }}>
        Loading the collection…
      </p>
    </div>
  ),
});

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 150);
    }
  }, []);

  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  }
  const categories = sortCategories(Array.from(byCategory.keys()));

  return (
    <>
      <Hero />
      <main>
        {categories.map((cat, i) => (
          <CategorySection
            key={cat}
            category={cat}
            products={byCategory.get(cat) ?? []}
            isFirst={i === 0}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
