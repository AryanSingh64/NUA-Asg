import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { fetchProduct } from "../lib/api";
import { getSalePrice, getVariants } from "../lib/variants";
import { useCart } from "../stores/CartContext";
import { money } from "../lib/format";
import { Footer } from "../components/Footer/Footer";
import styles from "./product.$id.module.scss";

const searchSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
});

const productQuery = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60_000,
  });

export const Route = createFileRoute("/product/$id")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(productQuery(params.id)),
  component: ProductDetail,
  errorComponent: ({ error }) => (
    <div style={{ padding: "8rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>
        Product not found
      </h1>
      <p style={{ color: "var(--fg-muted)", margin: "1rem 0 2rem" }}>
        {error.message}
      </p>
      <Link
        to="/"
        style={{
          padding: "0.75rem 1.4rem",
          background: "var(--moss-800)",
          color: "var(--cream-50)",
          borderRadius: 999,
          fontSize: "0.8rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Back to shop
      </Link>
    </div>
  ),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/product/$id" });
  const { data: product } = useSuspenseQuery(productQuery(id));
  const { addLine } = useCart();

  const variants = useMemo(
    () => getVariants(product.id, product.category),
    [product],
  );
  const sale = getSalePrice(product.price, product.id);
  const effective = sale ?? product.price;

  const selectedColor =
    variants.colors.find((c) => c.id === search.color) ?? variants.colors[0];
  const firstAvailableSize =
    variants.sizes.find((s) => s.stock !== "sold-out") ?? variants.sizes[0];
  const selectedSize =
    variants.sizes.find((s) => s.id === search.size) ?? firstAvailableSize;

  const [mainIndex, setMainIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );

  const gallery = [product.image, product.image, product.image];

  const soldOut = selectedSize.stock === "sold-out";

  type SearchState = z.infer<typeof searchSchema>;

  const setColor = (colorId: string) =>
    navigate({
      search: (prev: SearchState) => ({ ...prev, color: colorId }),
      replace: true,
    });

  const setSize = (sizeId: string) => {
    const target = variants.sizes.find((s) => s.id === sizeId);
    if (!target || target.stock === "sold-out") return;
    navigate({
      search: (prev: SearchState) => ({ ...prev, size: sizeId }),
      replace: true,
    });
  };

  const onAdd = async () => {
    if (soldOut || adding === "loading") return;
    setAdding("loading");
    try {
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => (Math.random() < 0.08 ? reject() : resolve()), 500),
      );
      addLine(
        {
          productId: product.id,
          title: product.title,
          image: product.image,
          unitPrice: effective,
          color: selectedColor?.name ?? null,
          size: selectedSize?.label ?? null,
        },
        qty,
      );
      setAdding("ok");
      setTimeout(() => setAdding("idle"), 1500);
    } catch {
      setAdding("err");
      setTimeout(() => setAdding("idle"), 1800);
    }
  };

  return (
    <>
      <div className={styles.wrap}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link to="/">Shop</Link>
          <span aria-hidden>·</span>
          <span className={styles.crumbCat}>{product.category}</span>
        </nav>

        <div className={styles.layout}>
          <section className={styles.gallery}>
            <div className={styles.mainImage}>
              <img
                src={gallery[mainIndex]}
                alt={product.title}
                width={800}
                height={800}
                fetchPriority="high"
              />
              {sale && <span className={styles.saleFlag}>Sale</span>}
            </div>
            <ul className={styles.thumbs} role="tablist">
              {gallery.map((src, i) => (
                <li key={i}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === mainIndex}
                    className={i === mainIndex ? styles.thumbActive : ""}
                    onClick={() => setMainIndex(i)}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.info}>
            <p className={styles.brand}>nua · {product.category}</p>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              {sale ? (
                <>
                  <span className={styles.priceSale}>{money(sale)}</span>
                  <span className={styles.priceOriginal}>
                    {money(product.price)}
                  </span>
                  <span className={styles.saveTag}>
                    Save {money(product.price - sale)}
                  </span>
                </>
              ) : (
                <span className={styles.price}>{money(product.price)}</span>
              )}
            </div>

            <p className={styles.desc}>{product.description}</p>

            <div className={styles.group}>
              <div className={styles.groupHead}>
                <span className={styles.groupLabel}>Colour</span>
                <span className={styles.groupValue}>{selectedColor?.name}</span>
              </div>
              <div className={styles.swatches}>
                {variants.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.swatch} ${
                      c.id === selectedColor?.id ? styles.swatchActive : ""
                    }`}
                    style={{ background: c.hex }}
                    onClick={() => setColor(c.id)}
                    aria-label={`Colour ${c.name}`}
                    aria-pressed={c.id === selectedColor?.id}
                  />
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <div className={styles.groupHead}>
                <span className={styles.groupLabel}>Size</span>
                <span className={styles.groupValue}>
                  {selectedSize?.label ?? "—"}
                </span>
              </div>
              <div className={styles.sizes}>
                {variants.sizes.map((s) => {
                  const disabled = s.stock === "sold-out";
                  const active = s.id === selectedSize?.id && !disabled;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.size} ${active ? styles.sizeActive : ""} ${
                        disabled ? styles.sizeDisabled : ""
                      } ${s.stock === "low" ? styles.sizeLow : ""}`}
                      disabled={disabled}
                      onClick={() => setSize(s.id)}
                      aria-pressed={active}
                    >
                      <span>{s.label}</span>
                      {s.stock === "low" && (
                        <em className={styles.sizeHint}>Low stock</em>
                      )}
                      {s.stock === "sold-out" && (
                        <em className={styles.sizeHint}>Sold out</em>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.qty} aria-label="Quantity">
                <button
                  aria-label="Decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  aria-label="Increase"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  disabled={qty >= 10}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.addBtn}
                onClick={onAdd}
                disabled={soldOut || adding === "loading"}
                data-state={adding}
              >
                {adding === "loading" && "Adding to bag…"}
                {adding === "ok" && "Added to bag ✓"}
                {adding === "err" && "Something went wrong - retry"}
                {adding === "idle" &&
                  (soldOut
                    ? "Sold out"
                    : `Add to bag · ${money(effective * qty)}`)}
              </button>
            </div>

            <ul className={styles.perks}>
              <li>Free carbon-neutral shipping over $75</li>
              <li>30-day returns, no questions asked</li>
              <li>Made from responsibly-sourced materials</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
