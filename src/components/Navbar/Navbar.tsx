import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "../../stores/CartContext";
import styles from "./Navbar.module.scss";

const NAV = [
  { label: "New", href: "/#collection", targetId: "collection" },
  { label: "Women", href: "/#collection", targetId: "collection" },
  { label: "Men", href: "/#mens-clothing", targetId: "mens-clothing" },
  { label: "Jewellery", href: "/#jewelery", targetId: "jewelery" },
  { label: "Objects", href: "/#electronics", targetId: "electronics" },
];

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
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

        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="nua home">
          <span>nua</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.href}
              className={styles.link}
              onClick={(e) => handleNavClick(e, n.targetId)}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className={styles.tools}>
          <button
            type="button"
            className={styles.cartBtn}
            onClick={openCart}
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M9 7a3 3 0 1 1 6 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {itemCount > 0 && (
              <span className={styles.badge} aria-hidden>
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
