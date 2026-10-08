"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { useAuth } from "../../context/auth-context";
import { IconShield, IconTruck, IconReturn, IconBadge } from "../../components/icons";

interface CartItem {
  id: string;
  title: string;
  category: string;
  price: number;
  priceStr: string;
  wasPrice: number;
  wasStr: string;
  img: string;
  qty: number;
  inStock: boolean;
  discount: string;
  seller: string;
}

const INITIAL_CART: CartItem[] = [
  {
    id: "C-01",
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Pro",
    category: "Electronics",
    price: 48900,
    priceStr: "₦48,900",
    wasPrice: 65000,
    wasStr: "₦65,000",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    qty: 1,
    inStock: true,
    discount: "25% OFF",
    seller: "Aura Official Store",
  },
  {
    id: "C-02",
    title: "Digital Touchscreen Air Fryer 5.5L with 8 Fast Presets",
    category: "Home & Kitchen",
    price: 59500,
    priceStr: "₦59,500",
    wasPrice: 72000,
    wasStr: "₦72,000",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    qty: 1,
    inStock: true,
    discount: "17% OFF",
    seller: "AeroFry Nigeria",
  },
  {
    id: "C-03",
    title: "Le Voyage Handcrafted Italian Leather Crossbody Bag",
    category: "Fashion & Style",
    price: 28750,
    priceStr: "₦28,750",
    wasPrice: 39000,
    wasStr: "₦39,000",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    qty: 2,
    inStock: true,
    discount: "26% OFF",
    seller: "Le Voyage Lagos",
  },
];

const DELIVERY_FEE = 3500;
const FREE_DELIVERY_THRESHOLD = 50000;

function formatNaira(amount: number) {
  return "₦" + amount.toLocaleString();
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [loading, setLoading] = useState(true);
  const [removedId, setRemovedId] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        const url = user?.id ? `/api/cart?userId=${user.id}` : "/api/cart";
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (err) {
        console.error("Failed to load backend cart, using initial items", err);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [user]);

  const updateQty = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
    );

    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId: id, quantity: newQty }),
      });
    } catch {
      // Ignored
    }
  };

  const removeItem = async (id: string) => {
    setRemovedId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemovedId(null);
    }, 300);

    try {
      await fetch(`/api/cart?lineId=${id}`, { method: "DELETE" });
    } catch {
      // Ignored
    }
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const totalItemCount = useMemo(
    () => items.reduce((s, i) => s + i.qty, 0),
    [items]
  );
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SHOPZERO10" || coupon.trim().toUpperCase() === "WELCOME2K") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try WELCOME2K or SHOPZERO10.");
      setCouponApplied(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="cart-page-container">
        {/* Breadcrumb & Header */}
        <div className="cart-page-hero-bar">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <strong>Shopping Cart</strong>
          </nav>
          <div className="cart-title-row">
            <h1>
              Review Your Cart
              <span className="cart-count-pill">{totalItemCount} Items</span>
            </h1>
            <span className="escrow-safe-badge">
              <IconShield size={16} /> 100% Escrow Protected Checkout
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="cart-empty-state-card">
            <div className="empty-cart-icon-wrap">🛒</div>
            <h2>Your shopping cart is currently empty</h2>
            <p>Explore today&apos;s flash deals and top verified Nigerian stores.</p>
            <a href="/" className="empty-cart-cta-btn">
              ⚡ Start Shopping Deals Now
            </a>
          </div>
        ) : (
          <div className="cart-main-grid">
            {/* Left Column: Cart Items List */}
            <div className="cart-items-column">
              {/* Free Delivery Tracker */}
              <div className={`delivery-tracker-banner ${subtotal >= FREE_DELIVERY_THRESHOLD ? "unlocked" : ""}`}>
                {subtotal < FREE_DELIVERY_THRESHOLD ? (
                  <>
                    <div className="tracker-text-row">
                      <span>🚚 Add <strong>{formatNaira(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> more to unlock <strong>FREE Express Delivery</strong>!</span>
                      <strong className="threshold-tag">{Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%</strong>
                    </div>
                    <div className="delivery-progress-track">
                      <div
                        className="delivery-progress-fill"
                        style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="unlocked-text-flex">
                    <span className="confetti-emoji">🎉</span>
                    <span><strong>Congratulations!</strong> You&apos;ve unlocked <strong>FREE Express Delivery</strong> to your doorstep.</span>
                  </div>
                )}
              </div>

              {/* Items Card */}
              <div className="cart-items-wrapper">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className={`luxury-cart-item ${removedId === item.id ? "fade-out-removing" : ""}`}
                  >
                    <div className="cart-thumb-box">
                      <img src={item.img} alt={item.title} />
                      <span className="thumb-discount-tag">{item.discount}</span>
                    </div>

                    <div className="cart-item-info">
                      <div className="item-meta-top">
                        <span className="item-category-pill">{item.category}</span>
                        <span className="item-seller-pill">🛡️ {item.seller}</span>
                      </div>

                      <h3 className="item-title">{item.title}</h3>

                      <div className="item-bottom-controls-row">
                        <div className="item-price-stack">
                          <strong className="item-main-price">{formatNaira(item.price * item.qty)}</strong>
                          <div className="item-price-subtext">
                            {item.qty > 1 && <span className="unit-price">{item.priceStr} each</span>}
                            <del className="item-was-price">{item.wasStr}</del>
                          </div>
                        </div>

                        <div className="item-actions-cluster">
                          <div className="luxury-qty-stepper">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                              type="button"
                            >
                              −
                            </button>
                            <span className="qty-number">{item.qty}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQty(item.id, 1)}
                              type="button"
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="item-remove-trigger-btn"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                            type="button"
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Footer row underneath items */}
              <div className="cart-items-footer-nav">
                <a href="/" className="continue-shopping-anchor">
                  ← Continue Shopping
                </a>
                <span className="cart-verified-security-text">
                  🔒 Bank-grade 256-bit encryption on all orders
                </span>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <aside className="cart-summary-sidebar">
              <div className="luxury-order-summary-card">
                <h2 className="summary-card-title">Order Summary</h2>

                <div className="summary-rows-stack">
                  <div className="summary-row">
                    <span className="row-label">Subtotal ({totalItemCount} items)</span>
                    <span className="row-val">{formatNaira(subtotal)}</span>
                  </div>

                  <div className="summary-row">
                    <span className="row-label">Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="free-delivery-pill">FREE</span>
                    ) : (
                      <span className="row-val">{formatNaira(deliveryFee)}</span>
                    )}
                  </div>

                  {couponApplied && (
                    <div className="summary-row discount-applied-row">
                      <span className="row-label">Coupon Discount (10%)</span>
                      <span className="row-val discount-val">−{formatNaira(discount)}</span>
                    </div>
                  )}

                  <div className="summary-divider-line" />

                  <div className="summary-row total-highlight-row">
                    <span className="total-label">Grand Total</span>
                    <div className="total-price-stack">
                      <strong className="total-amount">{formatNaira(total)}</strong>
                      <small className="vat-included-sub">VAT &amp; Escrow included</small>
                    </div>
                  </div>
                </div>

                {/* Coupon Input Area */}
                <div className="summary-coupon-box">
                  <label htmlFor="cart-coupon-input" className="coupon-box-label">
                    Have a promo voucher?
                  </label>
                  <div className="coupon-input-group">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      placeholder="e.g. WELCOME2K"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setCouponError("");
                      }}
                      disabled={couponApplied}
                    />
                    <button
                      className={`coupon-apply-btn ${couponApplied ? "applied" : ""}`}
                      onClick={applyCoupon}
                      disabled={couponApplied || !coupon.trim()}
                      type="button"
                    >
                      {couponApplied ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="coupon-feedback-error">⚠️ {couponError}</p>}
                  {couponApplied && <p className="coupon-feedback-success">🎉 Voucher applied successfully!</p>}
                </div>

                {/* Checkout CTA */}
                <button
                  className="primary-checkout-btn"
                  onClick={handleCheckout}
                  type="button"
                >
                  <span>{user ? "Proceed to Secure Checkout →" : "Sign In to Checkout →"}</span>
                </button>

                {/* Trust Badges in Summary */}
                <div className="summary-trust-badges-grid">
                  <div className="summary-trust-item">
                    <IconShield size={18} />
                    <span>Escrow Protected</span>
                  </div>
                  <div className="summary-trust-item">
                    <IconReturn size={18} />
                    <span>7-Day Easy Returns</span>
                  </div>
                  <div className="summary-trust-item">
                    <IconBadge size={18} />
                    <span>100% Genuine</span>
                  </div>
                  <div className="summary-trust-item">
                    <IconTruck size={18} />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ── Luxury Footer ── */}
      <footer className="luxury-footer">
        <div className="footer-inner-grid">
          <div className="footer-brand-column">
            <a href="/" className="footer-brand-logo">
              Shop<span>Zero</span>
            </a>
            <p className="footer-tagline-text">
              Nigeria&apos;s most trusted escrow marketplace. Every order is
              protected — pay only when you&apos;re satisfied.
            </p>
            <div className="footer-badges-list">
              <span className="payment-chip">🔒 Escrow</span>
              <span className="payment-chip">📦 Fast Delivery</span>
              <span className="payment-chip">↩ Easy Returns</span>
            </div>
          </div>

          <div className="footer-links-column">
            <h4>Shop</h4>
            <a href="/c/electronics">Electronics</a>
            <a href="/c/fashion">Fashion</a>
            <a href="/c/home-kitchen">Home &amp; Kitchen</a>
            <a href="/deals">Today&apos;s Deals</a>
            <a href="/search">Browse All</a>
          </div>

          <div className="footer-links-column">
            <h4>Account</h4>
            <a href="/account">My Profile</a>
            <a href="/orders">My Orders</a>
            <a href="/wishlist">Wishlist</a>
            <a href="/cart">Shopping Cart</a>
          </div>

          <div className="footer-links-column">
            <h4>Help</h4>
            <a href="#">Buyer Protection</a>
            <a href="#">How Escrow Works</a>
            <a href="#">Track My Order</a>
            <a href="#">Return Policy</a>
            <a href="#">Contact Support</a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-content">
            <span>© {new Date().getFullYear()} ShopZero Technologies Ltd. All rights reserved.</span>
            <span className="footer-tagline">🔒 256-bit SSL · Escrow Protected · CBN Compliant</span>
          </div>
        </div>
      </footer>
    </>
  );
}
