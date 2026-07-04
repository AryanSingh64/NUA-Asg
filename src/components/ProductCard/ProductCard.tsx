import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import type { ApiProduct } from "../../lib/api";
import { getSalePrice, getVariants } from "../../lib/variants";
import { useCart } from "../../stores/CartContext";
import { money } from "../../lib/format";
import styles from "./ProductCard.module.scss";

type Props = { product: ApiProduct; index?: number };

export function ProductCard({ product, index = 0 }: Props) {
  const { addLine } = useCart();
  const [adding, setAdding] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );

  const sale = getSalePrice(product.price, product.id);
  const effective = sale ?? product.price;
  const variants = getVariants(product.id, product.category);
  const soldOut = variants.sizes.every((s) => s.stock === "sold-out");

  const quickAdd = async () => {
    if (soldOut || adding === "loading") return;
    setAdding("loading");
    try {
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => (Math.random() < 0.08 ? reject() : resolve()), 450),
      );
      const firstAvailable = variants.sizes.find((s) => s.stock !== "sold-out");
      addLine({
        productId: product.id,
        title: product.title,
        image: product.image,
        unitPrice: effective,
        color: variants.colors[0]?.name ?? null,
        size: firstAvailable?.label ?? null,
      });
      setAdding("ok");
      setTimeout(() => setAdding("idle"), 1200);
    } catch {
      setAdding("err");
      setTimeout(() => setAdding("idle"), 1600);
    }
  };

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to="/product/$id"
        params={{ id: String(product.id) }}
        className={styles.imgLink}
        aria-label={product.title}
      >
        <div className={styles.imgFrame}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            width={400}
            height={500}
          />
          {sale && <span className={styles.saleTag}>Sale</span>}
          {soldOut && <span className={styles.soldTag}>Sold out</span>}
        </div>

        <button
          type="button"
          className={styles.quickAdd}
          onClick={(e) => {
            e.preventDefault();
            quickAdd();
          }}
          disabled={soldOut || adding === "loading"}
          data-state={adding}
        >
          {adding === "loading" && "Adding…"}
          {adding === "ok" && "Added ✓"}
          {adding === "err" && "Try again"}
          {adding === "idle" && (soldOut ? "Sold out" : "Quick add")}
        </button>
      </Link>

      <div className={styles.meta}>
        <Link
          to="/product/$id"
          params={{ id: String(product.id) }}
          className={styles.title}
        >
          {product.title}
        </Link>
        <div className={styles.priceRow}>
          {sale ? (
            <>
              <span className={styles.priceSale}>{money(sale)}</span>
              <span className={styles.priceOriginal}>
                {money(product.price)}
              </span>
            </>
          ) : (
            <span className={styles.price}>{money(product.price)}</span>
          )}
        </div>
        <div className={styles.swatches} aria-hidden>
          {variants.colors.slice(0, 4).map((c) => (
            <span
              key={c.id}
              className={styles.swatch}
              style={{ background: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
