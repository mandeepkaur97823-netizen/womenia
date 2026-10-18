import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getProductImage } from "@/lib/images";
import { business, whatsappHref } from "@/lib/womania";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    itemCount,
    openCheckout,
  } = useCart();

  // Escape key to close drawer and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  // Generate WhatsApp cart text for alternative quick ordering
  const whatsappCartText = () => {
    let msg = `Hi WOMANIA! I would like to book an order for the following items from your website:\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}*\n   Size: ${item.selectedSize}${item.selectedColour ? ` | Colour: ${item.selectedColour}` : ""}\n   Qty: ${item.quantity} × ₹${item.product.price?.toLocaleString("en-IN")}\n\n`;
    });
    msg += `*Subtotal:* ₹${cartTotal.toLocaleString("en-IN")}\n*Shipping:* Worldwide Free\n\nPlease let me know the payment details and dispatch schedule. Thank you!`;
    return encodeURIComponent(msg);
  };

  const whatsappCartUrl = `https://wa.me/91${business.whatsapp}?text=${whatsappCartText()}`;

  return (
    <div className="cart-backdrop" onClick={closeCart}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} className="text-[#b8925c]" />
            <h3>SHOPPING BAG</h3>
            <span className="cart-badge-count">{itemCount}</span>
          </div>
          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="cart-perk-bar">
          <Truck size={15} className="text-[#b8925c] shrink-0" />
          <span>Complimentary Express Shipping Across India & Worldwide</span>
        </div>

        {/* Drawer Body / Items List */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={42} strokeWidth={1.2} />
              </div>
              <h4>Your Shopping Bag is Empty</h4>
              <p>Discover our party couture, power blazers, and luxury accessories.</p>
              <Link
                to="/shop"
                className="cart-explore-btn"
                onClick={closeCart}
              >
                <span>Explore Boutique Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => {
                const img = getProductImage(item.product.images[0]);
                const itemSubtotal = (item.product.price || 0) * item.quantity;

                return (
                  <div key={item.itemKey} className="cart-item">
                    <div className="cart-item-image">
                      <img src={img} alt={item.product.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <span className="cart-item-cat">
                          {item.product.subcategory || item.product.category}
                        </span>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.itemKey)}
                          title="Remove item"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h5 className="cart-item-name">{item.product.name}</h5>

                      <div className="cart-item-specs">
                        <span className="cart-spec-pill">Size: {item.selectedSize}</span>
                        {item.selectedColour && (
                          <span className="cart-spec-pill">{item.selectedColour}</span>
                        )}
                      </div>

                      <div className="cart-item-price-row">
                        <div className="cart-qty-controls">
                          <button
                            onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="cart-item-subtotal">
                          ₹{itemSubtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer with Actions */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="cart-total-row">
                <span>Express Shipping</span>
                <span className="text-emerald-700 font-semibold uppercase text-xs">FREE</span>
              </div>
              <div className="cart-total-row cart-grand-total">
                <strong>Grand Total</strong>
                <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="cart-actions">
              <button
                className="cart-checkout-btn"
                onClick={() => openCheckout()}
              >
                <span>Book Order Online (Checkout)</span>
                <ArrowRight size={17} />
              </button>

              <a
                href={whatsappCartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cart-whatsapp-alt-btn"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>Instant Order via WhatsApp</span>
              </a>
            </div>

            <div className="cart-trust-notes">
              <div className="cart-trust-item">
                <ShieldCheck size={14} className="text-[#b8925c]" />
                <span>100% Authentic WOMANIA Boutique Stock · Hand-inspected</span>
              </div>
              <span className="cart-policy-note">
                Prepaid dispatch within 24-48 hrs with tracked courier. No COD.
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
