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
} from "./icons";

const categoryCatalog = [
  {
    name: "Phones & Tablets",
    icon: <IconPhone size={18} />,
    slug: "phones-tablets",
    subcategories: ["Smartphones (5G & 4G)", "Tablets & iPads", "Power Banks & Batteries", "Fast Chargers & Cables", "Smartwatches & Bands", "Cases & Screen Protectors"],
  },
  {
    name: "Electronics",
    icon: <IconBolt size={18} />,
    slug: "electronics",
    subcategories: ["Smart LED Televisions", "Bluetooth Soundbars & Audio", "Home Theatre Systems", "Gaming Consoles & Games", "Cameras & Camcorders", "Laptops & Computing"],
  },
  {
    name: "Fashion",
    icon: <IconShirt size={18} />,
    slug: "fashion",
    subcategories: ["Men's Clothing & Suits", "Women's Dresses & Native", "Sneakers & Casual Shoes", "Luxury Watches & Jewelry", "Handbags & Backpacks", "Kids' & Baby Clothing"],
  },
  {
    name: "Home & Living",
    icon: <IconHome size={18} />,
    slug: "home-living",
    subcategories: ["Air Fryers & Microwaves", "Blenders & Food Processors", "Inverters & Solar Power", "Bedding & Mattress", "Living Room Furniture", "Generators & Stabilizers"],
  },
  {
    name: "Groceries & Supermarket",
    icon: <IconGrocery size={18} />,
    slug: "groceries",
    subcategories: ["Food Cupboard & Grains", "Beverages, Coffee & Juices", "Cleaning & Detergents", "Cooking Oils & Seasonings", "Breakfast Cereals & Milk", "Baby Formula & Food"],
  },
  {
    name: "Beauty & Personal Care",
    icon: <IconBeauty size={18} />,
    slug: "beauty-personal-care",
    subcategories: ["Luxury Perfumes & Colognes", "Skincare & Sunscreen", "Hair Care & Extensions", "Men's Grooming & Shaving", "Makeup & Cosmetics", "Oral & Dental Care"],
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
  const [cartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name ? user.name.split(" ")[0] : null;

  // Close menu on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
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
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-marquee">
          <span>
            Free delivery on orders over ₦15,000 &nbsp;·&nbsp;
            Secure payments guaranteed &nbsp;·&nbsp;
            Up to 40% off Back-to-School essentials &nbsp;·&nbsp;
            Sell on Shop Zero — join 50,000+ merchants &nbsp;·&nbsp;
            Flash sale ends today — don't miss out
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
        <nav className="topbar-links">
          <a href="/sell">Sell on Shop Zero</a>
          <a href="/help">Help</a>
          {user ? (
            <a href="/account" className="topbar-user">Hi, {firstName}</a>
          ) : (
            <a href="/login" className="topbar-auth">Sign In / Register</a>
          )}
        </nav>
      </div>

      {/* Sticky Header */}
      <div className="header-wrap" ref={menuRef}>
        <header className="header">
          <a className="logo" href="/">
            SHOP<span>ZERO</span>
          </a>

          <form className="search" action="/search">
            <input
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands and categories…"
              aria-label="Search Shop Zero"
            />
            <button type="submit" aria-label="Submit search" className="search-btn">
              <IconSearch size={17} />
              <span>Search</span>
            </button>
          </form>

          <nav className="account-nav">
            <a href={user ? "/account" : "/login"} aria-label={user ? "My account" : "Sign In"}>
              <IconUser size={21} />
              <span>{user ? `Hi, ${firstName}` : "Sign In"}</span>
            </a>
            <a href={user ? "/orders" : "/login?redirect=/orders"} aria-label="My orders">
              <IconPackage size={21} />
              <span>Orders</span>
            </a>
            <a href="/cart" className="cart-link" aria-label="Shopping cart">
              <span className="cart-icon-wrap">
                <IconCart size={22} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </span>
              <span>Cart</span>
            </a>
          </nav>
        </header>

        {/* Departments Bar */}
        <div className="departments-wrap">
          <nav className="departments" aria-label="Shop departments">
            <button
              className={`all-categories ${isMenuOpen ? "active" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <IconMenu size={16} />
              <span>All Categories</span>
              <span className="caret-icon">{isMenuOpen ? "▲" : "▼"}</span>
            </button>
            {departments.map((dept) => (
              <a
                key={dept}
                href={`/c/${dept.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}`}
              >
                {dept}
              </a>
            ))}
            <a href="/deals" className="deals">⚡ Flash Deals</a>
          </nav>
        </div>

        {/* ── Mega Menu / Categories Dropdown ── */}
        {isMenuOpen && (
          <div className="mega-menu-overlay">
            <div className="mega-menu-panel">
              <div className="mega-menu-header">
                <h3>Explore All Categories</h3>
                <button
                  className="close-menu-btn"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="mega-menu-grid">
                {categoryCatalog.map((cat) => (
                  <div className="mega-cat-col" key={cat.name}>
                    <a
                      className="mega-cat-title"
                      href={`/c/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="cat-icon-badge">{cat.icon}</span>
                      <strong>{cat.name}</strong>
                    </a>
                    <ul className="subcat-list">
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

              <div className="mega-menu-footer">
                <div className="mega-footer-promo">
                  <span className="promo-tag">🔥 FLASH SALE</span>
                  <span>Save up to 40% on top tech, groceries &amp; essentials today.</span>
                </div>
                <a
                  href="/deals"
                  className="mega-view-deals-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Deals →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
