"use client";

import { useState, useEffect, useMemo } from "react";
import { SiteHeader } from "../../components/site-header";
import { IconHeart, IconShield } from "../../components/icons";

interface DealProduct {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  price: number;
  wasPrice: number;
  priceStr: string;
  wasStr: string;
  rating: string;
  reviews: number;
  discount: string;
  discountPct: number;
  img: string;
  endsIn: string; // "Today" | "2h" | "5h" etc
  sold: number;   // units sold (for progress bar)
  total: number;  // total stock
}

const deals: DealProduct[] = [
  {
    id: "D-01",
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Pro",
    category: "electronics",
    categoryLabel: "Electronics",
    price: 48900,
    wasPrice: 65000,
    priceStr: "₦48,900",
    wasStr: "₦65,000",
    rating: "4.9",
    reviews: 312,
    discount: "25% OFF",
    discountPct: 25,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    endsIn: "Today",
    sold: 78,
    total: 100,
  },
  {
    id: "D-02",
    title: "Samsung 43-inch Crystal UHD 4K Smart TV with Voice Remote",
    category: "electronics",
    categoryLabel: "Electronics",
    price: 235000,
    wasPrice: 280000,
    priceStr: "₦235,000",
    wasStr: "₦280,000",
    rating: "4.8",
    reviews: 98,
    discount: "16% OFF",
    discountPct: 16,
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    endsIn: "Today",
    sold: 42,
    total: 60,
  },
  {
    id: "D-03",
    title: "Everyday Air Fryer 5L Digital Touchscreen with 8 Presets",
    category: "home-living",
    categoryLabel: "Home & Living",
    price: 59500,
    wasPrice: 72000,
    priceStr: "₦59,500",
    wasStr: "₦72,000",
    rating: "4.6",
    reviews: 441,
    discount: "17% OFF",
    discountPct: 17,
    img: "/products/airfryer.jpg",
    endsIn: "Today",
    sold: 55,
    total: 80,
  },
  {
    id: "D-04",
    title: "Men's Classic Lightweight Running Sneakers (White & Orange)",
    category: "fashion",
    categoryLabel: "Fashion",
    price: 32990,
    wasPrice: 45000,
    priceStr: "₦32,990",
    wasStr: "₦45,000",
    rating: "4.4",
    reviews: 187,
    discount: "27% OFF",
    discountPct: 27,
    img: "/products/sneakers.jpg",
    endsIn: "Today",
    sold: 90,
    total: 120,
  },
  {
    id: "D-05",
    title: "Zenith Pro 5G Smartphone 256GB / 8GB RAM",
    category: "phones-tablets",
    categoryLabel: "Phones & Tablets",
    price: 185000,
    wasPrice: 220000,
    priceStr: "₦185,000",
    wasStr: "₦220,000",
    rating: "4.8",
    reviews: 523,
    discount: "16% OFF",
    discountPct: 16,
    img: "/products/phone.jpg",
    endsIn: "Today",
    sold: 130,
    total: 200,
  },
  {
    id: "D-06",
    title: "Velociti High-Speed Kitchen Blender 1500W Ice Crusher",
    category: "home-living",
    categoryLabel: "Home & Living",
    price: 41500,
    wasPrice: 55000,
    priceStr: "₦41,500",
    wasStr: "₦55,000",
    rating: "4.6",
    reviews: 278,
    discount: "25% OFF",
    discountPct: 25,
    img: "/products/blender.jpg",
    endsIn: "Today",
    sold: 63,
    total: 90,
  },
  {
    id: "D-07",
    title: "Le Voyage Premium Italian Leather Handbag (Caramel Tan)",
    category: "fashion",
    categoryLabel: "Fashion",
    price: 28750,
    wasPrice: 39000,
    priceStr: "₦28,750",
    wasStr: "₦39,000",
    rating: "4.7",
    reviews: 194,
    discount: "26% OFF",
    discountPct: 26,
    img: "/products/bag.jpg",
    endsIn: "Today",
    sold: 38,
    total: 50,
  },
  {
    id: "D-08",
    title: "Fast-Charging 30,000mAh Ultra Slim Power Bank",
    category: "phones-tablets",
    categoryLabel: "Phones & Tablets",
    price: 18900,
    wasPrice: 25000,
    priceStr: "₦18,900",
    wasStr: "₦25,000",
    rating: "4.7",
    reviews: 840,
    discount: "24% OFF",
    discountPct: 24,
    img: "/products/phone.jpg",
    endsIn: "Today",
    sold: 210,
    total: 300,
  },
  {
    id: "D-09",
    title: "Versace Eros Pour Homme Eau de Parfum 100ml",
    category: "beauty-personal-care",
    categoryLabel: "Beauty & Care",
    price: 55000,
    wasPrice: 72000,
    priceStr: "₦55,000",
    wasStr: "₦72,000",
    rating: "4.9",
    reviews: 874,
    discount: "24% OFF",
    discountPct: 24,
    img: "/products/sneakers.jpg",
    endsIn: "Today",
    sold: 45,
    total: 60,
  },
  {
    id: "D-10",
    title: "Golden Penny Semovita 10kg Bag — Premium Quality",
    category: "groceries",
    categoryLabel: "Groceries",
    price: 8500,
    wasPrice: 11000,
    priceStr: "₦8,500",
    wasStr: "₦11,000",
    rating: "4.5",
    reviews: 620,
    discount: "23% OFF",
    discountPct: 23,
    img: "/products/airfryer.jpg",
    endsIn: "Today",
    sold: 185,
    total: 250,
  },
  {
    id: "D-11",
    title: "CeraVe Moisturizing Cream 340g — Dry to Very Dry Skin",
    category: "beauty-personal-care",
    categoryLabel: "Beauty & Care",
    price: 18500,
    wasPrice: 24000,
    priceStr: "₦18,500",
    wasStr: "₦24,000",
    rating: "4.8",
    reviews: 1560,
    discount: "23% OFF",
    discountPct: 23,
    img: "/products/bag.jpg",
    endsIn: "Today",
    sold: 340,
    total: 400,
  },
  {
    id: "D-12",
    title: "Dell Inspiron 15 Laptop Intel Core i5, 16GB RAM 512GB SSD",
    category: "electronics",
    categoryLabel: "Electronics",
    price: 420000,
    wasPrice: 510000,
    priceStr: "₦420,000",
    wasStr: "₦510,000",
    rating: "4.6",
    reviews: 175,
    discount: "18% OFF",
    discountPct: 18,
    img: "/products/tv.jpg",
    endsIn: "Today",
    sold: 18,
    total: 30,
  },
];

const CATEGORY_TABS = [
  { key: "all", label: "All Deals" },
  { key: "electronics", label: "Electronics" },
  { key: "phones-tablets", label: "Phones & Tablets" },
  { key: "fashion", label: "Fashion" },
  { key: "home-living", label: "Home & Living" },
  { key: "beauty-personal-care", label: "Beauty & Care" },
  { key: "groceries", label: "Groceries" },
];

function StarRating({ rating }: { rating: string }) {
  const r = parseFloat(rating);
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(r) ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

function Countdown({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="deals-countdown">
      <span className="countdown-label">⚡ Sale ends in:</span>
      <div className="countdown-timer">
        <div className="countdown-block">
          <span className="countdown-num">{pad(timeLeft.h)}</span>
          <span className="countdown-unit">HRS</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-block">
          <span className="countdown-num">{pad(timeLeft.m)}</span>
          <span className="countdown-unit">MIN</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-block">
          <span className="countdown-num">{pad(timeLeft.s)}</span>
          <span className="countdown-unit">SEC</span>
        </div>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"discount" | "price-low" | "price-high" | "rating">("discount");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [wishlistIds, setWishlistIds] = useState<Record<string, boolean>>({});

  // End of day countdown
  const endTime = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, []);

  const filteredDeals = useMemo(() => {
    let items = activeTab === "all" ? deals : deals.filter((d) => d.category === activeTab);
    if (sortBy === "discount") items = [...items].sort((a, b) => b.discountPct - a.discountPct);
    else if (sortBy === "price-low") items = [...items].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") items = [...items].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") items = [...items].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return items;
  }, [activeTab, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <>
      <SiteHeader />
      <main className="search-page-container">
        {/* Hero Banner */}
        <div className="search-hero-banner" style={{ background: "radial-gradient(circle at 80% 20%, #991b1b 0%, #450a0a 60%, #090e1a 100%)" }}>
          <div className="search-query-row">
            <div>
              <span className="search-hero-tag">🔥 24-HOUR FLASH BLITZ</span>
              <h1>Flash Deals of the Day</h1>
              <p className="search-count-caption">
                Massive price cuts across top genuine brands. Grab deals before the countdown hits zero!
              </p>
            </div>
            <Countdown endTime={endTime} />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">/</span>
          <strong>Flash Deals</strong>
        </nav>

        {/* Category Tabs */}
        <div className="subcat-pills-bar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`subcat-pill ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="search-controls-bar">
          <span className="results-badge-text">
            Showing <strong>{filteredDeals.length}</strong> deals
            {activeTab !== "all" && ` in ${CATEGORY_TABS.find((t) => t.key === activeTab)?.label}`}
          </span>

          <div className="sort-select-wrap">
            <label htmlFor="deals-sort-select">Sort by:</label>
            <select
              id="deals-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="discount">Biggest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredDeals.length > 0 ? (
          <div className="products-modern-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "40px" }}>
            {filteredDeals.map((p) => {
              const soldPct = Math.round((p.sold / p.total) * 100);
              const isHot = soldPct >= 75;
              return (
                <article className="luxury-product-card" key={p.id}>
                  <div className="card-image-box">
                    <span className="discount-badge-pill">-{p.discount}</span>
                    <button
                      className={`wishlist-heart-btn ${wishlistIds[p.id] ? "active" : ""}`}
                      onClick={() => toggleWishlist(p.id)}
                      aria-label="Add to wishlist"
                      type="button"
                    >
                      <IconHeart size={18} fill={wishlistIds[p.id] ? "#f43f5e" : "none"} />
                    </button>
                    <img src={p.img} alt={p.title} loading="lazy" />
                    {isHot && <span className="item-tag-pill" style={{ background: "#ef4444" }}>🔥 Selling Fast</span>}
                    <span className="seller-verified-pill">🏷️ {p.categoryLabel}</span>
                  </div>

                  <div className="card-content-box">
                    <div className="rating-pill-row">
                      <StarRating rating={p.rating} />
                      <span className="rating-score">{p.rating}</span>
                      <span className="review-count">({p.reviews})</span>
                    </div>

                    <h3 className="product-title-text" title={p.title}>
                      {p.title}
                    </h3>

                    <div className="price-display-row">
                      <strong className="sale-price">{p.priceStr}</strong>
                      <del className="was-price">{p.wasStr}</del>
                    </div>

                    {/* Stock indicator */}
                    <div className="stock-level-indicator">
                      <div className="stock-text-flex">
                        <span>{isHot ? `🔥 Only ${p.total - p.sold} left!` : `${p.sold} claimed`}</span>
                        <span>{soldPct}%</span>
                      </div>
                      <div className="mini-progress-track">
                        <div
                          className="mini-progress-bar"
                          style={{
                            width: `${soldPct}%`,
                            background: soldPct >= 75 ? "linear-gradient(90deg, #f43f5e, #ef4444)" : undefined,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className={`cart-action-btn ${addedItems[p.id] ? "added" : ""}`}
                      onClick={() => handleAddToCart(p.id)}
                      type="button"
                    >
                      {addedItems[p.id] ? "✓ Added to Cart!" : "Claim Deal"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="search-empty-state">
            <div className="empty-search-icon">⚡</div>
            <h2>No Deals in This Category Right Now</h2>
            <p>Check back soon — our merchants add fresh deals every single day!</p>
            <button className="empty-home-btn" onClick={() => setActiveTab("all")} type="button">
              View All Deals
            </button>
          </div>
        )}
      </main>

      {/* ── Global Luxury Footer ── */}
      <footer className="luxury-footer">
        <div className="footer-inner-grid">
          <div className="footer-brand-column">
            <div className="brand-logo-text footer-brand-logo">
              SHOP<span>ZERO</span>
            </div>
            <p className="footer-tagline-text">
              Nigeria&apos;s leading secure marketplace. Discover over 150,000 verified genuine products from vetted merchants with automated escrow protection.
            </p>
            <div className="footer-badges-list">
              <span className="payment-chip">🔒 Escrow Protected</span>
              <span className="payment-chip">💳 Mastercard</span>
              <span className="payment-chip">💳 Visa</span>
              <span className="payment-chip">💳 Verve</span>
              <span className="payment-chip">⚡ Paystack</span>
            </div>
          </div>

          <div className="footer-links-column">
            <h4>Shop Categories</h4>
            <a href="/c/electronics">Electronics &amp; Gadgets</a>
            <a href="/c/phones-tablets">Phones &amp; Tablets</a>
            <a href="/c/fashion">Fashion &amp; Apparel</a>
            <a href="/c/home-living">Home &amp; Kitchen</a>
            <a href="/c/groceries">Groceries &amp; Foodstuff</a>
            <a href="/deals">Flash Sale Deals</a>
          </div>

          <div className="footer-links-column">
            <h4>Customer Service</h4>
            <a href="/account">My Account</a>
            <a href="/orders">Track Your Order</a>
            <a href="/wishlist">Saved Wishlist</a>
            <a href="/cart">Shopping Cart</a>
            <a href="/returns">Returns &amp; Refunds</a>
            <a href="/help">Help Center &amp; FAQs</a>
          </div>

          <div className="footer-links-column">
            <h4>Sell on Shop Zero</h4>
            <a href="/login?tab=register">Open Merchant Store</a>
            <a href="/vendor/kyc">Vendor KYC Verification</a>
            <a href="/sell">Seller Protection &amp; Escrow</a>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} Shop Zero Technologies Ltd. All rights reserved.</p>
            <p className="footer-tagline">Engineered with ❤️ in Lagos, Nigeria · Bank-Grade Security</p>
          </div>
        </div>
      </footer>
    </>
  );
}
