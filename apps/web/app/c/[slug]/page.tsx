"use client";

import { use, useState, useEffect, useMemo } from "react";
import { SiteHeader } from "../../../components/site-header";
import { IconSearch, IconHeart, IconShield } from "../../../components/icons";

interface ProductItem {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  brand: string;
  price: number;
  wasPrice: number;
  priceStr: string;
  wasStr: string;
  rating: string;
  reviews: number;
  discount: string;
  img: string;
  inStock: boolean;
}

const allCategoryProducts: ProductItem[] = [
  // Phones & Tablets
  {
    id: "PT-01",
    title: "Zenith Pro 5G Smartphone 256GB / 8GB RAM",
    category: "phones-tablets",
    subCategory: "Smartphones (5G & 4G)",
    brand: "Zenith",
    price: 185000,
    wasPrice: 220000,
    priceStr: "₦185,000",
    wasStr: "₦220,000",
    rating: "4.8",
    reviews: 523,
    discount: "16%",
    img: "/products/phone.jpg",
    inStock: true,
  },
  {
    id: "PT-02",
    title: "Wireless Noise-Cancelling Bluetooth Earbuds Pro",
    category: "phones-tablets",
    subCategory: "Fast Chargers & Cables",
    brand: "Aura",
    price: 24500,
    wasPrice: 35000,
    priceStr: "₦24,500",
    wasStr: "₦35,000",
    rating: "4.6",
    reviews: 210,
    discount: "30%",
    img: "/products/headphones.jpg",
    inStock: true,
  },
  {
    id: "PT-03",
    title: "Fast-Charging 30,000mAh Ultra Slim Power Bank",
    category: "phones-tablets",
    subCategory: "Power Banks & Batteries",
    brand: "Oraimo",
    price: 18900,
    wasPrice: 25000,
    priceStr: "₦18,900",
    wasStr: "₦25,000",
    rating: "4.7",
    reviews: 840,
    discount: "24%",
    img: "/products/phone.jpg",
    inStock: true,
  },

  // Electronics
  {
    id: "EL-01",
    title: "Smart LED TV 43-inch Full HD HDR with Voice Remote",
    category: "electronics",
    subCategory: "Smart LED Televisions",
    brand: "Lumina",
    price: 235000,
    wasPrice: 280000,
    priceStr: "₦235,000",
    wasStr: "₦280,000",
    rating: "4.5",
    reviews: 98,
    discount: "16%",
    img: "/products/tv.jpg",
    inStock: true,
  },
  {
    id: "EL-02",
    title: "Wireless Noise-Cancelling Over-Ear Studio Headphones",
    category: "electronics",
    subCategory: "Bluetooth Soundbars & Audio",
    brand: "Aura",
    price: 48900,
    wasPrice: 65000,
    priceStr: "₦48,900",
    wasStr: "₦65,000",
    rating: "4.7",
    reviews: 312,
    discount: "25%",
    img: "/products/headphones.jpg",
    inStock: true,
  },

  // Home & Living
  {
    id: "HL-01",
    title: "Everyday Air Fryer 5L Digital Touchscreen with 8 Presets",
    category: "home-living",
    subCategory: "Air Fryers & Microwaves",
    brand: "AeroFry",
    price: 59500,
    wasPrice: 72000,
    priceStr: "₦59,500",
    wasStr: "₦72,000",
    rating: "4.6",
    reviews: 441,
    discount: "17%",
    img: "/products/airfryer.jpg",
    inStock: true,
  },
  {
    id: "HL-02",
    title: "Velociti High-Speed Kitchen Blender 1500W Ice Crusher",
    category: "home-living",
    subCategory: "Blenders & Food Processors",
    brand: "Velociti",
    price: 41500,
    wasPrice: 55000,
    priceStr: "₦41,500",
    wasStr: "₦55,000",
    rating: "4.6",
    reviews: 278,
    discount: "25%",
    img: "/products/blender.jpg",
    inStock: true,
  },

  // Fashion
  {
    id: "FA-01",
    title: "Men's Classic Lightweight Running Sneakers (White & Orange)",
    category: "fashion",
    subCategory: "Sneakers & Casual Shoes",
    brand: "Stride",
    price: 32990,
    wasPrice: 45000,
    priceStr: "₦32,990",
    wasStr: "₦45,000",
    rating: "4.4",
    reviews: 187,
    discount: "27%",
    img: "/products/sneakers.jpg",
    inStock: true,
  },
  {
    id: "FA-02",
    title: "Le Voyage Premium Italian Leather Handbag (Caramel Tan)",
    category: "fashion",
    subCategory: "Handbags & Backpacks",
    brand: "Le Voyage",
    price: 28750,
    wasPrice: 39000,
    priceStr: "₦28,750",
    wasStr: "₦39,000",
    rating: "4.7",
    reviews: 194,
    discount: "26%",
    img: "/products/bag.jpg",
    inStock: true,
  },
  // More Fashion
  {
    id: "FA-03",
    title: "Men's Slim Fit Chino Trousers — Navy Blue (All Sizes)",
    category: "fashion",
    subCategory: "Men's Wear",
    brand: "Elegance",
    price: 12500,
    wasPrice: 17000,
    priceStr: "₦12,500",
    wasStr: "₦17,000",
    rating: "4.3",
    reviews: 98,
    discount: "26%",
    img: "/products/sneakers.jpg",
    inStock: true,
  },
  {
    id: "FA-04",
    title: "Women's Floral Wrap Midi Dress — Summer Collection",
    category: "fashion",
    subCategory: "Women's Fashion",
    brand: "Blooms",
    price: 18900,
    wasPrice: 26000,
    priceStr: "₦18,900",
    wasStr: "₦26,000",
    rating: "4.6",
    reviews: 321,
    discount: "27%",
    img: "/products/bag.jpg",
    inStock: true,
  },
  {
    id: "FA-05",
    title: "Seiko Automatic Stainless Steel Men's Dress Watch",
    category: "fashion",
    subCategory: "Watches",
    brand: "Seiko",
    price: 78000,
    wasPrice: 95000,
    priceStr: "₦78,000",
    wasStr: "₦95,000",
    rating: "4.9",
    reviews: 57,
    discount: "18%",
    img: "/products/sneakers.jpg",
    inStock: true,
  },

  // More Electronics
  {
    id: "EL-03",
    title: "Dell Inspiron 15 Laptop Intel Core i5, 16GB RAM 512GB SSD",
    category: "electronics",
    subCategory: "Laptops & Computing",
    brand: "Dell",
    price: 420000,
    wasPrice: 510000,
    priceStr: "₦420,000",
    wasStr: "₦510,000",
    rating: "4.6",
    reviews: 175,
    discount: "18%",
    img: "/products/tv.jpg",
    inStock: true,
  },

  // More Home & Living
  {
    id: "HL-03",
    title: "Lumineux 2.5KVA Pure Sine Wave Inverter with Deep Cycle Battery",
    category: "home-living",
    subCategory: "Inverters & Solar",
    brand: "Lumineux",
    price: 145000,
    wasPrice: 178000,
    priceStr: "₦145,000",
    wasStr: "₦178,000",
    rating: "4.8",
    reviews: 133,
    discount: "19%",
    img: "/products/airfryer.jpg",
    inStock: true,
  },
  {
    id: "HL-04",
    title: "Royal Comfort 6x6 Orthopedic Foam Mattress (10 inches)",
    category: "home-living",
    subCategory: "Bedding & Furniture",
    brand: "Royal Comfort",
    price: 89000,
    wasPrice: 110000,
    priceStr: "₦89,000",
    wasStr: "₦110,000",
    rating: "4.5",
    reviews: 204,
    discount: "19%",
    img: "/products/blender.jpg",
    inStock: true,
  },

  // Groceries
  {
    id: "GR-01",
    title: "Golden Penny Semovita 10kg Bag — Premium Quality",
    category: "groceries",
    subCategory: "Food Cupboard",
    brand: "Golden Penny",
    price: 8500,
    wasPrice: 11000,
    priceStr: "₦8,500",
    wasStr: "₦11,000",
    rating: "4.5",
    reviews: 620,
    discount: "23%",
    img: "/products/airfryer.jpg",
    inStock: true,
  },
  {
    id: "GR-02",
    title: "Indomie Instant Noodles Chicken Flavour — 40 Pack Carton",
    category: "groceries",
    subCategory: "Food Cupboard",
    brand: "Indomie",
    price: 9500,
    wasPrice: 12000,
    priceStr: "₦9,500",
    wasStr: "₦12,000",
    rating: "4.7",
    reviews: 2340,
    discount: "21%",
    img: "/products/blender.jpg",
    inStock: true,
  },
  {
    id: "GR-03",
    title: "Milo Energy Drink Chocolate Powder 1kg Tin",
    category: "groceries",
    subCategory: "Beverages & Drinks",
    brand: "Nestlé",
    price: 5200,
    wasPrice: 6800,
    priceStr: "₦5,200",
    wasStr: "₦6,800",
    rating: "4.8",
    reviews: 1102,
    discount: "24%",
    img: "/products/airfryer.jpg",
    inStock: true,
  },
  {
    id: "GR-04",
    title: "Lipton Yellow Label Tea Bags 200 Pack",
    category: "groceries",
    subCategory: "Beverages & Drinks",
    brand: "Lipton",
    price: 4800,
    wasPrice: 6200,
    priceStr: "₦4,800",
    wasStr: "₦6,200",
    rating: "4.6",
    reviews: 540,
    discount: "23%",
    img: "/products/blender.jpg",
    inStock: true,
  },
  {
    id: "GR-05",
    title: "Ariel Matic Detergent Powder 5kg — Front & Top Load",
    category: "groceries",
    subCategory: "Cleaning Supplies",
    brand: "Ariel",
    price: 7900,
    wasPrice: 10500,
    priceStr: "₦7,900",
    wasStr: "₦10,500",
    rating: "4.6",
    reviews: 380,
    discount: "25%",
    img: "/products/airfryer.jpg",
    inStock: true,
  },
  {
    id: "GR-06",
    title: "Dettol Antiseptic Liquid Disinfectant 500ml (2-Pack)",
    category: "groceries",
    subCategory: "Cleaning Supplies",
    brand: "Dettol",
    price: 3500,
    wasPrice: 4800,
    priceStr: "₦3,500",
    wasStr: "₦4,800",
    rating: "4.7",
    reviews: 875,
    discount: "27%",
    img: "/products/blender.jpg",
    inStock: true,
  },
  {
    id: "GR-07",
    title: "Kings Groundnut Oil 5 Litres — Pure & Refined",
    category: "groceries",
    subCategory: "Cooking Oils",
    brand: "Kings",
    price: 12000,
    wasPrice: 15500,
    priceStr: "₦12,000",
    wasStr: "₦15,500",
    rating: "4.4",
    reviews: 215,
    discount: "23%",
    img: "/products/airfryer.jpg",
    inStock: true,
  },

  // Beauty & Personal Care
  {
    id: "BP-01",
    title: "Versace Eros Pour Homme Eau de Parfum 100ml",
    category: "beauty-personal-care",
    subCategory: "Perfumes & Colognes",
    brand: "Versace",
    price: 55000,
    wasPrice: 72000,
    priceStr: "₦55,000",
    wasStr: "₦72,000",
    rating: "4.9",
    reviews: 874,
    discount: "24%",
    img: "/products/sneakers.jpg",
    inStock: true,
  },
  {
    id: "BP-02",
    title: "Chanel Chance Eau Tendre Perfume 100ml for Women",
    category: "beauty-personal-care",
    subCategory: "Perfumes & Colognes",
    brand: "Chanel",
    price: 98000,
    wasPrice: 125000,
    priceStr: "₦98,000",
    wasStr: "₦125,000",
    rating: "4.9",
    reviews: 320,
    discount: "22%",
    img: "/products/bag.jpg",
    inStock: true,
  },
  {
    id: "BP-03",
    title: "CeraVe Moisturizing Cream 340g — Dry to Very Dry Skin",
    category: "beauty-personal-care",
    subCategory: "Skincare",
    brand: "CeraVe",
    price: 18500,
    wasPrice: 24000,
    priceStr: "₦18,500",
    wasStr: "₦24,000",
    rating: "4.8",
    reviews: 1560,
    discount: "23%",
    img: "/products/bag.jpg",
    inStock: true,
  },
  {
    id: "BP-04",
    title: "Neutrogena Hydro Boost Water Gel SPF 15 Sunscreen 50ml",
    category: "beauty-personal-care",
    subCategory: "Skincare",
    brand: "Neutrogena",
    price: 14200,
    wasPrice: 18500,
    priceStr: "₦14,200",
    wasStr: "₦18,500",
    rating: "4.7",
    reviews: 722,
    discount: "23%",
    img: "/products/sneakers.jpg",
    inStock: true,
  },
  {
    id: "BP-05",
    title: "OGX Biotin & Collagen Shampoo 385ml — Thick & Full",
    category: "beauty-personal-care",
    subCategory: "Hair Care",
    brand: "OGX",
    price: 8200,
    wasPrice: 11000,
    priceStr: "₦8,200",
    wasStr: "₦11,000",
    rating: "4.5",
    reviews: 432,
    discount: "25%",
    img: "/products/bag.jpg",
    inStock: true,
  },
  {
    id: "BP-06",
    title: "Cantu Shea Butter Leave-In Conditioning Repair Cream 453g",
    category: "beauty-personal-care",
    subCategory: "Hair Care",
    brand: "Cantu",
    price: 9800,
    wasPrice: 13000,
    priceStr: "₦9,800",
    wasStr: "₦13,000",
    rating: "4.6",
    reviews: 689,
    discount: "25%",
    img: "/products/sneakers.jpg",
    inStock: true,
  },
  {
    id: "BP-07",
    title: "Gillette Fusion5 ProGlide Razor with 4 Refill Blades",
    category: "beauty-personal-care",
    subCategory: "Men's Grooming",
    brand: "Gillette",
    price: 14500,
    wasPrice: 19000,
    priceStr: "₦14,500",
    wasStr: "₦19,000",
    rating: "4.7",
    reviews: 289,
    discount: "24%",
    img: "/products/bag.jpg",
    inStock: true,
  },
];

const categoryMeta: Record<string, { title: string; desc: string; icon: string; subcats: string[] }> = {
  "phones-tablets": {
    title: "Phones & Tablets",
    desc: "Discover the latest 5G smartphones, iPads, high-capacity power banks, and genuine accessories with manufacturer warranty.",
    icon: "📱",
    subcats: ["All", "Smartphones (5G & 4G)", "Tablets & iPads", "Power Banks & Batteries", "Fast Chargers & Cables", "Smartwatches"],
  },
  "electronics": {
    title: "Electronics & Audio",
    desc: "Shop 4K Smart Televisions, premium noise-cancelling soundbars, computing laptops, and home entertainment systems.",
    icon: "⚡",
    subcats: ["All", "Smart LED Televisions", "Bluetooth Soundbars & Audio", "Gaming Consoles", "Laptops & Computing"],
  },
  "fashion": {
    title: "Fashion & Footwear",
    desc: "Explore trending men's and women's clothing, authentic sneakers, leather bags, and stylish lifestyle accessories.",
    icon: "👗",
    subcats: ["All", "Sneakers & Casual Shoes", "Handbags & Backpacks", "Men's Wear", "Women's Fashion", "Watches"],
  },
  "home-living": {
    title: "Home & Kitchen Appliances",
    desc: "Upgrade your living space with energy-efficient digital air fryers, high-speed blenders, inverters, and kitchen essentials.",
    icon: "🏠",
    subcats: ["All", "Air Fryers & Microwaves", "Blenders & Food Processors", "Inverters & Solar", "Bedding & Furniture"],
  },
  "groceries": {
    title: "Groceries & Supermarket",
    desc: "Everyday household essentials, beverages, pantry staples, and cleaning products delivered right to your doorstep.",
    icon: "🛒",
    subcats: ["All", "Food Cupboard", "Beverages & Drinks", "Cleaning Supplies", "Cooking Oils"],
  },
  "beauty-personal-care": {
    title: "Beauty & Personal Care",
    desc: "Luxury fragrances, dermatologist-approved skincare, haircare treatments, and personal grooming products.",
    icon: "💄",
    subcats: ["All", "Perfumes & Colognes", "Skincare", "Hair Care", "Men's Grooming"],
  },
};

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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const currentMeta = categoryMeta[slug] || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    desc: "Explore verified products from official Nigerian brands and authorized merchants.",
    icon: "🛍️",
    subcats: ["All"],
  };

  const [selectedSubcat, setSelectedSubcat] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [wishlistIds, setWishlistIds] = useState<Record<string, boolean>>({});
  const [dbProducts, setDbProducts] = useState<ProductItem[] | null>(null);

  // Fetch real products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`/api/products?category=${slug}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDbProducts(data.data);
        }
      } catch (err) {
        console.error("Using local fallback products", err);
      }
    }
    loadProducts();
  }, [slug]);

  // Filter products by category, subcategory, and price
  const categoryProducts = useMemo(
    () => dbProducts || allCategoryProducts.filter((p) => p.category === slug),
    [dbProducts, slug]
  );
  const categoryHasProducts = categoryProducts.length > 0;

  const filteredProducts = useMemo(() => {
    let items = categoryProducts;

    if (selectedSubcat !== "All") {
      items = items.filter((p) => p.subCategory === selectedSubcat);
    }

    items = items.filter((p) => p.price <= maxPrice);

    if (sortBy === "price-low") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      items = [...items].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return items;
  }, [categoryProducts, selectedSubcat, maxPrice, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = async (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 2000);

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
    } catch {
      // Ignored
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="category-page-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">/</span>
          <a href="/#categories">Categories</a>
          <span className="breadcrumb-sep">/</span>
          <strong>{currentMeta.title}</strong>
        </nav>

        {/* Category Header Banner */}
        <div className="cat-hero-banner">
          <div className="cat-hero-text">
            <span className="cat-hero-badge">{currentMeta.icon} Verified Department</span>
            <h1>{currentMeta.title}</h1>
            <p>{currentMeta.desc}</p>
          </div>
          <div className="search-escrow-pill">
            <IconShield size={18} /> Official Stores &amp; Escrow Guarantee
          </div>
        </div>

        {/* Subcategory Pills */}
        <div className="subcat-pills-bar">
          {currentMeta.subcats.map((sub) => (
            <button
              key={sub}
              className={`subcat-pill ${selectedSubcat === sub ? "active" : ""}`}
              onClick={() => setSelectedSubcat(sub)}
              type="button"
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Main Layout: Filters Sidebar + Products Grid */}
        <div className="cat-layout-grid">
          {/* Sidebar Filters */}
          <aside className="cat-sidebar">
            <div className="search-sidebar-card">
              <div className="search-filter-header">
                <h3>Filter Products</h3>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSelectedSubcat("All");
                    setMaxPrice(3000000);
                    setSortBy("featured");
                  }}
                  type="button"
                >
                  Reset All
                </button>
              </div>

              {/* Price Filter */}
              <div className="search-filter-section">
                <span className="filter-section-title">
                  Max Price: <strong>₦{maxPrice.toLocaleString()}</strong>
                </span>
                <input
                  id="price-range"
                  type="range"
                  min={5000}
                  max={3000000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="price-range-slider"
                />
                <div className="range-bounds-row">
                  <span>₦5,000</span>
                  <span>₦3,000,000</span>
                </div>
              </div>

              {/* Delivery Filter */}
              <div className="search-filter-section">
                <span className="filter-section-title">Delivery Option</span>
                <label className="checkbox-filter-label">
                  <input type="checkbox" defaultChecked />
                  <span>Free Doorstep Delivery</span>
                </label>
                <label className="checkbox-filter-label" style={{ marginTop: "8px" }}>
                  <input type="checkbox" defaultChecked />
                  <span>Express 24h Shipping</span>
                </label>
              </div>

              {/* Rating Filter */}
              <div className="search-filter-section">
                <span className="filter-section-title">Customer Rating</span>
                <label className="checkbox-filter-label">
                  <input type="checkbox" />
                  <span>★ 4.5 &amp; above</span>
                </label>
                <label className="checkbox-filter-label" style={{ marginTop: "8px" }}>
                  <input type="checkbox" />
                  <span>★ 4.0 &amp; above</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Results */}
          <section className="cat-products-area">
            {/* Sort & Count Header */}
            <div className="search-controls-bar">
              <span className="results-badge-text">
                Showing <strong>{filteredProducts.length}</strong> items in <em>{currentMeta.title}</em>
              </span>

              <div className="sort-select-wrap">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="featured">Featured / Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="products-modern-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
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
                      <span className="seller-verified-pill">🛡️ {p.brand} Official</span>
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
                        className={`cart-action-btn ${addedItems[p.id] ? "added" : ""}`}
                        onClick={() => handleAddToCart(p.id)}
                        type="button"
                      >
                        {addedItems[p.id] ? "✓ Added to Cart!" : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : !categoryHasProducts ? (
              <div className="search-empty-state">
                <div className="empty-search-icon">📦</div>
                <h2>No Items Available in {currentMeta.title}</h2>
                <p>
                  Our verified merchants are restocking this department right now. Please check back shortly or explore other categories.
                </p>
                <a href="/" className="empty-home-btn">
                  ⚡ Back to Marketplace Home
                </a>
              </div>
            ) : (
              <div className="search-empty-state">
                <div className="empty-search-icon">🔍</div>
                <h2>No products match your current filters</h2>
                <p>Try increasing your price range or selecting <strong>All</strong> subcategories.</p>
                <button
                  className="empty-home-btn"
                  onClick={() => {
                    setSelectedSubcat("All");
                    setMaxPrice(3000000);
                  }}
                  type="button"
                >
                  Reset Category Filters
                </button>
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
