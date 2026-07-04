import { motion } from "framer-motion";
import type { ApiProduct } from "../../lib/api";
import { CATEGORY_META } from "../../lib/api";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./CategorySection.module.scss";

type Props = {
  category: string;
  products: ApiProduct[];
  isFirst?: boolean;
};

export function CategorySection({ category, products, isFirst }: Props) {
  const meta = CATEGORY_META[category] ?? {
    eyebrow: "Chapter",
    title: category,
    blurb: "",
  };

  const categoryIds: Record<string, string> = {
    "women's clothing": "womens-clothing",
    "men's clothing": "mens-clothing",
    jewelery: "jewelery",
    electronics: "electronics",
  };
  const sectionId = isFirst
    ? "collection"
    : (categoryIds[category] ?? category);

  return (
    <section
      className={styles.section}
      id={sectionId}
      aria-labelledby={`cat-${category}`}
    >
      <motion.header
        className={styles.head}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.headLeft}>
          <p className={styles.eyebrow}>{meta.eyebrow}</p>
          <h2 id={`cat-${category}`} className={styles.title}>
            {meta.title}
          </h2>
        </div>
        <p className={styles.blurb}>{meta.blurb}</p>
      </motion.header>

      <div className={styles.grid}>
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
