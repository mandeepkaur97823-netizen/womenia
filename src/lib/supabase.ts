import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { type OrderRecord, type OrderStatus } from "@/lib/cart";
import { type CustomerEnquiry } from "@/lib/analytics";

export const WOMANIA_SUPABASE_CONFIG_KEY = "womania_supabase_config_v1";

export const DEFAULT_SUPABASE_URL = "https://myvjrxwjtopahcfbubym.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dmpyeHdqdG9wYWhjZmJ1YnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MjA2MTAsImV4cCI6MjEwNzk5NjYxMH0._WQ47flljbwTSIL_zQcyrbExaz1npzuemDFuZELPgV8";

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

/**
 * Retrieve Supabase credentials.
 * Checks environment variables first (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY),
 * then falls back to localStorage configuration (for manual Admin setup),
 * and finally defaults to the active project credentials.
 */
export function getSupabaseCredentials(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

  if (envUrl && envAnonKey && envUrl.startsWith("http")) {
    return { url: envUrl, anonKey: envAnonKey };
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(WOMANIA_SUPABASE_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.url && parsed?.anonKey && parsed.url.startsWith("http")) {
          return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
        }
      }
    } catch {
      // ignore
    }
  }

  // Active production credentials
  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
}


let cachedClient: SupabaseClient | null = null;
let lastClientKey = "";

/**
 * Get or initialize Supabase client instance.
 * Returns null if credentials are not configured.
 */
export function getSupabase(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds) {
    cachedClient = null;
    lastClientKey = "";
    return null;
  }

  const currentKey = `${creds.url}:::${creds.anonKey}`;
  if (cachedClient && lastClientKey === currentKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastClientKey = currentKey;
    return cachedClient;
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
    return null;
  }
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseCredentials() !== null;
}

/**
 * Save custom Supabase config in localStorage (for admin panel)
 */
export function saveCustomSupabaseConfig(url: string, anonKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const config: SupabaseConfig = { url: url.trim(), anonKey: anonKey.trim() };
    localStorage.setItem(WOMANIA_SUPABASE_CONFIG_KEY, JSON.stringify(config));
    cachedClient = null;
    lastClientKey = "";
    window.dispatchEvent(new CustomEvent("womania_supabase_changed"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear custom Supabase config from localStorage
 */
export function clearCustomSupabaseConfig(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(WOMANIA_SUPABASE_CONFIG_KEY);
    cachedClient = null;
    lastClientKey = "";
    window.dispatchEvent(new CustomEvent("womania_supabase_changed"));
  } catch {
    // ignore
  }
}

/**
 * Test connectivity with Supabase and verify required tables exist
 */
export function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  ordersTableFound?: boolean;
  enquiriesTableFound?: boolean;
  error?: any;
}> {
  return (async () => {
    const client = getSupabase();
    if (!client) {
      return {
        success: false,
        message: "Supabase credentials are not configured. Enter Project URL & Anon Key.",
      };
    }

    try {
      // 1. Test orders table
      const ordersRes = await client.from("orders").select("order_id").limit(1);
      if (ordersRes.error) {
        return {
          success: false,
          message: `Connected to Supabase, but error querying 'orders' table: ${ordersRes.error.message}. Please run the setup SQL script.`,
          error: ordersRes.error,
        };
      }

      // 2. Test enquiries table (optional check)
      let enquiriesTableFound = true;
      const enqRes = await client.from("enquiries").select("id").limit(1);
      if (enqRes.error) {
        enquiriesTableFound = false;
      }

      return {
        success: true,
        message: "Successfully connected to Supabase! Orders table is active.",
        ordersTableFound: true,
        enquiriesTableFound,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network or configuration error connecting to Supabase: ${err?.message || err}`,
        error: err,
      };
    }
  })();
}

// ---------------------------------------------------------------------------
// DATA MAPPINGS
// ---------------------------------------------------------------------------

function mapRowToOrder(row: any): OrderRecord {
  return {
    orderId: row.order_id || row.id || "WMN-UNKNOWN",
    date: row.date || new Date(row.created_at || Date.now()).toLocaleDateString("en-IN"),
    customerName: row.customer_name || "Guest Customer",
    phone: row.phone || "",
    email: row.email || undefined,
    address: row.address || "",
    city: row.city || "",
    state: row.state || "",
    pinCode: row.pincode || row.pin_code || "",
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    shipping: Number(row.shipping) || 0,
    total: Number(row.total) || 0,
    paymentMethod: row.payment_method || "upi",
    status: (row.status as OrderStatus) || "Confirmed",
    notes: row.notes || undefined,
    cancellationReason: row.cancellation_reason || undefined,
    cancelledAt: row.cancelled_at || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

function mapOrderToRow(order: OrderRecord) {
  return {
    order_id: order.orderId,
    date: order.date,
    customer_name: order.customerName,
    phone: order.phone,
    email: order.email || null,
    address: order.address,
    city: order.city,
    state: order.state,
    pincode: order.pinCode,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    payment_method: order.paymentMethod,
    status: order.status,
    notes: order.notes || null,
    cancellation_reason: order.cancellationReason || null,
    cancelled_at: order.cancelledAt || null,
    updated_at: order.updatedAt || null,
  };
}

function mapRowToEnquiry(row: any): CustomerEnquiry {
  return {
    id: row.id,
    date: row.date || new Date(row.created_at || Date.now()).toLocaleDateString("en-IN"),
    name: row.name || "Customer",
    phone: row.phone || "",
    email: row.email || undefined,
    message: row.message || "",
    productInterest: row.product_interest || undefined,
    status: row.status || "New",
  };
}

function mapEnquiryToRow(enquiry: CustomerEnquiry) {
  return {
    id: enquiry.id,
    date: enquiry.date,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email || null,
    message: enquiry.message,
    product_interest: enquiry.productInterest || null,
    status: enquiry.status,
  };
}

// ---------------------------------------------------------------------------
// ORDERS CLOUD CRUD
// ---------------------------------------------------------------------------

/**
 * Insert or upsert an order in Supabase
 */
export async function createCloudOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const row = mapOrderToRow(order);
    const { error } = await client.from("orders").upsert(row, { onConflict: "order_id" });

    if (error) {
      console.error("Supabase createCloudOrder error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase createCloudOrder exception:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}

/**
 * Fetch all orders from Supabase (sorted by most recent first)
 */
export async function fetchCloudOrders(): Promise<{ success: boolean; data: OrderRecord[]; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, data: [], error: "Supabase not configured." };
  }

  try {
    const { data, error } = await client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetchCloudOrders error:", error);
      return { success: false, data: [], error: error.message };
    }

    const mapped = (data || []).map(mapRowToOrder);
    return { success: true, data: mapped };
  } catch (err: any) {
    console.error("Supabase fetchCloudOrders exception:", err);
    return { success: false, data: [], error: err?.message || "Unknown error" };
  }
}

/**
 * Update order status and optional cancellation notes in Supabase
 */
export async function updateCloudOrderStatus(
  orderId: string,
  status: OrderStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: "Supabase not configured." };
  }

  const now = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const patch: any = {
      status,
      updated_at: now,
    };
    if (status === "Cancelled") {
      patch.cancellation_reason = reason || "Order cancelled";
      patch.cancelled_at = now;
    }

    const { error } = await client.from("orders").update(patch).eq("order_id", orderId);

    if (error) {
      console.error("Supabase updateCloudOrderStatus error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase updateCloudOrderStatus exception:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}

/**
 * Permanently delete an order from Supabase Cloud
 */
export async function deleteCloudOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: "Supabase not configured." };
  }

  try {
    const { error } = await client.from("orders").delete().eq("order_id", orderId);
    if (error) {
      console.error("Supabase deleteCloudOrder error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("Supabase deleteCloudOrder exception:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}

/**
 * Fetch orders matching query (orderId or phone) from Supabase
 */
export async function fetchCloudOrdersByQuery(query: string): Promise<OrderRecord[]> {
  const client = getSupabase();
  if (!client) return [];

  const trimmed = query.trim();
  if (!trimmed) return [];
  const digits = trimmed.replace(/\D/g, "");

  try {
    // Try exact or partial match on order_id or phone
    const filter = digits.length >= 4
      ? `order_id.ilike.%${trimmed}%,phone.ilike.%${digits}%,customer_name.ilike.%${trimmed}%`
      : `order_id.ilike.%${trimmed}%,customer_name.ilike.%${trimmed}%`;

    const { data, error } = await client
      .from("orders")
      .select("*")
      .or(filter)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchCloudOrdersByQuery error:", error);
      return [];
    }

    return (data || []).map(mapRowToOrder);
  } catch (err) {
    console.warn("Supabase fetchCloudOrdersByQuery exception:", err);
    return [];
  }
}

/**
 * Subscribe to real-time changes on the orders table
 */
export function subscribeToOrders(onUpdate: () => void): () => void {
  const client = getSupabase();
  if (!client) return () => {};

  try {
    const channel = client
      .channel("public:orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Could not subscribe to Supabase orders realtime:", err);
    return () => {};
  }
}

// ---------------------------------------------------------------------------
// ENQUIRIES CLOUD CRUD
// ---------------------------------------------------------------------------

export async function createCloudEnquiry(enquiry: CustomerEnquiry): Promise<{ success: boolean; error?: string }> {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase not configured." };

  try {
    const row = mapEnquiryToRow(enquiry);
    const { error } = await client.from("enquiries").upsert(row, { onConflict: "id" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Unknown error" };
  }
}

export async function fetchCloudEnquiries(): Promise<{ success: boolean; data: CustomerEnquiry[]; error?: string }> {
  const client = getSupabase();
  if (!client) return { success: false, data: [], error: "Supabase not configured." };

  try {
    const { data, error } = await client
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { success: false, data: [], error: error.message };
    return { success: true, data: (data || []).map(mapRowToEnquiry) };
  } catch (err: any) {
    return { success: false, data: [], error: err?.message || "Unknown error" };
  }
}

export async function updateCloudEnquiryStatus(id: string, status: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("enquiries").update({ status }).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCloudEnquiry(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("enquiries").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
