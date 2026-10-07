"use client";

import { useState, useEffect, useMemo } from "react";
import { SiteHeader } from "../../components/site-header";

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
    title: "Wireless Noise-Cancelling Over-Ear Headphones Pro",
    category: "electronics",
    categoryLabel: "Electronics",
    price: 48900,
    wasPrice: 65000,
    priceStr: "₦48,900",
    wasStr: "₦65,000",
    rating: "4.7",
    reviews: 312,
    discount: "25% OFF",
    discountPct: 25,
    img: "/products/headphones.jpg",
    endsIn: "Today",
    sold: 78,
    total: 100,
  },
  {
    id: "D-02",
    title: "Smart LED TV 43-inch Full HD HDR with Voice Remote",
    category: "electronics",
    categoryLabel: "Electronics",
    price: 235000,
    wasPrice: 280000,
    priceStr: "₦235,000",
    wasStr: "₦280,000",
    rating: "4.5",
    reviews: 98,
    discount: "16% OFF",
    discountPct: 16,
    img: "/products/tv.jpg",
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

  const handleAddToCart = (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Banner */}
        <div className="deals-hero">
          <div className="deals-hero-inner">
            <div className="deals-hero-text">
              <span className="deals-hero-badge">🔥 Limited Time Only</span>
              <h1>Flash Deals</h1>
              <p>Massive discounts across all categories. New deals added daily — grab them before they're gone!</p>
            </div>
            <Countdown endTime={endTime} />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ padding: "0.75rem 1.5rem", maxWidth: "1400px", margin: "0 auto" }}>
          <a href="/">Home</a>
          <span>/</span>
          <strong>Flash Deals</strong>
        </nav>

        {/* Category Tabs + Sort */}
        <div className="deals-controls">
          <div className="deals-tabs" role="tablist">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`deals-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="deals-sort">
            <label htmlFor="deals-sort-select">Sort:</label>
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

        {/* Deal Count */}
        <div className="deals-count-bar">
          <span>
            Showing <strong>{filteredDeals.length}</strong> deals
            {activeTab !== "all" && ` in ${CATEGORY_TABS.find((t) => t.key === activeTab)?.label}`}
          </span>
        </div>

        {/* Products Grid */}
        {filteredDeals.length > 0 ? (
          <div className="deals-grid">
            {filteredDeals.map((p) => {
              const soldPct = Math.round((p.sold / p.total) * 100);
              const isHot = soldPct >= 75;
              return (
                <article className="deal-card" key={p.id}>
                  {/* Discount Badge */}
                  <div className="deal-image-wrap">
                    <span className="deal-badge">{p.discount}</span>
                    {isHot && <span className="deal-hot-badge">🔥 HOT</span>}
                    <img src={p.img} alt={p.title} loading="lazy" />
                  </div>

                  <div className="deal-info">
                    <span className="deal-cat-tag">{p.categoryLabel}</span>
                    <h3>{p.title}</h3>

                    <div className="deal-price-row">
                      <strong className="deal-price">{p.priceStr}</strong>
                      <del className="deal-was">{p.wasStr}</del>
                    </div>

                    <div className="deal-rating-row">
                      <StarRating rating={p.rating} />
                      <span className="rating-num">{p.rating}</span>
                      <small>({p.reviews.toLocaleString()} reviews)</small>
                    </div>

                    {/* Stock progress bar */}
                    <div className="deal-stock">
                      <div className="deal-stock-bar">
                        <div
                          className="deal-stock-fill"
                          style={{
                            width: `${soldPct}%`,
                            background: soldPct >= 75 ? "var(--clr-accent)" : "var(--clr-primary)",
                          }}
                        />
                      </div>
                      <span className="deal-stock-label">
                        {isHot ? `🔥 Only ${p.total - p.sold} left!` : `${p.sold} sold of ${p.total}`}
                      </span>
                    </div>

                    <button
                      className="deal-cart-btn"
                      onClick={() => handleAddToCart(p.id)}
                      style={
                        addedItems[p.id]
                          ? { background: "#15803d", borderColor: "#15803d" }
                          : undefined
                      }
                    >
                      {addedItems[p.id] ? "✓ Added to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-products-state" style={{ margin: "4rem auto" }}>
            <span className="empty-icon">⚡</span>
            <h3>No Deals in This Category Right Now</h3>
            <p>Check back soon — our merchants add new flash deals every day!</p>
            <button className="primary-btn" onClick={() => setActiveTab("all")}>
              View All Deals
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="footer" style={{ marginTop: "4rem" }}>
          <div className="footer-inner">
            <div className="footer-brand">
              <a className="logo" href="/">SHOP<span>ZERO</span></a>
              <p>Nigeria's favourite multi-category marketplace. Big brands, genuine products, and fast delivery — all in one place.</p>
            </div>
            <div className="footer-col">
              <h4>Flash Deals</h4>
              <a href="/deals">Today's Deals</a>
              <a href="/c/electronics">Electronics</a>
              <a href="/c/fashion">Fashion</a>
              <a href="/c/groceries">Groceries</a>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <a href="/account">My Account</a>
              <a href="/orders">My Orders</a>
              <a href="/wishlist">Wishlist</a>
              <a href="/cart">Cart</a>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <a href="/help">Help Center</a>
              <a href="/returns">Returns</a>
              <a href="/shipping">Shipping Info</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Shop Zero Ltd. All rights reserved. · Made with ❤️ in Nigeria
          </div>
        </footer>
      </main>
    </>
  );
}
