# Decisions, Inspiration & Trade-Offs

## 1. Design Inspiration & Layout Choices
Before writing any code, I did extensive research searching for a balance between high-end visual design and functional, conversion-friendly layouts:
- **Visuals & Components:** I searched showcase websites like **Awwwards** and component directories like **21st.dev** to find inspiration for micro-interactions, clean cards, and a premium editorial aesthetic.
- **Listing & UX:** For the product listing grids, I analyzed mainstream e-commerce applications like **Amazon** and **Myntra** to ensure the listing interface remains highly intuitive and production-ready for users, rather than purely experimental.

---

## 2. Tailwind CSS vs. SCSS Modules (Workflow Call)
I could have gone either way on the styling system. In my day-to-day workflow, I prefer **Tailwind CSS** because utility-first styling significantly speeds up iteration and layout building. 

However, I decided to build this with **Sass/SCSS Modules** for this assignment because:
- It enforces a strict separation of concerns, keeping TSX markup exceptionally clean and readable.
- It allowed me to leverage SCSS mixins and structured design variables to craft a highly custom design system for the **nua Studio** aesthetic without polluting components with verbose utility class lists.

---

## 3. The State Source Call: URL vs. Component State
For the variant selector on the product detail page, I chose to persist the selected color and size directly in the **URL search queries** instead of local React `useState`. 

This introduces a tiny bit of routing complexity (handling navigations on swatch clicks), but guarantees the page is **deep-linkable**. If a user configures a size/color combination and shares the URL, the next viewer sees that exact variant.

---

## 4. What I'd Clean Up / Do Differently with More Time
If I were to rebuild this project, these are the areas I would refine:
1. **Typography & Hero Legibility:** Currently, the white text overlay on the hero banner slightly clashes with the bright details of the background image. I added text-shadows as a quick correction, but it still isn't perfect; it creates visual fatigue, and the eye doesn't settle naturally on the headline. I would implement a subtle gradient scrim or swap in a more balanced, lower-contrast image.
2. **Scroll-Driven Animations:** I would build deeper CSS or Framer Motion scroll-driven animations to enrich transitions as the user scrolls down the landing page.
3. **Product Asset Optimization:** In a real-world scenario, I'd proxy the Fake Store API images through a media service like Cloudinary or Cloudflare Images to dynamic-crop and serve WebP/AVIF variants directly.
4. **Focus & Accessibility:** I would implement a custom React hook (or use `react-focus-lock`) to trap keyboard focus within the slide-out Cart Drawer when it is active, ensuring proper WCAG accessibility conformance.
