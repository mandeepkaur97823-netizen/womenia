import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  MessageCircle,
  Printer,
  X,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useCart, type OrderRecord, type OrderStatus } from "@/lib/cart";
import { business, whatsappHref } from "@/lib/womania";
import { StylishGirlIcon } from "@/components/Site";

export function OrderTrackerContent({ initialQuery }: { initialQuery?: string }) {
  const { getOrdersByQuery, getOrdersByQueryAsync, cancelOrder, recentOrder, pastOrders } = useCart();
  const [searchInput, setSearchInput] = useState(initialQuery || (recentOrder ? recentOrder.orderId : ""));
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(recentOrder || null);
  const [matchedOrders, setMatchedOrders] = useState<OrderRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState("");

  // Sync initial query or recent order
  useEffect(() => {
    if (initialQuery) {
      setSearchInput(initialQuery);
      handleSearch(initialQuery);
    } else if (recentOrder) {
      setActiveOrder(recentOrder);
      setSearchInput(recentOrder.orderId);
      setHasSearched(true);
    }
  }, [initialQuery, recentOrder]);

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : searchInput;
    if (!q.trim()) {
      setActiveOrder(null);
      setMatchedOrders([]);
      setHasSearched(false);
      return;
    }

    // 1. Instant local search
    const localResults = getOrdersByQuery(q);
    setMatchedOrders(localResults);
    setHasSearched(true);
    if (localResults.length > 0) {
      setActiveOrder(localResults[0] || null);
    }

    // 2. Query Supabase cloud to find orders placed on any customer device
    if (getOrdersByQueryAsync) {
      try {
        const fullResults = await getOrdersByQueryAsync(q);
        if (fullResults && fullResults.length > 0) {
          setMatchedOrders(fullResults);
          if (!activeOrder || !fullResults.some((r) => r.orderId === activeOrder.orderId)) {
            setActiveOrder(fullResults[0] || null);
          }
        }
      } catch {
        // keep local results
      }
    }
  };

  const handleClientCancelOrder = (orderId: string) => {
    const reason = cancelReasonInput.trim() || "Cancelled by customer";
    const success = cancelOrder(orderId, reason);
    if (success) {
      setActionNotice("Your order has been successfully cancelled.");
      setConfirmCancelOpen(false);
      setCancelReasonInput("");
      // Refresh active order
      setTimeout(() => {
        handleSearch(searchInput);
      }, 100);
    }
  };

  return (
    <div className="order-tracker-wrap">
      {/* Search Header */}
      <div className="tracker-search-section">
        <div className="tracker-title-box">
          <span className="tracker-eyebrow">ONLINE ORDER STATUS & TRACKING</span>
          <h2>TRACK YOUR ORDER<br /><em>LIVE STATUS & PROGRESS</em></h2>
          <p>
            Track whether your order is <strong>Confirmed</strong>, <strong>In Progress</strong>, <strong>Dispatched</strong>, <strong>Delivered</strong>, or <strong>Cancelled</strong>.
            Enter your 10-digit mobile number or Order ID below.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="tracker-search-form"
        >
          <div className="tracker-input-box">
            <Search size={18} className="tracker-search-icon" />
            <input
              type="text"
              placeholder="Enter 10-digit phone or Order ID (e.g. WOM-8492 / 9876543210)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="tracker-search-btn">
            <span>Check Status</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Action Notice */}
        {actionNotice && (
          <div className="tracker-action-banner">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Recent orders quick chips */}
        {pastOrders.length > 0 && (
          <div className="tracker-quick-chips">
            <span className="quick-label">Recent Orders:</span>
            <div className="quick-chips-list">
              {pastOrders.slice(0, 3).map((ord) => (
                <button
                  key={ord.orderId}
                  type="button"
                  className={`quick-chip ${activeOrder?.orderId === ord.orderId ? "active" : ""}`}
                  onClick={() => {
                    setSearchInput(ord.orderId);
                    setActiveOrder(ord);
                    setHasSearched(true);
                  }}
                >
                  <span className="chip-id">{ord.orderId}</span>
                  <span className={`chip-st status-${ord.status.toLowerCase()}`}>
                    ● {ord.status === "Confirmed" ? "Done (Confirmed)" : ord.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Multiple Matching Orders Selector */}
      {matchedOrders.length > 1 && (
        <div className="tracker-matches-list">
          <h4>Found {matchedOrders.length} order(s) for your mobile number:</h4>
          <div className="matches-grid">
            {matchedOrders.map((ord) => (
              <div
                key={ord.orderId}
                onClick={() => setActiveOrder(ord)}
                className={`match-card ${activeOrder?.orderId === ord.orderId ? "selected" : ""}`}
              >
                <div className="match-card-top">
                  <strong>{ord.orderId}</strong>
                  <span className={`status-pill pill-${ord.status.toLowerCase()}`}>
                    {ord.status === "Confirmed" ? "✓ Done (Confirmed)" : ord.status === "Cancelled" ? "❌ Cancelled" : ord.status}
                  </span>
                </div>
                <p className="match-card-date">{ord.date}</p>
                <p className="match-card-total">₹{ord.total.toLocaleString("en-IN")} · {ord.items.length} designs</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Order Details View */}
      {activeOrder ? (
        <div className="tracker-result-card">
          {/* BIG STATUS HERO BANNER */}
          <div className={`status-hero-banner status-${activeOrder.status.toLowerCase()}`}>
            <div className="status-hero-left">
              {activeOrder.status === "Confirmed" && (
                <>
                  <div className="status-hero-icon icon-confirmed">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <span className="status-hero-tag">ORDER STATUS: DONE & CONFIRMED</span>
                    <h3>Order Confirmed (Done ✓)</h3>
                    <p>Your order has been received and confirmed. The boutique team is preparing your package.</p>
                  </div>
                </>
              )}

              {activeOrder.status === "Processing" && (
                <>
                  <div className="status-hero-icon icon-processing">
                    <Clock size={32} />
                  </div>
                  <div>
                    <span className="status-hero-tag">ORDER STATUS: IN PROGRESS</span>
                    <h3>Outfit In Tailoring & Quality Check</h3>
                    <p>Our artisans are finishing your garments and conducting meticulous quality checks.</p>
                  </div>
                </>
              )}

              {activeOrder.status === "Dispatched" && (
                <>
                  <div className="status-hero-icon icon-dispatched">
                    <Truck size={32} />
                  </div>
                  <div>
                    <span className="status-hero-tag">ORDER STATUS: ON THE WAY</span>
                    <h3>Parcel Dispatched 🚚</h3>
                    <p>Your parcel has been handed over to express courier. Expected delivery in 2-4 business days.</p>
                  </div>
                </>
              )}

              {activeOrder.status === "Delivered" && (
                <>
                  <div className="status-hero-icon icon-delivered">
                    <PackageCheck size={32} />
                  </div>
                  <div>
                    <span className="status-hero-tag">ORDER STATUS: COMPLETED & DONE</span>
                    <h3>Order Delivered (Done ✓)</h3>
                    <p>Your parcel has been successfully delivered. Thank you for choosing WOMANIA!</p>
                  </div>
                </>
              )}

              {activeOrder.status === "Cancelled" && (
                <>
                  <div className="status-hero-icon icon-cancelled">
                    <XCircle size={32} />
                  </div>
                  <div>
                    <span className="status-hero-tag">ORDER STATUS: CANCELLED</span>
                    <h3>This Order Has Been Cancelled</h3>
                    <p>
                      {activeOrder.cancellationReason
                        ? `Cancellation Reason: "${activeOrder.cancellationReason}"`
                        : "This order was cancelled by the boutique or customer."}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="status-hero-meta">
              <div className="hero-order-id">
                <span>ORDER ID</span>
                <strong>{activeOrder.orderId}</strong>
              </div>
              <div className="hero-order-date">
                <span>Booking Date</span>
                <p>{activeOrder.date}</p>
              </div>
            </div>
          </div>

          {/* STEPPER PROGRESS BAR (If not cancelled) */}
          {activeOrder.status !== "Cancelled" ? (
            <div className="tracker-stepper">
              <div className="stepper-step completed">
                <div className="step-circle">✓</div>
                <span>1. Order Placed</span>
                <p>Details Recorded</p>
              </div>
              <div className={`stepper-line ${activeOrder.status !== "Confirmed" || activeOrder.status === "Confirmed" ? "active" : ""}`} />

              <div className={`stepper-step ${activeOrder.status !== "Confirmed" || activeOrder.status === "Confirmed" ? "completed" : ""}`}>
                <div className="step-circle">✓</div>
                <span>2. Confirmed (Done)</span>
                <p>Approved by Boutique</p>
              </div>
              <div className={`stepper-line ${activeOrder.status === "Dispatched" || activeOrder.status === "Delivered" ? "active" : ""}`} />

              <div className={`stepper-step ${activeOrder.status === "Dispatched" || activeOrder.status === "Delivered" ? "completed" : ""}`}>
                <div className="step-circle">{activeOrder.status === "Dispatched" || activeOrder.status === "Delivered" ? "✓" : "3"}</div>
                <span>3. Dispatched</span>
                <p>Courier On The Way</p>
              </div>
              <div className={`stepper-line ${activeOrder.status === "Delivered" ? "active" : ""}`} />

              <div className={`stepper-step ${activeOrder.status === "Delivered" ? "completed" : ""}`}>
                <div className="step-circle">{activeOrder.status === "Delivered" ? "✓" : "4"}</div>
                <span>4. Delivered (Done)</span>
                <p>Parcel Delivered</p>
              </div>
            </div>
          ) : (
            <div className="cancelled-alert-box">
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <div>
                <h4>Notice: This order is no longer active</h4>
                <p>
                  If you have already made payment or have queries regarding refunds, please chat with our stylist on WhatsApp.
                  You can browse our collection and place a new order anytime.
                </p>
              </div>
            </div>
          )}

          {/* ORDER DETAILS GRID */}
          <div className="tracker-details-grid">
            {/* Left: Items list */}
            <div className="tracker-items-box">
              <h4>Ordered Items ({activeOrder.items.length} {activeOrder.items.length === 1 ? "design" : "designs"})</h4>
              <div className="tracker-items-list">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="tracker-item-row">
                    <div className="tracker-item-info">
                      <strong>{it.name}</strong>
                      <span className="tracker-item-sub">
                        Size: <em>{it.size}</em>
                        {it.colour ? ` | Colour: ${it.colour}` : ""}
                        {` | Quantity: ${it.quantity}`}
                      </span>
                    </div>
                    <div className="tracker-item-price">
                      ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="tracker-total-row">
                <span>Grand Total</span>
                <strong>₹{activeOrder.total.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {/* Right: Customer & Delivery Address */}
            <div className="tracker-destination-box">
              <h4>Customer & Delivery Details</h4>
              <div className="dest-meta-block">
                <span className="dest-label">Customer Name:</span>
                <strong>{activeOrder.customerName}</strong>
              </div>
              <div className="dest-meta-block">
                <span className="dest-label">Phone Number:</span>
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-[#b8925c]" />
                  <span>+91 {activeOrder.phone}</span>
                </p>
              </div>
              <div className="dest-meta-block">
                <span className="dest-label">Delivery Address:</span>
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#b8925c] shrink-0 mt-1" />
                  <span>
                    {activeOrder.address}, {activeOrder.city}, {activeOrder.state} - <strong>{activeOrder.pinCode}</strong>
                  </span>
                </p>
              </div>
              <div className="dest-meta-block">
                <span className="dest-label">Payment Method:</span>
                <span className="dest-pay-tag">
                  {activeOrder.paymentMethod === "upi"
                    ? "UPI (09877792387@okaxis)"
                    : activeOrder.paymentMethod === "whatsapp"
                      ? "WhatsApp Payment Link"
                      : "Bank Transfer"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS & CLIENT SELF-CANCELLATION */}
          <div className="tracker-bottom-actions">
            {/* Client Cancellation Option (If active and not yet dispatched) */}
            {activeOrder.status !== "Cancelled" && activeOrder.status !== "Dispatched" && activeOrder.status !== "Delivered" && (
              <div className="client-cancel-box">
                {!confirmCancelOpen ? (
                  <button
                    type="button"
                    onClick={() => setConfirmCancelOpen(true)}
                    className="btn-request-cancel"
                  >
                    <XCircle size={15} />
                    <span>Cancel This Order</span>
                  </button>
                ) : (
                  <div className="cancel-confirm-dialog">
                    <h5>Are you sure you want to cancel this order?</h5>
                    <input
                      type="text"
                      placeholder="Reason for cancellation (e.g. wrong size selected)"
                      value={cancelReasonInput}
                      onChange={(e) => setCancelReasonInput(e.target.value)}
                    />
                    <div className="confirm-buttons">
                      <button
                        type="button"
                        onClick={() => handleClientCancelOrder(activeOrder.orderId)}
                        className="btn-confirm-cancel"
                      >
                        Yes, Cancel Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmCancelOpen(false)}
                        className="btn-abort-cancel"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="tracker-utility-buttons">
              <a
                href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(
                  `Hi WOMANIA! I want to check my Order #${activeOrder.orderId} (Status: ${activeOrder.status}). Customer Name: ${activeOrder.customerName}, Phone: ${activeOrder.phone}. Please help!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tracker-whatsapp"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>Ask Stylist on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="btn-tracker-print"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="tracker-not-found">
          <AlertCircle size={44} className="text-amber-400" />
          <h3>No Orders Found</h3>
          <p>
            No order records found matching "{searchInput}". Please verify your 10-digit mobile number or Order ID (e.g. WMN-2026-XXXX).
          </p>
          <div className="flex gap-3 justify-center mt-3">
            <Link to="/shop" className="btn-go-shop">
              <ShoppingBag size={15} />
              <span>Shop Boutique</span>
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-help-wa">
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>Help on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function OrderTrackerModal() {
  const { isTrackerOpen, closeTracker, trackerQuery } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTracker();
    };
    if (isTrackerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTrackerOpen, closeTracker]);

  if (!isTrackerOpen) return null;

  return (
    <div className="checkout-backdrop" onClick={closeTracker}>
      <div
        className="checkout-dialog tracker-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="checkout-header">
          <div className="checkout-header-brand">
            <StylishGirlIcon size={28} />
            <div>
              <h3>WOMANIA ATELIER</h3>
              <span>Live Order Tracker · Done & Cancelled Status</span>
            </div>
          </div>
          <button
            className="checkout-close-btn"
            onClick={closeTracker}
            aria-label="Close order tracker"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tracker-modal-body">
          <OrderTrackerContent initialQuery={trackerQuery} />
        </div>
      </div>
    </div>
  );
}
