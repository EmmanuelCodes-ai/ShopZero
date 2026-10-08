"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/auth-context";
import {
  IconSearch,
  IconUser,
  IconPackage,
  IconCart,
  IconMenu,
  IconPhone,
  IconBolt,
  IconShirt,
  IconHome,
  IconGrocery,
  IconBeauty,
  IconHeart,
} from "./icons";

const categoryCatalog = [
  {
    name: "Phones & Tablets",
    icon: <IconPhone size={18} />,
    slug: "phones-tablets",
    subcategories: [
      "Smartphones (5G & 4G)",
      "Tablets & iPads",
      "Power Banks & Batteries",
      "Fast Chargers & Cables",
      "Smartwatches & Bands",
      "Cases & Screen Protectors",
    ],
  },
  {
    name: "Electronics & Audio",
    icon: <IconBolt size={18} />,
    slug: "electronics",
    subcategories: [
      "Smart LED Televisions",
      "Bluetooth Soundbars & Audio",
      "Home Theatre Systems",
      "Gaming Consoles & Games",
      "Cameras & Camcorders",
      "Laptops & Computing",
    ],
  },
  {
    name: "Fashion & Apparel",
    icon: <IconShirt size={18} />,
    slug: "fashion",
    subcategories: [
      "Men's Clothing & Suits",
      "Women's Dresses & Native",
      "Sneakers & Casual Shoes",
      "Luxury Watches & Jewelry",
      "Handbags & Backpacks",
      "Kids' & Baby Clothing",
    ],
  },
  {
    name: "Home & Kitchen",
    icon: <IconHome size={18} />,
    slug: "home-living",
    subcategories: [
      "Air Fryers & Microwaves",
      "Blenders & Food Processors",
      "Inverters & Solar Power",
      "Bedding & Mattress",
      "Living Room Furniture",
      "Generators & Stabilizers",
    ],
  },
  {
    name: "Groceries & Supermarket",
    icon: <IconGrocery size={18} />,
    slug: "groceries",
    subcategories: [
      "Food Cupboard & Grains",
      "Beverages, Coffee & Juices",
      "Cleaning & Detergents",
      "Cooking Oils & Seasonings",
      "Breakfast Cereals & Milk",
      "Baby Formula & Food",
    ],
  },
  {
    name: "Beauty & Fragrances",
    icon: <IconBeauty size={18} />,
    slug: "beauty-personal-care",
    subcategories: [
      "Luxury Perfumes & Colognes",
      "Skincare & Sunscreen",
      "Hair Care & Extensions",
      "Men's Grooming & Shaving",
      "Makeup & Cosmetics",
      "Oral & Dental Care",
    ],
  },
];

const departments = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Groceries",
  "Beauty & Personal Care",
  "Phones & Tablets",
];

export function SiteHeader() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name ? user.name.split(" ")[0] : null;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SZ";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchFocused(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* ── Announcement Topbar ── */}
      <div className="topbar">
        <div className="topbar-inner-container">
          <div className="topbar-marquee">
            <span className="marquee-content">
              🚚 <strong>Free delivery</strong> on orders above ₦15,000 across Nigeria &nbsp;·&nbsp;
              🛡️ <strong>100% Escrow Buyer Protection</strong> on all orders &nbsp;·&nbsp;
              ⚡ <strong>Flash Deals</strong> ending today &nbsp;·&nbsp;
              🏪 <strong>Sell on Shop Zero</strong> — 0% commission for 30 days &nbsp;·&nbsp;
              🚚 <strong>Free delivery</strong> on orders above ₦15,000 across Nigeria
            </span>
          </div>

          <nav className="topbar-actions" aria-label="Quick links">
            <a href="/login?tab=register" className="topbar-link seller-badge-link">
              <span className="seller-star">⭐</span> Sell on Shop Zero
            </a>
            <span className="topbar-sep">|</span>
            <a href="/help" className="topbar-link">Help &amp; FAQs</a>
            <span className="topbar-sep">|</span>
            {user ? (
              <a href="/account" className="topbar-link user-highlight">
                <span className="user-dot" />
                Hi, {firstName}
              </a>
            ) : (
              <a href="/login" className="topbar-link auth-cta">
                Sign In / Register
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* ── Glassmorphic Main Navigation Header ── */}
      <div className="header-sticky-wrapper" ref={menuRef}>
        <header className="header-main-surface">
          <div className="header-left-col">
            <a className="brand-logo" href="/" aria-label="ShOpZerO Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="ShOpZerO"
                className="brand-logo-img"
              />
            </a>
          </div>

          {/* Search bar */}
          <div className="search-col-wrapper">
            <form
              className={`modern-search-bar ${isSearchFocused ? "focused" : ""}`}
              action="/search"
              method="GET"
              role="search"
              onClick={() => {
                const el = document.getElementById("header-search-input");
                if (el) el.focus();
              }}
            >
              <div className="search-icon-prefix">
                <IconSearch size={18} />
              </div>
              <input
                id="header-search-input"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search over 150,000 genuine products, brands &amp; stores…"
                aria-label="Search Shop Zero"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery("");
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button type="submit" className="modern-search-submit-btn">
                <span>Search</span>
              </button>
            </form>

            {/* Quick search suggestions popup */}
            {isSearchFocused && (
              <div className="search-suggestions-dropdown">
                {query.trim() ? (
                  <div className="live-search-results">
                    <div className="suggestions-header">
                      <span>MATCHING PRODUCTS</span>
                    </div>
                    <div className="live-suggestions-list">
                      {[
                        {
                          id: "SP-01",
                          title: "Apple iPhone 15 Pro Max 256GB - Natural Titanium",
                          category: "Phones & Tablets",
                          price: "₦1,850,000",
                          img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          id: "SP-02",
                          title: "Sony WH-1000XM5 Wireless Headphones Pro",
                          category: "Electronics",
                          price: "₦48,900",
                          img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          id: "SP-04",
                          title: "Samsung Galaxy S24 Ultra 512GB - Titanium Black",
                          category: "Phones & Tablets",
                          price: "₦1,720,000",
                          img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          id: "SP-06",
                          title: "Samsung 43-inch Crystal UHD 4K Smart TV",
                          category: "Electronics",
                          price: "₦235,000",
                          img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          id: "SP-08",
                          title: "Digital Touchscreen Air Fryer 5.5L 8-Presets",
                          category: "Home & Living",
                          price: "₦59,500",
                          img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          id: "SP-10",
                          title: "Men's Pro Breathable Cushion Running Sneakers",
                          category: "Fashion",
                          price: "₦32,990",
                          img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          id: "SP-12",
                          title: "Lumina Noir Luxury Unisex Eau de Parfum 100ml",
                          category: "Beauty",
                          price: "₦19,900",
                          img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&auto=format&fit=crop&q=80",
                        },
                      ]
                        .filter(
                          (item) =>
                            item.title.toLowerCase().includes(query.toLowerCase()) ||
                            item.category.toLowerCase().includes(query.toLowerCase())
                        )
                        .slice(0, 4)
                        .map((item) => (
                          <a
                            key={item.id}
                            href={`/search?q=${encodeURIComponent(item.title)}`}
                            className="live-suggestion-item"
                          >
                            <img src={item.img} alt={item.title} className="suggestion-thumb" />
                            <div className="suggestion-item-info">
                              <span className="suggestion-item-title">{item.title}</span>
                              <div className="suggestion-item-meta">
                                <span className="suggestion-item-price">{item.price}</span>
                                <span className="suggestion-item-cat">{item.category}</span>
                              </div>
                            </div>
                            <span className="suggestion-arrow">→</span>
                          </a>
                        ))}
                    </div>
                    <a
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="view-all-search-link"
                    >
                      <span>🔍 View all results for &ldquo;{query}&rdquo;</span>
                      <strong>→</strong>
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="suggestions-header">
                      <span>🔥 POPULAR SEARCHES</span>
                    </div>
                    <div className="suggestions-tags-row">
                      <a href="/search?q=iPhone" className="suggestion-pill">iPhone 15 Pro</a>
                      <a href="/search?q=Sony" className="suggestion-pill">Sony Headphones</a>
                      <a href="/search?q=Air+Fryer" className="suggestion-pill">Digital Air Fryer</a>
                      <a href="/search?q=Sneakers" className="suggestion-pill">Nike Sneakers</a>
                      <a href="/search?q=Perfume" className="suggestion-pill">Lumina Perfume</a>
                      <a href="/search?q=Smart+TV" className="suggestion-pill">Smart LED TV</a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Navigation Actions */}
          <nav className="header-right-nav" aria-label="Account and cart navigation">
            <a href="/wishlist" className="nav-action-pill wishlist-pill" aria-label="Wishlist">
              <IconHeart size={20} />
              <span className="pill-title">Saved</span>
            </a>

            <a href={user ? "/account" : "/login"} className="nav-action-pill account-pill" aria-label="Account">
              {user ? (
                <div className="user-avatar-circle">{initials}</div>
              ) : (
                <IconUser size={20} />
              )}
              <div className="nav-pill-text-stack">
                <small>{user ? "Account" : "Welcome"}</small>
                <strong>{user ? firstName : "Sign In"}</strong>
              </div>
            </a>

            <a href={user ? "/orders" : "/login?redirect=/orders"} className="nav-action-pill orders-pill" aria-label="Orders">
              <IconPackage size={20} />
              <div className="nav-pill-text-stack">
                <small>Track</small>
                <strong>Orders</strong>
              </div>
            </a>

            <a href="/cart" className="nav-action-pill cart-action-pill" aria-label="Shopping Cart">
              <div className="cart-icon-container">
                <IconCart size={22} />
                <span className="cart-badge-counter">3</span>
              </div>
              <div className="nav-pill-text-stack cart-text">
                <small>Cart</small>
                <strong>₦137,150</strong>
              </div>
            </a>
          </nav>
        </header>

        {/* ── Sub-Navigation / Departments Bar ── */}
        <div className="departments-subbar">
          <div className="departments-inner-flex">
            <button
              className={`all-categories-trigger-btn ${isMenuOpen ? "active" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              type="button"
            >
              <IconMenu size={16} />
              <span>All Categories</span>
              <span className="dropdown-caret-arrow">{isMenuOpen ? "▲" : "▼"}</span>
            </button>

            <nav className="department-links-scroll" aria-label="Shop departments">
              {departments.map((dept) => (
                <a
                  key={dept}
                  className="dept-link-item"
                  href={`/c/${dept.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}`}
                >
                  {dept}
                </a>
              ))}
              <a href="/deals" className="dept-link-item flash-deal-highlight">
                <span className="bolt-emoji">⚡</span> Flash Deals
              </a>
            </nav>
          </div>
        </div>

        {/* ── Mega Menu Drawer Overlay ── */}
        {isMenuOpen && (
          <div className="mega-menu-overlay">
            <div className="mega-menu-panel">
              <div className="mega-menu-header">
                <div className="mega-header-title-flex">
                  <span className="mega-title-badge">CATALOG</span>
                  <h3>Explore All Product Categories</h3>
                </div>
                <button
                  className="close-mega-menu-btn"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  type="button"
                >
                  ✕
                </button>
              </div>

              <div className="mega-menu-grid">
                {categoryCatalog.map((cat) => (
                  <div className="mega-cat-column" key={cat.name}>
                    <a
                      className="mega-cat-header-link"
                      href={`/c/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mega-cat-icon-badge">{cat.icon}</span>
                      <strong>{cat.name}</strong>
                    </a>
                    <ul className="mega-subcat-list">
                      {cat.subcategories.map((sub) => (
                        <li key={sub}>
                          <a
                            href={`/c/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mega-menu-bottom-banner">
                <div className="mega-banner-text">
                  <span className="mega-fire-pill">🔥 40% OFF FLASH SALE</span>
                  <span>Grab today&apos;s hottest discounts on verified gadgets, fashion &amp; appliances.</span>
                </div>
                <a
                  href="/deals"
                  className="mega-view-deals-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop Flash Deals Now →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
