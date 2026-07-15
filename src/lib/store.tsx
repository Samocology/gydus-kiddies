import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;      // Home, Office, ...
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "Processing" | "Packed" | "Shipped" | "Delivered";
  address: Address;
  paymentMethod: string;
}

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  addresses: Address[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  updateQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  markViewed: (id: string) => void;
  addAddress: (a: Omit<Address, "id">) => void;
  updateAddress: (id: string, a: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
};

const StoreContext = createContext<StoreState | null>(null);

function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {}
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state, hydrated]);

  return [state, setState];
}

const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "Adaeze O.",
    phone: "+234 800 123 4567",
    line1: "24 Bourdillon Rd",
    city: "Ikoyi",
    state: "Lagos",
    country: "Nigeria",
    isDefault: true,
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocal<CartItem[]>("kk_cart", []);
  const [wishlist, setWishlist] = useLocal<string[]>("kk_wishlist", []);
  const [recentlyViewed, setRecentlyViewed] = useLocal<string[]>("kk_recent", []);
  const [addresses, setAddresses] = useLocal<Address[]>("kk_addresses", defaultAddresses);
  const [orders, setOrders] = useLocal<Order[]>("kk_orders", []);

  const value = useMemo<StoreState>(
    () => ({
      cart,
      wishlist,
      recentlyViewed,
      addresses,
      orders,
      addToCart: (item) =>
        setCart((prev) => {
          const idx = prev.findIndex(
            (p) => p.productId === item.productId && p.size === item.size && p.color === item.color,
          );
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
            return next;
          }
          return [...prev, item];
        }),
      updateQty: (idx, qty) =>
        setCart((prev) => prev.map((p, i) => (i === idx ? { ...p, quantity: Math.max(1, qty) } : p))),
      removeFromCart: (idx) => setCart((prev) => prev.filter((_, i) => i !== idx)),
      clearCart: () => setCart([]),
      toggleWishlist: (id) =>
        setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      markViewed: (id) =>
        setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
      addAddress: (a) =>
        setAddresses((prev) => {
          const id = `addr-${Date.now()}`;
          const next: Address = { ...a, id };
          if (next.isDefault || prev.length === 0) {
            return [{ ...next, isDefault: true }, ...prev.map((p) => ({ ...p, isDefault: false }))];
          }
          return [...prev, next];
        }),
      updateAddress: (id, patch) =>
        setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))),
      removeAddress: (id) =>
        setAddresses((prev) => {
          const next = prev.filter((a) => a.id !== id);
          if (next.length && !next.some((a) => a.isDefault)) next[0].isDefault = true;
          return next;
        }),
      setDefaultAddress: (id) =>
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id }))),
      addOrder: (o) => {
        const order: Order = {
          ...o,
          id: `KK-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          status: "Processing",
        };
        setOrders((prev) => [order, ...prev]);
        return order;
      },
    }),
    [cart, wishlist, recentlyViewed, addresses, orders, setCart, setWishlist, setRecentlyViewed, setAddresses, setOrders],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
