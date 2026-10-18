import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  Truck,
  CreditCard,
  QrCode,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Printer,
  AlertCircle,
  Phone,
  MapPin,
  User,
  Mail,
  Building,
  Hash,
  Clock,
} from "lucide-react";
import { useCart, type OrderRecord } from "@/lib/cart";
import { getProductImage } from "@/lib/images";
import { business, whatsappHref } from "@/lib/womania";
import { StylishGirlIcon } from "@/components/Site";

const INDIAN_STATES = [
  "Rajasthan",
  "Punjab",
  "Haryana",
  "Delhi (NCR)",
  "Chandigarh",
  "Himachal Pradesh",
  "Uttar Pradesh",
  "Gujarat",
  "Maharashtra",
  "Jammu & Kashmir",
  "Uttarakhand",
  "Madhya Pradesh",
  "West Bengal",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "Kerala",
  "Bihar",
  "Andhra Pradesh",
  "Assam",
  "Goa",
  "Jharkhand",
  "Odisha",
  "Chhattisgarh",
  "Other State / UT",
];

export function CheckoutModal() {
  const {
    cart,
    cartTotal,
    isCheckoutOpen,
    closeCheckout,
    directCheckoutItem,
    recentOrder,
    placeOrder,
    clearRecentOrder,
    openTracker,
    cancelOrder,
  } = useCart();

  const [cancelPrompt, setCancelPrompt] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Rajasthan");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "whatsapp" | "bank_transfer">("upi");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Field touch/dirty states for validation
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
    city: false,
    pinCode: false,
  });
  const [formSubmittedAttempt, setFormSubmittedAttempt] = useState(false);
  const [validationAlert, setValidationAlert] = useState("");

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Live Input Sanitizers - strictly prevent typing alphabet/gibberish where numeric is required
  const handlePhoneChange = (val: string) => {
    // Only accept numeric digits, up to 10 characters
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (validationAlert) setValidationAlert("");
  };

  const handlePinChange = (val: string) => {
    // Only accept numeric digits, up to 6 characters
    const digits = val.replace(/\D/g, "").slice(0, 6);
    setPinCode(digits);
    if (validationAlert) setValidationAlert("");
  };

  const handleNameChange = (val: string) => {
    // Allow letters, spaces, dots, and hyphens only
    const cleaned = val.replace(/[^a-zA-Z\s.'-]/g, "");
    setName(cleaned);
    if (validationAlert) setValidationAlert("");
  };

  const handleCityChange = (val: string) => {
    const cleaned = val.replace(/[^a-zA-Z\s.'-]/g, "");
    setCity(cleaned);
    if (validationAlert) setValidationAlert("");
  };

  // Accurate Validation Rules
  const isNameValid = name.trim().length >= 3;
  // Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9
  const isPhoneValid = /^[6-9]\d{9}$/.test(phone);
  // Indian PIN codes must be exactly 6 numeric digits
  const isPinValid = /^\d{6}$/.test(pinCode);
  const isAddressValid = address.trim().length >= 10;
  const isCityValid = city.trim().length >= 2;
  const isEmailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isFormValid = isNameValid && isPhoneValid && isPinValid && isAddressValid && isCityValid && isEmailValid;

  // Close on Escape & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCheckout();
    };
    if (isCheckoutOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCheckoutOpen, closeCheckout]);

  if (!isCheckoutOpen) return null;

  const itemsToCheckout = directCheckoutItem ? [directCheckoutItem] : cart;
  const currentTotal = itemsToCheckout.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmittedAttempt(true);
    setTouched({
      name: true,
      phone: true,
      email: true,
      address: true,
      city: true,
      pinCode: true,
    });

    if (!isNameValid) {
      setValidationAlert("Please enter a valid full name (min 3 characters).");
      return;
    }

    if (!isPhoneValid) {
      if (phone.length === 0) {
        setValidationAlert("Please enter your 10-digit mobile number.");
      } else if (!["6", "7", "8", "9"].includes(phone.charAt(0))) {
        setValidationAlert("Indian mobile numbers must start with 6, 7, 8, or 9.");
      } else {
        setValidationAlert(`Mobile number must be exactly 10 digits (${phone.length}/10 entered).`);
      }
      return;
    }

    if (!isAddressValid) {
      setValidationAlert("Please enter complete delivery address (min 10 characters).");
      return;
    }

    if (!isCityValid) {
      setValidationAlert("Please enter a valid city name.");
      return;
    }

    if (!isPinValid) {
      setValidationAlert("Please enter a valid 6-digit postal PIN code.");
      return;
    }

    if (!isEmailValid) {
      setValidationAlert("Please enter a valid email address.");
      return;
    }

    setValidationAlert("");
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state,
        pinCode: pinCode.trim(),
        paymentMethod,
        notes: notes.trim(),
      });
      setIsSubmitting(false);
    }, 600);
  };

  // WhatsApp Order Confirmation Generator
  const generateWhatsAppMessage = (order: OrderRecord) => {
    let msg = `🛍️ *NEW ONLINE ORDER BOOKING - WOMANIA*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Order ID:* ${order.orderId}\n`;
    msg += `*Date:* ${order.date}\n`;
    msg += `*Customer:* ${order.customerName}\n`;
    msg += `*Phone:* ${order.phone}\n`;
    if (order.email) msg += `*Email:* ${order.email}\n`;
    msg += `\n*Delivery Address:*\n${order.address}, ${order.city}, ${order.state} - ${order.pinCode}\n\n`;
    msg += `*Ordered Items:*\n`;
    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name}\n   Size: ${item.size}${item.colour ? ` | Colour: ${item.colour}` : ""} | Qty: ${item.quantity} | ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
    });
    msg += `\n*Total Amount:* ₹${order.total.toLocaleString("en-IN")}\n`;
    msg += `*Payment Option:* ${order.paymentMethod === "upi" ? "UPI / Online Prepaid" : order.paymentMethod === "whatsapp" ? "WhatsApp Payment Link" : "Bank Transfer"}\n`;
    if (order.notes) msg += `*Special Notes:* ${order.notes}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Please confirm my order booking and dispatch timeline. Thank you!`;
    return encodeURIComponent(msg);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="checkout-backdrop" onClick={closeCheckout}>
      <div
        className="checkout-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="checkout-header">
          <div className="checkout-header-brand">
            <StylishGirlIcon size={28} />
            <div>
              <h3>WOMANIA</h3>
              <span>Online Order Booking Portal</span>
            </div>
          </div>
          <button
            className="checkout-close-btn"
            onClick={closeCheckout}
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="checkout-body">
          {recentOrder ? (
            /* =========================================
               ORDER CONFIRMATION / SUCCESS VIEW
               ========================================= */
            <div className="order-success-view">
              <div className="order-success-badge">
                <CheckCircle2 size={46} className="text-emerald-500" />
                <h2>ORDER BOOKED SUCCESSFULLY!</h2>
                <p>Thank you for choosing WOMANIA. Your online booking has been recorded.</p>
              </div>

              <div className="order-id-card">
                <span className="order-id-label">OFFICIAL BOOKING ID</span>
                <div className="order-id-val">
                  <strong>{recentOrder.orderId}</strong>
                  <button
                    onClick={() => copyToClipboard(recentOrder.orderId, setCopiedOrderId)}
                    title="Copy Order ID"
                    className="copy-btn"
                  >
                    {copiedOrderId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedOrderId ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <span className="order-status-pill">● Status: {recentOrder.status}</span>
              </div>

              {/* Order Details Grid */}
              <div className="order-summary-grid">
                <div className="order-summary-block">
                  <h5>Customer Details</h5>
                  <p><strong>{recentOrder.customerName}</strong></p>
                  <p>Phone: {recentOrder.phone}</p>
                  {recentOrder.email && <p>Email: {recentOrder.email}</p>}
                </div>
                <div className="order-summary-block">
                  <h5>Delivery Destination</h5>
                  <p>{recentOrder.address}</p>
                  <p>{recentOrder.city}, {recentOrder.state} - {recentOrder.pinCode}</p>
                  <p className="text-xs text-amber-700 mt-1">🚚 Express Tracked Delivery (3-5 Days)</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="order-items-table">
                <h5>Booked Items ({recentOrder.items.length})</h5>
                {recentOrder.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <div>
                      <strong>{item.name}</strong>
                      <span>Size: {item.size} {item.colour ? `· ${item.colour}` : ""} · Qty: {item.quantity}</span>
                    </div>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="order-item-total">
                  <span>Grand Total (All Inclusive)</span>
                  <strong>₹{recentOrder.total.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              {/* UPI Verification Note */}
              {recentOrder.paymentMethod === "upi" && (
                <div className="order-upi-note">
                  <div className="order-upi-top">
                    <QrCode size={18} className="text-[#b8925c]" />
                    <span>Pay via UPI / GPay / PhonePe / Paytm</span>
                  </div>
                  <p>Official WOMANIA Store UPI ID:</p>
                  <div className="order-upi-code">
                    <code>09877792387@okaxis</code>
                    <button
                      onClick={() => copyToClipboard("09877792387@okaxis", setCopiedUpi)}
                      className="copy-btn"
                    >
                      {copiedUpi ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedUpi ? "Copied" : "Copy UPI"}</span>
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    Please send payment screenshot on WhatsApp with your Order ID for instant dispatch confirmation.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="order-success-actions">
                {recentOrder.status === "Cancelled" ? (
                  <div className="order-cancelled-notice-box">
                    <AlertCircle size={20} className="text-red-400 shrink-0" />
                    <div>
                      <strong>This order has been cancelled</strong>
                      <p>{recentOrder.cancellationReason || "Cancelled by client/store"}</p>
                    </div>
                  </div>
                ) : null}

                <a
                  href={`https://wa.me/91${business.whatsapp}?text=${generateWhatsAppMessage(recentOrder)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-whatsapp-btn"
                >
                  <MessageCircle size={18} className="text-[#25D366]" />
                  <span>Send Order to WhatsApp (Instant Confirmation)</span>
                  <ExternalLink size={15} />
                </a>

                {/* Track Order Live Button */}
                <button
                  type="button"
                  onClick={() => {
                    const id = recentOrder.orderId;
                    closeCheckout();
                    openTracker(id);
                  }}
                  className="order-track-live-btn"
                >
                  <Clock size={16} className="text-[#b8925c]" />
                  <span>Track Order Live</span>
                  <ArrowRight size={15} />
                </button>

                {/* Cancel Order Option if still active */}
                {recentOrder.status !== "Cancelled" && (
                  <div className="order-quick-cancel-wrap">
                    {!cancelPrompt ? (
                      <button
                        type="button"
                        onClick={() => setCancelPrompt(true)}
                        className="btn-text-cancel-order"
                      >
                        Cancel this order?
                      </button>
                    ) : (
                      <div className="quick-cancel-confirm">
                        <span>Are you sure you want to cancel this order?</span>
                        <div className="flex gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              cancelOrder(recentOrder.orderId, "Customer cancelled after placing");
                              setCancelPrompt(false);
                            }}
                            className="btn-danger-confirm-cancel"
                          >
                            Yes, Cancel Order
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancelPrompt(false)}
                            className="btn-cancel-abort"
                          >
                            Keep Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="order-sub-actions">
                  <button onClick={handlePrint} className="order-print-btn">
                    <Printer size={15} />
                    <span>Print / Save Receipt</span>
                  </button>
                  <button
                    onClick={() => {
                      clearRecentOrder();
                      closeCheckout();
                    }}
                    className="order-done-btn"
                  >
                    <span>Back to Boutique</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================
               CHECKOUT BOOKING FORM
               ========================================= */
            <form onSubmit={handleOrderSubmit} className="checkout-form">
              <div className="checkout-columns">
                {/* Left Column: Delivery & Customer Details */}
                <div className="checkout-left">
                  <div className="checkout-section-header">
                    <span className="checkout-step-num">1</span>
                    <div>
                      <h4>Customer & Delivery Details</h4>
                      <p>Where should we deliver your luxury parcel? (Please provide accurate details)</p>
                    </div>
                  </div>

                  {validationAlert && (
                    <div className="checkout-validation-banner">
                      <AlertCircle size={18} className="shrink-0 text-amber-400" />
                      <div>
                        <strong>Please Check:</strong>
                        <p>{validationAlert}</p>
                      </div>
                    </div>
                  )}

                  <div className="form-group-grid">
                    {/* Full Name */}
                    <div className={`form-field ${touched.name ? (isNameValid ? "is-valid" : "has-error") : ""}`}>
                      <div className="field-label-row">
                        <label htmlFor="chk-name">
                          <User size={13} className="field-label-icon" />
                          <span>Full Name *</span>
                        </label>
                        {touched.name && (
                          <span className={`field-status-tag ${isNameValid ? "valid" : "error"}`}>
                            {isNameValid ? "✓ Valid" : "Min 3 Letters"}
                          </span>
                        )}
                      </div>
                      <input
                        id="chk-name"
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => markTouched("name")}
                        className={touched.name ? (isNameValid ? "input-valid" : "input-error") : ""}
                        required
                        autoComplete="name"
                      />
                      {touched.name && !isNameValid && (
                        <span className="field-hint-error">
                          <AlertCircle size={12} />
                          <span>Please enter full name (min 3 characters)</span>
                        </span>
                      )}
                    </div>

                    {/* Accurate 10-digit Phone */}
                    <div className={`form-field ${touched.phone ? (isPhoneValid ? "is-valid" : "has-error") : ""}`}>
                      <div className="field-label-row">
                        <label htmlFor="chk-phone">
                          <Phone size={13} className="field-label-icon" />
                          <span>WhatsApp / Phone Number *</span>
                        </label>
                        <span className={`field-counter-badge ${isPhoneValid ? "valid" : phone.length > 0 ? "partial" : ""}`}>
                          {phone.length}/10 digits
                        </span>
                      </div>
                      <div className="phone-input-group">
                        <div className="phone-prefix-pill">
                          <span className="phone-flag">🇮🇳</span>
                          <span className="phone-code">+91</span>
                        </div>
                        <input
                          id="chk-phone"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          onBlur={() => markTouched("phone")}
                          className={`phone-input-field ${touched.phone ? (isPhoneValid ? "input-valid" : "input-error") : ""}`}
                          required
                          autoComplete="tel-national"
                        />
                      </div>
                      {touched.phone && !isPhoneValid ? (
                        <span className="field-hint-error">
                          <AlertCircle size={12} />
                          <span>
                            {phone.length === 0
                              ? "10-digit mobile number is required"
                              : !["6", "7", "8", "9"].includes(phone.charAt(0))
                                ? "Indian mobile numbers must start with 6, 7, 8, or 9"
                                : `${10 - phone.length} digits remaining (${phone.length}/10)`}
                          </span>
                        </span>
                      ) : isPhoneValid ? (
                        <span className="field-hint-success">
                          <Check size={12} />
                          <span>Valid 10-digit mobile number (WhatsApp updates enabled)</span>
                        </span>
                      ) : (
                        <span className="field-hint-sub">Enter accurate 10-digit mobile number</span>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`form-field ${touched.email && email.trim() ? (isEmailValid ? "is-valid" : "has-error") : ""}`}>
                    <div className="field-label-row">
                      <label htmlFor="chk-email">
                        <Mail size={13} className="field-label-icon" />
                        <span>Email Address (Optional)</span>
                      </label>
                      <span className="field-optional-badge">For invoice & tracking</span>
                    </div>
                    <input
                      id="chk-email"
                      type="email"
                      placeholder="e.g. yourname@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationAlert) setValidationAlert("");
                      }}
                      onBlur={() => markTouched("email")}
                      className={touched.email && email.trim() ? (isEmailValid ? "input-valid" : "input-error") : ""}
                    />
                    {touched.email && email.trim() && !isEmailValid && (
                      <span className="field-hint-error">
                        <AlertCircle size={12} />
                        <span>Please enter a valid email format (e.g. name@gmail.com)</span>
                      </span>
                    )}
                  </div>

                  {/* Complete Street Address */}
                  <div className={`form-field ${touched.address ? (isAddressValid ? "is-valid" : "has-error") : ""}`}>
                    <div className="field-label-row">
                      <label htmlFor="chk-address">
                        <MapPin size={13} className="field-label-icon" />
                        <span>Complete Street Address *</span>
                      </label>
                      <span className={`field-counter-badge ${isAddressValid ? "valid" : address.length > 0 ? "partial" : ""}`}>
                        {address.length} characters (min 10)
                      </span>
                    </div>
                    <textarea
                      id="chk-address"
                      rows={2}
                      placeholder="House/Flat No., Street, Sector/Colony, Landmark (e.g. House No. 24, Near Sukhadia Circle)"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (validationAlert) setValidationAlert("");
                      }}
                      onBlur={() => markTouched("address")}
                      className={touched.address ? (isAddressValid ? "input-valid" : "input-error") : ""}
                      required
                    />
                    {touched.address && !isAddressValid ? (
                      <span className="field-hint-error">
                        <AlertCircle size={12} />
                        <span>Enter complete address with house number, street & landmark (min 10 characters)</span>
                      </span>
                    ) : (
                      <span className="field-hint-sub">Complete address required for accurate delivery</span>
                    )}
                  </div>

                  {/* City, State, PIN Code */}
                  <div className="form-group-tri">
                    <div className={`form-field ${touched.city ? (isCityValid ? "is-valid" : "has-error") : ""}`}>
                      <div className="field-label-row">
                        <label htmlFor="chk-city">
                          <Building size={12} className="field-label-icon" />
                          <span>City *</span>
                        </label>
                      </div>
                      <input
                        id="chk-city"
                        type="text"
                        placeholder="e.g. Sri Ganganagar"
                        value={city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        onBlur={() => markTouched("city")}
                        className={touched.city ? (isCityValid ? "input-valid" : "input-error") : ""}
                        required
                      />
                      {touched.city && !isCityValid && (
                        <span className="field-hint-error">
                          <AlertCircle size={11} />
                          <span>Please enter city name</span>
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <div className="field-label-row">
                        <label htmlFor="chk-state">State *</label>
                      </div>
                      <select
                        id="chk-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-select-state"
                        required
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={`form-field ${touched.pinCode ? (isPinValid ? "is-valid" : "has-error") : ""}`}>
                      <div className="field-label-row">
                        <label htmlFor="chk-pin">
                          <Hash size={12} className="field-label-icon" />
                          <span>PIN Code *</span>
                        </label>
                        <span className={`field-counter-badge ${isPinValid ? "valid" : pinCode.length > 0 ? "partial" : ""}`}>
                          {pinCode.length}/6
                        </span>
                      </div>
                      <input
                        id="chk-pin"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="e.g. 335001"
                        value={pinCode}
                        onChange={(e) => handlePinChange(e.target.value)}
                        onBlur={() => markTouched("pinCode")}
                        className={touched.pinCode ? (isPinValid ? "input-valid" : "input-error") : ""}
                        required
                      />
                      {touched.pinCode && !isPinValid ? (
                        <span className="field-hint-error">
                          <AlertCircle size={11} />
                          <span>
                            {pinCode.length === 0
                              ? "6-digit PIN code is required"
                              : `PIN code must be 6 digits (${pinCode.length}/6)`}
                          </span>
                        </span>
                      ) : isPinValid ? (
                        <span className="field-hint-success">
                          <Check size={11} />
                          <span>Valid PIN Code</span>
                        </span>
                      ) : (
                        <span className="field-hint-sub">6 digits (numbers only)</span>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="chk-notes">Special Instructions (Optional)</label>
                    <input
                      id="chk-notes"
                      type="text"
                      placeholder="e.g. Custom size request, gift packaging, urgent dispatch"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="checkout-section-header mt-6">
                    <span className="checkout-step-num">2</span>
                    <div>
                      <h4>Select Payment & Confirmation Method</h4>
                      <p>Secure online payment options (Prepaid only per store policy)</p>
                    </div>
                  </div>

                  <div className="payment-options">
                    <label className={`payment-option-card ${paymentMethod === "upi" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-top">
                          <strong>Instant UPI / QR / Net Banking</strong>
                          <span className="payment-badge">RECOMMENDED</span>
                        </div>
                        <p>GPay, PhonePe, Paytm, or BHIM UPI directly to store ID.</p>
                      </div>
                    </label>

                    <label className={`payment-option-card ${paymentMethod === "whatsapp" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={paymentMethod === "whatsapp"}
                        onChange={() => setPaymentMethod("whatsapp")}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-top">
                          <strong>WhatsApp Order Booking & Payment Link</strong>
                        </div>
                        <p>Book online now; our stylist verifies stock & sends direct payment link on WhatsApp.</p>
                      </div>
                    </label>

                    <label className={`payment-option-card ${paymentMethod === "bank_transfer" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => setPaymentMethod("bank_transfer")}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-top">
                          <strong>Direct Bank IMPS / NEFT Transfer</strong>
                        </div>
                        <p>Direct electronic bank transfer to WOMANIA boutique business account.</p>
                      </div>
                    </label>
                  </div>

                  {/* Policy Alert Banner */}
                  <div className="checkout-policy-banner">
                    <ShieldCheck size={16} className="text-[#b8925c] shrink-0" />
                    <span>
                      <strong>Official Store Policy:</strong> All dispatched online orders are prepaid with express tracked delivery. No Cash on Delivery (COD).
                    </span>
                  </div>
                </div>

                {/* Right Column: Order Review & Total */}
                <div className="checkout-right">
                  <div className="order-review-box">
                    <h4>Order Summary ({itemsToCheckout.length} {itemsToCheckout.length === 1 ? "design" : "designs"})</h4>

                    <div className="checkout-items-preview">
                      {itemsToCheckout.map((item) => {
                        const img = getProductImage(item.product.images[0]);
                        return (
                          <div key={item.itemKey} className="checkout-mini-item">
                            <img src={img} alt={item.product.name} />
                            <div className="checkout-mini-info">
                              <h5>{item.product.name}</h5>
                              <span className="checkout-mini-meta">
                                Size: {item.selectedSize} {item.selectedColour ? `· ${item.selectedColour}` : ""} · Qty: {item.quantity}
                              </span>
                              <strong className="checkout-mini-price">
                                ₹{((item.product.price || 0) * item.quantity).toLocaleString("en-IN")}
                              </strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="checkout-cost-breakdown">
                      <div className="cost-row">
                        <span>Items Subtotal</span>
                        <span>₹{currentTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="cost-row">
                        <span>Express Courier Delivery</span>
                        <span className="text-emerald-700 font-bold">FREE</span>
                      </div>
                      <div className="cost-row grand-total">
                        <strong>Grand Total</strong>
                        <strong>₹{currentTotal.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    {/* Buyer Validation Status Card */}
                    <div className={`checkout-validation-status-box ${isFormValid ? "all-valid" : "needs-info"}`}>
                      {isFormValid ? (
                        <div className="status-box-content text-emerald-400">
                          <CheckCircle2 size={16} className="shrink-0" />
                          <span>All Buyer Details Verified ✓</span>
                        </div>
                      ) : (
                        <div className="status-box-content text-amber-300">
                          <AlertCircle size={16} className="shrink-0" />
                          <span>
                            {formSubmittedAttempt
                              ? "Details are incomplete. Please check highlighted fields."
                              : "Please enter buyer name, valid 10-digit mobile number, and address"}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || itemsToCheckout.length === 0}
                      className={`checkout-submit-btn ${isFormValid ? "btn-ready" : "btn-pending"}`}
                    >
                      {isSubmitting ? (
                        <span>Processing Order Booking...</span>
                      ) : (
                        <>
                          <span>Confirm & Book Order · ₹{currentTotal.toLocaleString("en-IN")}</span>
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>

                    <div className="checkout-guarantees">
                      <div className="guarantee-item">
                        <Truck size={14} className="text-[#b8925c]" />
                        <span>Dispatched from Sri Ganganagar within 24-48 hrs</span>
                      </div>
                      <div className="guarantee-item">
                        <ShieldCheck size={14} className="text-[#b8925c]" />
                        <span>100% Genuine Designer Boutique Couture</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
