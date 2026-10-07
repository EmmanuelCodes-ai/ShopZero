"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "../components/site-header";
import {
  IconPhone,
  IconShirt,
  IconHome,
  IconGrocery,
  IconBeauty,
  IconBolt,
  IconTruck,
  IconShield,
  IconReturn,
  IconBadge,
  IconHeart,
  IconSearch,
} from "../components/icons";

/* ── Flash sale products (4 items) ── */
const flashProducts = [
  {
    id: "fp-1",
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    price: "₦48,900",
    was: "₦65,000",
    rating: "4.9",
    discount: "25%",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    reviews: 312,
    stockLeft: 4,
    stockTotal: 25,
    tag: "⚡ Lightning Deal",
  },
  {
    id: "fp-2",
    title: "Samsung 43-inch Crystal UHD 4K Smart TV with Voice Remote",
    price: "₦235,000",
    was: "₦280,000",
    rating: "4.8",
    discount: "16%",
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    reviews: 98,
    stockLeft: 6,
    stockTotal: 20,
    tag: "🔥 Top Rated",
  },
  {
    id: "fp-3",
    title: "Digital Touchscreen Air Fryer 5.5L with 8 Fast Presets",
    price: "₦59,500",
    was: "₦72,000",
    rating: "4.7",
    discount: "17%",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    reviews: 441,
    stockLeft: 8,
    stockTotal: 30,
    tag: "🍳 Best for Home",
  },
  {
    id: "fp-4",
    title: "Men's Pro Breathable Cushion Running Sneakers",
    price: "₦32,990",
    was: "₦45,000",
    rating: "4.6",
    discount: "27%",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    reviews: 187,
    stockLeft: 5,
    stockTotal: 40,
    tag: "👟 Trending",
  },
];

/* ── Trending products (4 items) ── */
const trendingProducts = [
  {
    id: "tp-1",
    title: "Zenith Pro 5G Smartphone 256GB Dual SIM (OLED Display)",
    price: "₦185,000",
    was: "₦220,000",
    rating: "4.9",
    discount: "16%",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    reviews: 523,
    seller: "Zenith Official",
    verified: true,
  },
  {
    id: "tp-2",
    title: "Velociti Heavy-Duty High-Speed Commercial Blender 1500W",
    price: "₦41,500",
    was: "₦55,000",
    rating: "4.7",
    discount: "25%",
    img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
    reviews: 278,
    seller: "Velociti Appliances",
    verified: true,
  },
  {
    id: "tp-3",
    title: "Le Voyage Handcrafted Italian Leather Crossbody Bag",
    price: "₦28,750",
    was: "₦39,000",
    rating: "4.8",
    discount: "26%",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    reviews: 194,
    seller: "Le Voyage Lagos",
    verified: true,
  },
  {
    id: "tp-4",
    title: "Lumina Noir Luxury Unisex Eau de Parfum 100ml",
    price: "₦19,900",
    was: "₦27,500",
    rating: "4.9",
    discount: "28%",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    reviews: 360,
    seller: "Lumina Fragrances",
    verified: true,
  },
];

const categories = [
  { icon: <IconPhone size={22} />, label: "Phones & Tablets", href: "/c/phones-tablets", count: "4,200+ Items", badge: "Hot" },
  { icon: <IconShirt size={22} />, label: "Fashion & Style", href: "/c/fashion", count: "8,500+ Items", badge: "Sale" },
  { icon: <IconHome size={22} />, label: "Home & Kitchen", href: "/c/home-living", count: "3,100+ Items" },
  { icon: <IconGrocery size={22} />, label: "Supermarket & Groceries", href: "/c/groceries", count: "1,800+ Items" },
  { icon: <IconBeauty size={22} />, label: "Beauty & Perfumes", href: "/c/beauty-personal-care", count: "2,600+ Items", badge: "New" },
  { icon: <IconBolt size={22} />, label: "Electronics & Tech", href: "/c/electronics", count: "5,400+ Items" },
];

const trustBadges = [
  {
    icon: <IconTruck size={24} />,
    title: "Fast Nationwide Delivery",
    body: "Free on orders over ₦15,000 with 2-hour express delivery in Lagos & Abuja",
  },
  {
    icon: <IconShield size={24} />,
    title: "Escrow Buyer Protection",
    body: "Your money stays safe in automated escrow until your item is delivered & confirmed",
  },
  {
    icon: <IconReturn size={24} />,
    title: "7-Day Hassle-Free Returns",
    body: "Zero-stress return pickups and instant refund processing to your wallet or bank",
  },
  {
    icon: <IconBadge size={24} />,
    title: "100% Genuine Certified",
    body: "Every product verified directly from certified Nigerian merchants & official brands",
  },
];

function StarRating({ rating }: { rating: string }) {
  const r = parseFloat(rating);
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(r) ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});
  const [wishlistIds, setWishlistIds] = useState<{ [key: string]: boolean }>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Live countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 29 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("WELCOME2K");
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  const handleAddToCart = (id: string) => {
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="main-content-flow">
        {/* ── World-Class Marketplace Hero Banner ── */}
        <section className="hero-showcase">
          <div className="hero-glow-blob top-left" />
          <div className="hero-glow-blob bottom-right" />

          <div className="hero-main-col">
            <div className="hero-pill-badge">
              <span className="live-pulse-dot" />
              <span className="pill-text">NIGERIA&apos;S PREMIER MARKETPLACE</span>
              <span className="pill-highlight">NEW SEASON UP TO 40% OFF</span>
            </div>

            <h1 className="hero-title">
              Big Brands. <br />
              <span className="gradient-text">Zero Guesswork.</span>
            </h1>

            <p className="hero-description">
              Shop over 150,000 verified genuine products from top Nigerian merchants with automated escrow protection and lightning-fast delivery to your door.
            </p>

            {/* Popular quick-search tags */}
            <div className="hero-search-tags">
              <span className="tag-label">Trending Now:</span>
              <a href="/c/phones-tablets" className="hero-tag">📱 iPhone 15</a>
              <a href="/c/electronics" className="hero-tag">🎧 Sony Headphones</a>
              <a href="/c/fashion" className="hero-tag">👟 Running Sneakers</a>
              <a href="/c/home-living" className="hero-tag">🍳 Air Fryers</a>
            </div>

            <div className="hero-cta-group">
              <a href="/deals" className="primary-hero-btn">
                <span>⚡ Shop Flash Deals</span>
              </a>
              <a href="/c/phones-tablets" className="secondary-hero-btn">
                <span>Explore Categories →</span>
              </a>
            </div>

            {/* Live Trust Stats underneath Hero CTA */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <strong>500K+</strong>
                <span>Happy Shoppers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <strong>50K+</strong>
                <span>Verified Stores</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <strong>99.8%</strong>
                <span>On-Time Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Live Deal Card */}
          <div className="hero-featured-card-wrapper">
            <div className="featured-deal-card">
              <div className="featured-card-header">
                <span className="featured-tag">🔥 DEAL OF THE DAY</span>
                <span className="featured-timer">
                  Ends in {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>

              <div className="featured-image-box">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Sony Noise-Cancelling Headphones"
                  loading="eager"
                />
                <span className="featured-discount-pill">-25% OFF</span>
              </div>

              <div className="featured-card-body">
                <div className="featured-rating-row">
                  <StarRating rating="4.9" />
                  <span className="featured-reviews-count">(312 reviews)</span>
                  <span className="verified-badge-pill">🛡️ Verified Genuine</span>
                </div>

                <h3 className="featured-product-title">
                  Sony WH-1000XM5 Wireless Noise-Cancelling Headphones
                </h3>

                <div className="featured-price-row">
                  <div className="price-stack">
                    <span className="current-price">₦48,900</span>
                    <span className="original-price">₦65,000</span>
                  </div>
                  <button
                    className={`featured-add-btn ${addedIds["hero-featured"] ? "added" : ""}`}
                    onClick={() => handleAddToCart("hero-featured")}
                    type="button"
                  >
                    {addedIds["hero-featured"] ? "✓ Added to Cart!" : "+ Add to Cart"}
                  </button>
                </div>

                {/* Stock bar */}
                <div className="featured-stock-bar-wrap">
                  <div className="stock-info-row">
                    <span className="stock-warning">⚡ Only 4 left in stock</span>
                    <span className="stock-percent">84% Claimed</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: "84%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust & Guarantees Strip ── */}
        <section className="trust-guarantee-strip">
          {trustBadges.map(({ icon, title, body }) => (
            <div className="trust-card" key={title}>
              <div className="trust-card-icon-box">{icon}</div>
              <div className="trust-card-text">
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Shop by Category Section ── */}
        <section className="section-container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">BROWSE DEPARTMENTS</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <a href="/deals" className="section-view-all-link">
              View All Categories →
            </a>
          </div>

          <div className="categories-modern-grid">
            {categories.map(({ icon, label, href, count, badge }) => (
              <a className="category-pill-card" href={href} key={label}>
                {badge && <span className="category-badge-tag">{badge}</span>}
                <div className="cat-icon-glow-wrap">{icon}</div>
                <strong className="cat-card-title">{label}</strong>
                <span className="cat-card-count">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Flash Sale Section ── */}
        <section className="section-container flash-sale-container">
          <div className="flash-sale-header-bar">
            <div className="flash-sale-title-col">
              <div className="flash-pill">
                <span className="fire-icon">⚡</span>
                <span>LIMITED TIME OFFER</span>
              </div>
              <h2 className="flash-sale-heading">Flash Deals of the Day</h2>
              <p className="flash-sale-sub">Grab massive discounts before the countdown hits zero.</p>
            </div>

            <div className="countdown-box-wrapper">
              <span className="countdown-label">DEALS EXPIRE IN:</span>
              <div className="countdown-digits-grid">
                <div className="digit-block">
                  <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                  <small>HOURS</small>
                </div>
                <span className="digit-colon">:</span>
                <div className="digit-block">
                  <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                  <small>MINS</small>
                </div>
                <span className="digit-colon">:</span>
                <div className="digit-block">
                  <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                  <small>SECS</small>
                </div>
              </div>
            </div>
          </div>

          <div className="products-modern-grid">
            {flashProducts.map((p) => (
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
                  {p.tag && <span className="item-tag-pill">{p.tag}</span>}
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
                    <strong className="sale-price">{p.price}</strong>
                    <del className="was-price">{p.was}</del>
                  </div>

                  {/* Stock progress */}
                  <div className="stock-level-indicator">
                    <div className="stock-text-flex">
                      <span>⚡ Only {p.stockLeft} left</span>
                      <span>{Math.round(((p.stockTotal - p.stockLeft) / p.stockTotal) * 100)}% sold</span>
                    </div>
                    <div className="mini-progress-track">
                      <div
                        className="mini-progress-bar"
                        style={{ width: `${Math.round(((p.stockTotal - p.stockLeft) / p.stockTotal) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className={`cart-action-btn ${addedIds[p.id] ? "added" : ""}`}
                    onClick={() => handleAddToCart(p.id)}
                    type="button"
                  >
                    {addedIds[p.id] ? "✓ Added to Cart!" : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Exclusive Promotional Voucher Banner ── */}
        <section className="promo-voucher-banner">
          <div className="promo-banner-glow" />
          <div className="promo-banner-content">
            <div className="promo-badge-pill">🎁 NEW CUSTOMER BONUS</div>
            <h2 className="promo-title">Get ₦2,000 Off Your First Order</h2>
            <p className="promo-subtitle">
              Enjoy verified quality, escrow protection, and rapid delivery. Apply voucher at checkout on orders over ₦10,000.
            </p>

            <div className="coupon-action-group">
              <div className="coupon-code-pill">
                <span className="coupon-label">COUPON:</span>
                <strong className="coupon-value">WELCOME2K</strong>
              </div>
              <button
                className={`copy-coupon-btn ${copiedCode ? "copied" : ""}`}
                onClick={handleCopyCoupon}
                type="button"
              >
                {copiedCode ? "✓ COPIED TO CLIPBOARD!" : "📋 Copy Coupon Code"}
              </button>
            </div>
          </div>

          <div className="promo-side-visual">
            <div className="promo-floating-badge">
              <span className="big-percent">₦2,000</span>
              <span className="small-sub">INSTANT REBATE</span>
            </div>
          </div>
        </section>

        {/* ── Trending Products Section ── */}
        <section className="section-container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">COMMUNITY FAVORITES</span>
              <h2 className="section-title">Trending This Week</h2>
            </div>
            <a href="/deals" className="section-view-all-link">
              See All Trending →
            </a>
          </div>

          <div className="products-modern-grid">
            {trendingProducts.map((p) => (
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
                  <span className="seller-verified-pill">🛡️ {p.seller}</span>
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
                    <strong className="sale-price">{p.price}</strong>
                    <del className="was-price">{p.was}</del>
                  </div>

                  <button
                    className={`cart-action-btn ${addedIds[p.id] ? "added" : ""}`}
                    onClick={() => handleAddToCart(p.id)}
                    type="button"
                  >
                    {addedIds[p.id] ? "✓ Added to Cart!" : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Why Shop Zero Flagship Strip ── */}
        <section className="why-shopzero-strip">
          <div className="why-title-center">
            <span className="section-eyebrow">THE ZERO EXPERIENCE</span>
            <h2>Why Millions Choose Shop Zero</h2>
            <p>Built for the modern Nigerian consumer and ambitious merchant.</p>
          </div>

          <div className="why-features-grid">
            <div className="why-feature-card">
              <span className="why-icon-box">🔒</span>
              <h3>Buyer &amp; Seller Escrow</h3>
              <p>Funds are safeguarded in certified escrow until your delivery is inspected &amp; confirmed.</p>
            </div>
            <div className="why-feature-card">
              <span className="why-icon-box">🏪</span>
              <h3>Custom Merchant Stores</h3>
              <p>Buy directly from top brand storefronts with verified KYC badges and instant WhatsApp support.</p>
            </div>
            <div className="why-feature-card">
              <span className="why-icon-box">⚡</span>
              <h3>2-Hour Express Hubs</h3>
              <p>Hyperlocal fulfillment centres in Lagos, Abuja, and Port Harcourt for same-day delivery.</p>
            </div>
            <div className="why-feature-card">
              <span className="why-icon-box">💳</span>
              <h3>Multiple Payment Options</h3>
              <p>Pay with debit card, bank transfer, USSD, or Shop Zero Wallet with zero hidden charges.</p>
            </div>
          </div>
        </section>

        {/* ── VIP Newsletter Section ── */}
        <section className="vip-newsletter-card">
          <div className="newsletter-flex-container">
            <div className="newsletter-text-block">
              <span className="vip-badge-pill">✨ VIP SHOPPER CLUB</span>
              <h2>Never Miss a Flash Sale or Exclusive Drop</h2>
              <p>Join over 250,000 smart shoppers receiving weekly secret discounts and early access.</p>
            </div>

            <div className="newsletter-form-block">
              {newsletterSuccess ? (
                <div className="newsletter-success-state">
                  <span>🎉 You&apos;re in! We&apos;ve sent a ₦1,000 discount voucher to your inbox.</span>
                </div>
              ) : (
                <form className="luxury-newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Join VIP Club</button>
                </form>
              )}
              <span className="newsletter-guarantee">🔒 No spam ever. Unsubscribe anytime with 1 click.</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Luxury Marketplace Footer ── */}
      <footer className="luxury-marketplace-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-column">
            <a className="footer-brand-logo" href="/">
              SHOP<span>ZERO</span>
            </a>
            <p className="footer-mission-text">
              Nigeria&apos;s leading multi-category marketplace. Verified genuine products, automated buyer escrow, and express doorstep delivery across all 36 states.
            </p>
            <div className="footer-payment-methods">
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
