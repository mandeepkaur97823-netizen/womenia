import { describe, it, expect, beforeEach } from "vitest";
import {
  authenticateAdmin,
  addAdminUser,
  removeAdminUser,
  toggleSiteOnline,
  getSiteSettings,
  getAdminUsers,
  SUPER_ADMIN_PASSWORD,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/super-admin";

if (typeof (globalThis as any).window === "undefined") {
  (globalThis as any).window = globalThis;
  (globalThis as any).window.dispatchEvent = () => true;
}

if (typeof localStorage === "undefined") {
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}
if (typeof sessionStorage === "undefined") {
  const store: Record<string, string> = {};
  (globalThis as any).sessionStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

describe("Super Admin & Site Governance System", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("authenticates Super Admin with passcode 123456789", () => {
    const result = authenticateAdmin("123456789");
    expect(result.success).toBe(true);
    expect(result.role).toBe("super_admin");
  });

  it("authenticates standard Admin with passcode 12345678", () => {
    const result = authenticateAdmin("12345678");
    expect(result.success).toBe(true);
    expect(result.role).toBe("admin");
  });

  it("fails authentication on invalid passcode", () => {
    const result = authenticateAdmin("wrongpassword");
    expect(result.success).toBe(false);
    expect(result.role).toBeUndefined();
  });

  it("allows Super Admin to add a new admin who can then authenticate", () => {
    const newAdmin = addAdminUser("Simran Staff", "simran@womania.boutique", "pass5566");
    expect(newAdmin.name).toBe("Simran Staff");
    expect(newAdmin.role).toBe("admin");

    const authResult = authenticateAdmin("pass5566");
    expect(authResult.success).toBe(true);
    expect(authResult.user?.name).toBe("Simran Staff");
  });

  it("allows Super Admin to remove an existing admin", () => {
    const newAdmin = addAdminUser("Temp Staff", "temp@womania.boutique", "temppass123");
    expect(authenticateAdmin("temppass123").success).toBe(true);

    const removeResult = removeAdminUser(newAdmin.id);
    expect(removeResult.success).toBe(true);
    expect(authenticateAdmin("temppass123").success).toBe(false);
  });

  it("prevents removal of the Super Admin master account", () => {
    const users = getAdminUsers();
    const superAdmin = users.find((u) => u.role === "super_admin");
    expect(superAdmin).toBeDefined();

    const result = removeAdminUser(superAdmin!.id);
    expect(result.success).toBe(false);
    expect(result.message).toContain("cannot be removed");
  });

  it("toggles site online and offline (maintenance mode)", () => {
    expect(getSiteSettings().isSiteOnline).toBe(true);

    const offlineSettings = toggleSiteOnline(false, "Test Owner");
    expect(offlineSettings.isSiteOnline).toBe(false);

    const onlineSettings = toggleSiteOnline(true, "Test Owner");
    expect(onlineSettings.isSiteOnline).toBe(true);
  });
});
