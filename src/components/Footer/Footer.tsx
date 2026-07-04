import { toast } from "sonner";
import textureImg from "../../assets/texture-daisies.webp";
import styles from "./Footer.module.scss";

export function Footer() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "email",
    ) as HTMLInputElement | null;
    if (input && input.value) {
      toast.success(`Thank you! ${input.value} is now subscribed.`);
      input.value = "";
    }
  };

  return (
    <footer className={styles.footer}>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${textureImg})` }}
      >
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Stay in bloom</p>
          <h2 className={styles.headline}>Be part of what's next.</h2>
          <p className={styles.blurb}>
            Get early access to new drops, exclusive editorials and the
            occasional letter from the studio.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              required
              placeholder="you@somewhere.com"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <div className={styles.brandCol}>
            <span className={styles.brand}>nua</span>
            <p className={styles.tagline}>
              A garden of considered clothing. Built with care, worn with
              intent.
            </p>
          </div>
          <div className={styles.columns}>
            <div>
              <h4>Shop</h4>
              <ul>
                <li>All Products</li>
                <li>Sale</li>
              </ul>
            </div>
            <div>
              <h4>Studio</h4>
              <ul>
                <li>About</li>
                <li>Sustainability</li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>Support</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
