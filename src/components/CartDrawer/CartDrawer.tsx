import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "../../stores/CartContext";
import { money } from "../../lib/format";
import styles from "./CartDrawer.module.scss";

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQty, remove, subtotal } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.scrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            className={styles.drawer}
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <header className={styles.head}>
              <div>
                <p className={styles.eyebrow}>Your bag</p>
                <h2 className={styles.title}>
                  {lines.length === 0
                    ? "Empty for now"
                    : `${lines.length} ${lines.length === 1 ? "piece" : "pieces"}`}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeCart}
                aria-label="Close cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div className={styles.body}>
              {lines.length === 0 ? (
                <div className={styles.empty}>
                  <p>Nothing has caught your eye yet.</p>
                  <button className={styles.emptyCta} onClick={closeCart}>
                    Return to the collection
                  </button>
                </div>
              ) : (
                <ul className={styles.list}>
                  {lines.map((l) => (
                    <li key={l.key} className={styles.item}>
                      <div className={styles.thumb}>
                        <img src={l.image} alt="" loading="lazy" />
                      </div>
                      <div className={styles.meta}>
                        <p className={styles.name}>{l.title}</p>
                        <p className={styles.variant}>
                          {[l.color, l.size].filter(Boolean).join(" · ") ||
                            "Standard"}
                        </p>
                        <p className={styles.price}>{money(l.unitPrice)}</p>

                        <div className={styles.row}>
                          <div className={styles.qty}>
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => setQty(l.key, l.qty - 1)}
                            >
                              −
                            </button>
                            <span aria-live="polite">{l.qty}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => setQty(l.key, l.qty + 1)}
                              disabled={l.qty >= 99}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className={styles.removeBtn}
                            onClick={() => remove(l.key)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className={styles.foot}>
                <dl className={styles.summary}>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>Calculated at checkout</dd>
                  </div>
                  <div className={styles.total}>
                    <dt>Grand total</dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                </dl>
                <button className={styles.checkout}>Proceed to checkout</button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
