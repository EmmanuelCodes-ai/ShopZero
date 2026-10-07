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
            <a className="brand-logo" href="/" aria-label="Shop Zero Home">
              <div className="brand-logo-icon">SZ</div>
              <div className="brand-logo-text">
                SHOP<span>ZERO</span>
              </div>
            </a>
          </div>

          {/* Search bar */}
          <div className="search-col-wrapper">
            <form
              className={`modern-search-bar ${isSearchFocused ? "focused" : ""}`}
              action="/c/electronics"
              role="search"
            >
              <div className="search-icon-prefix">
                <IconSearch size={18} />
              </div>
              <input
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search over 150,000 genuine products, brands &amp; stores…"
                aria-label="Search Shop Zero"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setQuery("")}
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
                <div className="suggestions-header">
                  <span>🔥 POPULAR SEARCHES</span>
                </div>
                <div className="suggestions-tags-row">
                  <a href="/c/phones-tablets" className="suggestion-pill">iPhone 15 Pro</a>
                  <a href="/c/electronics" className="suggestion-pill">Sony Headphones</a>
                  <a href="/c/home-living" className="suggestion-pill">Digital Air Fryer</a>
                  <a href="/c/fashion" className="suggestion-pill">Nike Sneakers</a>
                  <a href="/c/beauty-personal-care" className="suggestion-pill">Lumina Perfume</a>
                </div>
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
