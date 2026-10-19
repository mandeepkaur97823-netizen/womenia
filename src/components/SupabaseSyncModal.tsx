import { useState, useEffect } from "react";
import {
  Database,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Save,
  Key,
  Globe,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  testSupabaseConnection,
} from "@/lib/supabase";

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const SUPABASE_SETUP_SQL = `-- WOMANIA BOUTIQUE - SUPABASE DATABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor (supabase.com -> SQL Editor -> New Query -> Run)

CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    date TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'upi',
    status TEXT NOT NULL DEFAULT 'Confirmed',
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TEXT,
    updated_at TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    date TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    product_interest TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can delete enquiries" ON public.enquiries;

CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view enquiries" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Public can update enquiries" ON public.enquiries FOR UPDATE USING (true);
CREATE POLICY "Public can delete enquiries" ON public.enquiries FOR DELETE USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
`;

export function SupabaseSyncModal({ isOpen, onClose, onConfigUpdated }: SupabaseSyncModalProps) {
  const [url, setUrl] = useState("");
  const [anonKey, setAnonKey] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds?.url || "");
      setAnonKey(creds?.anonKey || "");
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // If user typed in fields, temporarily save to test
      if (url.trim() && anonKey.trim()) {
        saveCustomSupabaseConfig(url.trim(), anonKey.trim());
      }
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Failed to test connection",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: "Please enter both Supabase Project URL and Anon Public Key.",
      });
      return;
    }

    if (!url.startsWith("http")) {
      setTestResult({
        success: false,
        message: "Project URL must start with https:// (e.g., https://your-id.supabase.co)",
      });
      return;
    }

    const saved = saveCustomSupabaseConfig(url.trim(), anonKey.trim());
    if (saved) {
      setSaveSuccess(true);
      setTestResult({
        success: true,
        message: "Supabase credentials successfully saved! Live sync is now active.",
      });
      if (onConfigUpdated) onConfigUpdated();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Disconnect Supabase cloud? Store will revert to browser local storage.")) {
      clearCustomSupabaseConfig();
      setUrl("");
      setAnonKey("");
      setTestResult({
        success: false,
        message: "Custom Supabase configuration removed.",
      });
      if (onConfigUpdated) onConfigUpdated();
    }
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#14100c] border border-[#b8925c]/30 text-[#e6ded5] shadow-2xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9c8e7c] hover:text-[#e2c288] hover:bg-[#201912] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#2d241a]">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#b8925c]/25 to-[#6b512e]/10 border border-[#b8925c]/40 text-[#e2c288]">
            <Database size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-wide text-[#f5ebd7] font-serif">
                Supabase Cloud Database Link
              </h3>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                  isConfigured
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                }`}
              >
                {isConfigured ? "🟢 Active & Connected" : "🟡 Not Linked Yet"}
              </span>
            </div>
            <p className="text-xs text-[#9c8e7c] mt-0.5">
              Sync customer orders placed on live Vercel website across all admin devices in real-time.
            </p>
          </div>
        </div>

        {/* Punjabi Explanation Banner */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#1b1510] border border-[#b8925c]/25 text-xs text-[#cfc2b2] space-y-1">
          <div className="flex items-center gap-1.5 text-[#e2c288] font-semibold">
            <ShieldCheck size={15} />
            <span>ਕਸਟਮਰ ਆਰਡਰ ਐਡਮਿਨ ਪੈਨਲ ਵਿੱਚ ਦਿਖਾਉਣ ਲਈ:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#a89b88]">
            ਜਦੋਂ ਕਸਟਮਰ ਲਾਈਵ ਸਾਈਟ (<span className="text-[#e2c288]">womenia-alpha.vercel.app</span>) 'ਤੇ ਆਰਡਰ ਕਰੇਗਾ, ਉਹ ਸਿੱਧਾ Supabase Cloud Database ਵਿੱਚ ਸੇਵ ਹੋਵੇਗਾ ਅਤੇ ਤੁਹਾਡੇ ਐਡਮਿਨ ਪੈਨਲ ਵਿੱਚ ਤੁਰੰਤ ਦਿਖਾਈ ਦੇਵੇਗਾ।
          </p>
        </div>

        {/* Credential Form */}
        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#d4c3ad] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-[#b8925c]" />
                Supabase Project URL
              </span>
              <span className="text-[10px] text-[#8a7b6b]">e.g. https://xxxx.supabase.co</span>
            </label>
            <input
              type="text"
              placeholder="https://xyzabcdefg.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0906] border border-[#382b1d] text-sm text-[#f5ebd7] placeholder-[#6b5c4e] focus:outline-none focus:border-[#e2c288] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d4c3ad] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key size={14} className="text-[#b8925c]" />
                Supabase Anon / Public API Key
              </span>
              <span className="text-[10px] text-[#8a7b6b]">anon public key</span>
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0906] border border-[#382b1d] text-sm text-[#f5ebd7] placeholder-[#6b5c4e] focus:outline-none focus:border-[#e2c288] transition-colors font-mono text-xs"
            />
          </div>

          {/* Test Status Message */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-150 ${
                testResult.success
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-red-950/40 border-red-500/40 text-red-200"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b8925c] to-[#9c7846] text-black font-semibold text-xs hover:from-[#c9a36d] hover:to-[#ad8854] shadow-md transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>Save & Connect</span>
            </button>

            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#201912] border border-[#423322] text-[#e2c288] font-semibold text-xs hover:bg-[#2c2219] hover:border-[#b8925c]/50 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={testing ? "animate-spin" : ""} />
              <span>{testing ? "Testing..." : "Test Connection"}</span>
            </button>

            {isConfigured && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 font-semibold text-xs hover:bg-red-900/40 transition-all cursor-pointer ml-auto"
              >
                <Trash2 size={14} />
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </form>

        {/* 3 Step Setup Guide */}
        <div className="p-4 rounded-xl bg-[#0c0906] border border-[#2b2116] space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#e2c288] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={14} />
              <span>Supabase Setup Guide (3 Simple Steps)</span>
            </h4>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#b8925c] hover:underline flex items-center gap-1"
            >
              <span>Open Supabase.com</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <ol className="text-xs space-y-2.5 text-[#b0a293] list-decimal list-inside leading-relaxed">
            <li>
              <strong>Step 1:</strong> Create a project on{" "}
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#e2c288] underline">
                Supabase.com
              </a>{" "}
              (free tier).
            </li>
            <li>
              <strong>Step 2:</strong> In your Supabase Dashboard, click <strong>SQL Editor</strong> → click <strong>New Query</strong> → paste the SQL code below and click <strong>Run</strong>:
              <div className="mt-1.5">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f1710] border border-[#b8925c]/40 text-[#e2c288] text-[11px] font-semibold hover:bg-[#2e2318] transition-all cursor-pointer shadow-sm"
                >
                  {copiedSql ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedSql ? "✓ SQL Code Copied to Clipboard!" : "Copy SQL Setup Code (Tables & Realtime)"}</span>
                </button>
              </div>
            </li>
            <li>
              <strong>Step 3:</strong> In Supabase, go to <strong>Project Settings → API</strong>. Copy <strong>Project URL</strong> and <strong>Project API Keys (anon public)</strong> and paste them above, OR add them into your <strong>Vercel Project Settings → Environment Variables</strong>:
              <div className="mt-1 p-2 rounded bg-[#17120d] text-[11px] font-mono text-[#c9bba8] space-y-0.5 border border-[#2d2216]">
                <div>VITE_SUPABASE_URL = &lt;Your Project URL&gt;</div>
                <div>VITE_SUPABASE_ANON_KEY = &lt;Your Anon Public Key&gt;</div>
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#9c8e7c] hover:text-[#e2c288] transition-colors py-1 px-4 cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
