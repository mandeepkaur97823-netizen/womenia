import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Clock, Lock, Sparkles, AlertCircle } from "lucide-react";
import { business, whatsappHref } from "@/lib/womania";
import { StylishGirlIcon } from "@/components/Site";
import { type SiteSettings } from "@/lib/super-admin";

export function MaintenanceScreen({ settings }: { settings: SiteSettings }) {
  return (
    <div className="min-h-screen bg-[#0e0c0a] text-[#f7f2ea] flex flex-col justify-between selection:bg-[#cda26b] selection:text-[#181410]">
      {/* Decorative top amber accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8a6b3d] via-[#f3d99e] to-[#8a6b3d]" />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Brand Logo & Emblem */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-4">
              <div className="absolute -inset-3 bg-[#b8925c]/10 rounded-full blur-xl animate-pulse" />
              <StylishGirlIcon size={80} className="relative z-10 drop-shadow-[0_4px_16px_rgba(205,162,107,0.4)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Playfair_Display'] text-3xl sm:text-4xl tracking-[0.25em] font-bold text-[#f7f2ea]">
                WOMANIA
              </span>
              <span className="text-xs text-[#b8925c] tracking-widest uppercase font-serif border border-[#b8925c]/40 px-1.5 py-0.5 rounded">
                ®
              </span>
            </div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#b8925c] mt-1 font-medium">
              Sri Ganganagar · Rajasthan
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b8925c]/15 border border-[#b8925c]/35 text-[#e5c687] text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#e5c687] animate-ping" />
            <span>Store Temporarily Offline</span>
          </div>

          {/* Maintenance Headline */}
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold leading-tight text-[#fdf8ee] mb-4">
            {settings.maintenanceTitle || "WOMANIA is Currently Offline"}
          </h1>

          {/* Message */}
          <p className="text-base sm:text-lg text-[#d1c5b4] leading-relaxed max-w-xl mx-auto mb-8 font-light">
            {settings.maintenanceMessage ||
              "Our online boutique is currently undergoing private updates and collection curations. We will be back online shortly."}
          </p>

          {/* Estimated Return Pill */}
          {settings.estimatedBackOnline && (
            <div className="inline-flex items-center gap-2 text-xs text-[#a89b88] bg-[#1a1613] px-4 py-2 rounded-lg border border-[#2b241d] mb-10">
              <Clock size={14} className="text-[#b8925c]" />
              <span>Status: <strong className="text-[#e2c288]">{settings.estimatedBackOnline}</strong></span>
            </div>
          )}

          {/* Boutique Contact Actions */}
          <div className="bg-[#181410] border border-[#2d251c] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
            <h2 className="text-sm uppercase tracking-widest text-[#b8925c] font-semibold mb-4">
              Connect With The Boutique Directly
            </h2>
            <p className="text-xs text-[#9c8e7c] mb-6">
              Our physical showroom in Sri Ganganagar remains active. For order queries, appointments, or custom outfit requests, reach out below:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappHref("Hello WOMANIA, I would like to inquire about styles and boutique orders while the website is offline.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-medium text-sm shadow-lg hover:brightness-110 transition-all"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${business.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2b231a] hover:bg-[#382e22] text-[#f7f2ea] border border-[#4a3d2e] font-medium text-sm transition-all"
              >
                <Phone size={16} className="text-[#b8925c]" />
                <span>Call Store ({business.phone})</span>
              </a>
            </div>

            {/* Address */}
            <div className="mt-6 pt-6 border-t border-[#261f17] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#9a8c7b]">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#b8925c]" />
                <span>{business.address}</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#b8925c]" />
                <span>Open Daily · Closes {business.closingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Discrete Administrator Login Link */}
      <footer className="w-full border-t border-[#221c16] py-4 px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#716555] gap-3">
        <div>
          © {new Date().getFullYear()} WOMANIA Boutique. All rights reserved.
        </div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-[#8f7e68] hover:text-[#e2c288] transition-colors py-1 px-2.5 rounded bg-[#17130f] border border-[#2b2319]"
          title="Staff and Super Admin Login"
        >
          <Lock size={12} />
          <span>Super Admin / Staff Login</span>
        </Link>
      </footer>
    </div>
  );
}
