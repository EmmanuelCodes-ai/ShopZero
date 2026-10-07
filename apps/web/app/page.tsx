import { SiteHeader } from "../components/site-header";
import { NewsletterForm } from "../components/newsletter-form";
import {
  IconPhone, IconShirt, IconHome, IconGrocery, IconBeauty, IconBolt,
  IconTruck, IconShield, IconReturn, IconBadge,
} from "../components/icons";

/* ── Flash sale products (4 items) ── */
const flashProducts = [
  {
    title: "Wireless Noise-Cancelling Headphones",
    price: "₦48,900", was: "₦65,000", rating: "4.7", discount: "25%",
    img: "/products/headphones.jpg", reviews: 312,
  },
  {
    title: "Smart LED TV 43-inch Full HD",
    price: "₦235,000", was: "₦280,000", rating: "4.5", discount: "16%",
    img: "/products/tv.jpg", reviews: 98,
  },
  {
    title: "Everyday Air Fryer 5L Digital",
    price: "₦59,500", was: "₦72,000", rating: "4.6", discount: "17%",
    img: "/products/airfryer.jpg", reviews: 441,
  },
  {
    title: "Men's Classic Running Sneakers",
    price: "₦32,990", was: "₦45,000", rating: "4.4", discount: "27%",
    img: "/products/sneakers.jpg", reviews: 187,
  },
];

/* ── Trending products (4 items, 2nd grid) ── */
const trendingProducts = [
  {
    title: "Zenith Pro 5G Smartphone 256GB",
    price: "₦185,000", was: "₦220,000", rating: "4.8", discount: "16%",
    img: "/products/phone.jpg", reviews: 523,
  },
  {
    title: "Velociti High-Speed Blender 1500W",
    price: "₦41,500", was: "₦55,000", rating: "4.6", discount: "25%",
    img: "/products/blender.jpg", reviews: 278,
  },
  {
    title: "Le Voyage Premium Leather Handbag",
    price: "₦28,750", was: "₦39,000", rating: "4.7", discount: "26%",
    img: "/products/bag.jpg", reviews: 194,
  },
  {
    title: "Lumina Noir Eau de Parfum 100ml",
    price: "₦19,900", was: "₦27,500", rating: "4.5", discount: "28%",
    img: "", reviews: 360, /* no image — uses CSS gradient */
    gradient: "linear-gradient(135deg,#2d1b69,#7c3aed,#c4b5fd)",
    emoji: "✨",
  },
];

const categories = [
  { icon: <IconPhone />,   label: "Phones & Tablets", href: "/c/phones-tablets" },
  { icon: <IconShirt />,   label: "Fashion",           href: "/c/fashion" },
  { icon: <IconHome />,    label: "Home & Living",     href: "/c/home-living" },
  { icon: <IconGrocery />, label: "Groceries",          href: "/c/groceries" },
  { icon: <IconBeauty />,  label: "Beauty",             href: "/c/beauty-personal-care" },
  { icon: <IconBolt />,    label: "Electronics",        href: "/c/electronics" },
];

const trustBadges = [
  { icon: <IconTruck />,  title: "Free Delivery",   body: "On eligible orders over ₦15,000 across Nigeria" },
  { icon: <IconShield />, title: "Secure Payments", body: "Bank-grade encryption on every transaction" },
  { icon: <IconReturn />, title: "Easy Returns",    body: "Hassle-free 7-day returns, no questions asked" },
  { icon: <IconBadge />,  title: "100% Genuine",    body: "All products verified directly from brands" },
];

function StarRating({ rating }: { rating: string }) {
  const r = parseFloat(rating);
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(r) ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

function ProductCard({
  title, price, was, rating, discount, img, reviews, gradient, emoji, delay,
}: {
  title: string; price: string; was: string; rating: string; discount: string;
  img: string; reviews: number; gradient?: string; emoji?: string; delay?: number;
}) {
  return (
    <article className="product" style={{ animationDelay: `${delay ?? 0}ms` }}>
      <div
        className="product-image"
        style={img ? undefined : { background: gradient }}
      >
        <span className="badge">-{discount}</span>
        {img
          ? <img src={img} alt={title} loading="lazy" />
          : <em>{emoji}</em>}
      </div>
      <h3>{title}</h3>
      <div className="product-price">
        <strong>{price}</strong>
        <del>{was}</del>
      </div>
      <p className="rating">
        <StarRating rating={rating} />
        <span className="rating-num">{rating}</span>
        <small>({reviews.toLocaleString()})</small>
      </p>
      <button>Add to cart</button>
    </article>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">BACK TO SCHOOL</p>
            <h1>Big brands.<br />Zero guesswork.</h1>
            <p>Up to 40% off essentials, delivered to your door.</p>
            <div className="hero-actions">
              <button>Shop the sale</button>
              <a className="hero-link" href="/deals">View all deals →</a>
            </div>
          </div>
          <aside>
            <strong>Shop by need</strong>
            <a href="/c/phones-tablets">Phones &amp; Tablets</a>
            <a href="/c/groceries">Fresh Groceries</a>
            <a href="/c/home-living">Home Upgrades</a>
            <a href="/c/fashion">Fashion Finds</a>
          </aside>
        </section>

        {/* ── Trust strip ── */}
        <section className="trust-strip">
          {trustBadges.map(({ icon, title, body }) => (
            <div className="trust-badge" key={title}>
              <span className="trust-icon">{icon}</span>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Categories ── */}
        <section className="categories-section">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(({ icon, label, href }) => (
              <a className="category-card" href={href} key={label}>
                <span className="cat-icon">{icon}</span>
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* ── Flash Sale ── */}
        <section className="section-heading">
          <div>
            <p className="eyebrow">LIMITED TIME</p>
            <h2>Flash Sale</h2>
          </div>
          <div className="countdown">
            Ends in
            <span className="countdown-badge">04 : 18 : 29</span>
          </div>
          <a href="/deals">See all →</a>
        </section>
        <section className="product-grid">
          {flashProducts.map(({ title, price, was, rating, discount, img, reviews }, i) => (
            <ProductCard key={title} title={title} price={price} was={was}
              rating={rating} discount={discount} img={img} reviews={reviews}
              delay={i * 60} />
          ))}
        </section>

        {/* ── Promo Banner ── */}
        <section className="promo-banner">
          <div className="promo-content">
            <p className="eyebrow">EXCLUSIVE OFFER</p>
            <h2>New customers get ₦2,000 off</h2>
            <p>Use code <strong>WELCOME2K</strong> on your first order. Min. spend ₦10,000.</p>
            <a className="promo-btn" href="/register">Claim your discount →</a>
          </div>
          <div className="promo-graphic" aria-hidden="true">
            <span>🎁</span>
          </div>
        </section>

        {/* ── Trending Now ── */}
        <section className="section-heading">
          <div>
            <p className="eyebrow">THIS WEEK</p>
            <h2>Trending Now</h2>
          </div>
          <a href="/trending">See all →</a>
        </section>
        <section className="product-grid">
          {trendingProducts.map(({ title, price, was, rating, discount, img, reviews, gradient, emoji }, i) => (
            <ProductCard key={title} title={title} price={price} was={was}
              rating={rating} discount={discount} img={img} reviews={reviews}
              gradient={gradient} emoji={emoji} delay={i * 60} />
          ))}
        </section>

        {/* ── Newsletter ── */}
        <section className="newsletter">
          <div className="newsletter-inner">
            <div>
              <h2>Stay in the loop</h2>
              <p>Get exclusive deals, restocks alerts, and new arrivals straight to your inbox.</p>
            </div>
            <NewsletterForm />
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a className="logo" href="/">SHOP<span>ZERO</span></a>
            <p>Nigeria's favourite multi-category marketplace. Big brands, genuine products, and fast delivery — all in one place.</p>
            <div className="footer-socials">
              <a href="https://twitter.com"   aria-label="Twitter"   rel="noopener noreferrer">𝕏</a>
              <a href="https://instagram.com" aria-label="Instagram" rel="noopener noreferrer">📸</a>
              <a href="https://facebook.com"  aria-label="Facebook"  rel="noopener noreferrer">f</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <a href="/c/electronics">Electronics</a>
            <a href="/c/fashion">Fashion</a>
            <a href="/c/home-living">Home &amp; Living</a>
            <a href="/c/groceries">Groceries</a>
            <a href="/deals">Flash Deals</a>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <a href="/account">My Account</a>
            <a href="/orders">My Orders</a>
            <a href="/wishlist">Wishlist</a>
            <a href="/cart">Cart</a>
            <a href="/sell">Sell on Shop Zero</a>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <a href="/help">Help Center</a>
            <a href="/returns">Returns</a>
            <a href="/shipping">Shipping Info</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Shop Zero Ltd. All rights reserved. &nbsp;·&nbsp; Made with ❤️ in Nigeria
        </div>
      </footer>
    </>
  );
}
