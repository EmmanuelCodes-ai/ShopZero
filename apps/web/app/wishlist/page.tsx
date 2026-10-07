"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { useAuth } from "../../context/auth-context";

interface WishItem {
  id: string;
  title: string;
  category: string;
  price: number;
  priceStr: string;
  wasPrice: number;
  wasStr: string;
  discount: string;
  rating: string;
  reviews: number;
  img: string;
  inStock: boolean;
  addedDate: string;
}

const INITIAL_WISHLIST: WishItem[] = [
  {
    id: "W-01",
    title: "Zenith Pro 5G Smartphone 256GB / 8GB RAM",
    category: "Phones & Tablets",
    price: 185000,
    priceStr: "₦185,000",
    wasPrice: 220000,
    wasStr: "₦220,000",
    discount: "16% OFF",
    rating: "4.8",
    reviews: 523,
    img: "/products/phone.jpg",
    inStock: true,
    addedDate: "20 Aug 2026",
  },
  {
    id: "W-02",
    title: "Smart LED TV 43-inch Full HD HDR with Voice Remote",
    category: "Electronics",
    price: 235000,
    priceStr: "₦235,000",
    wasPrice: 280000,
    wasStr: "₦280,000",
    discount: "16% OFF",
    rating: "4.5",
    reviews: 98,
    img: "/products/tv.jpg",
    inStock: true,
    addedDate: "18 Aug 2026",
  },
  {
    id: "W-03",
    title: "Seiko Automatic Stainless Steel Men's Dress Watch",
    category: "Fashion",
    price: 78000,
    priceStr: "₦78,000",
    wasPrice: 95000,
    wasStr: "₦95,000",
    discount: "18% OFF",
    rating: "4.9",
    reviews: 57,
    img: "/products/sneakers.jpg",
    inStock: true,
    addedDate: "15 Aug 2026",
  },
  {
    id: "W-04",
    title: "Versace Eros Pour Homme Eau de Parfum 100ml",
    category: "Beauty & Care",
    price: 55000,
    priceStr: "₦55,000",
    wasPrice: 72000,
    wasStr: "₦72,000",
    discount: "24% OFF",
    rating: "4.9",
    reviews: 874,
    img: "/products/sneakers.jpg",
    inStock: false,
    addedDate: "12 Aug 2026",
  },
  {
    id: "W-05",
    title: "Lumineux 2.5KVA Pure Sine Wave Inverter with Battery",
    category: "Home & Living",
    price: 145000,
    priceStr: "₦145,000",
    wasPrice: 178000,
    wasStr: "₦178,000",
    discount: "19% OFF",
    rating: "4.8",
    reviews: 133,
    img: "/products/airfryer.jpg",
    inStock: true,
    addedDate: "08 Aug 2026",
  },
  {
    id: "W-06",
    title: "Dell Inspiron 15 Laptop Intel Core i5, 16GB RAM 512GB SSD",
    category: "Electronics",
    price: 420000,
    priceStr: "₦420,000",
    wasPrice: 510000,
    wasStr: "₦510,000",
    discount: "18% OFF",
    rating: "4.6",
    reviews: 175,
    img: "/products/tv.jpg",
    inStock: true,
    addedDate: "05 Aug 2026",
  },
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

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<WishItem[]>(INITIAL_WISHLIST);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) return;
      try {
        const res = await fetch(`/api/wishlist?userId=${user.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (err) {
        console.error("Failed to load wishlist from backend", err);
      }
    }
    loadWishlist();
  }, [user]);

  const removeItem = async (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemovingId(null);
    }, 300);

    try {
      await fetch(`/api/wishlist?id=${id}`, { method: "DELETE" });
    } catch {
      // Ignored
    }
  };

  const handleAddToCart = async (id: string) => {
    setAddedToCart((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedToCart((prev) => ({ ...prev, [id]: false })), 2000);

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, productId: id, quantity: 1 }),
      });
    } catch {
      // Ignored
    }
  };

  const handleMoveAll = () => {
    const inStock = items.filter((i) => i.inStock);
    inStock.forEach((i) => handleAddToCart(i.id));
  };

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="wishlist-page">
          <div className="wishlist-empty-auth">
            <span>🔒</span>
            <h2>Sign In to View Your Wishlist</h2>
            <p>Save items you love and come back to them anytime.</p>
            <a href="/login?redirect=/wishlist" className="wish-btn wish-btn-primary">
              Sign In
            </a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="wishlist-page">
        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-header-inner">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/account">Account</a>
                <span>/</span>
                <strong>Wishlist</strong>
              </nav>
              <h1>
                My Wishlist
                <span className="wish-count-badge">{items.length} saved</span>
              </h1>
              <p>Items you love, ready when you are.</p>
            </div>
            {items.some((i) => i.inStock) && (
              <button className="wish-btn wish-btn-primary" onClick={handleMoveAll}>
                🛒 Add All In-Stock to Cart
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <span>💛</span>
            <h2>Your wishlist is empty</h2>
            <p>Tap the heart icon on any product to save it here.</p>
            <a href="/" className="wish-btn wish-btn-primary">Explore Products</a>
          </div>
        ) : (
          <div className="wishlist-grid-wrap">
            <div className="wishlist-grid">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`wish-card ${removingId === item.id ? "removing" : ""} ${!item.inStock ? "out-of-stock" : ""}`}
                >
                  {/* Remove button */}
                  <button
                    className="wish-remove-btn"
                    aria-label="Remove from wishlist"
                    onClick={() => removeItem(item.id)}
                  >
                    ✕
                  </button>

                  {/* Image */}
                  <div className="wish-card-img">
                    <span className="wish-discount-badge">{item.discount}</span>
                    {!item.inStock && <span className="wish-oos-banner">Out of Stock</span>}
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </div>

                  {/* Info */}
                  <div className="wish-card-info">
                    <span className="wish-category">{item.category}</span>
                    <h3>{item.title}</h3>

                    <div className="wish-rating-row">
                      <StarRating rating={item.rating} />
                      <span>{item.rating}</span>
                      <small>({item.reviews.toLocaleString()})</small>
                    </div>

                    <div className="wish-price-row">
                      <strong>{item.priceStr}</strong>
                      <del>{item.wasStr}</del>
                    </div>

                    <span className="wish-added-date">Saved {item.addedDate}</span>

                    <button
                      className={`wish-cart-btn ${addedToCart[item.id] ? "added" : ""}`}
                      onClick={() => handleAddToCart(item.id)}
                      disabled={!item.inStock}
                    >
                      {!item.inStock
                        ? "Out of Stock"
                        : addedToCart[item.id]
                        ? "✓ Added to Cart"
                        : "🛒 Add to Cart"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
