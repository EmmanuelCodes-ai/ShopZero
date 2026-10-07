"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { SiteHeader } from "../../../components/site-header";
import { IconShield, IconTruck, IconBadge } from "../../../components/icons";

interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  tag?: string;
}

const mockProducts: ProductItem[] = [
  {
    id: "prod-101",
    title: "Apple iPhone 15 Pro Max 256GB - Natural Titanium (Dual SIM)",
    category: "Smartphones",
    price: 1850000,
    originalPrice: 1950000,
    rating: 4.9,
    reviewsCount: 320,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    tag: "Top Seller",
  },
  {
    id: "prod-102",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Audio",
    price: 489000,
    originalPrice: 520000,
    rating: 4.8,
    reviewsCount: 184,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    tag: "20% OFF",
  },
  {
    id: "prod-103",
    title: 'MacBook Pro 16" M3 Max 36GB RAM 1TB SSD - Space Black',
    category: "Laptops",
    price: 4200000,
    originalPrice: 4500000,
    rating: 5.0,
    reviewsCount: 96,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    tag: "Verified Genuine",
  },
  {
    id: "prod-104",
    title: "Samsung Galaxy S24 Ultra 512GB - Titanium Black",
    category: "Smartphones",
    price: 1720000,
    originalPrice: 1800000,
    rating: 4.9,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    inStock: true,
  },
];

export default function VendorStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const storeName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://shopzero.com/store/${slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filteredProducts = mockProducts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="storefront-page">
      <SiteHeader />

      {/* ── Vendor Store Banner Header ── */}
      <section className="vendor-banner-header">
        <div className="vendor-banner-overlay">
          <div className="container vendor-header-content">
            <div className="vendor-avatar-wrap">
              <div className="vendor-avatar-icon">🏪</div>
              <span className="verified-badge-icon" title="Verified Merchant">✓</span>
            </div>

            <div className="vendor-meta-col">
              <div className="vendor-title-row">
                <h1 className="vendor-store-title">{storeName}</h1>
                <span className="merchant-status-badge">Official Store</span>
              </div>

              <p className="vendor-store-handle">shopzero.com/store/{slug}</p>

              <div className="vendor-stats-row">
                <div className="stat-item">
                  <span className="stat-value">⭐ 4.9 / 5.0</span>
                  <span className="stat-label">(1,240 Ratings)</span>
                </div>
                <div className="stat-divider">•</div>
                <div className="stat-item">
                  <span className="stat-value">⚡ 99%</span>
                  <span className="stat-label">Response Rate</span>
                </div>
                <div className="stat-divider">•</div>
                <div className="stat-item">
                  <span className="stat-value">📦 &lt; 24 Hours</span>
                  <span className="stat-label">Dispatch Speed</span>
                </div>
              </div>
            </div>

            <div className="vendor-share-action">
              <button className={`copy-link-btn ${copied ? "copied" : ""}`} onClick={handleCopyLink} type="button">
                {copied ? "✓ Link Copied!" : "🔗 Share Store Link"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Storefront Main Content ── */}
      <main className="container storefront-body">
        {/* Guarantees Bar */}
        <div className="vendor-guarantees-bar">
          <div className="guarantee-chip">
            <IconShield /> <span>100% Genuine Guarantee</span>
          </div>
          <div className="guarantee-chip">
            <IconTruck /> <span>Fast Express Delivery</span>
          </div>
          <div className="guarantee-chip">
            <IconBadge /> <span>Escrow Payment Protection</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="store-filter-bar">
          <div className="category-pills">
            {["All", "Smartphones", "Laptops", "Audio"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="store-search-input">
            <input
              type="text"
              placeholder={`Search products in ${storeName}…`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="store-products-header">
          <h2>Catalog ({filteredProducts.length} Items)</h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products-box">
            <p>No products match your search query in this store.</p>
          </div>
        ) : (
          <div className="store-products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="store-product-card">
                {product.tag && <span className="product-card-tag">{product.tag}</span>}
                <div className="product-card-img-wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-card-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-rating">
                    <span>★ {product.rating}</span>
                    <span className="review-count">({product.reviewsCount})</span>
                  </div>
                  <div className="product-price-row">
                    <div className="price-col">
                      <span className="current-price">₦{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">₦{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button className="add-cart-btn" type="button">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
