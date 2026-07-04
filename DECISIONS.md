# Decisions & Trade-Offs

## The Architectural Call I Could Have Gone Either Way On

**Where to keep selected-variant state on the product detail page.**

Two reasonable options:

1. **Local `useState`** inside the detail component. Simplest possible layout: one component owns the current color and size, a normal controlled UI, no router involvement.
2. **URL search params** (`/product/7?color=moss&size=m`). More moving parts: a Zod-validated `validateSearch`, a `useNavigate` call on every swatch and size button, and defaults computed off the URL instead of local state.

I picked option 2. Two reasons drove it, both from the specification:

- The brief explicitly says: "**Selected variant reflected in the URL so the page is deep-linkable**". If you share `/product/7` with a friend and mean "the moss one, in medium", that meaning must survive the copy-paste action. Local state discard it.
- It composes with the loader model. TanStack Router's `validateSearch` gives us runtime-validated, typed search params out of the box, meaning the "what is selected right now" question has a single source of truth (`Route.useSearch()`) instead of drifting between component state and the URL.

The cost is real: every swatch click is a `navigate({ search, replace: true })` instead of a simple `setState`. There is a tiny amount of glue code where I merge previous search state (`(prev) => ({ ...prev, color })`) instead of just calling a setter. And I still need one piece of local state (the currently-focused gallery thumbnail) because that thumbnail has no reason to be deep-shareable. So the page has both, which is a mild inconsistency I decided I could live with.

If the variant matrix grew (color + size + material + fit), or if invalid combinations needed to redirect to the nearest valid one, option 2 pays off even more, because that validation logic naturally lives in the loader / search validator. If the site were purely client-rendered with no sharing story, option 1 would have been the correct call.

## The Cart Store Choice

Context + `useReducer` was chosen over Zustand/Redux. State is small, only one branch of the tree consumes it, and I wanted zero extra runtime dependencies for a mini project. Persistence is manual (versioned `localStorage` key `"nua.cart.v1"`, defensive rehydration) so I can evolve the schema without corrupting existing carts.

## What I'd Clean Up with More Time

1. **Self-host fonts:** Google Fonts is a render-blocking third-party request. `@fontsource/instrument-serif` + `@fontsource/inter` with `font-display: swap` would shave ~150-250ms off first contentful paint and remove a third-party connection from the waterfall.
2. **Real variant backend:** `src/lib/variants.ts` is a deterministic stub because Fake Store API does not ship variant data. In a real codebase, the variant matrix, sale flag, and stock state would come from the same database call as the product: no client-side synthesis.
3. **Focus management in the cart drawer:** Right now the drawer closes on ESC and click-outside, but focus is not trapped inside it and does not return to the cart button on close. `react-focus-lock` or a small `useFocusTrap` hook would resolve this accessibility issue.
4. **Tests:** I added the mock-failure Add-to-Cart for the bonus but did not wire up Vitest. The natural first tests are around `getVariants` (deterministic output for a given id), the cart reducer (add / merge / setQty / remove edge cases), and the size button's disabled and sold-out interaction.
5. **Image performance:** Fake Store API images are large PNGs served without a CDN. I would proxy them through a resizing service (Cloudinary / Cloudflare Images) and serve WebP/AVIF variants. Right now `loading="lazy"` is doing most of the work.
6. **Skeleton states:** The route-level `pendingComponent` is a plain text line. A grid of shimmering card placeholders matching the real layout would remove layout shifts (CLS) on first load.

## The Three Open Questions I Noticed

1. **What counts as a "variant" when the API has none?** The spec asks for color swatches, size buttons, and sold-out states, but Fake Store API does not provide them. Call: synthesize them deterministically from the product id, keeping the code path realistic so a real API can slot in.
2. **What happens to the URL when you pick a sold-out size?** Call: silently ignore the click. Sold-out buttons are visibly disabled and line-through; clicking them should not change the URL to an unreachable state.
3. **What does "grand total" include?** The spec does not mention shipping or tax. Call: show subtotal and grand total as the same number for now, with a "Shipping calculated at checkout" hint so a future step can slot in without redesigning the summary block.
