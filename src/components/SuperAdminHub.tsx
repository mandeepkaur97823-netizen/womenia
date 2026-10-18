import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Crown,
  Power,
  Shield,
  ShieldAlert,
  Users,
  UserPlus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Download,
  Key,
  ShoppingBag,
  Bell,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  type SiteSettings,
  type AdminUser,
  type AdminSession,
  getAdminUsers,
  addAdminUser,
  removeAdminUser,
  updateAdminPassword,
  saveSiteSettings,
  toggleSiteOnline,
  SUPER_ADMIN_PASSWORD,
} from "@/lib/super-admin";

interface SuperAdminHubProps {
  settings: SiteSettings;
  onSettingsChange: (newSettings: SiteSettings) => void;
  session: AdminSession | null;
}

export function SuperAdminHub({ settings, onSettingsChange, session }: SuperAdminHubProps) {
  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getAdminUsers);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Add Admin form states
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addAdminSuccess, setAddAdminSuccess] = useState("");
  const [addAdminError, setAddAdminError] = useState("");

  // Settings editable state
  const [maintTitle, setMaintTitle] = useState(settings.maintenanceTitle);
  const [maintMessage, setMaintMessage] = useState(settings.maintenanceMessage);
  const [estBack, setEstBack] = useState(settings.estimatedBackOnline || "");
  const [announcement, setAnnouncement] = useState(settings.announcementText);
  const [allowOrders, setAllowOrders] = useState(settings.allowOrders);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Sync settings if parent updates
  useEffect(() => {
    setMaintTitle(settings.maintenanceTitle);
    setMaintMessage(settings.maintenanceMessage);
    setEstBack(settings.estimatedBackOnline || "");
    setAnnouncement(settings.announcementText);
    setAllowOrders(settings.allowOrders);
  }, [settings]);

  // Refresh admin list
  const refreshAdmins = () => {
    setAdminUsers(getAdminUsers());
  };

  // Toggle Site Online/Offline Master Switch
  const handleToggleOnline = (newState: boolean) => {
    const confirmMsg = newState
      ? "Do you want to turn the website ONLINE? Public visitors will be able to browse and shop."
      : "Do you want to turn the website OFFLINE (Maintenance Mode)? Public visitors will see the boutique maintenance screen.";

    if (window.confirm(confirmMsg)) {
      const updated = toggleSiteOnline(newState, session?.name || "Super Admin");
      onSettingsChange(updated);
    }
  };

  // Save textual settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSiteSettings(
      {
        maintenanceTitle: maintTitle.trim(),
        maintenanceMessage: maintMessage.trim(),
        estimatedBackOnline: estBack.trim(),
        announcementText: announcement.trim(),
        allowOrders,
      },
      session?.name || "Super Admin"
    );
    onSettingsChange(updated);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3500);
  };

  // Add new admin user
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminError("");
    setAddAdminSuccess("");

    if (!newAdminName.trim()) {
      setAddAdminError("Please enter the administrator's name.");
      return;
    }
    if (!newAdminPassword.trim() || newAdminPassword.trim().length < 4) {
      setAddAdminError("Password must be at least 4 characters long.");
      return;
    }

    const created = addAdminUser(
      newAdminName.trim(),
      newAdminEmail.trim() || `${newAdminName.trim().toLowerCase().replace(/\s+/g, ".")}@womania.boutique`,
      newAdminPassword.trim()
    );

    refreshAdmins();
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPassword("");
    setAddAdminSuccess(`Admin '${created.name}' created successfully with passcode '${created.password}'!`);
    setTimeout(() => setAddAdminSuccess(""), 5000);
  };

  // Remove admin user
  const handleDeleteAdmin = (user: AdminUser) => {
    if (user.role === "super_admin" || user.isMaster) {
      alert("Super Admin account cannot be removed.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove admin '${user.name}'? They will immediately lose access to this portal.`
    );

    if (confirmed) {
      const result = removeAdminUser(user.id);
      if (result.success) {
        refreshAdmins();
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  // Toggle password visibility
  const toggleShowPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Export database backup
  const handleExportBackup = () => {
    const data = {
      exportDate: new Date().toISOString(),
      superAdmin: "WOMANIA Owner",
      settings: settings,
      adminUsers: adminUsers.map((u) => ({ ...u, password: "[ENCRYPTED]" })),
      orders: JSON.parse(localStorage.getItem("womania_orders_history_v1") || "[]"),
      enquiries: JSON.parse(localStorage.getItem("womania_enquiries_v2") || "[]"),
      analytics: JSON.parse(localStorage.getItem("womania_analytics_v2") || "{}"),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `womania-boutique-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="super-admin-hub space-y-8 animate-fadeIn">
      {/* Super Admin Top Badge & Banner */}
      <div className="bg-gradient-to-r from-[#211a12] via-[#2d2216] to-[#1a140d] border border-[#b8925c]/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Crown size={200} className="text-[#b8925c]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e2c288] to-[#966d33] flex items-center justify-center text-[#14110e] shadow-lg flex-shrink-0">
              <Crown size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#b8925c]/20 border border-[#b8925c]/40 text-[#e2c288] font-bold">
                  👑 Super Admin Master Console
                </span>
                <span className="text-xs text-[#a0907e]">Passcode: 123456789</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#f7f2ea] mt-1">
                Site Governance & Multi-Admin Control
              </h2>
              <p className="text-xs sm:text-sm text-[#b8a794] mt-1 max-w-xl">
                You have complete administrative authority over the website — toggle the store online/offline and manage all staff accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14110e] hover:bg-[#201a14] text-[#e2c288] border border-[#b8925c]/30 text-xs font-semibold transition-all shadow"
              title="Download JSON backup of orders, analytics and settings"
            >
              <Download size={15} />
              <span>Export Store Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: MASTER SITE ON / OFF SWITCH
         ===================================================================== */}
      <div className="bg-[#14110e] border border-[#2b241c] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#b8925c]/15 text-[#e2c288] flex items-center justify-center">
            <Power size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#f7f2ea] flex items-center gap-2">
              <span>Master Site Status: ON / OFF</span>
            </h3>
            <p className="text-xs text-[#9a8c7b]">
              Turn the public website online or offline at any time with a single click.
            </p>
          </div>
        </div>

        {/* Master Toggle Card */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            settings.isSiteOnline
              ? "bg-gradient-to-r from-[#0d2316] to-[#122b1c] border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
              : "bg-gradient-to-r from-[#2b100e] to-[#361614] border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.2)]"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                  settings.isSiteOnline ? "bg-emerald-600" : "bg-red-600"
                }`}
              >
                <Power size={24} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      settings.isSiteOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400 animate-ping"
                    }`}
                  />
                  <h4 className="text-xl font-bold text-white tracking-wide">
                    {settings.isSiteOnline ? "🟢 WEBSITE IS ONLINE" : "🔴 WEBSITE IS OFFLINE (MAINTENANCE MODE)"}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg">
                  {settings.isSiteOnline
                    ? "Store is completely active. Public visitors can view the boutique catalogue, collections, and place orders."
                    : "Maintenance mode is active. Public visitors see your boutique maintenance notice with WhatsApp contact. Admins can still preview the site."}
                </p>
                <div className="text-[11px] text-gray-400 mt-2">
                  Last updated: <strong>{settings.lastUpdated}</strong> by <strong>{settings.updatedBy}</strong>
                </div>
              </div>
            </div>

            {/* Toggle Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {settings.isSiteOnline ? (
                <button
                  type="button"
                  onClick={() => handleToggleOnline(false)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Power size={18} />
                  <span>Turn Site OFFLINE</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleOnline(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Power size={18} />
                  <span>Turn Site ONLINE</span>
                </button>
              )}

              <Link
                to="/"
                target="_blank"
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-[#14110e]/70 hover:bg-[#14110e] text-[#e2c288] border border-[#b8925c]/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Live Preview</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Maintenance Message & Notice Editor */}
        <form onSubmit={handleSaveSettings} className="mt-8 space-y-4 pt-6 border-t border-[#261f17]">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#b8925c]">
              Custom Offline Notice Settings
            </h4>
            {settingsSavedToast && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                <CheckCircle2 size={14} />
                <span>Settings Saved Successfully!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#a0907e] mb-1 font-medium">
                Offline Page Headline
              </label>
              <input
                type="text"
                value={maintTitle}
                onChange={(e) => setMaintTitle(e.target.value)}
                className="w-full bg-[#1b1713] border border-[#33291f] rounded-lg px-3.5 py-2.5 text-sm text-[#f7f2ea] focus:border-[#b8925c] focus:outline-none"
                placeholder="e.g. WOMANIA Boutique is Temporarily Offline"
              />
            </div>

            <div>
              <label className="block text-xs text-[#a0907e] mb-1 font-medium">
                Estimated Back Online Time
              </label>
              <input
                type="text"
                value={estBack}
                onChange={(e) => setEstBack(e.target.value)}
                className="w-full bg-[#1b1713] border border-[#33291f] rounded-lg px-3.5 py-2.5 text-sm text-[#f7f2ea] focus:border-[#b8925c] focus:outline-none"
                placeholder="e.g. Resuming today at 6:00 PM"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#a0907e] mb-1 font-medium">
              Maintenance Message to Shoppers
            </label>
            <textarea
              rows={2}
              value={maintMessage}
              onChange={(e) => setMaintMessage(e.target.value)}
              className="w-full bg-[#1b1713] border border-[#33291f] rounded-lg px-3.5 py-2 text-sm text-[#f7f2ea] focus:border-[#b8925c] focus:outline-none resize-none"
              placeholder="Message displayed on the maintenance screen..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-[#a0907e] mb-1 font-medium">
                Site Top Announcement Bar
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full bg-[#1b1713] border border-[#33291f] rounded-lg px-3.5 py-2.5 text-sm text-[#f7f2ea] focus:border-[#b8925c] focus:outline-none"
                placeholder="e.g. WOMEN’S & GIRLS’ WESTERN WEAR · SRI GANGANAGAR"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-[#f7f2ea] bg-[#1b1713] border border-[#33291f] rounded-lg px-4 py-2.5 w-full">
                <input
                  type="checkbox"
                  checked={allowOrders}
                  onChange={(e) => setAllowOrders(e.target.checked)}
                  className="w-4 h-4 accent-[#b8925c] rounded"
                />
                <div>
                  <span className="font-semibold block">Allow Online Orders & Checkout</span>
                  <span className="text-[10px] text-[#9a8c7b] block">Uncheck to pause cart checkout while keeping browsing open</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b8925c] to-[#966d33] hover:brightness-110 text-[#14110e] font-bold text-xs shadow-md transition-all"
            >
              <Save size={15} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* =====================================================================
          SECTION 2: MULTI-ADMIN MANAGEMENT
         ===================================================================== */}
      <div className="bg-[#14110e] border border-[#2b241c] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b8925c]/15 text-[#e2c288] flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#f7f2ea]">
                Manage Store Administrators
              </h3>
              <p className="text-xs text-[#9a8c7b]">
                As Super Admin, you can add new store staff admins or remove any admin immediately.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#b8925c] bg-[#1d1712] border border-[#332719] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Shield size={14} />
            <span>Total Administrators: <strong>{adminUsers.length}</strong></span>
          </div>
        </div>

        {/* Existing Admins Table */}
        <div className="overflow-x-auto rounded-xl border border-[#2d241a] mb-8">
          <table className="w-full text-left text-xs text-[#d1c5b4]">
            <thead className="bg-[#1c1712] text-[#e2c288] uppercase tracking-wider text-[11px] border-b border-[#2d241a]">
              <tr>
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">Email / Username</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Passcode / PIN</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261f16]">
              {adminUsers.map((user) => {
                const isSuper = user.role === "super_admin" || user.isMaster;
                const isPasswordShown = revealedPasswords[user.id];

                return (
                  <tr key={user.id} className="hover:bg-[#18130e] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#f7f2ea] flex items-center gap-2">
                      {isSuper ? (
                        <span className="p-1 rounded bg-[#b8925c]/20 text-[#e2c288]" title="Super Admin">
                          <Crown size={14} />
                        </span>
                      ) : (
                        <span className="p-1 rounded bg-[#2a2219] text-[#a89b88]" title="Store Admin">
                          <Shield size={14} />
                        </span>
                      )}
                      <span>{user.name}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[#a89b88] font-mono text-[11px]">
                      {user.email}
                    </td>

                    <td className="py-3.5 px-4">
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#b8925c]/20 text-[#e2c288] font-bold text-[10px] border border-[#b8925c]/40 uppercase tracking-wider">
                          👑 Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2a2219] text-[#c0b29f] font-semibold text-[10px] border border-[#3b3023] uppercase">
                          Staff Admin
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#1a1510] px-2 py-1 rounded text-[#e2c288] border border-[#2e2419]">
                          {isPasswordShown ? user.password : "••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(user.id)}
                          className="text-[#8d7e6c] hover:text-[#e2c288] transition-colors"
                          title={isPasswordShown ? "Hide password" : "Reveal password"}
                        >
                          {isPasswordShown ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#8a7a67]">
                      {user.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isSuper ? (
                        <span className="text-[10px] text-[#8f7e69] italic px-2 py-1">
                          Protected (Master)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-800 text-red-300 hover:text-white border border-red-700/50 text-xs font-semibold transition-all shadow-sm"
                          title="Remove this administrator"
                        >
                          <Trash2 size={13} />
                          <span>Remove Admin</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add New Admin Form */}
        <div className="bg-[#1a1510] border border-[#2e2419] rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={18} className="text-[#b8925c]" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#e2c288]">
              Add New Store Administrator
            </h4>
          </div>

          {addAdminError && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{addAdminError}</span>
            </div>
          )}

          {addAdminSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{addAdminSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#a0907e] mb-1 font-medium">
                Administrator Full Name
              </label>
              <input
                type="text"
                required
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="e.g. Gurpreet Kaur"
                className="w-full bg-[#14110e] border border-[#33291f] rounded-lg px-3.5 py-2 text-xs text-[#f7f2ea] focus:border-[#b8925c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#a0907e] mb-1 font-medium">
                Email / Username (Optional)
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="e.g. staff@womania.boutique"
                className="w-full bg-[#14110e] border border-[#33291f] rounded-lg px-3.5 py-2 text-xs text-[#f7f2ea] focus:border-[#b8925c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#a0907e] mb-1 font-medium">
                Assign Passcode / Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="e.g. 98765432"
                  className="w-full bg-[#14110e] border border-[#33291f] rounded-lg px-3.5 py-2 text-xs text-[#f7f2ea] font-mono focus:border-[#b8925c] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#b8925c] hover:bg-[#c9a46c] text-[#14110e] font-bold text-xs flex-shrink-0 transition-all flex items-center gap-1.5 shadow"
                >
                  <UserPlus size={14} />
                  <span>Add Admin</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
