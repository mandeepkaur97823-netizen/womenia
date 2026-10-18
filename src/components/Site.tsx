import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Instagram, MapPin, Menu, Phone, X, MessageCircle, Star, ShoppingBag, Check, Sparkles, Lock, Clock, Crown, AlertTriangle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { recordVisit, saveEnquiry } from "@/lib/analytics";
import { getSiteSettings, isAdminLoggedIn, type SiteSettings } from "@/lib/super-admin";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { business, collections, directionsHref, phoneHref, PRODUCT_DATA, reviews, customerReviews, lookbookItems, SOCIAL_IMAGES, whatsappHref, policiesConfirmed, POLICY_COD, POLICY_EXCHANGE, POLICY_RETURN, POLICY_SHIPPING } from "@/lib/womania";
import heroAesthetic from "@/assets/womania-hero-aesthetic.jpg";
import heroJumpsuit from "@/assets/womania-hero.jpg";
import western from "@/assets/womania-western.jpg";
import indo from "@/assets/womania-indo.jpg";
import suits from "@/assets/womania-suits.jpg";
import bag from "@/assets/womania-bag.jpg";
import sunglasses from "@/assets/womania-sunglasses.jpg";
import introModern from "@/assets/womania-intro-modern.jpg";
import chicCouture from "@/assets/womania-chic-couture.jpg";
import blackQuiltedBag from "@/assets/womania-black-quilted-bag.jpg";
import goldenClutch from "@/assets/womania-golden-clutch.jpg";
import milanSquare from "@/assets/womania-milan-square.jpg";
import goldAviators from "@/assets/womania-gold-aviators.jpg";
import wideLegJeans from "@/assets/womania-wideleg-jeans.jpg";
import flareJeans from "@/assets/womania-flare-jeans.jpg";
import cargoJeans from "@/assets/womania-cargo-jeans.jpg";
import corsetTop from "@/assets/womania-corset-top.jpg";
import organzaTop from "@/assets/womania-organza-top.jpg";
import ribbedTop from "@/assets/womania-ribbed-top.jpg";
import silkSuit from "@/assets/womania-silk-suit.jpg";
import palazzoSuit from "@/assets/womania-palazzo-suit.jpg";
import blazerDress from "@/assets/womania-blazer-dress.jpg";
import satinDress from "@/assets/womania-satin-dress.jpg";
import emeraldGold from "@/assets/womania-emerald-gold.jpg";
import emeraldWine from "@/assets/womania-emerald-wine.jpg";
import introBlack from "@/assets/womania-intro-black.jpg";
import introGold from "@/assets/womania-intro-gold.jpg";
import indoRose from "@/assets/womania-indo-rose.jpg";
import indoGold from "@/assets/womania-indo-gold.jpg";
import chicLavender from "@/assets/womania-chic-lavender.jpg";
import chicBlue from "@/assets/womania-chic-blue.jpg";
import corsetGold from "@/assets/womania-corset-gold.jpg";
import corsetRuby from "@/assets/womania-corset-ruby.jpg";
import corsetBlack from "@/assets/womania-corset-black.jpg";
import silkRose from "@/assets/womania-silk-rose.jpg";
import palazzoCrimson from "@/assets/womania-palazzo-crimson.jpg";
import palazzoEmerald from "@/assets/womania-palazzo-emerald.jpg";
import westernCamel from "@/assets/womania-western-camel.jpg";
import westernIvory from "@/assets/womania-western-ivory.jpg";
import suitsChampagne from "@/assets/womania-suits-champagne.jpg";
import suitsMauve from "@/assets/womania-suits-mauve.jpg";
import satinBlack from "@/assets/womania-satin-black.jpg";
import satinRuby from "@/assets/womania-satin-ruby.jpg";

const hero = heroAesthetic;
const categoryImages = [western, indo, suits];
const imageMap = {
  emerald: heroAesthetic,
  emeraldGold: emeraldGold,
  emeraldWine: emeraldWine,
  western: western,
  westernCamel: westernCamel,
  westernIvory: westernIvory,
  indo: indo,
  indoRose: indoRose,
  indoGold: indoGold,
  suits: suits,
  suitsChampagne: suitsChampagne,
  suitsMauve: suitsMauve,
  jumpsuit: heroJumpsuit,
  bag: bag,
  sunglasses: sunglasses,
  introModern: introModern,
  introBlack: introBlack,
  introGold: introGold,
  chicCouture: chicCouture,
  chicLavender: chicLavender,
  chicBlue: chicBlue,
  blackQuiltedBag: blackQuiltedBag,
  goldenClutch: goldenClutch,
  milanSquare: milanSquare,
  goldAviators: goldAviators,
  wideLegJeans: wideLegJeans,
  flareJeans: flareJeans,
  cargoJeans: cargoJeans,
  corsetTop: corsetTop,
  corsetBlack: corsetBlack,
  corsetGold: corsetGold,
  corsetRuby: corsetRuby,
  organzaTop: organzaTop,
  ribbedTop: ribbedTop,
  silkSuit: silkSuit,
  silkRose: silkRose,
  palazzoSuit: palazzoSuit,
  palazzoCrimson: palazzoCrimson,
  palazzoEmerald: palazzoEmerald,
  blazerDress: blazerDress,
  satinDress: satinDress,
  satinBlack: satinBlack,
  satinRuby: satinRuby,
} as const;

const nav = [
  { label: "Home", to: "/" }, { label: "Shop", to: "/shop" },
  { label: "Track Order", to: "/track-order" },
  { label: "Collections", to: "/collections" }, { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" }, { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/contact" },
] as const;

export function StylishGirlIcon({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="girlGoldGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2C288" />
          <stop offset="50%" stopColor="#B8925C" />
          <stop offset="100%" stopColor="#966D33" />
        </linearGradient>
        <linearGradient id="girlBgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#241F1A" />
          <stop offset="100%" stopColor="#14110E" />
        </linearGradient>
      </defs>
      
      {/* Medallion Base */}
      <circle cx="20" cy="20" r="19" fill="url(#girlBgGrad)" stroke="url(#girlGoldGrad)" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="17.2" stroke="url(#girlGoldGrad)" strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.65" />
      
      {/* Couture floppy sun-hat brim */}
      <path
        d="M8 16.5C11.5 14.5 15.5 13.8 20 13.8C24.5 13.8 28.5 14.5 32 16.5C30.5 15 25.5 14.2 20 14.2C14.5 14.2 9.5 15 8 16.5Z"
        fill="url(#girlGoldGrad)"
      />
      {/* Hat Crown */}
      <path
        d="M15 14.2C15 9.8 17.2 8.2 20 8.2C22.8 8.2 25 9.8 25 14.2"
        stroke="url(#girlGoldGrad)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Chic Cat-Eye Sunglasses */}
      <path
        d="M14.5 19C15.8 18.2 18.2 18.2 19.5 19.2C19.5 20.8 17.8 21.8 16 21.8C14.5 21.8 14 20.5 14.5 19Z"
        fill="url(#girlGoldGrad)"
      />
      <path
        d="M25.5 19C24.2 18.2 21.8 18.2 20.5 19.2C20.5 20.8 22.2 21.8 24 21.8C25.5 21.8 26 20.5 25.5 19Z"
        fill="url(#girlGoldGrad)"
      />
      <line x1="19.2" y1="19.2" x2="20.8" y2="19.2" stroke="url(#girlGoldGrad)" strokeWidth="1" />

      {/* Red/Gold Lips */}
      <path
        d="M18.8 24.6C19.4 24.2 20.6 24.2 21.2 24.6C20.6 25.4 19.4 25.4 18.8 24.6Z"
        fill="#D97768"
      />

      {/* Jawline & Slender Neck */}
      <path
        d="M15.5 20.8C15.8 23.5 17.2 26.2 20 27.2C22.8 26.2 24.2 23.5 24.5 20.8"
        stroke="url(#girlGoldGrad)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M18.8 27.2V30.5M21.2 27.2V30.5"
        stroke="url(#girlGoldGrad)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Shoulders / Dress Neckline */}
      <path
        d="M11 34.5C13.5 32 16.5 30.5 20 30.5C23.5 30.5 26.5 32 29 34.5"
        stroke="url(#girlGoldGrad)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      
      {/* Pearl / Sparkle earrings */}
      <circle cx="15.2" cy="22.2" r="0.9" fill="#FDF8EE" />
      <circle cx="24.8" cy="22.2" r="0.9" fill="#FDF8EE" />
    </svg>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart, openTracker } = useCart();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      recordVisit(window.location.pathname || "/");
    }
  }, []);

  useEffect(() => {
    setSiteSettings(getSiteSettings());
    setAdminLoggedIn(isAdminLoggedIn());

    const onSettingsChange = () => setSiteSettings(getSiteSettings());
    const onSessionChange = () => setAdminLoggedIn(isAdminLoggedIn());

    window.addEventListener("womania_settings_changed", onSettingsChange);
    window.addEventListener("womania_session_changed", onSessionChange);
    return () => {
      window.removeEventListener("womania_settings_changed", onSettingsChange);
      window.removeEventListener("womania_session_changed", onSessionChange);
    };
  }, []);

  // When Site is OFF (Maintenance mode):
  // 1. If currently on /admin, always let admin routes load so Super Admin can log in
  // 2. If public visitor (not logged-in admin), show luxury MaintenanceScreen
  const isMaintenance = !siteSettings.isSiteOnline;
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isMaintenance && !isAdminRoute && !adminLoggedIn) {
    return <MaintenanceScreen settings={siteSettings} />;
  }

  return <>
    {/* Super Admin / Admin Maintenance Preview Sticky Banner */}
    {isMaintenance && (
      <div className="bg-gradient-to-r from-[#5a110d] via-[#3d0b08] to-[#260604] text-[#fdd4cf] px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-red-500/40 sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping flex-shrink-0" />
          <span>
            ⚠️ <strong>[SUPER ADMIN PREVIEW] STORE IS OFFLINE</strong>: Public visitors currently see the boutique maintenance screen. You are viewing administrator live preview.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="px-3 py-1 rounded bg-[#1c0806] hover:bg-black text-[#fdd4cf] border border-red-400/50 font-bold tracking-wide transition-all shadow"
          >
            Open Super Admin Panel (Turn Online) →
          </Link>
        </div>
      </div>
    )}

    <div className="announcement">{siteSettings.announcementText || "WOMEN’S & GIRLS’ WESTERN WEAR · SRI GANGANAGAR"}</div>
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="wordmark" onClick={() => setMenuOpen(false)}>
          <StylishGirlIcon className="wordmark-icon" size={30} />
          <span>WOMANIA</span>
          <span className="trademark">®</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <Link key={item.to} to={item.to} activeProps={{ className: "is-active" }} activeOptions={{ exact: true }}>{item.label}</Link>)}</nav>
        <div className="header-actions">
          <Button asChild className="header-shop-btn">
            <Link to="/shop">
              <ShoppingBag size={15} />
              <span>Shop Now</span>
            </Link>
          </Button>
          <button
            type="button"
            className="header-track-btn"
            onClick={() => openTracker()}
            title="Track Order (Done / Cancelled)"
            aria-label="Track Order Status"
          >
            <Clock size={15} className="text-[#b8925c]" />
            <span>Track Order</span>
          </button>
          <button
            type="button"
            className="header-cart-btn"
            onClick={openCart}
            aria-label={`View Shopping Bag (${itemCount} items)`}
            title="View Shopping Bag"
          >
            <ShoppingBag size={18} />
            <span className="cart-badge-pill">{itemCount}</span>
          </button>
          <Button asChild variant="outline" className="header-whatsapp"><a href={whatsappHref()} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/> WhatsApp Us <ArrowUpRight size={14}/></a></Button>
          <Button variant="ghost" size="icon" className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</Button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <Link to="/shop" className="mobile-menu-highlight" onClick={() => setMenuOpen(false)}>
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#b8925c]" />
              <strong>Shop Now (Online Store)</strong>
            </div>
            <ArrowUpRight size={18} />
          </Link>
          <button
            type="button"
            className="mobile-track-trigger"
            onClick={() => {
              setMenuOpen(false);
              openTracker();
            }}
          >
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#b8925c]" />
              <span>Track Order (Done / Cancelled Status)</span>
            </div>
            <ArrowUpRight size={18} />
          </button>
          <button
            type="button"
            className="mobile-cart-trigger"
            onClick={() => {
              setMenuOpen(false);
              openCart();
            }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span>Shopping Bag</span>
            </div>
            <span className="cart-badge-pill">{itemCount}</span>
          </button>
          {nav.map(item => <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={18}/></Link>)}
          <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ<ArrowUpRight size={18}/></Link>
        </nav>
      )}
    </header>
    <main>{children}</main>
    <Footer />
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <Link to="/shop"><span>Shop Now</span><ShoppingBag size={17}/></Link>
      <button type="button" onClick={() => openTracker()} className="mobile-track-action-btn">
        <span>Track</span>
        <Clock size={17} />
      </button>
      <button type="button" onClick={openCart} className="mobile-bag-btn">
        <span>Bag ({itemCount})</span>
        <ShoppingBag size={17} />
      </button>
      <a href={whatsappHref()} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><MessageCircle size={17}/></a>
      <a href={directionsHref} target="_blank" rel="noopener noreferrer"><span>Directions</span><MapPin size={17}/></a>
    </nav>
  </>;
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link to="/" className="footer-brand">
            <StylishGirlIcon className="footer-brand-icon" size={36} />
            <span>WOMANIA</span>
          </Link>
          <p>Women’s & Girls’ Western Wear Store<br/>Sri Ganganagar, Rajasthan</p>
        </div>
        <div className="footer-links">
          <div><span>EXPLORE</span><Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/track-order">Track Order</Link><Link to="/collections">Collections</Link><Link to="/gallery">Gallery</Link><Link to="/reviews">Reviews</Link></div>
          <div><span>INFORMATION</span><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/track-order">Order Status (Done / Cancel)</Link><Link to="/faq">FAQ</Link><Link to="/policies">Policies</Link></div>
          <div><span>CONNECT</span><a href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={phoneHref}>098777 92387</a><span className="footer-handle">Instagram · {business.instagramHandle}</span></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© WOMANIA</span>
        <span>6-L Block, Radheshyam Kothi Road, Sri Ganganagar, Rajasthan 335001</span>
        <Link to="/admin" className="footer-admin-link">
          <Lock size={12} />
          <span>Admin Portal</span>
        </Link>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="eyebrow"><span className="eyebrow-line"/>{children}</div>; }
function TextArrow({ to, children }: { to: "/shop" | "/collections" | "/gallery" | "/contact" | "/reviews" | "/about"; children: React.ReactNode }) { return <Link to={to} className="text-arrow">{children}<ArrowUpRight size={20}/></Link>; }

export function HomePage() { return <>
  <section className="hero">
    <img src={hero} alt="Luxury fashion editorial portrait of a woman in contemporary fusion couture" width={1920} height={1080} fetchPriority="high"/>
    <div className="hero-shade"/>
    <div className="hero-content">
      <div className="hero-main">
        <div className="hero-badge"><MapPin size={13}/> SRI GANGANAGAR</div>
        <div className="hero-title-row">
          <StylishGirlIcon className="hero-title-icon" size={50} />
          <h1 className="hero-title">WOMANIA</h1>
        </div>
        <p className="hero-tagline">YOUR STYLE. YOUR STATEMENT.</p>
        <p className="hero-subtag">Western & Indo-Western Couture</p>
        <div className="hero-buttons">
          <Button asChild variant="hero" size="editorial">
            <Link to="/shop" className="group">
              <ShoppingBag size={18} className="text-[#b8925c]" />
              <span>Shop Now</span>
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
          <Button asChild variant="heroOutline" size="editorial">
            <Link to="/collections" className="group">
              <span>Explore Collection</span>
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
          <Button asChild variant="heroOutline" size="editorial">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="group">
              <MessageCircle size={16} className="text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
              <span>WhatsApp Us</span>
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        </div>
      </div>
      <div className="hero-bottom">
        <span className="hero-scroll-indicator">SCROLL TO EXPLORE ↓</span>
      </div>
    </div>
  </section>
  <section className="intro section-wrap">
    <div className="intro-image">
      <img
        src={introModern}
        alt="Fashion model walking in tailored ivory wide-leg belted jumpsuit at WOMANIA"
        loading="lazy"
        width={1000}
        height={1500}
      />
      <div className="intro-image-badge">
        <span className="badge-pill">NEW EDIT · 2026</span>
        <span className="badge-title">MODERN WESTERN & COUTURE</span>
      </div>
    </div>
    <div className="intro-copy">
      <Eyebrow>01 / THE WOMANIA ESSENCE</Eyebrow>
      <h2>WHERE CONFIDENCE <br/><em>MEETS COUTURE.</em></h2>
      <p className="intro-lead">
        Step into Sri Ganganagar’s premier boutique for women who refuse to blend into the crowd.
      </p>
      <p className="intro-description">
        From head-turning party dresses and sequined evening couture to sleek runway co-ords, luxury sunglasses, and statement handbags — every design at WOMANIA is chosen to bring out your most radiant, unapologetic self.
      </p>

      <div className="intro-features">
        <div className="intro-feature-item">
          <span className="feature-icon">✨</span>
          <div>
            <strong>Curated Runway Silhouettes</strong>
            <span>Western gowns, chic co-ords & evening party wear</span>
          </div>
        </div>
        <div className="intro-feature-item">
          <span className="feature-icon">💎</span>
          <div>
            <strong>Signature Luxury Accents</strong>
            <span>Handpicked designer bags & fashion sunglasses</span>
          </div>
        </div>
        <div className="intro-feature-item">
          <span className="feature-icon">📍</span>
          <div>
            <strong>Personal Boutique Experience</strong>
            <span>Visit us at 6-L Block, Radheshyam Kothi Road for personalized styling</span>
          </div>
        </div>
      </div>

      <div className="intro-actions">
        <TextArrow to="/about">Explore The Story</TextArrow>
        <Link to="/collections" className="intro-pill-link">
          Browse Collection <ArrowUpRight size={16}/>
        </Link>
      </div>
    </div>
  </section>
  <CollectionsPreview />
  <section className="statement-band">
    <span>WOMANIA / SRI GANGANAGAR</span>
    <p>Find a look that feels <em>entirely yours.</em></p>
    <Link to="/shop" className="statement-band-pill">
      <span>Explore The Full Collection</span>
      <ArrowUpRight size={17} />
    </Link>
  </section>
  <ReviewsPreview />
  <InstagramSection />
  <VisitSection />
  </>; }

export function CollectionsPreview() {
  const [activeTab, setActiveTab] = useState<"all" | "jeans" | "tops" | "suits" | "western" | "indo-western" | "accessories">("all");

  const filteredItems = lookbookItems.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <section className="collections-section">
      <div className="section-wrap">
        <div className="section-heading">
          <div>
            <Eyebrow>02 / CURATED LOOKBOOK & ACCESSORIES</Eyebrow>
            <h2>FIND YOUR <em>LOOK.</em></h2>
          </div>
          <TextArrow to="/shop">View all collections</TextArrow>
        </div>

        {/* Filter Bar */}
        <div className="lookbook-filter-bar">
          <button
            className={`lookbook-filter-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Curations
          </button>
          <button
            className={`lookbook-filter-btn ${activeTab === "jeans" ? "active" : ""}`}
            onClick={() => setActiveTab("jeans")}
          >
            Jeans & Denim
          </button>
          <button
            className={`lookbook-filter-btn ${activeTab === "tops" ? "active" : ""}`}
            onClick={() => setActiveTab("tops")}
          >
            Tops & Corsets
          </button>
          <button
            className={`lookbook-filter-btn ${activeTab === "suits" ? "active" : ""}`}
            onClick={() => setActiveTab("suits")}
          >
            Suits & Sets
          </button>
          <button
            className={`lookbook-filter-btn ${activeTab === "western" ? "active" : ""}`}
            onClick={() => setActiveTab("western")}
          >
            Western Wear
          </button>
          <button
            className={`lookbook-filter-btn ${activeTab === "indo-western" ? "active" : ""}`}
            onClick={() => setActiveTab("indo-western")}
          >
            Indo-Western
          </button>
          <button
            className={`lookbook-filter-btn ${activeTab === "accessories" ? "active" : ""}`}
            onClick={() => setActiveTab("accessories")}
          >
            Purses & Goggles
          </button>
        </div>

        {/* Dynamic Collage Grid */}
        <div className="lookbook-collage-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`lookbook-card ${item.span === "featured" ? "card-featured" : ""}`}
            >
              <div className="lookbook-image-wrap">
                <img
                  src={imageMap[item.imageKey]}
                  alt={item.name}
                  loading="lazy"
                />
                <div className="lookbook-badge-row">
                  <span className="lookbook-category-badge">{item.categoryLabel}</span>
                  <span className="lookbook-tag-pill">{item.tag}</span>
                </div>
              </div>
              <div className="lookbook-info">
                <div>
                  <h3 className="lookbook-title">{item.name}</h3>
                  <p className="lookbook-desc">{item.description}</p>
                </div>
                <div className="lookbook-actions">
                  <a
                    href={whatsappHref(item.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lookbook-enquire-btn"
                  >
                    <span>Enquire Availability</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lookbook-footer-note">
          <span>Editorial styling & accessories edit · Sri Ganganagar</span>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="custom-order-link">
            Looking for a custom size or style? <strong>Chat on WhatsApp →</strong>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ReviewsPreview() {
  return (
    <section className="reviews-section section-wrap">
      <div className="section-heading">
        <div>
          <Eyebrow>03 / KIND WORDS</Eyebrow>
          <h2>WHAT CUSTOMERS <em>SAY.</em></h2>
        </div>
        <TextArrow to="/reviews">View all reviews</TextArrow>
      </div>
      <div className="reviews-layout">
        <div className="rating">
          <div className="rating-badge">★ VERIFIED STORE RATING</div>
          <strong>{business.rating}<span> / 5</span></strong>
          <div className="rating-stars" aria-label={`${business.rating} out of 5 stars`}>★★★★★</div>
          <p>{business.reviewCount}+ Google & Store Reviews</p>
          <div className="rating-recommend">✓ 99% Recommended by shoppers</div>
        </div>
        <div className="review-cards">
          {customerReviews.slice(0, 4).map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div className="review-stars">
                  {"★".repeat(review.rating)}
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">“{review.comment}”</p>
              <div className="review-author">
                <div className="author-avatar">{review.name.charAt(0)}</div>
                <div>
                  <h4 className="author-name">{review.name}</h4>
                  <p className="author-location">
                    {review.location} {review.verified && <span className="verified-badge">✓ Verified Buyer</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramSection() {
  const { addToCart, openCheckout, openCart } = useCart();
  const [activeCuratedCategory, setActiveCuratedCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCuratedCategory(null);
      }
    };
    if (activeCuratedCategory) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCuratedCategory]);

  const instagramFeed = [
    {
      id: "party-couture",
      src: introModern,
      alt: "WOMANIA Pure ivory belted jumpsuit and evening couture edit",
      title: "Party Couture Edit",
      badge: "Cocktail & Evening",
      count: "5 Exclusive Styles",
      desc: "Runway ivory jumpsuits, plum off-shoulder bandage gowns, and draped cocktail silhouettes."
    },
    {
      id: "tailored-chic",
      src: chicCouture,
      alt: "WOMANIA Blush pink polka-dot couture dress and suits",
      title: "Tailored Chic & Suits",
      badge: "Power Suits & Sets",
      count: "6 Tailored Outfits",
      desc: "Structured power blazers, royal purple silk sarees, chikankari shararas & polka-dot dresses."
    },
    {
      id: "denim-edit",
      src: wideLegJeans,
      alt: "WOMANIA vintage wide-leg, flare and patch boyfriend jeans collection",
      title: "Designer Denim & Jeans",
      badge: "High-Waist Jeans & Flares",
      count: "3 Denim Fits",
      desc: "High-waist wide-leg vintage wash, bootcut flares & pop-art patch embroidered boyfriend jeans."
    },
    {
      id: "corset-tops",
      src: corsetTop,
      alt: "WOMANIA luxury boned corset tops, mock-neck tops and streetwear sets",
      title: "Luxe Tops & Corsets",
      badge: "Corset Bustiers & Tops",
      count: "3 Statement Tops",
      desc: "Liquid satin boned corset tops, midnight black ribbed mock-necks & sunshine yellow streetwear co-ords."
    },
    {
      id: "handbags",
      src: bag,
      alt: "WOMANIA calfskin designer leather handbag",
      title: "Luxury Handbags",
      badge: "Leather Purses & Clutches",
      count: "3 Handbag Styles",
      desc: "Calfskin leather satchels, quilted crossbody bags & golden hour evening clutches."
    },
    {
      id: "eyewear",
      src: sunglasses,
      alt: "WOMANIA Riviera amber cat-eye goggles",
      title: "Designer Eyewear",
      badge: "UV400 Goggles & Shades",
      count: "3 Eyewear Styles",
      desc: "Gradient amber cat-eye frames, Milan black squares & Venetian gold aviators."
    },
  ];

  const selectedCuration = instagramFeed.find((f) => f.id === activeCuratedCategory);
  const matchingProducts = activeCuratedCategory
    ? PRODUCT_DATA.filter((p) => p.curationGroup === activeCuratedCategory)
    : [];

  return (
    <section className="instagram-band">
      <div className="section-wrap instagram-inner">
        <div>
          <Eyebrow>04 / CURATED INSTAGRAM EDIT</Eyebrow>
          <h2>TAP TO SHOP<br/><em>THE LOOKS.</em></h2>
        </div>
        <div className="instagram-side">
          <Instagram size={28} strokeWidth={1.3}/>
          <p className="instagram-handle">{business.instagramHandle}</p>
          <p>{business.instagramFollowers} followers <span>· Tap any look below to view full products</span></p>
          <a
            href={business.instagramUrl || `https://instagram.com/${business.instagramHandle.replace('@','')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-arrow"
          >
            Follow {business.instagramHandle} <ArrowUpRight size={20}/>
          </a>
        </div>
      </div>

      <div className="social-grid">
        {instagramFeed.map((item) => (
          <div
            key={item.id}
            className="social-card-btn"
            onClick={() => setActiveCuratedCategory(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveCuratedCategory(item.id);
              }
            }}
          >
            <img src={item.src} alt={item.alt} loading="lazy" />
            <div className="social-click-hint">
              <span>View Products</span>
              <ArrowUpRight size={13} />
            </div>
            <div className="gallery-caption">
              <div>
                <strong>{item.title}</strong>
                <span className="social-badge-sub">{item.count}</span>
              </div>
              <Instagram size={15} />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Products Modal */}
      {activeCuratedCategory && selectedCuration && (
        <div
          className="curated-modal-backdrop"
          onClick={() => setActiveCuratedCategory(null)}
        >
          <div
            className="curated-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="curated-modal-header">
              <div>
                <span className="curated-modal-eyebrow">
                  ✨ {selectedCuration.badge} · {matchingProducts.length} DESIGNS AVAILABLE
                </span>
                <h3 className="curated-modal-title">{selectedCuration.title}</h3>
                <p className="curated-modal-desc">{selectedCuration.desc}</p>
              </div>
              <button
                className="curated-modal-close-btn"
                onClick={() => setActiveCuratedCategory(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="curated-modal-body">
              {matchingProducts.map((p) => {
                const imgSrc = imageMap[p.images[0] as keyof typeof imageMap] || western;
                return (
                  <div className="curated-product-card" key={p.id}>
                    <div className="curated-product-image">
                      <img src={imgSrc} alt={p.name} loading="lazy" />
                      <span className="curated-product-badge">
                        {p.subcategory || p.category}
                      </span>
                    </div>
                    <div className="curated-product-details">
                      <div>
                        <h4 className="curated-product-name">{p.name}</h4>
                        <p className="curated-product-desc">{p.description}</p>
                      </div>

                      <div className="curated-product-pricing">
                        <span className="curated-price">₹{p.price?.toLocaleString("en-IN")}</span>
                        {p.sizes?.length ? (
                          <div className="curated-sizes">
                            {p.sizes.map((s) => (
                              <span key={s} className="size-chip">{s}</span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="curated-product-footer">
                        <button
                          type="button"
                          className="curated-buy-btn"
                          onClick={() => {
                            setActiveCuratedCategory(null);
                            openCheckout(p, p.sizes?.[0] || "Standard");
                          }}
                        >
                          <ShoppingBag size={14} />
                          <span>Shop Now</span>
                        </button>
                        <button
                          type="button"
                          className="curated-bag-btn"
                          onClick={() => {
                            addToCart(p, p.sizes?.[0] || "Standard");
                            openCart();
                          }}
                        >
                          <span>+ Bag</span>
                        </button>
                        <a
                          href={whatsappHref(p.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="curated-whatsapp-btn"
                        >
                          <MessageCircle size={15} className="text-[#25D366]" />
                          <span>WhatsApp</span>
                          <ArrowUpRight size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="curated-modal-footer">
              <span className="curated-footer-help">
                📍 In-store trials available at 6-L Block, Radheshyam Kothi Road, Sri Ganganagar
              </span>
              <Link
                to="/shop"
                className="curated-explore-shop-btn"
                onClick={() => setActiveCuratedCategory(null)}
              >
                <span>Browse Full Boutique Catalog</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function VisitSection() {
  return (
    <section className="visit-section">
      <div className="section-wrap visit-inner">
        <div>
          <Eyebrow>05 / THE STORE</Eyebrow>
          <h2>COME SHOP<br/><em>WOMANIA.</em></h2>
          <p className="visit-lead">
            Step inside our Sri Ganganagar flagship boutique to discover our exclusive edits of western gowns, party couture, chic co-ords, and personal styling sessions.
          </p>
        </div>
        <div className="visit-card">
          <div className="visit-card-header">
            <div className="visit-icon-circle">
              <MapPin size={22} className="text-[#b8925c]" strokeWidth={1.8} />
            </div>
            <div>
              <span className="visit-flagship-tag">FLAGSHIP BOUTIQUE</span>
              <h3 className="visit-store-name">WOMANIA ATELIER</h3>
            </div>
          </div>
          <p className="visit-address-line">{business.address}</p>
          <div className="visit-meta-row">
            <span>✨ Open Daily · 11:00 AM – 9:00 PM</span>
            <span>👗 Fitting Lounge & In-Store Styling</span>
          </div>
          <div className="visit-actions">
            <Button asChild variant="hero" size="editorial">
              <a href={directionsHref} target="_blank" rel="noopener noreferrer">
                <span>Get Directions</span>
                <ArrowUpRight size={17} />
              </a>
            </Button>
            <Button asChild variant="heroOutline" size="editorial">
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>WhatsApp Us</span>
                <ArrowUpRight size={17} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageTop({ number, eyebrow, title, italic, description }: { number: string; eyebrow: string; title: string; italic?: string; description?: string }) { return <div className="page-top section-wrap"><div className="page-top-index">{number} / WOMANIA</div><Eyebrow>{eyebrow}</Eyebrow><h1>{title} {italic && <em>{italic}</em>}</h1>{description && <p>{description}</p>}</div>; }

function getColorHex(colorName: string): string {
  const lower = colorName.toLowerCase();
  if (lower.includes("purple") || lower.includes("violet") || lower.includes("aubergine")) return "#6b21a8";
  if (lower.includes("plum") || lower.includes("mulberry") || lower.includes("wine") || lower.includes("burgundy")) return "#701a40";
  if (lower.includes("emerald") || lower.includes("teal")) return "#065f46";
  if (lower.includes("olive") || lower.includes("sage")) return "#4d6b38";
  if (lower.includes("mint") || lower.includes("sky")) return "#7dd3fc";
  if (lower.includes("navy") || lower.includes("blue") || lower.includes("indigo")) return "#1e3a8a";
  if (lower.includes("black") || lower.includes("onyx") || lower.includes("obsidian")) return "#18181b";
  if (lower.includes("charcoal") || lower.includes("slate") || lower.includes("grey") || lower.includes("gray")) return "#475569";
  if (lower.includes("white") || lower.includes("ivory") || lower.includes("pearl") || lower.includes("cream")) return "#fafaf9";
  if (lower.includes("pink") || lower.includes("rose") || lower.includes("blush") || lower.includes("lilac") || lower.includes("lavender")) return "#f472b6";
  if (lower.includes("gold") || lower.includes("champagne") || lower.includes("zari") || lower.includes("bronze")) return "#d97706";
  if (lower.includes("yellow") || lower.includes("mustard") || lower.includes("sunshine")) return "#eab308";
  if (lower.includes("red") || lower.includes("crimson") || lower.includes("ruby")) return "#dc2626";
  if (lower.includes("camel") || lower.includes("cognac") || lower.includes("tan") || lower.includes("brown") || lower.includes("mocha")) return "#92400e";
  if (lower.includes("amber") || lower.includes("tortoise")) return "#d97706";
  if (lower.includes("silver") || lower.includes("chrome")) return "#94a3b8";
  return "#c5a059";
}

const COLOR_PALETTES = [
  { id: "all", name: "All Colors", hex: "#c5a059", keywords: [] },
  { id: "purple-wine", name: "Royal Purple & Wine", hex: "#6b21a8", keywords: ["purple", "wine", "plum", "mulberry"] },
  { id: "emerald-olive", name: "Emerald & Olive", hex: "#065f46", keywords: ["emerald", "olive", "teal", "green"] },
  { id: "black-charcoal", name: "Noir Black & Charcoal", hex: "#18181b", keywords: ["black", "onyx", "charcoal", "obsidian"] },
  { id: "white-ivory", name: "Pure Ivory & White", hex: "#f5f5f4", keywords: ["ivory", "white", "pearl", "cream"] },
  { id: "blue-indigo", name: "Blue & Indigo Denim", hex: "#1e3a8a", keywords: ["blue", "indigo", "mint", "sky"] },
  { id: "pink-blush", name: "Blush Pink", hex: "#f472b6", keywords: ["pink", "rose", "blush", "lavender", "lilac"] },
  { id: "yellow-mustard", name: "Sunshine Yellow", hex: "#eab308", keywords: ["yellow", "mustard", "sunshine"] },
  { id: "gold-metallic", name: "Champagne Gold", hex: "#d97706", keywords: ["gold", "champagne", "amber", "zari"] },
] as const;

function getDisplayImage(
  product: typeof PRODUCT_DATA[0],
  selectedColour: string
): { src: string; isRealPhotoVariant: boolean } {
  const lower = (selectedColour || "").toLowerCase().trim();

  // 1. The Royal Emerald Draped Gown
  if (product.id === "prod-1") {
    if (lower.includes("gold") || lower.includes("champagne")) {
      return { src: imageMap.emeraldGold, isRealPhotoVariant: true };
    }
    if (lower.includes("wine") || lower.includes("ruby") || lower.includes("maroon")) {
      return { src: imageMap.emeraldWine, isRealPhotoVariant: true };
    }
    return { src: imageMap.emerald, isRealPhotoVariant: true };
  }

  // 2. Pure Ivory Belted Wide-Leg Jumpsuit
  if (product.id === "prod-2" || product.id === "prod-4") {
    if (lower.includes("black") || lower.includes("onyx")) {
      return { src: imageMap.introBlack, isRealPhotoVariant: true };
    }
    return { src: imageMap.introModern, isRealPhotoVariant: true };
  }

  // 3. Olive Flora Bustier & Cape Set
  if (product.id === "prod-3") {
    return { src: imageMap.indo, isRealPhotoVariant: true };
  }

  // 5. Tailored Midnight Power Blazer & Pants
  if (product.id === "prod-5") {
    return { src: imageMap.western, isRealPhotoVariant: true };
  }

  // 6. Blush Pink Polka-Dot Ruffled Organza Dress
  if (product.id === "prod-6") {
    return { src: imageMap.chicCouture, isRealPhotoVariant: true };
  }

  // 7. Artisanal Duster & Charcoal Suit
  if (product.id === "prod-7") {
    return { src: imageMap.suits, isRealPhotoVariant: true };
  }

  // 9. Sienna Dual-Tone Leather Satchel
  if (product.id === "prod-9") {
    if (lower.includes("black") || lower.includes("noir")) {
      return { src: imageMap.blackQuiltedBag, isRealPhotoVariant: true };
    }
    return { src: imageMap.bag, isRealPhotoVariant: true };
  }

  // 10. Noir Quilted Crossbody Chain Bag
  if (product.id === "prod-10") {
    if (lower.includes("champagne") || lower.includes("beige") || lower.includes("gold")) {
      return { src: imageMap.goldenClutch, isRealPhotoVariant: true };
    }
    return { src: imageMap.blackQuiltedBag, isRealPhotoVariant: true };
  }

  // 11. Golden Hour Metallic Evening Clutch
  if (product.id === "prod-11") {
    if (lower.includes("silver") || lower.includes("chrome") || lower.includes("black") || lower.includes("noir")) {
      return { src: imageMap.blackQuiltedBag, isRealPhotoVariant: true };
    }
    return { src: imageMap.goldenClutch, isRealPhotoVariant: true };
  }

  // 12. Riviera Amber Cat-Eye Goggles
  if (product.id === "prod-12") {
    if (lower.includes("quartz") || lower.includes("smoky") || lower.includes("black") || lower.includes("obsidian") || lower.includes("dark")) {
      return { src: imageMap.milanSquare, isRealPhotoVariant: true };
    }
    return { src: imageMap.sunglasses, isRealPhotoVariant: true };
  }

  // 13. Milan Oversized Square Sunglasses
  if (product.id === "prod-13") {
    if (lower.includes("tortoise") || lower.includes("amber") || lower.includes("brown") || lower.includes("warm")) {
      return { src: imageMap.sunglasses, isRealPhotoVariant: true };
    }
    return { src: imageMap.milanSquare, isRealPhotoVariant: true };
  }

  // 14. Venetian Gold Wire Aviators
  if (product.id === "prod-14") {
    if (lower.includes("silver") || lower.includes("grey") || lower.includes("obsidian")) {
      return { src: imageMap.milanSquare, isRealPhotoVariant: true };
    }
    return { src: imageMap.goldAviators, isRealPhotoVariant: true };
  }

  // 15. The Palazzo Vintage Wide-Leg Jeans
  if (product.id === "prod-15") {
    if (lower.includes("indigo") || lower.includes("flare") || lower.includes("sky")) {
      return { src: imageMap.flareJeans, isRealPhotoVariant: true };
    }
    if (lower.includes("slate") || lower.includes("grey") || lower.includes("cargo")) {
      return { src: imageMap.cargoJeans, isRealPhotoVariant: true };
    }
    return { src: imageMap.wideLegJeans, isRealPhotoVariant: true };
  }

  // 16. Riviera High-Rise Bootcut Flare Jeans
  if (product.id === "prod-16") {
    if (lower.includes("wide") || lower.includes("stone") || lower.includes("classic")) {
      return { src: imageMap.wideLegJeans, isRealPhotoVariant: true };
    }
    if (lower.includes("charcoal") || lower.includes("black") || lower.includes("cargo")) {
      return { src: imageMap.cargoJeans, isRealPhotoVariant: true };
    }
    return { src: imageMap.flareJeans, isRealPhotoVariant: true };
  }

  // 17. Pop-Art Patch Embroidered Ripped Boyfriend Jeans
  if (product.id === "prod-17") {
    if (lower.includes("sky") || lower.includes("wide") || lower.includes("light")) {
      return { src: imageMap.wideLegJeans, isRealPhotoVariant: true };
    }
    if (lower.includes("black") || lower.includes("flare") || lower.includes("midnight")) {
      return { src: imageMap.flareJeans, isRealPhotoVariant: true };
    }
    return { src: imageMap.cargoJeans, isRealPhotoVariant: true };
  }

  // 18. Emerald Satin Boned Corset Bustier
  if (product.id === "prod-18") {
    if (lower.includes("black") || lower.includes("onyx") || lower.includes("midnight")) {
      return { src: imageMap.organzaTop, isRealPhotoVariant: true };
    }
    return { src: imageMap.corsetTop, isRealPhotoVariant: true };
  }

  // 19. Midnight Black Ribbed Mock-Neck Top
  if (product.id === "prod-19") {
    if (lower.includes("cream") || lower.includes("white")) {
      return { src: imageMap.ribbedTop, isRealPhotoVariant: true };
    }
    return { src: imageMap.organzaTop, isRealPhotoVariant: true };
  }

  // 20. Sunshine Yellow Cropped Hoodie & Joggers Set
  if (product.id === "prod-20") {
    if (lower.includes("black") || lower.includes("onyx")) {
      return { src: imageMap.organzaTop, isRealPhotoVariant: true };
    }
    return { src: imageMap.ribbedTop, isRealPhotoVariant: true };
  }

  // 21. Icy Mint Chikankari Embroidered Sharara Suit Set
  if (product.id === "prod-21") {
    return { src: imageMap.silkSuit, isRealPhotoVariant: true };
  }

  // 22. Royal Purple & Gold Zari Silk Saree
  if (product.id === "prod-22") {
    if (lower.includes("green") || lower.includes("emerald")) {
      return { src: imageMap.emerald, isRealPhotoVariant: true };
    }
    return { src: imageMap.palazzoSuit, isRealPhotoVariant: true };
  }

  // 23. Off-Shoulder White Crop Top & Striped Wide-Leg Co-ord Set
  if (product.id === "prod-23") {
    if (lower.includes("black") || lower.includes("onyx")) {
      return { src: imageMap.introBlack, isRealPhotoVariant: true };
    }
    return { src: imageMap.blazerDress, isRealPhotoVariant: true };
  }

  // 24. Plum Off-Shoulder Sculpted Bandage Evening Gown
  if (product.id === "prod-24") {
    if (lower.includes("emerald") || lower.includes("green")) {
      return { src: imageMap.emerald, isRealPhotoVariant: true };
    }
    return { src: imageMap.satinDress, isRealPhotoVariant: true };
  }

  const baseSrc = imageMap[product.images[0] as keyof typeof imageMap] || western;
  return { src: baseSrc, isRealPhotoVariant: true };
}

export function MoreClothesModal({
  isOpen,
  onClose,
  initialProduct,
  initialCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: typeof PRODUCT_DATA[0] | null | undefined;
  initialCategory?: string | undefined;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Western Party Wear & Dresses");
  const [preferredColor, setPreferredColor] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError("");
      if (initialProduct) {
        setCategory(initialProduct.subcategory || initialProduct.name);
        setPreferredColor(initialProduct.colours?.[0] || "");
      } else if (initialCategory) {
        setCategory(initialCategory);
      }
    }
  }, [isOpen, initialProduct, initialCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError("Please enter a valid WhatsApp phone number.");
      return;
    }

    const messageText = `Customer requested more clothes/designs in ${category}.${
      preferredColor ? ` Preferred Color: ${preferredColor}.` : ""
    }${notes ? ` Notes: ${notes}` : ""}`;

    // 1. Save to Admin Enquiry Store
    saveEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: messageText,
      productInterest: `More Clothes Request: ${category}${preferredColor ? ` (${preferredColor})` : ""}`,
    });

    // 2. Open WhatsApp directly to boutique concierge
    const waText = `Hi WOMANIA! My name is ${name.trim()} (Phone: ${phone.trim()}). I want to see more clothes and exclusive designs in "${category}"${
      preferredColor ? ` (Preferred Color: ${preferredColor})` : ""
    }.${notes ? ` Special Request: ${notes}` : ""} Please send me more photos and options on WhatsApp!`;

    window.open(`https://wa.me/91${business.phone}?text=${encodeURIComponent(waText)}`, "_blank");

    setSubmitted(true);
  };

  return (
    <div className="more-clothes-modal-backdrop" onClick={onClose}>
      <div className="more-clothes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="more-clothes-modal-header">
          <div>
            <div className="more-clothes-badge">
              <Sparkles size={12} className="text-amber-400" />
              <span>PRIVATE BOUTIQUE ACCESS</span>
            </div>
            <h3>Request More Clothes & Options</h3>
            <p>Our admin will personally send you exclusive photos and options on WhatsApp.</p>
          </div>
          <button type="button" className="more-clothes-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="more-clothes-modal-body">
          {submitted ? (
            <div className="more-clothes-success-box">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
                <Check size={28} />
              </div>
              <h4>Enquiry Sent to Boutique Admin!</h4>
              <p>
                Thank you <strong>{name}</strong>! Your enquiry has been sent directly to the WOMANIA admin desk.
                Our styling concierge is preparing exclusive photos and will send more options to your WhatsApp (<strong>{phone}</strong>) shortly!
              </p>
              <Button onClick={onClose} variant="hero" className="w-full">
                Continue Browsing
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 mb-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="more-clothes-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Simran Kaur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="more-clothes-field">
                <label>WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 98140XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="more-clothes-field">
                <label>What Clothes / Style Are You Looking For?</label>
                <input
                  type="text"
                  placeholder="e.g. Western Party Wear, Silk Sarees, Shararas, Flared Jeans..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="more-clothes-field">
                <label>Preferred Color or Tone (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Wine, Emerald Green, Lavender, Pastels, Black..."
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                />
              </div>

              <div className="more-clothes-field">
                <label>Any Specific Requirements? (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need for an upcoming reception, size M, full-length silhouette..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="more-clothes-submit-btn">
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>Send Enquiry to Admin & Get Options</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  onRequestMoreClothes,
  initialColor,
}: {
  product: typeof PRODUCT_DATA[0];
  onRequestMoreClothes?: ((product?: typeof PRODUCT_DATA[0]) => void) | undefined;
  initialColor?: string | undefined;
}) {
  const { addToCart, openCheckout, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return product.sizes?.[0] || "Standard";
  });
  const [selectedColour, setSelectedColour] = useState<string>(() => {
    return initialColor || product.colours?.[0] || "";
  });
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (initialColor && product.colours?.includes(initialColor)) {
      setSelectedColour(initialColor);
    }
  }, [initialColor, product.colours]);

  const displayInfo = getDisplayImage(product, selectedColour);

  const handleBuyNow = () => {
    openCheckout(product, selectedSize, selectedColour);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColour);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    openCart();
  };

  return (
    <div className="product-card" key={product.id}>
      <div className="product-image-wrap">
        <img
          src={displayInfo.src}
          alt={`${product.name} in ${selectedColour}`}
          loading="lazy"
        />
        {selectedColour && (
          <div className="product-color-preview-badge">
            <span
              className="color-swatch-dot"
              style={{ backgroundColor: getColorHex(selectedColour) }}
            />
            <span>{selectedColour}</span>
          </div>
        )}
        <div className="product-badge-row">
          <span className="product-cat-tag">{product.subcategory || product.category}</span>
          {product.newArrival && <span className="product-status-tag">✨ NEW EDIT</span>}
        </div>
        <div className="product-quick-overlay">
          <button
            type="button"
            className="product-quick-buy-btn"
            onClick={handleBuyNow}
          >
            <ShoppingBag size={14} />
            <span>Shop Now · 1-Click Buy</span>
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-header-row">
          <h3 className="product-title">{product.name}</h3>
          <span className="product-price">₹{product.price?.toLocaleString("en-IN")}</span>
        </div>
        <p className="product-desc">{product.description}</p>
        
        {/* Color Selection */}
        {product.colours && product.colours.length > 0 && (
          <div className="product-color-select-row">
            <div className="color-label-row">
              <span className="size-label">Select Color:</span>
              <span className="color-active-name">{selectedColour}</span>
            </div>
            <div className="product-colors">
              {product.colours.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-chip-btn ${selectedColour === c ? "active" : ""}`}
                  onClick={() => setSelectedColour(c)}
                  title={`Select ${c}`}
                >
                  <span
                    className="color-swatch-dot"
                    style={{ backgroundColor: getColorHex(c) }}
                  />
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-size-select-row">
            <span className="size-label">Select Size:</span>
            <div className="product-sizes">
              {product.sizes.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`size-chip-btn ${selectedSize === s ? "active" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="product-actions-grid">
          <button
            type="button"
            className="product-buy-now-btn"
            onClick={handleBuyNow}
          >
            <ShoppingBag size={15} />
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            className={`product-add-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? <Check size={15} className="text-emerald-500" /> : <ShoppingBag size={15} />}
            <span>{added ? "In Bag!" : "Add to Bag"}</span>
          </button>
        </div>

        {/* More Clothes Request Button */}
        <div className="product-more-clothes-row">
          <button
            type="button"
            className="product-more-clothes-btn"
            onClick={() => onRequestMoreClothes?.(product)}
          >
            <Sparkles size={12} className="text-amber-500" />
            <span>Want More Clothes / Colors in this style? Request from Admin</span>
          </button>
        </div>

        <div className="product-whatsapp-sub">
          <a
            href={whatsappHref(
              `${product.name}${selectedColour ? ` (Colour: ${selectedColour})` : ""}${selectedSize ? ` (Size: ${selectedSize})` : ""}`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={13} className="text-[#25D366]" />
            <span>Questions? Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function ShopPage() {
  const [selected, setSelected] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [moreClothesModalOpen, setMoreClothesModalOpen] = useState(false);
  const [selectedProductForMore, setSelectedProductForMore] = useState<typeof PRODUCT_DATA[0] | null>(null);

  const visible = PRODUCT_DATA.filter((p) => {
    const matchesCategory = selected === "all" || p.category === selected;
    if (!matchesCategory) return false;

    if (selectedColor === "all") return true;

    const palette = COLOR_PALETTES.find((cp) => cp.id === selectedColor);
    if (!palette || palette.keywords.length === 0) return true;

    const productColours = (p.colours || []).map((c) => c.toLowerCase());
    const productName = (p.name || "").toLowerCase();
    const productDesc = (p.description || "").toLowerCase();

    return palette.keywords.some((kw) =>
      productColours.some((c) => c.includes(kw)) ||
      productName.includes(kw) ||
      productDesc.includes(kw)
    );
  });

  const handleRequestMoreClothes = (p?: typeof PRODUCT_DATA[0]) => {
    setSelectedProductForMore(p || null);
    setMoreClothesModalOpen(true);
  };

  return (
    <>
      <PageTop
        number="01"
        eyebrow="DISCOVER WOMANIA"
        title="THE"
        italic="SHOP."
        description="Explore our handpicked curation of western party wear, tailored power suits, modern Indo-Western silhouettes, luxury handbags, and designer goggles."
      />
      <div className="section-wrap shop-body">
        {/* Category Filters */}
        <div className="lookbook-filter-bar" role="group" aria-label="Filter by collection">
          <button
            className={`lookbook-filter-btn ${selected === "all" ? "active" : ""}`}
            onClick={() => setSelected("all")}
          >
            All Collections ({PRODUCT_DATA.length})
          </button>
          {collections.map((c) => (
            <button
              key={c.id}
              className={`lookbook-filter-btn ${selected === c.id ? "active" : ""}`}
              onClick={() => setSelected(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Color Palette Filter */}
        <div className="shop-color-filter-wrap">
          <div className="shop-color-filter-title">
            <span>Filter Clothes by Color / Select Color:</span>
            {selectedColor !== "all" && (
              <button
                type="button"
                className="shop-color-clear-btn"
                onClick={() => setSelectedColor("all")}
              >
                Reset Color (Show All)
              </button>
            )}
          </div>
          <div className="shop-color-palette-bar" role="group" aria-label="Filter clothes by color">
            {COLOR_PALETTES.map((cp) => (
              <button
                type="button"
                key={cp.id}
                className={`color-filter-btn ${selectedColor === cp.id ? "active" : ""}`}
                onClick={() => setSelectedColor(cp.id)}
              >
                <span
                  className="color-filter-dot"
                  style={{ backgroundColor: cp.hex }}
                />
                <span>{cp.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* More Clothes Banner */}
        <div className="more-clothes-banner">
          <div className="more-clothes-banner-content">
            <div className="more-clothes-badge">
              <Sparkles size={14} className="text-amber-400" />
              <span>EXCLUSIVE BOUTIQUE DESIGNS</span>
            </div>
            <h3>Looking for More Clothes, Colors or Custom Designs?</h3>
            <p>
              Our boutique showroom has hundreds of unlisted party wear dresses, festive sarees, and western outfits.
              Send a quick enquiry and our admin will personally send you exclusive photos and options on WhatsApp!
            </p>
          </div>
          <button
            type="button"
            className="more-clothes-banner-cta"
            onClick={() => handleRequestMoreClothes()}
          >
            <MessageCircle size={16} />
            <span>Request More Clothes & Photos</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="shop-empty-state">
            <p>No outfits found in this exact color and collection combination.</p>
            <button
              type="button"
              className="more-clothes-banner-cta"
              onClick={() => handleRequestMoreClothes()}
            >
              <MessageCircle size={16} />
              <span>Ask Admin for this Color on WhatsApp</span>
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {visible.map((p) => {
              const matchingColour = selectedColor !== "all"
                ? p.colours?.find((c) => {
                    const palette = COLOR_PALETTES.find((cp) => cp.id === selectedColor);
                    return palette?.keywords.some((kw) => c.toLowerCase().includes(kw));
                  })
                : undefined;

              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  initialColor={matchingColour}
                  onRequestMoreClothes={handleRequestMoreClothes}
                />
              );
            })}
          </div>
        )}
      </div>
      <CollectionsPreview />
      <VisitSection />

      {/* More Clothes Enquiry Modal */}
      <MoreClothesModal
        isOpen={moreClothesModalOpen}
        onClose={() => setMoreClothesModalOpen(false)}
        initialProduct={selectedProductForMore}
        initialCategory={selected !== "all" ? collections.find((c) => c.id === selected)?.name : undefined}
      />
    </>
  );
}

export function CollectionsPage() {
  return (
    <>
      <PageTop
        number="02"
        eyebrow="EXPLORE BY STYLE"
        title="THE"
        italic="COLLECTIONS."
        description="A seasonal edit designed for modern women who love contemporary silhouettes, red-carpet cocktail glam, and artisanal Indo-Western fusion."
      />
      <CollectionsPreview />
      <div className="page-cta section-wrap">
        <h2>Looking for a Custom Fit or Styling?</h2>
        <p>Connect with WOMANIA’s styling concierge on WhatsApp to check sizes, live fabric videos, or place custom orders.</p>
        <Button asChild variant="hero" size="editorial">
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} className="text-[#25D366]" />
            <span>Chat With Stylist</span>
            <ArrowUpRight size={18} />
          </a>
        </Button>
      </div>
      <VisitSection />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageTop
        number="03"
        eyebrow="GET TO KNOW US"
        title="THE ESSENCE OF"
        italic="WOMANIA."
        description="Sri Ganganagar’s curated boutique for women’s & girls’ western wear, cocktail couture & signature accents."
      />
      <section className="about-layout section-wrap">
        <div className="about-image-wrap">
          <img
            src={chicCouture}
            alt="Fashion model in contemporary couture outfit at WOMANIA boutique"
            width={1000}
            height={1500}
            loading="lazy"
          />
          <div className="about-image-tag">BOUTIQUE ATELIER · SRI GANGANAGAR</div>
        </div>
        <div>
          <Eyebrow>OUR PHILOSOPHY</Eyebrow>
          <h2>Where Style Meets <em>Self-Expression.</em></h2>
          <p>
            At WOMANIA, we believe that fashion isn’t just about clothing — it’s an extension of your confidence. Located on Radheshyam Kothi Road in Sri Ganganagar, our boutique brings hand-curated western fashion, runway-inspired party dresses, contemporary Indo-Western suits, and designer accessories together under one roof.
          </p>
          <p>
            Every piece is selected for premium fabric feel, flattering cuts, and effortless glamour. Whether you need a head-turning gown for an upcoming celebration or chic everyday essentials, we’re here to help you find that perfect silhouette.
          </p>
          <p className="about-address-note">
            📍 Visit us in-store: 6-L Block, Radheshyam Kothi Road, Sri Ganganagar
          </p>
          <div className="about-actions">
            <TextArrow to="/contact">Visit The Store</TextArrow>
          </div>
        </div>
      </section>
      <VisitSection />
    </>
  );
}

export function GalleryPage() {
  const galleryItems = [
    { src: introModern, title: "01 / Pure Ivory Belted Wide-Leg Jumpsuit", span: "span-6" },
    { src: heroAesthetic, title: "02 / The Royal Emerald & Gold Draped Gown", span: "span-6" },
    { src: wideLegJeans, title: "03 / The Palazzo Vintage Wide-Leg Denim", span: "span-6" },
    { src: corsetTop, title: "04 / Sculpted Emerald Satin Boned Corset", span: "span-6" },
    { src: flareJeans, title: "05 / Riviera High-Rise Bootcut Flare Denim", span: "span-4" },
    { src: silkSuit, title: "06 / Icy Mint Chikankari Sharara Suit Set", span: "span-4" },
    { src: palazzoSuit, title: "07 / Royal Purple & Gold Zari Silk Saree", span: "span-4" },
    { src: blazerDress, title: "08 / Off-Shoulder White Top & Striped Wide-Leg Set", span: "span-4" },
    { src: satinDress, title: "09 / Plum Off-Shoulder Bandage Evening Gown", span: "span-4" },
    { src: cargoJeans, title: "10 / Pop-Art Patch Embroidered Boyfriend Jeans", span: "span-4" },
    { src: organzaTop, title: "11 / Midnight Black Ribbed Mock-Neck Top", span: "span-4" },
    { src: ribbedTop, title: "12 / Sunshine Yellow Cropped Hoodie & Joggers Set", span: "span-4" },
    { src: western, title: "13 / Tailored Midnight Power Blazer & Pants", span: "span-4" },
    { src: bag, title: "14 / Sienna Calfskin Leather Satchel", span: "span-4" },
    { src: sunglasses, title: "15 / Riviera Amber Cat-Eye Goggles", span: "span-4" },
    { src: blackQuiltedBag, title: "16 / Noir Quilted Crossbody Chain Bag", span: "span-4" },
    { src: goldenClutch, title: "17 / Golden Hour Evening Minaudière", span: "span-4" },
    { src: milanSquare, title: "18 / Milan Oversized Square Sunglasses", span: "span-4" },
    { src: goldAviators, title: "19 / Venetian Gold Wire Aviators", span: "span-4" },
    { src: indo, title: "20 / Olive Flora Bustier & Cape Set", span: "span-6" },
    { src: suits, title: "21 / Artisanal Duster & Charcoal Suit", span: "span-6" },
    { src: chicCouture, title: "22 / Blush Pink Polka-Dot Ruffled Organza Dress", span: "span-12" },
  ];

  return (
    <>
      <PageTop
        number="04"
        eyebrow="A VISUAL JOURNEY"
        title="THE"
        italic="GALLERY."
        description="Immerse yourself in WOMANIA’s curated visual lookbook — showcasing modern western dresses, cocktail gowns, artisanal capes, and handcrafted luxury accents."
      />
      <section className="gallery-grid section-wrap">
        {galleryItems.map((item, idx) => (
          <div key={idx} className={`gallery-item ${item.span}`}>
            <img src={item.src} alt={item.title} loading="lazy" />
            <div className="gallery-caption">
              <span>{item.title}</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
        ))}
      </section>
      <InstagramSection />
      <VisitSection />
    </>
  );
}

export function ReviewsPage() {
  return (
    <>
      <PageTop
        number="05"
        eyebrow="CUSTOMER VOICES"
        title="WHAT THEY"
        italic="SAY."
        description={`Read genuine customer feedback from shoppers in Sri Ganganagar. Over ${business.reviewCount}+ reviews with a ${business.rating} / 5 rating.`}
      />
      <section className="reviews-full-section section-wrap">
        <div className="reviews-full-grid">
          {customerReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div className="review-stars">
                  {"★".repeat(review.rating)}
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">“{review.comment}”</p>
              <div className="review-author">
                <div className="author-avatar">{review.name.charAt(0)}</div>
                <div>
                  <h4 className="author-name">{review.name}</h4>
                  <p className="author-location">
                    {review.location} {review.verified && <span className="verified-badge">✓ Verified Buyer</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <VisitSection/>
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageTop
        number="06"
        eyebrow="GET IN TOUCH"
        title="LET’S FIND YOUR"
        italic="NEXT LOOK."
        description="Have questions about a style, sizing, trials, or custom orders? Reach out to our Sri Ganganagar boutique styling desk."
      />
      <section className="contact-grid section-wrap">
        <div className="contact-card">
          <div>
            <div className="contact-card-icon">
              <MessageCircle size={26} className="text-[#25D366]" />
            </div>
            <span className="contact-card-tag">01 / FASTEST RESPONSE</span>
            <h2>WhatsApp Concierge</h2>
            <p>Connect instantly with our in-store stylist for size assistance, live video trials, and direct ordering.</p>
          </div>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
            <span>Chat on WhatsApp</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="contact-card">
          <div>
            <div className="contact-card-icon">
              <MapPin size={26} className="text-[#b8925c]" />
            </div>
            <span className="contact-card-tag">02 / VISIT ATELIER</span>
            <h2>Flagship Store</h2>
            <p>{business.address}</p>
          </div>
          <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
            <span>Get Directions</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="contact-card">
          <div>
            <div className="contact-card-icon">
              <Phone size={26} className="text-[#b8925c]" />
            </div>
            <span className="contact-card-tag">03 / CALL US</span>
            <h2>Direct Phone</h2>
            <p>Call our boutique desk during operating hours (11:00 AM – 9:00 PM) for inquiries and appointments.</p>
          </div>
          <a href={phoneHref} className="contact-card-btn">
            <span>Call 098777 92387</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <div className="contact-call section-wrap">
        <div className="contact-call-left">
          <span>✨ Operating Hours: Monday to Sunday · 11:00 AM – 9:00 PM</span>
        </div>
        <a href={phoneHref}>
          <Phone size={16} />
          <span>Call Desk: 098777 92387</span>
        </a>
      </div>
      <ContactInquiryForm />
      <VisitSection />
    </>
  );
}

export function ContactInquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [productInterest, setProductInterest] = useState("General Boutique Styling");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (errorMsg) setErrorMsg("");
  };

  const handleNameChange = (val: string) => {
    const cleaned = val.replace(/[^a-zA-Z\s.'-]/g, "");
    setName(cleaned);
    if (errorMsg) setErrorMsg("");
  };

  const isPhoneValid = /^[6-9]\d{9}$/.test(phone);
  const isNameValid = name.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid) {
      setErrorMsg("Please enter your full name (at least 3 characters).");
      return;
    }
    if (!isPhoneValid) {
      if (phone.length === 0) {
        setErrorMsg("Please enter your 10-digit mobile number.");
      } else if (!["6", "7", "8", "9"].includes(phone.charAt(0))) {
        setErrorMsg("Indian mobile numbers must start with 6, 7, 8, or 9.");
      } else {
        setErrorMsg(`Mobile number must be exactly 10 digits (${phone.length}/10 entered).`);
      }
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Please enter your question or styling enquiry.");
      return;
    }

    saveEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      productInterest,
    });

    setIsSubmitted(true);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setErrorMsg("");
  };

  return (
    <section className="contact-form-section section-wrap">
      <div className="contact-form-box">
        <div className="contact-form-header">
          <Eyebrow>DIRECT CONCIERGE DESK</Eyebrow>
          <h2>SEND AN ENQUIRY<br/><em>TO OUR STYLIST.</em></h2>
          <p>
            Have a question about a gown, trial, power suit, or custom sizing? Send your message below. Our in-store team will review your enquiry in our Admin desk and contact you on WhatsApp.
          </p>
        </div>

        {errorMsg && (
          <div className="checkout-validation-banner">
            <AlertCircle size={18} className="shrink-0 text-amber-400" />
            <div>
              <strong>Please Check Input:</strong>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {isSubmitted ? (
          <div className="contact-success-alert">
            <Check size={28} className="text-emerald-500" />
            <div>
              <h4>ENQUIRY SUBMITTED SUCCESSFULLY!</h4>
              <p>Thank you for reaching out to WOMANIA. Our Sri Ganganagar stylist will connect with you shortly.</p>
              <button type="button" onClick={() => setIsSubmitted(false)} className="btn-send-another">Send Another Message</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-inquiry-form">
            <div className="form-row-2">
              <div className="form-field">
                <div className="field-label-row">
                  <label>Your Full Name *</label>
                  {name.length > 0 && (
                    <span className={`field-status-tag ${isNameValid ? "valid" : "error"}`}>
                      {isNameValid ? "✓ Valid" : "Min 3 Letters"}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Jaspreet Kaur"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <div className="field-label-row">
                  <label>WhatsApp / Phone Number *</label>
                  <span className={`field-counter-badge ${isPhoneValid ? "valid" : phone.length > 0 ? "partial" : ""}`}>
                    {phone.length}/10 Digits
                  </span>
                </div>
                <div className="phone-input-group">
                  <div className="phone-prefix-pill">
                    <span className="phone-flag">🇮🇳</span>
                    <span className="phone-code">+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="phone-input-field"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label>Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Outfit / Collection of Interest</label>
                <select
                  value={productInterest}
                  onChange={(e) => setProductInterest(e.target.value)}
                  className="contact-select"
                >
                  <option value="General Boutique Styling">General Boutique Styling</option>
                  <option value="Party & Evening Couture Gowns">Party & Evening Couture Gowns</option>
                  <option value="Tailored Power Suits & Blazers">Tailored Power Suits & Blazers</option>
                  <option value="Indo-Western Fusion Outfits">Indo-Western Fusion Outfits</option>
                  <option value="Designer Handbags & Clutches">Designer Handbags & Clutches</option>
                  <option value="Luxury Goggles & Eyewear">Luxury Goggles & Eyewear</option>
                  <option value="Custom Size / Urgent Dispatch">Custom Size / Urgent Dispatch</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Your Question or Enquiry *</label>
              <textarea
                rows={3}
                placeholder="Ask about size availability, trials, colors, or styling..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              <MessageCircle size={17} />
              <span>Submit Enquiry to Stylist</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function FAQPage() {
  return (
    <>
      <PageTop
        number="07"
        eyebrow="HELP & ASSISTANCE"
        title="FREQUENTLY"
        italic="ASKED."
        description="Everything you need to know about shopping with WOMANIA — in-store visits, sizing, custom orders, and worldwide delivery."
      />
      <div className="faq-list section-wrap">
        <details className="faq-item" open>
          <summary>
            <span>Where is WOMANIA located?</span>
            <ArrowUpRight size={18} />
          </summary>
          <p>
            Our flagship boutique is located at <strong>{business.address}</strong>. We welcome you to visit us in person for fitting sessions and to experience our complete collection.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <span>How do I place an order online or enquire about a product?</span>
            <ArrowUpRight size={18} />
          </summary>
          <p>
            You can enquire directly via WhatsApp! Tap the <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp Us</a> button on any piece. Our styling team will confirm your size, share live videos if needed, and assist you with seamless payment and dispatch.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <span>Do you offer custom alterations or size customization?</span>
            <ArrowUpRight size={18} />
          </summary>
          <p>
            Yes! For cocktail couture and Indo-Western outfits, we provide personalized fitting guidance and alterations to ensure the silhouette sits flawlessly on you.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <span>Do you ship across India and internationally?</span>
            <ArrowUpRight size={18} />
          </summary>
          <p>
            Yes, we provide worldwide shipping. All outfits and accessories are carefully packaged in luxury protective packaging, and real-time courier tracking is provided directly to you on WhatsApp.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <span>What are the boutique operating hours?</span>
            <ArrowUpRight size={18} />
          </summary>
          <p>
            Our Sri Ganganagar boutique is open daily from <strong>11:00 AM to 9:00 PM</strong>, Monday through Sunday.
          </p>
        </details>
      </div>
      <VisitSection />
    </>
  );
}

export function PoliciesPage() {
  return (
    <>
      <PageTop
        number="08"
        eyebrow="CUSTOMER ASSURANCE"
        title="STORE"
        italic="POLICIES."
        description="Our commitment to delivering an exceptional luxury shopping experience with transparency and care."
      />
      <section className="policy-content section-wrap">
        <h2>Boutique Shopping & Order Guidelines</h2>
        <p>
          At WOMANIA, every outfit and accessory is handpicked and thoroughly quality-checked before reaching you. Here is everything you need to know about shopping with us:
        </p>

        <div className="policy-grid">
          <div className="policy-card">
            <h3 className="policy-card-title"><span>👗</span> In-Store Trials & Fitting</h3>
            <p>
              Visit our boutique at 6-L Block, Radheshyam Kothi Road, Sri Ganganagar for dedicated trial room sessions and personalized styling assistance.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title"><span>✈️</span> Worldwide Doorstep Shipping</h3>
            <p>
              We safely dispatch orders domestically and internationally using trusted courier partners. Tracking numbers are shared immediately upon dispatch.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title"><span>📹</span> Live Video Assistance</h3>
            <p>
              Need to inspect fabric drape or fine embroidery before purchasing? Our boutique team is happy to connect via WhatsApp video call.
            </p>
          </div>

          <div className="policy-card">
            <h3 className="policy-card-title"><span>✨</span> Pre-Dispatch Sizing Guarantee</h3>
            <p>
              To ensure you receive the exact right fit, our stylists cross-check your measurements prior to courier handover.
            </p>
          </div>
        </div>

        <div className="policy-action-row">
          <Button asChild variant="hero" size="editorial">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} className="text-[#25D366]" />
              <span>Ask a Policy Question</span>
              <ArrowUpRight size={18} />
            </a>
          </Button>
          <Button asChild variant="outline" size="editorial">
            <a href={directionsHref} target="_blank" rel="noopener noreferrer">
              <span>Visit The Boutique</span>
              <ArrowUpRight size={18} />
            </a>
          </Button>
        </div>
      </section>
      <VisitSection />
    </>
  );
}