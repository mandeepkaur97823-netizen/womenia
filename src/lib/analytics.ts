/**
 * WOMANIA Boutique Analytics & Enquiries Management
 * Tracks visitors, page views, and customer enquiries in local storage & Supabase cloud.
 */
import { createCloudEnquiry, updateCloudEnquiryStatus, deleteCloudEnquiry } from "@/lib/supabase";

export type PageViewRecord = {
  path: string;
  timestamp: number;
};

export type AnalyticsData = {
  totalViews: number;
  uniqueVisitors: number;
  viewsByPath: Record<string, number>;
  todayViews: number;
  lastUpdated: string;
};

export type CustomerEnquiry = {
  id: string;
  date: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  productInterest?: string;
  status: "New" | "Contacted" | "Closed";
};

const ANALYTICS_STORAGE_KEY = "womania_analytics_v2";
const ENQUIRIES_STORAGE_KEY = "womania_enquiries_v2";
const VISITOR_COOKIE_KEY = "womania_visitor_id";
const TODAY_KEY = "womania_today_date";

export const ADMIN_PASSWORD = "12345678";

// Initial seed data so the dashboard is immediately informative and useful
const DEFAULT_ANALYTICS: AnalyticsData = {
  totalViews: 1248,
  uniqueVisitors: 312,
  viewsByPath: {
    "/": 540,
    "/shop": 380,
    "/collections": 165,
    "/gallery": 84,
    "/about": 42,
    "/reviews": 25,
    "/contact": 12,
  },
  todayViews: 86,
  lastUpdated: new Date().toLocaleDateString("en-IN"),
};

const DEFAULT_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: "ENQ-101",
    date: "16 Oct 2026, 12:45 PM",
    name: "Simran Kaur",
    phone: "9814523910",
    email: "simran.k@gmail.com",
    message: "Is the Royal Emerald Evening Drape available in size M for trial at your Sri Ganganagar store?",
    productInterest: "Royal Emerald Evening Drape",
    status: "New",
  },
  {
    id: "ENQ-102",
    date: "15 Oct 2026, 04:20 PM",
    name: "Pooja Verma",
    phone: "9414088921",
    email: "pooja.verma@yahoo.com",
    message: "Can you share video of the Golden Hour Clutch and confirm express dispatch to Abohar?",
    productInterest: "Golden Hour Evening Minaudière",
    status: "Contacted",
  },
  {
    id: "ENQ-103",
    date: "14 Oct 2026, 07:10 PM",
    name: "Ananya Mehta",
    phone: "9872234509",
    email: "ananya.m@outlook.com",
    message: "Looking for tailored power suits for a cocktail reception this weekend.",
    productInterest: "Tailored Power Suiting",
    status: "Closed",
  },
];

/**
 * Record a page visit in localStorage
 */
export function recordVisit(path: string) {
  if (typeof window === "undefined") return;

  try {
    let data: AnalyticsData;
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) {
      data = JSON.parse(raw);
    } else {
      data = { ...DEFAULT_ANALYTICS };
    }

    // Check unique visitor
    let isNewVisitor = false;
    if (!localStorage.getItem(VISITOR_COOKIE_KEY)) {
      isNewVisitor = true;
      localStorage.setItem(VISITOR_COOKIE_KEY, `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    }

    // Check if new day for todayViews
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem(TODAY_KEY);
    if (storedDate !== todayStr) {
      localStorage.setItem(TODAY_KEY, todayStr);
      data.todayViews = 1;
    } else {
      data.todayViews = (data.todayViews || 0) + 1;
    }

    data.totalViews = (data.totalViews || 0) + 1;
    if (isNewVisitor) {
      data.uniqueVisitors = (data.uniqueVisitors || 0) + 1;
    }

    if (!data.viewsByPath) data.viewsByPath = {};
    data.viewsByPath[path] = (data.viewsByPath[path] || 0) + 1;
    data.lastUpdated = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage access errors
  }
}

/**
 * Get current analytics data
 */
export function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") return DEFAULT_ANALYTICS;
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS));
      return DEFAULT_ANALYTICS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ANALYTICS;
  }
}

/**
 * Get customer enquiries
 */
export function getEnquiries(): CustomerEnquiry[] {
  if (typeof window === "undefined") return DEFAULT_ENQUIRIES;
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(DEFAULT_ENQUIRIES));
      return DEFAULT_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ENQUIRIES;
  }
}

/**
 * Save a new customer enquiry
 */
export function saveEnquiry(newEnquiry: Omit<CustomerEnquiry, "id" | "date" | "status">): CustomerEnquiry {
  const current = getEnquiries();
  const enquiry: CustomerEnquiry = {
    ...newEnquiry,
    id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    status: "New",
  };

  const updated = [enquiry, ...current];
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Asynchronously sync enquiry to Supabase cloud
  createCloudEnquiry(enquiry).catch((err) => {
    console.warn("Could not sync enquiry to Supabase:", err);
  });

  return enquiry;
}

/**
 * Update enquiry status (e.g. New -> Contacted)
 */
export function updateEnquiryStatus(id: string, status: CustomerEnquiry["status"]) {
  const current = getEnquiries();
  const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  updateCloudEnquiryStatus(id, status).catch((err) => {
    console.warn("Could not update enquiry status in Supabase:", err);
  });
}

/**
 * Delete an enquiry
 */
export function deleteEnquiry(id: string) {
  const current = getEnquiries();
  const updated = current.filter((e) => e.id !== id);
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  deleteCloudEnquiry(id).catch((err) => {
    console.warn("Could not delete enquiry in Supabase:", err);
  });
}

