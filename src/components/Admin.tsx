import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShoppingBag,
  Users,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  Filter,
  ExternalLink,
  Printer,
  Trash2,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  LogOut,
  SlidersHorizontal,
  AlertCircle,
  Crown,
  Power,
  Shield,
  UserPlus,
} from "lucide-react";
import { StylishGirlIcon } from "@/components/Site";
import {
  ADMIN_PASSWORD,
  getAnalyticsData,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  recordVisit,
  type AnalyticsData,
  type CustomerEnquiry,
} from "@/lib/analytics";
import {
  authenticateAdmin,
  getSiteSettings,
  saveSiteSettings,
  setAdminSession,
  getAdminSession,
  clearAdminSession,
  SUPER_ADMIN_PASSWORD,
  type SiteSettings,
  type AdminSession,
} from "@/lib/super-admin";
import { SuperAdminHub } from "@/components/SuperAdminHub";
import { type OrderRecord } from "@/lib/cart";
import { PRODUCT_DATA, business } from "@/lib/womania";
import { getProductImage } from "@/lib/images";
import {
  isSupabaseConfigured,
  fetchCloudOrders,
  createCloudOrder,
  updateCloudOrderStatus,
  deleteCloudOrder,
  clearAllCloudOrders,
  getDeletedOrderIds,
  markOrderAsDeleted,
  markOrdersAsDeleted,
  subscribeToOrders,
  fetchCloudEnquiries,
} from "@/lib/supabase";

import { SupabaseSyncModal } from "@/components/SupabaseSyncModal";
import { Database } from "lucide-react";

const ORDERS_STORAGE_KEY = "womania_orders_history_v1";
const ADMIN_AUTH_KEY = "womania_admin_authenticated";

const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderId: "WOM-8492",
    date: "16 Oct 2026, 01:15 PM",
    customerName: "Harleen Sandhu",
    phone: "9876543210",
    email: "harleen.sandhu@gmail.com",
    address: "House 24, Sukhadia Circle",
    city: "Sri Ganganagar",
    state: "Rajasthan",
    pinCode: "335001",
    items: [
      {
        id: "party-crimson",
        name: "Crimson Velvet Cocktail Gown",
        size: "M",
        colour: "Crimson Red",
        quantity: 1,
        price: 8499,
      },
      {
        id: "sunglasses-amber",
        name: "Riviera Amber Cat-Eye Goggles",
        size: "Standard",
        quantity: 1,
        price: 1899,
      },
    ],
    subtotal: 10398,
    shipping: 0,
    total: 10398,
    paymentMethod: "upi",
    status: "Confirmed",
    notes: "Please pack with extra tissue for gift presentation.",
  },
  {
    orderId: "WOM-8120",
    date: "15 Oct 2026, 05:40 PM",
    customerName: "Manpreet Dhillon",
    phone: "9814099881",
    email: "manpreet.d@yahoo.com",
    address: "B-Block, Street No. 4, Near Nehru Park",
    city: "Sri Ganganagar",
    state: "Rajasthan",
    pinCode: "335001",
    items: [
      {
        id: "suits-tailored",
        name: "Midnight Noir Structured Blazer & Trousers",
        size: "S",
        quantity: 1,
        price: 9299,
      },
    ],
    subtotal: 9299,
    shipping: 0,
    total: 9299,
    paymentMethod: "whatsapp",
    status: "Processing",
  },
  {
    orderId: "WOM-7944",
    date: "14 Oct 2026, 02:10 PM",
    customerName: "Ritika Goyal",
    phone: "9414233211",
    email: "ritika.g@gmail.com",
    address: "Model Town, House 112",
    city: "Abohar",
    state: "Punjab",
    pinCode: "152116",
    items: [
      {
        id: "handbag-sienna",
        name: "Sienna Calfskin Leather Satchel",
        size: "Standard",
        quantity: 1,
        price: 4999,
      },
    ],
    subtotal: 4999,
    shipping: 0,
    total: 4999,
    paymentMethod: "upi",
    status: "Dispatched",
  },
];

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(getAdminSession);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Data states
  const [analytics, setAnalytics] = useState<AnalyticsData>(getAnalyticsData);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(getEnquiries);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"super_admin" | "orders" | "enquiries" | "analytics" | "catalog">("orders");
  const [orderFilter, setOrderFilter] = useState<"All" | "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Cancelled">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Supabase Cloud Sync States
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConfigured());

  // Check existing session
  useEffect(() => {
    const existing = getAdminSession();
    if (existing) {
      setSession(existing);
      setIsAuthenticated(true);
      if (existing.role === "super_admin") {
        setActiveTab("super_admin");
      }
    }
    setSiteSettings(getSiteSettings());

    const handleSettingsChange = () => setSiteSettings(getSiteSettings());
    window.addEventListener("womania_settings_changed", handleSettingsChange);
    return () => window.removeEventListener("womania_settings_changed", handleSettingsChange);
  }, []);

  // Load orders from Supabase Cloud (with localStorage cache fallback)
  const refreshOrders = async () => {
    setIsSyncing(true);
    const deletedIds = getDeletedOrderIds();
    let localOrders: OrderRecord[] = [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed: OrderRecord[] = JSON.parse(raw);
        localOrders = parsed.filter((o) => !deletedIds.has(o.orderId) && o.status !== "Deleted");
      }
    } catch {
      localOrders = [];
    }

    if (isSupabaseConfigured()) {
      try {
        const cloudRes = await fetchCloudOrders();
        if (cloudRes.success && Array.isArray(cloudRes.data)) {
          // Cloud orders are already filtered against deletedIds and status !== 'Deleted'
          const cloudMap = new Map<string, OrderRecord>();
          cloudRes.data.forEach((o) => {
            if (!deletedIds.has(o.orderId) && o.status !== "Deleted") {
              cloudMap.set(o.orderId, o);
            }
          });

          // Append only local orders that are active and not deleted
          localOrders.forEach((lo) => {
            if (!deletedIds.has(lo.orderId) && lo.status !== "Deleted" && !cloudMap.has(lo.orderId)) {
              cloudMap.set(lo.orderId, lo);
              createCloudOrder(lo).catch(() => {});
            }
          });

          const merged = Array.from(cloudMap.values());
          setOrders(merged);
          try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          setIsSyncing(false);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch orders from Supabase:", err);
      }
    }

    // Local fallback
    if (localOrders.length > 0) {
      setOrders(localOrders);
    } else {
      // NEVER resurrect INITIAL_ORDERS if user has cleared orders or deleted any order
      const hasBeenCleared = localStorage.getItem("womania_orders_cleared_v1") === "true";
      const hasDeletedIds = deletedIds.size > 0;
      const rawStored = localStorage.getItem(ORDERS_STORAGE_KEY);

      if (!hasBeenCleared && !hasDeletedIds && rawStored === null) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
        setOrders(INITIAL_ORDERS);
      } else {
        setOrders([]);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
      }
    }
    setIsSyncing(false);
  };

  // Load enquiries from Supabase Cloud (with localStorage fallback)
  const refreshEnquiries = async () => {
    if (isSupabaseConfigured()) {
      try {
        const cloudRes = await fetchCloudEnquiries();
        if (cloudRes.success && cloudRes.data && cloudRes.data.length > 0) {
          setEnquiries(cloudRes.data);
          return;
        }
      } catch {}
    }
    setEnquiries(getEnquiries());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();
      refreshEnquiries();
      setAnalytics(getAnalyticsData());
      setSiteSettings(getSiteSettings());

      // Realtime subscription: whenever a customer places an order on Vercel, Supabase updates us automatically!
      const unsubscribe = subscribeToOrders(() => {
        refreshOrders();
      });

      const handleSupabaseEvent = () => {
        setSupabaseConnected(isSupabaseConfigured());
        refreshOrders();
        refreshEnquiries();
      };

      window.addEventListener("womania_supabase_changed", handleSupabaseEvent);

      return () => {
        unsubscribe();
        window.removeEventListener("womania_supabase_changed", handleSupabaseEvent);
      };
    }
  }, [isAuthenticated]);


  // Handle Login (Supports Super Admin 123456789 and Staff Admins)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authenticateAdmin(passwordInput);

    if (result.success && result.role) {
      const newSession: AdminSession = {
        id: result.user?.id || `admin-${Date.now()}`,
        name: result.user?.name || (result.role === "super_admin" ? "Super Admin" : "Staff Admin"),
        role: result.role,
        loginTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setAdminSession(newSession);
      setSession(newSession);
      setIsAuthenticated(true);
      setAuthError("");

      if (result.role === "super_admin") {
        setActiveTab("super_admin");
      } else {
        setActiveTab("orders");
      }
    } else {
      setAuthError(result.error || "Incorrect password. Enter 123456789 for Super Admin or your staff passcode.");
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setSession(null);
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Update order status with Done / Cancelled support
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderRecord["status"]) => {
    let cancelReason: string | undefined = undefined;
    if (newStatus === "Cancelled") {
      const input = prompt("Please enter the reason for order cancellation:", "Out of stock / Customer requested cancellation");
      cancelReason = input ? input.trim() : "Cancelled by boutique";
    }

    const now = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated: OrderRecord[] = orders.map((o) => {
      if (o.orderId !== orderId) return o;
      const base: OrderRecord = {
        ...o,
        status: newStatus,
        updatedAt: now,
      };
      if (newStatus === "Cancelled") {
        base.cancellationReason = cancelReason || "Cancelled by boutique";
        base.cancelledAt = now;
      }
      return base;
    });

    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync status change to Supabase Cloud
    updateCloudOrderStatus(orderId, newStatus, cancelReason).catch((err) => {
      console.warn("Could not sync order status to Supabase:", err);
    });
  };

  // Update enquiry status
  const handleEnquiryStatusChange = (id: string, status: CustomerEnquiry["status"]) => {
    updateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  // Delete enquiry
  const handleDeleteEnquiry = (id: string) => {
    if (confirm("Are you sure you want to delete this customer enquiry?")) {
      deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Delete order permanently from local state and Supabase Cloud
  const handleDeleteOrder = (orderId: string, customerName?: string) => {
    const confirmMsg = customerName
      ? `Are you sure you want to delete Order #${orderId} (${customerName})? This will permanently remove it from your order history.`
      : `Are you sure you want to delete Order #${orderId}? This cannot be undone.`;

    if (!window.confirm(confirmMsg)) return;

    // 1. Mark as deleted in persistent tombstone immediately
    markOrderAsDeleted(orderId);

    // 2. Instant optimistic UI update
    const updated = orders.filter((o) => o.orderId !== orderId);
    setOrders(updated);

    // 3. Remove from local storage
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      if (updated.length === 0) {
        localStorage.setItem("womania_orders_cleared_v1", "true");
      }
    } catch {
      // ignore
    }

    // 4. Delete & mark Deleted in Supabase Cloud
    deleteCloudOrder(orderId).catch((err) => {
      console.warn("Could not delete order from Supabase:", err);
    });

    window.dispatchEvent(new CustomEvent("womania_orders_changed"));
  };

  // Delete ALL orders permanently from local state, storage, and Supabase Cloud
  const handleClearAllOrders = () => {
    if (orders.length === 0) return;
    const confirmMsg = `Are you sure you want to permanently delete ALL ${orders.length} orders from history and the cloud? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    const allIds = orders.map((o) => o.orderId);
    markOrdersAsDeleted(allIds);
    setOrders([]);

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem("womania_orders_cleared_v1", "true");
    } catch {}

    clearAllCloudOrders(allIds).catch((err) => {
      console.warn("Could not clear all orders in Supabase:", err);
    });

    window.dispatchEvent(new CustomEvent("womania_orders_changed"));
  };



  // Calculations for KPI Cards
  const totalClothesCount = orders.reduce(
    (sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const totalSalesRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingEnquiriesCount = enquiries.filter((e) => e.status === "New").length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "All" || o.status === orderFilter;
    const matchesSearch =
      searchQuery === "" ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // =========================================================================
  // LOGIN SCREEN (If not authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-lock-header">
            <StylishGirlIcon size={52} className="admin-lock-icon" />
            <h2>WOMANIA ATELIER</h2>
            <span className="admin-lock-sub">Store Governance & Super Admin Portal</span>
          </div>

          {/* Super Admin Passcode Highlight Banner */}
          <div className="mb-5 p-3.5 rounded-xl bg-[#1b1712] border border-[#b8925c]/35 text-left text-xs space-y-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-[#e2c288] font-bold">
              <Crown size={15} />
              <span>👑 Super Admin Passcode: <strong>123456789</strong></span>
            </div>
            <p className="text-[11px] text-[#9c8e7c]">
              Gives complete site control: Site On/Off maintenance switch and authority to add or remove other administrators.
            </p>
          </div>

          <form onSubmit={handleLogin} className="admin-lock-form">
            <div className="admin-field-group">
              <label htmlFor="admin-pass">Enter Admin or Super Admin Passcode</label>
              <div className="admin-pass-wrap">
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter passcode (123456789 for Super Admin)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="admin-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && <div className="admin-auth-error">{authError}</div>}

            <button type="submit" className="admin-login-btn">
              <Lock size={16} />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="admin-lock-footer">
            <span>🔒 Protected Area · WOMANIA Boutique Sri Ganganagar</span>
            <Link to="/" className="admin-back-site">
              Back to Customer Website →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="admin-dashboard">
      {/* Top Banner & Header */}
      <header className="admin-top-bar">
        <div className="admin-bar-inner">
          <div className="admin-brand-left">
            <StylishGirlIcon size={34} />
            <div>
              <h3>WOMANIA ADMIN ATELIER</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {session?.role === "super_admin" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e2c288] bg-[#b8925c]/25 border border-[#b8925c]/50 px-2.5 py-0.5 rounded-full">
                    <Crown size={12} />
                    <span>SUPER ADMIN (Master Control)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#a89b88] bg-[#221c15] border border-[#382d21] px-2 py-0.5 rounded-full">
                    <Shield size={12} />
                    <span>STAFF ADMIN</span>
                  </span>
                )}
                <span className={`admin-live-tag ${!siteSettings.isSiteOnline ? "bg-red-900/30 text-red-400 border-red-500/40" : ""}`}>
                  <span className={`live-dot ${!siteSettings.isSiteOnline ? "bg-red-400" : ""}`} />
                  {siteSettings.isSiteOnline ? "LIVE STORE" : "OFFLINE (MAINTENANCE)"}
                </span>
              </div>
            </div>
          </div>

          <div className="admin-top-actions">
            {/* Supabase Cloud Sync Status Button */}
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                supabaseConnected
                  ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                  : "bg-amber-950/70 border-amber-500/50 text-amber-300 hover:bg-amber-900/60 animate-pulse"
              }`}
              title="Click to view or configure Supabase Cloud Database"
            >
              <Database size={13} className={supabaseConnected ? "text-emerald-400" : "text-amber-400"} />
              <span>{supabaseConnected ? "🟢 Supabase Cloud Active" : "⚡ Link Supabase Cloud"}</span>
            </button>

            <Link to="/" className="admin-action-link" target="_blank">
              <span>View Website</span>
              <ExternalLink size={14} />
            </Link>
            <Link to="/shop" className="admin-action-link" target="_blank">
              <span>View Shop</span>
              <ArrowUpRight size={14} />
            </Link>
            <button onClick={handleLogout} className="admin-logout-btn" title="Sign out of Admin">
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main section-wrap">
        {/* KPI METRIC CARDS */}
        <section className="admin-metrics-grid">
          {/* Visitors Metric */}
          <div className="admin-stat-card" onClick={() => setActiveTab("analytics")}>
            <div className="stat-card-icon stat-visitors">
              <Users size={24} />
            </div>
            <div className="stat-card-content">
              <span className="stat-label">TOTAL VISITORS</span>
              <div className="stat-value-row">
                <strong>{analytics.uniqueVisitors.toLocaleString("en-IN")}</strong>
                <span className="stat-badge-sub">Unique</span>
              </div>
              <p className="stat-desc">
                {analytics.totalViews.toLocaleString("en-IN")} Total Pageviews · {analytics.todayViews} Today
              </p>
            </div>
          </div>

          {/* Clothes Orders Booked Metric */}
          <div className="admin-stat-card" onClick={() => setActiveTab("orders")}>
            <div className="stat-card-icon stat-orders">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-card-content">
              <span className="stat-label">CLOTHES ORDERS BOOKED</span>
              <div className="stat-value-row">
                <strong>{orders.length} Orders</strong>
                <span className="stat-badge-sub">{totalClothesCount} Clothes</span>
              </div>
              <p className="stat-desc">
                {orders.filter((o) => o.status === "Confirmed").length} Confirmed ·{" "}
                {orders.filter((o) => o.status === "Processing").length} In Progress
              </p>
            </div>
          </div>

          {/* Total Sales Revenue */}
          <div className="admin-stat-card" onClick={() => setActiveTab("orders")}>
            <div className="stat-card-icon stat-sales">
              <IndianRupee size={24} />
            </div>
            <div className="stat-card-content">
              <span className="stat-label">TOTAL BOOKING VALUE</span>
              <div className="stat-value-row">
                <strong>₹{totalSalesRevenue.toLocaleString("en-IN")}</strong>
              </div>
              <p className="stat-desc">Prepaid orders & WhatsApp bookings</p>
            </div>
          </div>

          {/* Customer Enquiries Metric */}
          <div className="admin-stat-card" onClick={() => setActiveTab("enquiries")}>
            <div className="stat-card-icon stat-enquiries">
              <MessageCircle size={24} />
            </div>
            <div className="stat-card-content">
              <span className="stat-label">CUSTOMER ENQUIRIES</span>
              <div className="stat-value-row">
                <strong>{enquiries.length} Enquiries</strong>
                {pendingEnquiriesCount > 0 && (
                  <span className="stat-badge-alert">{pendingEnquiriesCount} New</span>
                )}
              </div>
              <p className="stat-desc">Contact page messages & dress styling questions</p>
            </div>
          </div>
        </section>

        {/* NAVIGATION TABS */}
        <div className="admin-nav-tabs">
          {session?.role === "super_admin" && (
            <button
              className={`admin-tab-btn super-admin-tab ${activeTab === "super_admin" ? "active" : ""}`}
              onClick={() => setActiveTab("super_admin")}
              style={{
                background: activeTab === "super_admin" ? "linear-gradient(135deg, rgba(226, 194, 136, 0.25), rgba(184, 146, 92, 0.15))" : undefined,
                borderColor: activeTab === "super_admin" ? "#e2c288" : "rgba(226, 194, 136, 0.35)",
              }}
            >
              <Crown size={17} className="text-[#e2c288]" />
              <span className="font-bold text-[#e2c288]">👑 Super Admin Hub (Site On/Off & Staff)</span>
            </button>
          )}

          <button
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={17} />
            <span>Booked Clothes Orders ({orders.length})</span>
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "enquiries" ? "active" : ""}`}
            onClick={() => setActiveTab("enquiries")}
          >
            <MessageCircle size={17} />
            <span>Customer Enquiries ({enquiries.length})</span>
            {pendingEnquiriesCount > 0 && <span className="tab-counter-badge">{pendingEnquiriesCount}</span>}
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <TrendingUp size={17} />
            <span>Visitors & Analytics</span>
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "catalog" ? "active" : ""}`}
            onClick={() => setActiveTab("catalog")}
          >
            <Sparkles size={17} />
            <span>Boutique Catalog ({PRODUCT_DATA.length})</span>
          </button>
        </div>

        {/* =================================================================
            TAB 0: SUPER ADMIN HUB (Master Site Control)
            ================================================================= */}
        {activeTab === "super_admin" && session?.role === "super_admin" && (
          <SuperAdminHub
            settings={siteSettings}
            onSettingsChange={setSiteSettings}
            session={session}
          />
        )}

        {/* =================================================================
            TAB 1: ORDERS MANAGEMENT
            ================================================================= */}
        {activeTab === "orders" && (
          <section className="admin-tab-content">
            <div className="admin-section-top">
              <div>
                <h2>Booked Clothes Orders & Deliveries</h2>
                <p>Manage all clothing orders placed through the website or direct checkout modal.</p>
              </div>

              {/* Filters & Search */}
              <div className="admin-filters-row">
                <div className="admin-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by customer name, order ID, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => refreshOrders()}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1610] border border-[#b8925c]/40 text-[#e2c288] text-xs font-semibold hover:bg-[#2a2016] transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  title="Re-sync latest live orders from Supabase"
                >
                  <RefreshCw size={13} className={isSyncing ? "animate-spin text-[#e2c288]" : "text-[#b8925c]"} />
                  <span>{isSyncing ? "Syncing..." : "Sync Live Orders"}</span>
                </button>

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllOrders}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-semibold hover:bg-red-900/60 hover:border-red-500/70 transition-all cursor-pointer shrink-0"
                    title="Permanently delete all orders history from this device and cloud"
                  >
                    <Trash2 size={13} className="text-red-400" />
                    <span>Clear All Orders ({orders.length})</span>
                  </button>
                )}

                <div className="admin-status-filters">
                  {(["All", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"] as const).map((st) => (
                    <button
                      key={st}
                      className={`status-filter-chip ${orderFilter === st ? "active" : ""}`}
                      onClick={() => setOrderFilter(st)}
                    >
                      {st === "Confirmed" ? "Confirmed (Done)" : st === "Delivered" ? "Delivered (Done)" : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="admin-empty-state">
                <ShoppingBag size={48} className="text-[#b8925c]" />
                <h3>No Orders Found</h3>
                <p>No orders matched your current search/filter criteria.</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {filteredOrders.map((order) => {
                  const clothesCount = order.items.reduce((s, it) => s + it.quantity, 0);

                  return (
                    <div key={order.orderId} className={`admin-order-card ${order.status === "Cancelled" ? "card-cancelled" : ""}`}>
                      {/* Top Header */}
                      <div className="admin-order-header">
                        <div className="order-id-meta">
                          <span className="order-chip-id">{order.orderId}</span>
                          <span className="order-timestamp">
                            <Clock size={13} /> {order.date}
                          </span>
                        </div>

                        <div className="order-status-control">
                          <label htmlFor={`st-${order.orderId}`}>Status:</label>
                          <select
                            id={`st-${order.orderId}`}
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.orderId, e.target.value as OrderRecord["status"])
                            }
                            className={`order-status-select status-${order.status.toLowerCase()}`}
                          >
                            <option value="Confirmed">✓ Confirmed (Done)</option>
                            <option value="Processing">⏳ Processing</option>
                            <option value="Dispatched">🚚 Dispatched</option>
                            <option value="Delivered">📦 Delivered (Done)</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.orderId, order.customerName)}
                            className="admin-order-delete-btn"
                            title="Delete this order permanently"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>

                      {/* Cancelled Alert in Admin */}
                      {order.status === "Cancelled" && (
                        <div className="admin-order-cancel-badge">
                          <AlertCircle size={14} className="text-red-400 shrink-0" />
                          <span>
                            <strong>Order Cancelled:</strong>{" "}
                            {order.cancellationReason || "Cancelled"} {order.cancelledAt ? `· ${order.cancelledAt}` : ""}
                          </span>
                        </div>
                      )}

                      {/* Customer & Address Details */}
                      <div className="admin-order-grid">
                        <div className="admin-customer-box">
                          <span className="box-subhead">Customer & Contact</span>
                          <h4>{order.customerName}</h4>
                          <p className="contact-row">
                            <Phone size={13} /> {order.phone}
                          </p>
                          {order.email && (
                            <p className="contact-row">
                              <Mail size={13} /> {order.email}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className="payment-pill">
                              Payment:{" "}
                              {order.paymentMethod === "upi"
                                ? "UPI (09877792387@okaxis)"
                                : order.paymentMethod === "whatsapp"
                                  ? "WhatsApp Payment Link"
                                  : "Bank Transfer"}
                            </span>
                          </div>
                        </div>

                        <div className="admin-address-box">
                          <span className="box-subhead">Delivery Destination</span>
                          <p className="address-text">
                            <MapPin size={14} className="shrink-0 text-[#b8925c]" />
                            <span>
                              {order.address}, {order.city}, {order.state} - <strong>{order.pinCode}</strong>
                            </span>
                          </p>
                          {order.notes && (
                            <p className="order-notes-tag">
                              <strong>Note:</strong> “{order.notes}”
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items Booked Table */}
                      <div className="admin-items-list">
                        <span className="box-subhead">
                          Clothes Booked ({clothesCount} {clothesCount === 1 ? "item" : "items"})
                        </span>
                        <div className="items-table">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="item-row">
                              <div className="item-name-col">
                                <strong>{it.name}</strong>
                                <span className="item-meta">
                                  Size: <em>{it.size}</em>
                                  {it.colour ? ` | Colour: ${it.colour}` : ""}
                                </span>
                              </div>
                              <div className="item-qty-col">Qty: {it.quantity}</div>
                              <div className="item-price-col">₹{(it.price * it.quantity).toLocaleString("en-IN")}</div>
                            </div>
                          ))}
                        </div>
                        <div className="order-total-bar">
                          <span>Grand Total (Free Shipping)</span>
                          <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="admin-order-actions">
                        <a
                          href={`https://wa.me/91${order.phone}?text=${encodeURIComponent(
                            order.status === "Confirmed"
                              ? `Hi ${order.customerName}! Greetings from WOMANIA Sri Ganganagar. Your Order #${order.orderId} (${clothesCount} items, Total: ₹${order.total}) has been CONFIRMED (DONE) ✓. We are preparing your order for dispatch. Thank you for shopping with us!`
                              : order.status === "Cancelled"
                                ? `Hi ${order.customerName}! Regarding your WOMANIA Order #${order.orderId}: Your order has been CANCELLED ❌. ${order.cancellationReason ? `Reason: ${order.cancellationReason}. ` : ""}If you have any questions or require an alternative outfit/size, please reply here.`
                                : order.status === "Delivered"
                                  ? `Hi ${order.customerName}! Your WOMANIA Order #${order.orderId} has been DELIVERED (DONE) 📦. We hope you love your new outfit! Thank you for choosing WOMANIA Sri Ganganagar.`
                                  : `Hi ${order.customerName}! Greetings from WOMANIA Sri Ganganagar. Your Order #${order.orderId} status is: ${order.status}. Total: ₹${order.total}. Thank you!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-whatsapp-btn"
                        >
                          <MessageCircle size={15} className="text-[#25D366]" />
                          <span>
                            {order.status === "Cancelled"
                              ? "Notify Cancellation on WhatsApp"
                              : order.status === "Confirmed"
                                ? "Send 'Order Done' on WhatsApp"
                                : "Chat on WhatsApp"}
                          </span>
                        </a>

                        <button onClick={() => window.print()} className="admin-receipt-btn">
                          <Printer size={15} />
                          <span>Print Order</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.orderId, order.customerName)}
                          className="admin-order-delete-action-btn"
                          title="Delete this order permanently from history"
                        >
                          <Trash2 size={14} />
                          <span>Delete Order</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* =================================================================
            TAB 2: CUSTOMER ENQUIRIES
            ================================================================= */}
        {activeTab === "enquiries" && (
          <section className="admin-tab-content">
            <div className="admin-section-top">
              <div>
                <h2>Customer Enquiries & Style Questions</h2>
                <p>Incoming customer questions from the website contact desk and styling assistance.</p>
              </div>
            </div>

            {enquiries.length === 0 ? (
              <div className="admin-empty-state">
                <MessageCircle size={48} className="text-[#b8925c]" />
                <h3>No Enquiries Yet</h3>
                <p>New inquiries submitted by visitors on the Contact page will appear here.</p>
              </div>
            ) : (
              <div className="admin-enquiries-list">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="admin-enquiry-card">
                    <div className="enquiry-card-top">
                      <div className="enquiry-author-info">
                        <h4>{enq.name}</h4>
                        <span className="enquiry-date">{enq.date}</span>
                      </div>
                      <div className="enquiry-actions-top">
                        <span className={`enquiry-status-chip status-${enq.status.toLowerCase()}`}>
                          ● {enq.status}
                        </span>
                        <button
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="enquiry-del-btn"
                          title="Delete enquiry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <p className="enquiry-message">“{enq.message}”</p>

                    {(enq.productInterest?.toLowerCase().includes("more clothes") || enq.message.toLowerCase().includes("more clothes")) && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold my-2">
                        <Sparkles size={13} />
                        <span>✨ MORE CLOTHES & DESIGN OPTIONS REQUEST</span>
                      </div>
                    )}

                    {enq.productInterest && (
                      <div className="enquiry-product-tag">
                        <span>Product Interest:</span> <strong>{enq.productInterest}</strong>
                      </div>
                    )}

                    <div className="enquiry-card-bottom">
                      <div className="enquiry-contact-links">
                        <a href={`tel:${enq.phone}`}>
                          <Phone size={13} /> {enq.phone}
                        </a>
                        {enq.email && (
                          <a href={`mailto:${enq.email}`}>
                            <Mail size={13} /> {enq.email}
                          </a>
                        )}
                      </div>

                      <div className="enquiry-response-actions">
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleEnquiryStatusChange(enq.id, e.target.value as CustomerEnquiry["status"])
                          }
                          className="enquiry-status-select"
                        >
                          <option value="New">Mark: New</option>
                          <option value="Contacted">Mark: Contacted / Sent Options</option>
                          <option value="Closed">Mark: Closed</option>
                        </select>

                        <a
                          href={`https://wa.me/91${enq.phone}?text=${encodeURIComponent(
                            (enq.productInterest?.toLowerCase().includes("more clothes") || enq.message.toLowerCase().includes("more clothes"))
                              ? `Hi ${enq.name}! Thank you for your request for more clothes & designs from WOMANIA Sri Ganganagar. Here are our newest exclusive boutique options and photos:`
                              : `Hi ${enq.name}! Thank you for contacting WOMANIA Sri Ganganagar regarding: "${enq.message}". How can we assist you today?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="enquiry-whatsapp-reply"
                        >
                          <MessageCircle size={15} className="text-[#25D366]" />
                          <span>
                            {(enq.productInterest?.toLowerCase().includes("more clothes") || enq.message.toLowerCase().includes("more clothes"))
                              ? "Send Clothes Options via WhatsApp"
                              : "Reply on WhatsApp"}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================================
            TAB 3: VISITORS & TRAFFIC ANALYTICS
            ================================================================= */}
        {activeTab === "analytics" && (
          <section className="admin-tab-content">
            <div className="admin-section-top">
              <div>
                <h2>Website Visitor & Traffic Analytics</h2>
                <p>Live tracking of how many visitors and shoppers view your boutique pages.</p>
              </div>

              <button
                onClick={() => {
                  recordVisit("/shop");
                  setAnalytics(getAnalyticsData());
                }}
                className="admin-test-btn"
              >
                <Plus size={14} />
                <span>Simulate Visitor Hit</span>
              </button>
            </div>

            <div className="analytics-overview-grid">
              <div className="analytics-card">
                <span className="analytics-card-title">TOTAL STORE PAGEVIEWS</span>
                <strong>{analytics.totalViews.toLocaleString("en-IN")}</strong>
                <p>Across all website destinations and product lookbooks.</p>
              </div>

              <div className="analytics-card">
                <span className="analytics-card-title">UNIQUE VISITORS</span>
                <strong>{analytics.uniqueVisitors.toLocaleString("en-IN")}</strong>
                <p>Distinct individuals who browsed WOMANIA online.</p>
              </div>

              <div className="analytics-card">
                <span className="analytics-card-title">TODAY'S VISITS</span>
                <strong>{analytics.todayViews}</strong>
                <p>Active shoppers visiting the store today.</p>
              </div>
            </div>

            {/* Page Breakdown Table */}
            <div className="analytics-table-wrap">
              <h3>Page-Wise Traffic Breakdown</h3>
              <div className="page-traffic-table">
                {Object.entries(analytics.viewsByPath || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([path, count]) => {
                    const percentage = Math.round((count / (analytics.totalViews || 1)) * 100);
                    return (
                      <div key={path} className="traffic-row">
                        <div className="traffic-page-name">
                          <strong>{path === "/" ? "Home Page (/)" : path}</strong>
                          <span className="traffic-page-url">{path}</span>
                        </div>
                        <div className="traffic-bar-wrap">
                          <div className="traffic-bar" style={{ width: `${Math.min(percentage, 100)}%` }} />
                        </div>
                        <div className="traffic-numbers">
                          <strong>{count} views</strong>
                          <span>({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}

        {/* =================================================================
            TAB 4: BOUTIQUE CATALOG
            ================================================================= */}
        {activeTab === "catalog" && (
          <section className="admin-tab-content">
            <div className="admin-section-top">
              <div>
                <h2>Current Boutique Clothing Catalog</h2>
                <p>16+ curated Western & Indo-Western couture styles active on WOMANIA.</p>
              </div>
            </div>

            <div className="admin-catalog-grid">
              {PRODUCT_DATA.map((p) => {
                const img = getProductImage(p.images[0]);
                return (
                  <div key={p.id} className="admin-product-card">
                    <img src={img} alt={p.name} />
                    <div className="admin-product-meta">
                      <span className="admin-product-cat">{p.subcategory || p.category}</span>
                      <h4>{p.name}</h4>
                      <p className="admin-product-price">₹{p.price?.toLocaleString("en-IN")}</p>
                      <div className="admin-sizes-row">
                        {p.sizes?.map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Supabase Cloud Connection & Setup Modal */}
      <SupabaseSyncModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onConfigUpdated={() => {
          setSupabaseConnected(isSupabaseConfigured());
          refreshOrders();
          refreshEnquiries();
        }}
      />
    </div>
  );
}

