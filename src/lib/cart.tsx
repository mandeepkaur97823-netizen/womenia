import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { type Product, business, whatsappHref } from "@/lib/womania";
import { createCloudOrder, updateCloudOrderStatus, fetchCloudOrdersByQuery } from "@/lib/supabase";

export type CartItem = {
  itemKey: string;
  product: Product;
  selectedSize: string;
  selectedColour?: string | undefined;
  quantity: number;
};

export type OrderStatus = "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";

export type OrderRecord = {
  orderId: string;
  date: string;
  customerName: string;
  phone: string;
  email?: string | undefined;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  items: {
    id: string;
    name: string;
    size: string;
    colour?: string | undefined;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "upi" | "whatsapp" | "bank_transfer";
  status: OrderStatus;
  notes?: string | undefined;
  cancellationReason?: string | undefined;
  cancelledAt?: string | undefined;
  updatedAt?: string | undefined;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, colour?: string, quantity?: number) => void;
  removeFromCart: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: (directProduct?: Product, size?: string, colour?: string) => void;
  closeCheckout: () => void;
  directCheckoutItem: CartItem | null;
  recentOrder: OrderRecord | null;
  pastOrders: OrderRecord[];
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    paymentMethod: "upi" | "whatsapp" | "bank_transfer";
    notes?: string;
  }) => OrderRecord;
  clearRecentOrder: () => void;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => boolean;
  getOrdersByQuery: (query: string) => OrderRecord[];
  getOrdersByQueryAsync: (query: string) => Promise<OrderRecord[]>;
  isTrackerOpen: boolean;
  openTracker: (query?: string) => void;
  closeTracker: () => void;
  trackerQuery: string;
  setTrackerQuery: (query: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CART_STORAGE_KEY = "womania_cart_items_v1";
export const ORDERS_STORAGE_KEY = "womania_orders_history_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pastOrders, setPastOrders] = useState<OrderRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);
  const [recentOrder, setRecentOrder] = useState<OrderRecord | null>(null);

  // Load persisted cart & past orders on client mount to eliminate SSR hydration mismatch
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) setPastOrders(JSON.parse(savedOrders));
    } catch {
      // Ignore storage read error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist cart to localStorage once loaded
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart, isLoaded]);

  // Persist past orders once loaded
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(pastOrders));
    } catch (e) {
      console.warn("Could not save orders to localStorage", e);
    }
  }, [pastOrders, isLoaded]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product, size?: string, colour?: string, quantity: number = 1) => {
    const chosenSize: string = size || (product.sizes && product.sizes.length > 0 && product.sizes[0] ? product.sizes[0] : "Standard");
    const chosenColour = colour || (product.colours && product.colours.length > 0 && product.colours[0] ? product.colours[0] : undefined);
    const itemKey = `${product.id}-${chosenSize}-${chosenColour || "default"}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.itemKey === itemKey);
      if (existingIndex > -1) {
        const next = [...prevCart];
        const existing = next[existingIndex];
        if (existing) {
          next[existingIndex] = {
            ...existing,
            quantity: existing.quantity + quantity,
          };
        }
        return next;
      }
      const newItem: CartItem = {
        itemKey,
        product,
        selectedSize: chosenSize,
        selectedColour: chosenColour,
        quantity,
      };
      return [...prevCart, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemKey: string) => {
    setCart((prev) => prev.filter((i) => i.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.itemKey === itemKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = (directProduct?: Product, size?: string, colour?: string) => {
    if (directProduct) {
      const chosenSize: string = size || (directProduct.sizes && directProduct.sizes.length > 0 && directProduct.sizes[0] ? directProduct.sizes[0] : "Standard");
      const chosenColour = colour || (directProduct.colours && directProduct.colours.length > 0 && directProduct.colours[0] ? directProduct.colours[0] : undefined);
      setDirectCheckoutItem({
        itemKey: `direct-${directProduct.id}`,
        product: directProduct,
        selectedSize: chosenSize,
        selectedColour: chosenColour,
        quantity: 1,
      });
    } else {
      setDirectCheckoutItem(null);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setDirectCheckoutItem(null);
  };

  const clearRecentOrder = () => setRecentOrder(null);

  const placeOrder = (orderData: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    paymentMethod: "upi" | "whatsapp" | "bank_transfer";
    notes?: string;
  }): OrderRecord => {
    const itemsToOrder = directCheckoutItem ? [directCheckoutItem] : cart;
    const subtotal = itemsToOrder.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
    const shipping = 0; // Free worldwide shipping per policy
    const total = subtotal + shipping;

    // Generate readable random order ID: WMN-2026-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `WMN-2026-${randomDigits}`;

    const newOrder: OrderRecord = {
      orderId,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
      city: orderData.city,
      state: orderData.state,
      pinCode: orderData.pinCode,
      items: itemsToOrder.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        size: i.selectedSize,
        colour: i.selectedColour,
        quantity: i.quantity,
        price: i.product.price || 0,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: orderData.paymentMethod,
      status: "Confirmed",
      notes: orderData.notes,
    };

    setRecentOrder(newOrder);
    setPastOrders((prev) => [newOrder, ...prev]);

    // Asynchronously sync to Supabase Cloud so Admin panel on any device sees it immediately
    createCloudOrder(newOrder).catch((err) => {
      console.warn("Could not sync order to Supabase cloud:", err);
    });

    // Clear cart if this was a cart order
    if (!directCheckoutItem) {
      clearCart();
    }
    setDirectCheckoutItem(null);

    return newOrder;
  };

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerQuery, setTrackerQuery] = useState("");

  const openTracker = (query?: string) => {
    if (query) setTrackerQuery(query);
    else if (recentOrder) setTrackerQuery(recentOrder.orderId);
    setIsTrackerOpen(true);
  };

  const closeTracker = () => {
    setIsTrackerOpen(false);
  };

  const cancelOrder = (orderId: string, reason?: string): boolean => {
    let changed = false;
    const now = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setPastOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.orderId === orderId) {
          changed = true;
          return {
            ...ord,
            status: "Cancelled" as OrderStatus,
            cancellationReason: reason || "Cancelled by client request",
            cancelledAt: now,
            updatedAt: now,
          };
        }
        return ord;
      });
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Asynchronously sync cancellation to Supabase Cloud
    updateCloudOrderStatus(orderId, "Cancelled", reason).catch((err) => {
      console.warn("Could not sync order cancellation to Supabase:", err);
    });

    if (recentOrder && recentOrder.orderId === orderId) {
      setRecentOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "Cancelled",
              cancellationReason: reason || "Cancelled by client request",
              cancelledAt: now,
              updatedAt: now,
            }
          : null
      );
    }

    return changed;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, reason?: string): boolean => {
    let changed = false;
    const now = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setPastOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.orderId === orderId) {
          changed = true;
          return {
            ...ord,
            status: newStatus,
            ...(newStatus === "Cancelled"
              ? { cancellationReason: reason || "Order cancelled by store", cancelledAt: now }
              : {}),
            updatedAt: now,
          };
        }
        return ord;
      });
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Asynchronously sync status change to Supabase Cloud
    updateCloudOrderStatus(orderId, newStatus, reason).catch((err) => {
      console.warn("Could not sync order status to Supabase:", err);
    });

    if (recentOrder && recentOrder.orderId === orderId) {
      setRecentOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              ...(newStatus === "Cancelled"
                ? { cancellationReason: reason || "Order cancelled by store", cancelledAt: now }
                : {}),
              updatedAt: now,
            }
          : null
      );
    }

    return changed;
  };

  const getOrdersByQuery = (query: string): OrderRecord[] => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    const digitsOnly = query.replace(/\D/g, "");

    let allOrders = pastOrders;
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) allOrders = JSON.parse(raw);
    } catch {
      // ignore
    }

    return allOrders.filter((o) => {
      const idMatch = o.orderId.toLowerCase().includes(trimmed);
      const phoneMatch = digitsOnly.length >= 4 && o.phone.replace(/\D/g, "").includes(digitsOnly);
      const nameMatch = trimmed.length >= 3 && o.customerName.toLowerCase().includes(trimmed);
      return idMatch || phoneMatch || nameMatch;
    });
  };

  const getOrdersByQueryAsync = async (query: string): Promise<OrderRecord[]> => {
    const local = getOrdersByQuery(query);
    try {
      const cloud = await fetchCloudOrdersByQuery(query);
      if (cloud && cloud.length > 0) {
        const map = new Map<string, OrderRecord>();
        cloud.forEach((o) => map.set(o.orderId, o));
        local.forEach((o) => {
          if (!map.has(o.orderId)) {
            map.set(o.orderId, o);
          }
        });
        return Array.from(map.values());
      }
    } catch {
      // ignore network errors
    }
    return local;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        directCheckoutItem,
        recentOrder,
        pastOrders,
        placeOrder,
        clearRecentOrder,
        cancelOrder,
        updateOrderStatus,
        getOrdersByQuery,
        getOrdersByQueryAsync,

        isTrackerOpen,
        openTracker,
        closeTracker,
        trackerQuery,
        setTrackerQuery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
