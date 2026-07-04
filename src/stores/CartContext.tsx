import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

const STORAGE_KEY = "nua.cart.v1";

export type CartLine = {
  key: string;
  productId: number;
  title: string;
  image: string;
  unitPrice: number; // effective price (sale price if applicable)
  color: string | null;
  size: string | null;
  qty: number;
};

type State = { lines: CartLine[] };

type Action =
  | { type: "add"; line: Omit<CartLine, "qty">; qty: number }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.lines.find((l) => l.key === action.line.key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === action.line.key
              ? { ...l, qty: Math.min(99, l.qty + action.qty) }
              : l,
          ),
        };
      }
      return { lines: [...state.lines, { ...action.line, qty: action.qty }] };
    }
    case "setQty": {
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.key !== action.key) };
      }
      return {
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l,
        ),
      };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return { lines: [] };
  }
}

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (line: Omit<CartLine, "qty" | "key">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildKey(
  productId: number,
  color: string | null,
  size: string | null,
) {
  return `${productId}::${color ?? "-"}::${size ?? "-"}`;
}

function readInitial(): State {
  if (typeof window === "undefined") return { lines: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.lines)) return { lines: [] };

    const lines = parsed.lines.filter(
      (l: unknown): l is CartLine =>
        !!l &&
        typeof l === "object" &&
        typeof (l as CartLine).key === "string" &&
        typeof (l as CartLine).productId === "number" &&
        typeof (l as CartLine).qty === "number",
    );
    return { lines };
  } catch (error) {
    void error;
  }
  return { lines: [] };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    lines: [],
  }));
  const [isOpen, setOpen] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );

  useEffect(() => {
    const initial = readInitial();
    if (initial.lines.length) dispatch({ type: "hydrate", state: initial });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      void error;
    }
  }, [state]);

  const addLine = useCallback(
    (line: Omit<CartLine, "qty" | "key">, qty = 1) => {
      const key = buildKey(line.productId, line.color, line.size);
      dispatch({ type: "add", line: { ...line, key }, qty });
      setOpen(true);
    },
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    return {
      lines: state.lines,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addLine,
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state, isOpen, addLine]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { buildKey as buildCartKey };
