"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { useAuth } from "../../context/auth-context";
import {
  IconUser,
  IconPackage,
  IconHeart,
  IconMapPin,
  IconCreditCard,
  IconLogOut,
  IconShield,
  IconBolt,
} from "../../components/icons";

const mockBuyerOrders = [
  {
    id: "ORD-948201",
    date: "21 Aug 2026",
    status: "In Transit",
    statusClass: "status-transit",
    total: "₦48,900",
    items: "Wireless Noise-Cancelling Headphones (1)",
    img: "/products/headphones.jpg",
  },
  {
    id: "ORD-892144",
    date: "14 Aug 2026",
    status: "Delivered",
    statusClass: "status-delivered",
    total: "₦32,990",
    items: "Men's Classic Running Sneakers (1)",
    img: "/products/sneakers.jpg",
  },
  {
    id: "ORD-761209",
    date: "02 Aug 2026",
    status: "Delivered",
    statusClass: "status-delivered",
    total: "₦59,500",
    items: "Everyday Air Fryer 5L Digital (1)",
    img: "/products/airfryer.jpg",
  },
];

const mockSellerProducts = [
  { id: "PRD-01", title: "Wireless Noise-Cancelling Headphones", price: "₦48,900", stock: 24, status: "Active", img: "/products/headphones.jpg" },
  { id: "PRD-02", title: "Smart LED TV 43-inch Full HD", price: "₦235,000", stock: 8, status: "Active", img: "/products/tv.jpg" },
  { id: "PRD-03", title: "Everyday Air Fryer 5L Digital", price: "₦59,500", stock: 15, status: "Active", img: "/products/airfryer.jpg" },
  { id: "PRD-04", title: "Zenith Pro 5G Smartphone 256GB", price: "₦185,000", stock: 12, status: "Active", img: "/products/phone.jpg" },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="account-page">
          <div className="auth-card" style={{ maxWidth: "480px", margin: "60px auto", textAlign: "center" }}>
            <div className="profile-avatar" style={{ margin: "0 auto 16px" }}>🔒</div>
            <h2>Please Sign In</h2>
            <p style={{ color: "var(--ink-muted)", margin: "8px 0 24px" }}>
              Sign in to manage your account, store, orders, and wallet balance.
            </p>
            <a href="/login?redirect=/account" className="auth-submit-btn inline-btn">
              Sign In to Your Account
            </a>
          </div>
        </main>
      </>
    );
  }

  const isSeller = user.role === "VENDOR";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SZ";

  return (
    <>
      <SiteHeader />
      <main className="account-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <strong>{isSeller ? "Merchant Portal" : "My Account"}</strong>
        </nav>

        <div className="account-layout">
          {/* ── Sidebar ── */}
          <aside className="account-sidebar">
            <div className="profile-summary">
              <div className="profile-avatar">{initials}</div>
              <div>
                <h3>{isSeller ? user.storeName || user.name : user.name}</h3>
                <p>{user.email}</p>
                <span className={`badge-gold ${isSeller ? "badge-merchant" : ""}`}>
                  {isSeller ? "🏪 Verified Merchant" : `⭐ ${user.membership}`}
                </span>
              </div>
            </div>

            <nav className="account-nav-menu">
              <button
                className={activeTab === "overview" ? "active" : ""}
                onClick={() => setActiveTab("overview")}
              >
                <IconUser size={18} />
                <span>{isSeller ? "Store Overview" : "Account Overview"}</span>
              </button>

              {isSeller ? (
                <>
                  <button
                    className={activeTab === "products" ? "active" : ""}
                    onClick={() => setActiveTab("products")}
                  >
                    <IconBolt size={18} />
                    <span>My Products (4)</span>
                  </button>
                  <button
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                  >
                    <IconPackage size={18} />
                    <span>Orders to Ship (2)</span>
                  </button>
                  <button
                    className={activeTab === "payouts" ? "active" : ""}
                    onClick={() => setActiveTab("payouts")}
                  >
                    <IconCreditCard size={18} />
                    <span>Payouts &amp; Bank</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                  >
                    <IconPackage size={18} />
                    <span>My Orders ({user.ordersCount || 3})</span>
                  </button>
                  <button
                    className={activeTab === "addresses" ? "active" : ""}
                    onClick={() => setActiveTab("addresses")}
                  >
                    <IconMapPin size={18} />
                    <span>Saved Addresses</span>
                  </button>
                  <button
                    className={activeTab === "payments" ? "active" : ""}
                    onClick={() => setActiveTab("payments")}
                  >
                    <IconCreditCard size={18} />
                    <span>Payment &amp; Wallet</span>
                  </button>
                  <a href="/wishlist" className="account-menu-link">
                    <IconHeart size={18} />
                    <span>Wishlist (5)</span>
                  </a>
                </>
              )}

              <button className="logout-btn" onClick={handleLogout}>
                <IconLogOut size={18} />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* ── Main Content Area ── */}
          <section className="account-content">
            {/* ════════════ SELLER / VENDOR DASHBOARD ════════════ */}
            {isSeller ? (
              <>
                {/* TAB: Seller Overview */}
                {activeTab === "overview" && (
                  <div className="tab-pane">
                    <div className="card-header-row">
                      <div>
                        <h2>{user.storeName || "Merchant Dashboard"}</h2>
                        <p className="section-sub">Manage your products, sales revenue, and incoming buyer orders.</p>
                      </div>
                      <button className="primary-btn" onClick={() => alert("Add Product Modal")}>+ Add New Product</button>
                    </div>

                    {/* Seller Stats */}
                    <div className="stats-grid">
                      <div className="stat-card highlight">
                        <span className="stat-label">Available Balance</span>
                        <strong className="stat-value">{user.walletBalance}</strong>
                        <button className="stat-action" onClick={() => setActiveTab("payouts")}>Request Payout</button>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Total Sales</span>
                        <strong className="stat-value">₦420,000</strong>
                        <span className="stat-sub">34 orders completed</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Active Listings</span>
                        <strong className="stat-value">4 products</strong>
                        <span className="stat-sub">59 total units in stock</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Pending Orders</span>
                        <strong className="stat-value">2 orders</strong>
                        <span className="stat-sub">Requires fulfillment</span>
                      </div>
                    </div>

                    {/* Seller Product Catalog Overview */}
                    <div className="account-card">
                      <div className="card-header-row">
                        <h3>My Listed Products</h3>
                        <button className="link-btn" onClick={() => setActiveTab("products")}>View all products →</button>
                      </div>

                      <div className="orders-list">
                        {mockSellerProducts.map((p) => (
                          <div className="order-row" key={p.id}>
                            <div className="order-thumb">
                              <img src={p.img} alt={p.title} />
                            </div>
                            <div className="order-info">
                              <div className="order-top">
                                <strong>{p.title}</strong>
                                <span className="status-pill status-delivered">{p.status}</span>
                              </div>
                              <p className="order-item-desc">Price: {p.price} · Available Stock: {p.stock} units</p>
                              <span className="order-date">SKU: {p.id}</span>
                            </div>
                            <div className="order-side">
                              <span className="order-price">{p.price}</span>
                              <button className="order-track-btn" onClick={() => alert(`Edit ${p.title}`)}>Edit</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Seller Products */}
                {activeTab === "products" && (
                  <div className="tab-pane">
                    <div className="card-header-row">
                      <div>
                        <h2>Inventory &amp; Products</h2>
                        <p className="section-sub">Update stock levels, pricing, and active listings.</p>
                      </div>
                      <button className="primary-btn" onClick={() => alert("Add Product Modal")}>+ Add New Product</button>
                    </div>

                    <div className="account-card">
                      <div className="orders-list">
                        {mockSellerProducts.map((p) => (
                          <div className="order-row" key={p.id}>
                            <div className="order-thumb">
                              <img src={p.img} alt={p.title} />
                            </div>
                            <div className="order-info">
                              <div className="order-top">
                                <strong>{p.title}</strong>
                                <span className="status-pill status-delivered">{p.status}</span>
                              </div>
                              <p className="order-item-desc">In Stock: {p.stock} units</p>
                            </div>
                            <div className="order-side">
                              <span className="order-price">{p.price}</span>
                              <button className="order-track-btn" onClick={() => alert(`Manage ${p.title}`)}>Manage</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Seller Payouts */}
                {activeTab === "payouts" && (
                  <div className="tab-pane">
                    <h2>Merchant Payouts &amp; Bank Account</h2>
                    <p className="section-sub">Earnings are transferred directly to your verified Nigerian commercial bank account.</p>

                    <div className="wallet-card">
                      <div>
                        <span className="wallet-label">Available for Withdrawal</span>
                        <h3 className="wallet-amt">{user.walletBalance}</h3>
                        <p className="wallet-desc">Escrow releases every Friday directly to your registered bank account.</p>
                      </div>
                      <button className="wallet-btn" onClick={() => alert("Withdraw funds initiated!")}>
                        Withdraw to Bank
                      </button>
                    </div>

                    <div className="account-card">
                      <h3>Settlement Bank Account</h3>
                      <div className="detail-rows" style={{ marginTop: "14px" }}>
                        <div><span className="label">Bank Name:</span> <strong>Guaranty Trust Bank (GTBank)</strong></div>
                        <div><span className="label">Account Number:</span> <strong>0123456789</strong></div>
                        <div><span className="label">Account Name:</span> <strong>{user.storeName || user.name}</strong></div>
                        <div><span className="label">Status:</span> <strong style={{ color: "#16a34a" }}>Verified for Instant Payouts</strong></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ════════════ BUYER / CUSTOMER DASHBOARD ════════════ */
              <>
                {/* TAB: Buyer Overview */}
                {activeTab === "overview" && (
                  <div className="tab-pane">
                    <h2>Account Overview</h2>

                    {/* Quick Stats Grid */}
                    <div className="stats-grid">
                      <div className="stat-card">
                        <span className="stat-label">Total Orders</span>
                        <strong className="stat-value">{user.ordersCount}</strong>
                        <span className="stat-sub">Active buyer account</span>
                      </div>
                      <div className="stat-card highlight">
                        <span className="stat-label">Wallet Balance</span>
                        <strong className="stat-value">{user.walletBalance}</strong>
                        <button className="stat-action" onClick={() => setActiveTab("payments")}>+ Top up</button>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Reward Points</span>
                        <strong className="stat-value">1,450 pts</strong>
                        <span className="stat-sub">= ₦1,450 discount</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Wishlist</span>
                        <strong className="stat-value">5 items</strong>
                        <span className="stat-sub">2 items on sale</span>
                      </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="account-card">
                      <div className="card-header-row">
                        <h3>Recent Orders</h3>
                        <button className="link-btn" onClick={() => setActiveTab("orders")}>View all orders →</button>
                      </div>

                      <div className="orders-list">
                        {mockBuyerOrders.map((ord) => (
                          <div className="order-row" key={ord.id}>
                            <div className="order-thumb">
                              <img src={ord.img} alt={ord.items} />
                            </div>
                            <div className="order-info">
                              <div className="order-top">
                                <strong>{ord.id}</strong>
                                <span className={`status-pill ${ord.statusClass}`}>{ord.status}</span>
                              </div>
                              <p className="order-item-desc">{ord.items}</p>
                              <span className="order-date">Ordered on {ord.date}</span>
                            </div>
                            <div className="order-side">
                              <span className="order-price">{ord.total}</span>
                              <button
                                className="order-track-btn"
                                onClick={() => alert(`Tracking package for ${ord.id}... Expected arrival tomorrow!`)}
                              >
                                Track
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div className="two-col-grid">
                      <div className="account-card">
                        <div className="card-header-row">
                          <h3>Personal Details</h3>
                          <button className="link-btn" onClick={() => alert("Edit profile modal")}>Edit</button>
                        </div>
                        <div className="detail-rows">
                          <div><span className="label">Full Name:</span> <strong>{user.name}</strong></div>
                          <div><span className="label">Email:</span> <strong>{user.email}</strong></div>
                          <div><span className="label">Phone:</span> <strong>{user.phone || "+234 803 123 4567"}</strong></div>
                          <div><span className="label">Role:</span> <strong className="gold-text">Shopper / Buyer</strong></div>
                        </div>
                      </div>

                      <div className="account-card">
                        <div className="card-header-row">
                          <h3>Primary Address</h3>
                          <button className="link-btn" onClick={() => setActiveTab("addresses")}>Manage</button>
                        </div>
                        <div className="address-box">
                          <strong>{user.name}</strong>
                          <p>14 Admiralty Way, Lekki Phase 1</p>
                          <p>Lagos State, Nigeria</p>
                          <p className="phone-line">📞 {user.phone || "+234 803 123 4567"}</p>
                          <span className="default-tag">Default Delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Buyer Orders */}
                {activeTab === "orders" && (
                  <div className="tab-pane">
                    <h2>Order History</h2>
                    <p className="section-sub">Track, return, or buy again from your past orders.</p>

                    <div className="account-card">
                      <div className="orders-list">
                        {mockBuyerOrders.map((ord) => (
                          <div className="order-row" key={ord.id}>
                            <div className="order-thumb">
                              <img src={ord.img} alt={ord.items} />
                            </div>
                            <div className="order-info">
                              <div className="order-top">
                                <strong>{ord.id}</strong>
                                <span className={`status-pill ${ord.statusClass}`}>{ord.status}</span>
                              </div>
                              <p className="order-item-desc">{ord.items}</p>
                              <span className="order-date">Ordered on {ord.date}</span>
                            </div>
                            <div className="order-side">
                              <span className="order-price">{ord.total}</span>
                              <button className="order-track-btn" onClick={() => alert(`Tracking package for ${ord.id}`)}>Track Package</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Buyer Addresses */}
                {activeTab === "addresses" && (
                  <div className="tab-pane">
                    <div className="card-header-row">
                      <div>
                        <h2>Saved Addresses</h2>
                        <p className="section-sub">Manage shipping addresses for faster checkout.</p>
                      </div>
                      <button className="primary-btn" onClick={() => alert("Add Address modal")}>+ Add New Address</button>
                    </div>

                    <div className="two-col-grid">
                      <div className="address-card selected">
                        <span className="default-tag">Default Delivery</span>
                        <h4>Home (Lekki)</h4>
                        <p><strong>{user.name}</strong></p>
                        <p>14 Admiralty Way, Lekki Phase 1</p>
                        <p>Lagos State, Nigeria</p>
                        <p>{user.phone || "+234 803 123 4567"}</p>
                        <div className="card-actions">
                          <button className="btn-sm">Edit</button>
                        </div>
                      </div>

                      <div className="address-card">
                        <h4>Office (Victoria Island)</h4>
                        <p><strong>{user.name}</strong></p>
                        <p>Plot 1205 Adeola Odeku St, Victoria Island</p>
                        <p>Lagos State, Nigeria</p>
                        <p>{user.phone || "+234 803 123 4567"}</p>
                        <div className="card-actions">
                          <button className="btn-sm">Set as Default</button>
                          <button className="btn-sm">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Buyer Payments */}
                {activeTab === "payments" && (
                  <div className="tab-pane">
                    <h2>Payment &amp; Wallet</h2>
                    <p className="section-sub">Manage your Shop Zero Wallet, saved debit cards, and payment security.</p>

                    <div className="wallet-card">
                      <div>
                        <span className="wallet-label">Shop Zero Wallet</span>
                        <h3 className="wallet-amt">{user.walletBalance}</h3>
                        <p className="wallet-desc">Use wallet balance for instant 1-click checkout with zero transaction fees.</p>
                      </div>
                      <button className="wallet-btn" onClick={() => alert("Top-up Wallet modal")}>
                        Top Up Wallet
                      </button>
                    </div>

                    <h3 className="subheading">Saved Cards</h3>
                    <div className="two-col-grid">
                      <div className="payment-card-box">
                        <div className="card-top">
                          <span className="card-brand">Mastercard</span>
                          <span className="default-tag">Default</span>
                        </div>
                        <strong className="card-num">•••• •••• •••• 4289</strong>
                        <div className="card-foot">
                          <span>Expires 08/28</span>
                          <span>{user.name}</span>
                        </div>
                      </div>

                      <div className="payment-card-box">
                        <div className="card-top">
                          <span className="card-brand">Verve</span>
                        </div>
                        <strong className="card-num">•••• •••• •••• 7103</strong>
                        <div className="card-foot">
                          <span>Expires 11/27</span>
                          <span>{user.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="security-notice">
                      <IconShield size={20} />
                      <span>Your payment methods are encrypted with bank-level 256-bit SSL security.</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}
