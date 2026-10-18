/**
 * WOMANIA Boutique - Super Admin & Site Governance System
 * Provides complete control over the site:
 * - Master Site ON/OFF (Maintenance mode toggle)
 * - Super Admin authentication (Passcode: 123456789)
 * - Multi-admin management: Add & Remove store admins
 * - Order controls & announcement banner governance
 */

export const SUPER_ADMIN_PASSWORD = "123456789";
export const DEFAULT_ADMIN_PASSWORD = "12345678";

export type AdminRole = "super_admin" | "admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password: string;
  createdAt: string;
  lastLogin?: string;
  isMaster?: boolean;
};

export type SiteSettings = {
  isSiteOnline: boolean; // true = Live to public, false = Offline / Maintenance
  maintenanceTitle: string;
  maintenanceMessage: string;
  estimatedBackOnline?: string;
  announcementText: string;
  allowOrders: boolean; // Master toggle to enable/disable checkout
  lastUpdated: string;
  updatedBy: string;
};

export type AdminSession = {
  id: string;
  name: string;
  role: AdminRole;
  loginTime: string;
};

const SITE_SETTINGS_KEY = "womania_site_settings_v1";
const ADMIN_USERS_KEY = "womania_admin_users_v2";
const ADMIN_SESSION_KEY = "womania_admin_session_v2";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  isSiteOnline: true,
  maintenanceTitle: "WOMANIA Boutique is Temporarily Offline",
  maintenanceMessage: "We are currently curating new collections and updating our boutique showroom. We will be back online shortly!",
  estimatedBackOnline: "Resuming operations today",
  announcementText: "WOMEN’S & GIRLS’ WESTERN WEAR · SRI GANGANAGAR",
  allowOrders: true,
  lastUpdated: new Date().toLocaleDateString("en-IN"),
  updatedBy: "Super Admin",
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-super-01",
    name: "WOMANIA Owner (Super Admin)",
    email: "owner@womania.boutique",
    role: "super_admin",
    password: SUPER_ADMIN_PASSWORD,
    createdAt: "16 Oct 2026",
    isMaster: true,
  },
  {
    id: "admin-staff-01",
    name: "Boutique Manager",
    email: "manager@womania.boutique",
    role: "admin",
    password: DEFAULT_ADMIN_PASSWORD,
    createdAt: "16 Oct 2026",
    isMaster: false,
  },
];

/**
 * Retrieve current site configuration from localStorage
 */
export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
      return DEFAULT_SITE_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Update site configuration (Super Admin only)
 */
export function saveSiteSettings(updates: Partial<SiteSettings>, updatedBy = "Super Admin"): SiteSettings {
  const current = getSiteSettings();
  const next: SiteSettings = {
    ...current,
    ...updates,
    lastUpdated: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedBy,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(next));
      // Dispatch storage event so all components react immediately
      window.dispatchEvent(new Event("womania_settings_changed"));
    } catch {
      // ignore
    }
  }
  return next;
}

/**
 * Quick toggle for Site Online / Offline status
 */
export function toggleSiteOnline(isOnline: boolean, updatedBy = "Super Admin"): SiteSettings {
  return saveSiteSettings({ isSiteOnline: isOnline }, updatedBy);
}

/**
 * Get all registered admin users
 */
export function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return INITIAL_ADMIN_USERS;
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    return parsed;
  } catch {
    return INITIAL_ADMIN_USERS;
  }
}

/**
 * Add a new admin user (Super Admin only)
 */
export function addAdminUser(name: string, email: string, password: string): AdminUser {
  const users = getAdminUsers();
  const newUser: AdminUser = {
    id: `admin-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: "admin",
    password: password.trim(),
    createdAt: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    isMaster: false,
  };

  const updated = [...users, newUser];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return newUser;
}

/**
 * Remove an admin user by ID (Super Admin only - cannot delete the Super Admin)
 */
export function removeAdminUser(id: string): { success: boolean; message: string } {
  const users = getAdminUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: "Admin user not found." };
  }

  if (target.role === "super_admin" || target.isMaster) {
    return { success: false, message: "Super Admin account cannot be removed." };
  }

  const filtered = users.filter((u) => u.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }
  return { success: true, message: `Admin '${target.name}' has been successfully removed.` };
}

/**
 * Change an admin user's password
 */
export function updateAdminPassword(id: string, newPassword: string): boolean {
  const users = getAdminUsers();
  const updated = users.map((u) => (u.id === id ? { ...u, password: newPassword.trim() } : u));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Verify credentials during login
 * Checks against Super Admin password (123456789) and all registered sub-admins
 */
export function authenticateAdmin(passwordInput: string): {
  success: boolean;
  role?: AdminRole;
  user?: AdminUser;
  error?: string;
} {
  const cleanInput = passwordInput.trim();

  // 1. Check Super Admin master password
  if (cleanInput === SUPER_ADMIN_PASSWORD) {
    const superUser = getAdminUsers().find((u) => u.role === "super_admin") || INITIAL_ADMIN_USERS[0]!;
    return { success: true, role: "super_admin", user: superUser };
  }

  // 2. Check all registered admins
  const users = getAdminUsers();
  const matched = users.find((u) => u.password === cleanInput);
  if (matched) {
    return { success: true, role: matched.role, user: matched };
  }

  // 3. Fallback check for default admin password (12345678)
  if (cleanInput === DEFAULT_ADMIN_PASSWORD) {
    const defaultAdmin = users.find((u) => u.role === "admin") || INITIAL_ADMIN_USERS[1]!;
    return { success: true, role: "admin", user: defaultAdmin };
  }

  return { success: false, error: "Incorrect password. Enter 123456789 for Super Admin or your store admin passcode." };
}

/**
 * Save active session
 */
export function setAdminSession(session: AdminSession) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem("womania_admin_authenticated", "true");
    window.dispatchEvent(new Event("womania_session_changed"));
  } catch {
    // ignore
  }
}

/**
 * Get active session
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Check if logged in user is Super Admin
 */
export function isSuperAdminSession(): boolean {
  const session = getAdminSession();
  return session?.role === "super_admin";
}

/**
 * Check if any admin is logged in
 */
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return getAdminSession() !== null;
}

/**
 * End current session
 */
export function clearAdminSession() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem("womania_admin_authenticated");
    window.dispatchEvent(new Event("womania_session_changed"));
  } catch {
    // ignore
  }
}
