export function SiteFooter() {
  return (
    <footer className="luxury-footer">
      <div className="footer-inner-grid">
        {/* Brand Column */}
        <div className="footer-brand-column">
          <a href="/" className="footer-brand-logo">
            Shop<span>Zero</span>
          </a>
          <p className="footer-tagline-text">
            Nigeria&apos;s most trusted escrow marketplace. Discover over
            150,000 verified genuine products from vetted merchants — pay only
            when you&apos;re satisfied.
          </p>
          <div className="footer-badges-list">
            <span className="payment-chip">🔒 Escrow Protected</span>
            <span className="payment-chip">💳 Mastercard</span>
            <span className="payment-chip">💳 Visa</span>
            <span className="payment-chip">💳 Verve</span>
            <span className="payment-chip">⚡ Paystack</span>
          </div>
        </div>

        {/* Shop Categories */}
        <div className="footer-links-column">
          <h4>Shop Categories</h4>
          <a href="/c/electronics">Electronics &amp; Gadgets</a>
          <a href="/c/phones-tablets">Phones &amp; Tablets</a>
          <a href="/c/fashion">Fashion &amp; Apparel</a>
          <a href="/c/home-living">Home &amp; Kitchen</a>
          <a href="/c/groceries">Groceries &amp; Foodstuff</a>
          <a href="/deals">Flash Sale Deals</a>
        </div>

        {/* Customer Service */}
        <div className="footer-links-column">
          <h4>Customer Service</h4>
          <a href="/account">My Account</a>
          <a href="/orders">Track Your Order</a>
          <a href="/wishlist">Saved Wishlist</a>
          <a href="/cart">Shopping Cart</a>
          <a href="/returns">Returns &amp; Refunds</a>
          <a href="/help">Help Center &amp; FAQs</a>
        </div>

        {/* Sell on ShopZero */}
        <div className="footer-links-column">
          <h4>Sell on ShopZero</h4>
          <a href="/login?tab=register">Open Merchant Store</a>
          <a href="/vendor/kyc">Vendor KYC Verification</a>
          <a href="/sell">Seller Protection &amp; Escrow</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>
            © {new Date().getFullYear()} ShopZero Technologies Ltd. All rights
            reserved.
          </p>
          <p className="footer-tagline">
            Engineered with ❤️ in Lagos, Nigeria &nbsp;·&nbsp; Bank-Grade
            Security
          </p>
        </div>
      </div>
    </footer>
  );
}
