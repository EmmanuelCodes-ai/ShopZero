"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { useAuth } from "../../context/auth-context";

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
    title: "Wireless Noise-Cancelling Over-Ear Headphones Pro",
    category: "Electronics",
    price: 48900,
    priceStr: "₦48,900",
    wasPrice: 65000,
    wasStr: "₦65,000",
    img: "/products/headphones.jpg",
    qty: 1,
    inStock: true,
    discount: "25% OFF",
    seller: "Aura Official Store",
  },
  {
    id: "C-02",
    title: "Everyday Air Fryer 5L Digital Touchscreen with 8 Presets",
    category: "Home & Living",
    price: 59500,
    priceStr: "₦59,500",
    wasPrice: 72000,
    wasStr: "₦72,000",
    img: "/products/airfryer.jpg",
    qty: 1,
    inStock: true,
    discount: "17% OFF",
    seller: "AeroFry Nigeria",
  },
  {
    id: "C-03",
    title: "Le Voyage Premium Italian Leather Handbag (Caramel Tan)",
    category: "Fashion",
    price: 28750,
    priceStr: "₦28,750",
    wasPrice: 39000,
    wasStr: "₦39,000",
    img: "/products/bag.jpg",
    qty: 2,
    inStock: true,
    discount: "26% OFF",
    seller: "Le Voyage Official",
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
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SHOPZERO10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try SHOPZERO10.");
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
      <main className="cart-page">
        {/* Header */}
        <div className="cart-page-header">
          <div className="cart-header-inner">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <strong>Shopping Cart</strong>
            </nav>
            <h1>Shopping Cart <span className="cart-count-badge">{items.reduce((s, i) => s + i.qty, 0)}</span></h1>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="cart-empty">
            <span>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Start shopping!</p>
            <a href="/" className="cart-checkout-btn">Start Shopping</a>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Left: Items */}
            <div className="cart-items-col">
              {/* Free delivery banner */}
              {subtotal < FREE_DELIVERY_THRESHOLD && (
                <div className="cart-delivery-banner">
                  🚚 Add{" "}
                  <strong>{formatNaira(FREE_DELIVERY_THRESHOLD - subtotal)}</strong>{" "}
                  more to get <strong>FREE delivery</strong>!
                  <div className="cart-delivery-progress">
                    <div
                      className="cart-delivery-fill"
                      style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {subtotal >= FREE_DELIVERY_THRESHOLD && (
                <div className="cart-delivery-banner free">
                  🎉 You qualify for <strong>FREE delivery</strong>!
                </div>
              )}

              <div className="cart-items-list">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className={`cart-item ${removedId === item.id ? "removing" : ""}`}
                  >
                    <div className="cart-item-img-wrap">
                      <img src={item.img} alt={item.title} />
                      <span className="cart-item-discount-badge">{item.discount}</span>
                    </div>

                    <div className="cart-item-details">
                      <span className="cart-item-category">{item.category}</span>
                      <h3>{item.title}</h3>
                      <span className="cart-item-seller">Sold by: {item.seller}</span>

                      <div className="cart-item-bottom">
                        <div className="cart-price-group">
                          <strong>{formatNaira(item.price * item.qty)}</strong>
                          {item.qty > 1 && (
                            <small>{item.priceStr} each</small>
                          )}
                          <del>{item.wasStr}</del>
                        </div>

                        <div className="cart-item-controls">
                          <div className="cart-qty-control">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                            >−</button>
                            <span>{item.qty}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQty(item.id, 1)}
                            >+</button>
                          </div>
                          <button
                            className="cart-remove-btn"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Continue shopping */}
              <a href="/" className="cart-continue-link">← Continue Shopping</a>
            </div>

            {/* Right: Summary */}
            <aside className="cart-summary-col">
              <div className="cart-summary-card">
                <h2>Order Summary</h2>

                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <strong>{formatNaira(subtotal)}</strong>
                  </div>
                  <div className="cart-summary-row">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <strong className="cart-free-tag">FREE</strong>
                    ) : (
                      <strong>{formatNaira(deliveryFee)}</strong>
                    )}
                  </div>
                  {couponApplied && (
                    <div className="cart-summary-row discount-row">
                      <span>Coupon Discount (10%)</span>
                      <strong>−{formatNaira(discount)}</strong>
                    </div>
                  )}
                  <div className="cart-summary-divider" />
                  <div className="cart-summary-row total-row">
                    <span>Total</span>
                    <strong>{formatNaira(total)}</strong>
                  </div>
                </div>

                {/* Coupon */}
                <div className="cart-coupon-section">
                  <label htmlFor="coupon-input">Have a coupon?</label>
                  <div className="cart-coupon-row">
                    <input
                      id="coupon-input"
                      type="text"
                      placeholder="Enter code (e.g. SHOPZERO10)"
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                      disabled={couponApplied}
                    />
                    <button
                      className="cart-coupon-btn"
                      onClick={applyCoupon}
                      disabled={couponApplied || !coupon.trim()}
                    >
                      {couponApplied ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="cart-coupon-error">{couponError}</p>}
                  {couponApplied && <p className="cart-coupon-success">✓ Coupon applied — 10% off!</p>}
                </div>

                <button className="cart-checkout-btn" onClick={handleCheckout}>
                  {user ? "Proceed to Checkout" : "Sign In to Checkout"}
                </button>

                <div className="cart-trust-badges">
                  <span>🔒 Secure Checkout</span>
                  <span>↩ 7-Day Returns</span>
                  <span>✅ 100% Genuine</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
