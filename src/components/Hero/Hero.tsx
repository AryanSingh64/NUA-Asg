import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "../../assets/hero-daisies.jpg";
import styles from "./Hero.module.scss";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.35, 0.7]);

  return (
    <section ref={ref} className={styles.hero} aria-label="Introduction">
      <motion.div
        className={styles.imageWrap}
        style={{ y: imageY, scale: imageScale }}
      >
        <img
          src={heroImg}
          alt="A bouquet of white daisies resting in tall grass"
          fetchPriority="high"
          width={1600}
          height={1200}
        />
      </motion.div>
      <motion.div className={styles.overlay} style={{ opacity: overlay }} />

      <motion.div className={styles.content} style={{ y: textY }}>
        <div className={styles.top}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Spring / Summer Edit - 2026
          </motion.p>
          <motion.p
            className={styles.blurb}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            A groundbreaking new era for fashion, one where innovative design
            interweaves with sustainability. Pieces that reflect who we are and
            what we stand for.
          </motion.p>
        </div>

        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>Let nature inspire</span>
          <span className={styles.italic}>your unique wardrobe.</span>
        </motion.h1>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="#collection" className={styles.primaryBtn}>
            Shop the Collection
          </a>
          <a href="#collection" className={styles.ghostBtn}>
            Explore Lookbook
          </a>
        </motion.div>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <span>Scroll</span>
          <span className={styles.hintLine} aria-hidden />
        </motion.div>
      </motion.div>
    </section>
  );
}
