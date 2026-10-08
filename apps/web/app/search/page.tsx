"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { IconSearch, IconHeart, IconShield } from "../../components/icons";

interface SearchProductItem {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  brand: string;
  price: number;
  wasPrice: number;
  priceStr: string;
  wasStr: string;
  rating: string;
  reviews: number;
  discount: string;
  discountPct: number;
  img: string;
  seller: string;
  inStock: boolean;
  tag?: string;
}

const CATALOG_DATABASE: SearchProductItem[] = [
  // Phones & Audio
  {
    id: "SP-01",
    title: "Apple iPhone 15 Pro Max 256GB - Natural Titanium (Dual SIM)",
    category: "phones-tablets",
    categoryName: "Phones & Tablets",
    brand: "Apple",
    price: 1850000,
    wasPrice: 1950000,
    priceStr: "₦1,850,000",
    wasStr: "₦1,950,000",
    rating: "4.9",
    reviews: 320,
    discount: "5% OFF",
    discountPct: 5,
    img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    seller: "Apple Certified Store",
    inStock: true,
    tag: "Top Seller",
  },
  {
    id: "SP-02",
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Pro",
    category: "electronics",
    categoryName: "Electronics & Audio",
    brand: "Sony",
    price: 48900,
    wasPrice: 65000,
    priceStr: "₦48,900",
    wasStr: "₦65,000",
    rating: "4.9",
    reviews: 312,
    discount: "25% OFF",
    discountPct: 25,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    seller: "Sony Official Nigeria",
    inStock: true,
    tag: "Deal of Day",
  },
  {
    id: "SP-03",
    title: "Zenith Pro 5G Smartphone 256GB / 8GB RAM OLED Display",
    category: "phones-tablets",
    categoryName: "Phones & Tablets",
    brand: "Zenith",
    price: 185000,
    wasPrice: 220000,
    priceStr: "₦185,000",
    wasStr: "₦220,000",
    rating: "4.8",
    reviews: 523,
    discount: "16% OFF",
    discountPct: 16,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    seller: "Zenith Official Hub",
    inStock: true,
  },
  {
    id: "SP-04",
    title: "Samsung Galaxy S24 Ultra 512GB - Titanium Black (5G)",
    category: "phones-tablets",
    categoryName: "Phones & Tablets",
    brand: "Samsung",
    price: 1720000,
    wasPrice: 1800000,
    priceStr: "₦1,720,000",
    wasStr: "₦1,800,000",
    rating: "4.9",
    reviews: 210,
    discount: "5% OFF",
    discountPct: 5,
    img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    seller: "Samsung Experience Store",
    inStock: true,
  },
  {
    id: "SP-05",
    title: "Fast-Charging 30,000mAh Ultra Slim Power Bank with Digital Display",
    category: "phones-tablets",
    categoryName: "Phones & Tablets",
    brand: "Oraimo",
    price: 18900,
    wasPrice: 25000,
    priceStr: "₦18,900",
    wasStr: "₦25,000",
    rating: "4.7",
    reviews: 840,
    discount: "24% OFF",
    discountPct: 24,
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    seller: "Oraimo Flagship Store",
    inStock: true,
  },

  // Electronics & TVs
  {
    id: "SP-06",
    title: "Samsung 43-inch Crystal UHD 4K Smart LED TV with Voice Remote",
    category: "electronics",
    categoryName: "Electronics & Audio",
    brand: "Samsung",
    price: 235000,
    wasPrice: 280000,
    priceStr: "₦235,000",
    wasStr: "₦280,000",
    rating: "4.8",
    reviews: 98,
    discount: "16% OFF",
    discountPct: 16,
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    seller: "Lumina Home Tech",
    inStock: true,
  },
  {
    id: "SP-07",
    title: "Dell Inspiron 15 Laptop Intel Core i5, 16GB RAM 512GB SSD",
    category: "electronics",
    categoryName: "Electronics & Audio",
    brand: "Dell",
    price: 420000,
    wasPrice: 510000,
    priceStr: "₦420,000",
    wasStr: "₦510,000",
    rating: "4.6",
    reviews: 175,
    discount: "18% OFF",
    discountPct: 18,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    seller: "Tech Giant Lagos",
    inStock: true,
  },

  // Home & Kitchen
  {
    id: "SP-08",
    title: "Digital Touchscreen Air Fryer 5.5L with 8 Fast Presets",
    category: "home-living",
    categoryName: "Home & Kitchen",
    brand: "AeroFry",
    price: 59500,
    wasPrice: 72000,
    priceStr: "₦59,500",
    wasStr: "₦72,000",
    rating: "4.7",
    reviews: 441,
    discount: "17% OFF",
    discountPct: 17,
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    seller: "AeroFry Official",
    inStock: true,
  },
  {
    id: "SP-09",
    title: "Velociti Heavy-Duty High-Speed Commercial Blender 1500W",
    category: "home-living",
    categoryName: "Home & Kitchen",
    brand: "Velociti",
    price: 41500,
    wasPrice: 55000,
    priceStr: "₦41,500",
    wasStr: "₦55,000",
    rating: "4.7",
    reviews: 278,
    discount: "25% OFF",
    discountPct: 25,
    img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
    seller: "Velociti Appliances",
    inStock: true,
  },

  // Fashion & Style
  {
    id: "SP-10",
    title: "Men's Pro Breathable Cushion Running Sneakers (White & Orange)",
    category: "fashion",
    categoryName: "Fashion & Style",
    brand: "Nike",
    price: 32990,
    wasPrice: 45000,
    priceStr: "₦32,990",
    wasStr: "₦45,000",
    rating: "4.6",
    reviews: 187,
    discount: "27% OFF",
    discountPct: 27,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    seller: "Sneakerhead Lagos",
    inStock: true,
  },
  {
    id: "SP-11",
    title: "Le Voyage Handcrafted Italian Leather Crossbody Bag (Caramel)",
    category: "fashion",
    categoryName: "Fashion & Style",
    brand: "Le Voyage",
    price: 28750,
    wasPrice: 39000,
    priceStr: "₦28,750",
    wasStr: "₦39,000",
    rating: "4.8",
    reviews: 194,
    discount: "26% OFF",
    discountPct: 26,
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    seller: "Le Voyage Lagos",
    inStock: true,
  },

  // Beauty
  {
    id: "SP-12",
    title: "Lumina Noir Luxury Unisex Eau de Parfum 100ml",
    category: "beauty-personal-care",
    categoryName: "Beauty & Fragrances",
    brand: "Lumina",
    price: 19900,
    wasPrice: 27500,
    priceStr: "₦19,900",
    wasStr: "₦27,500",
    rating: "4.9",
    reviews: 360,
    discount: "28% OFF",
    discountPct: 28,
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    seller: "Lumina Fragrance House",
    inStock: true,
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

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams?.get("q") || "";
  const query = rawQuery.trim().toLowerCase();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high" | "rating" | "discount">("relevance");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [wishlistIds, setWishlistIds] = useState<Record<string, boolean>>({});

  // Filter and sort items based on search query
  const filteredProducts = useMemo(() => {
    let list = CATALOG_DATABASE;

    // 1. Text Search Filter
    if (query) {
      list = list.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const categoryMatch = item.categoryName.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
        const brandMatch = item.brand.toLowerCase().includes(query);
        const sellerMatch = item.seller.toLowerCase().includes(query);
        return titleMatch || categoryMatch || brandMatch || sellerMatch;
      });
    }

    // 2. Category Filter
    if (selectedCategory !== "all") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // 3. Price Filter
    list = list.filter((item) => item.price <= maxPrice);

    // 4. In Stock Filter
    if (onlyInStock) {
      list = list.filter((item) => item.inStock);
    }

    // 5. Sorting
    if (sortBy === "price-low") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "discount") {
      list = [...list].sort((a, b) => b.discountPct - a.discountPct);
    }

    return list;
  }, [query, selectedCategory, maxPrice, onlyInStock, sortBy]);

  const handleAddToCart = (id: string) => {
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CATALOG_DATABASE.length };
    CATALOG_DATABASE.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <>
      <main className="search-page-container">
      {/* ── Search Page Hero Header ── */}
      <div className="search-hero-banner">
        <div className="search-hero-content">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <strong>Search Results</strong>
          </nav>

          <div className="search-query-row">
            <div>
              <span className="search-hero-tag">🔍 Verified Marketplace Search</span>
              <h1>
                {rawQuery ? (
                  <>
                    Results for &ldquo;<span className="highlight-query">{rawQuery}</span>&rdquo;
                  </>
                ) : (
                  "Explore All Catalog Products"
                )}
              </h1>
              <p className="search-count-caption">
                Showing <strong>{filteredProducts.length}</strong> genuine products matching your criteria
              </p>
            </div>

            <div className="search-escrow-pill">
              <IconShield size={18} /> 100% Verified Genuine &amp; Escrow Protected
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Filters Sidebar + Results Grid ── */}
      <div className="search-layout-grid">
        {/* Sidebar Filters */}
        <aside className="search-sidebar-card">
          <div className="search-filter-header">
            <h3>Refine Results</h3>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory("all");
                setMaxPrice(2000000);
                setOnlyInStock(false);
                setSortBy("relevance");
              }}
              type="button"
            >
              Reset All
            </button>
          </div>

          {/* Department Filter */}
          <div className="search-filter-section">
            <span className="filter-section-title">Department</span>
            <div className="category-filter-list">
              <button
                className={`category-filter-item ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
                type="button"
              >
                <span>All Departments</span>
                <span className="filter-count">({categoryCounts.all})</span>
              </button>
              <button
                className={`category-filter-item ${selectedCategory === "phones-tablets" ? "active" : ""}`}
                onClick={() => setSelectedCategory("phones-tablets")}
                type="button"
              >
                <span>Phones &amp; Tablets</span>
                <span className="filter-count">({categoryCounts["phones-tablets"] || 0})</span>
              </button>
              <button
                className={`category-filter-item ${selectedCategory === "electronics" ? "active" : ""}`}
                onClick={() => setSelectedCategory("electronics")}
                type="button"
              >
                <span>Electronics &amp; Audio</span>
                <span className="filter-count">({categoryCounts["electronics"] || 0})</span>
              </button>
              <button
                className={`category-filter-item ${selectedCategory === "fashion" ? "active" : ""}`}
                onClick={() => setSelectedCategory("fashion")}
                type="button"
              >
                <span>Fashion &amp; Style</span>
                <span className="filter-count">({categoryCounts["fashion"] || 0})</span>
              </button>
              <button
                className={`category-filter-item ${selectedCategory === "home-living" ? "active" : ""}`}
                onClick={() => setSelectedCategory("home-living")}
                type="button"
              >
                <span>Home &amp; Kitchen</span>
                <span className="filter-count">({categoryCounts["home-living"] || 0})</span>
              </button>
              <button
                className={`category-filter-item ${selectedCategory === "beauty-personal-care" ? "active" : ""}`}
                onClick={() => setSelectedCategory("beauty-personal-care")}
                type="button"
              >
                <span>Beauty &amp; Fragrances</span>
                <span className="filter-count">({categoryCounts["beauty-personal-care"] || 0})</span>
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="search-filter-section">
            <span className="filter-section-title">
              Max Price: <strong>₦{maxPrice.toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min={10000}
              max={2000000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-range-slider"
            />
            <div className="range-bounds-row">
              <span>₦10,000</span>
              <span>₦2,000,000</span>
            </div>
          </div>

          {/* In-Stock Only */}
          <div className="search-filter-section">
            <span className="filter-section-title">Availability</span>
            <label className="checkbox-filter-label">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Results Column */}
        <section className="search-results-col">
          {/* Controls Bar */}
          <div className="search-controls-bar">
            <span className="results-badge-text">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            <div className="sort-select-wrap">
              <label htmlFor="search-sort-dropdown">Sort By:</label>
              <select
                id="search-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="search-empty-state">
              <div className="empty-search-icon">🔍</div>
              <h2>No products found for &ldquo;{rawQuery}&rdquo;</h2>
              <p>Try checking your spelling, using more general keywords, or browsing popular departments.</p>

              <div className="empty-suggestions-tags">
                <span className="sugg-tag-title">Popular searches:</span>
                <a href="/search?q=iPhone" className="sugg-pill">iPhone 15</a>
                <a href="/search?q=Sony" className="sugg-pill">Sony Headphones</a>
                <a href="/search?q=Air+Fryer" className="sugg-pill">Air Fryer</a>
                <a href="/search?q=Sneakers" className="sugg-pill">Running Sneakers</a>
                <a href="/search?q=Blender" className="sugg-pill">Blenders</a>
              </div>

              <a href="/" className="empty-home-btn">
                ⚡ Back to Marketplace Home
              </a>
            </div>
          ) : (
            /* Results Grid */
            <div className="search-products-grid">
              {filteredProducts.map((p) => (
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
                      <strong className="sale-price">{p.priceStr}</strong>
                      <del className="was-price">{p.wasStr}</del>
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
          )}
        </section>
      </div>
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

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<div className="search-page-container"><p>Searching catalog...</p></div>}>
        <SearchResultsContent />
      </Suspense>
    </>
  );
}
