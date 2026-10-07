"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { useAuth } from "../../context/auth-context";

// ── Types ─────────────────────────────────────────────
interface OrderItem {
  title: string;
  qty: number;
  price: string;
  img: string;
}

interface TrackingStep {
  label: string;
  detail: string;
  time: string;
  done: boolean;
  active: boolean;
}

interface Order {
  id: string;
  date: string;
  status: "Processing" | "Confirmed" | "Shipped" | "In Transit" | "Out for Delivery" | "Delivered" | "Cancelled" | "Returned";
  total: string;
  totalRaw: number;
  items: OrderItem[];
  address: string;
  paymentMethod: string;
  trackingSteps: TrackingStep[];
  deliveryDate: string;
  courier: string;
  trackingCode: string;
}

// ── Mock Orders ───────────────────────────────────────
const mockOrders: Order[] = [
  {
    id: "ORD-948201",
    date: "21 Aug 2026",
    status: "In Transit",
    total: "₦48,900",
    totalRaw: 48900,
    deliveryDate: "23 Aug 2026",
    courier: "DHL Express",
    trackingCode: "DHL-NG-7742918",
    address: "14 Adeola Odeku St, Victoria Island, Lagos",
    paymentMethod: "Debit Card (GTBank ••• 4521)",
    items: [
      { title: "Wireless Noise-Cancelling Over-Ear Headphones Pro", qty: 1, price: "₦48,900", img: "/products/headphones.jpg" },
    ],
    trackingSteps: [
      { label: "Order Placed", detail: "Your order was received", time: "21 Aug, 9:14 AM", done: true, active: false },
      { label: "Confirmed", detail: "Seller confirmed your order", time: "21 Aug, 10:02 AM", done: true, active: false },
      { label: "Shipped", detail: "Package picked up by DHL", time: "22 Aug, 7:30 AM", done: true, active: false },
      { label: "In Transit", detail: "Package en route to Lagos hub", time: "22 Aug, 3:45 PM", done: true, active: true },
      { label: "Out for Delivery", detail: "Estimated today", time: "—", done: false, active: false },
      { label: "Delivered", detail: "Estimated 23 Aug 2026", time: "—", done: false, active: false },
    ],
  },
  {
    id: "ORD-892144",
    date: "14 Aug 2026",
    status: "Delivered",
    total: "₦32,990",
    totalRaw: 32990,
    deliveryDate: "17 Aug 2026",
    courier: "GIG Logistics",
    trackingCode: "GIG-NG-5519234",
    address: "14 Adeola Odeku St, Victoria Island, Lagos",
    paymentMethod: "ShopZero Wallet",
    items: [
      { title: "Men's Classic Lightweight Running Sneakers (White & Orange)", qty: 1, price: "₦32,990", img: "/products/sneakers.jpg" },
    ],
    trackingSteps: [
      { label: "Order Placed", detail: "Your order was received", time: "14 Aug, 2:10 PM", done: true, active: false },
      { label: "Confirmed", detail: "Seller confirmed your order", time: "14 Aug, 2:55 PM", done: true, active: false },
      { label: "Shipped", detail: "Package picked up by GIG", time: "15 Aug, 8:00 AM", done: true, active: false },
      { label: "In Transit", detail: "Package en route", time: "16 Aug, 11:20 AM", done: true, active: false },
      { label: "Out for Delivery", detail: "Out for delivery", time: "17 Aug, 9:15 AM", done: true, active: false },
      { label: "Delivered", detail: "Delivered successfully", time: "17 Aug, 1:48 PM", done: true, active: true },
    ],
  },
  {
    id: "ORD-761209",
    date: "02 Aug 2026",
    status: "Delivered",
    total: "₦59,500",
    totalRaw: 59500,
    deliveryDate: "05 Aug 2026",
    courier: "DHL Express",
    trackingCode: "DHL-NG-6612847",
    address: "14 Adeola Odeku St, Victoria Island, Lagos",
    paymentMethod: "Debit Card (GTBank ••• 4521)",
    items: [
      { title: "Everyday Air Fryer 5L Digital Touchscreen with 8 Presets", qty: 1, price: "₦59,500", img: "/products/airfryer.jpg" },
    ],
    trackingSteps: [
      { label: "Order Placed", detail: "Your order was received", time: "02 Aug, 11:05 AM", done: true, active: false },
      { label: "Confirmed", detail: "Seller confirmed your order", time: "02 Aug, 12:00 PM", done: true, active: false },
      { label: "Shipped", detail: "Package picked up by DHL", time: "03 Aug, 8:15 AM", done: true, active: false },
      { label: "In Transit", detail: "Package en route to Lagos hub", time: "04 Aug, 10:00 AM", done: true, active: false },
      { label: "Out for Delivery", detail: "Out for delivery", time: "05 Aug, 8:30 AM", done: true, active: false },
      { label: "Delivered", detail: "Delivered successfully", time: "05 Aug, 2:12 PM", done: true, active: true },
    ],
  },
  {
    id: "ORD-634812",
    date: "18 Jul 2026",
    status: "Delivered",
    total: "₦203,750",
    totalRaw: 203750,
    deliveryDate: "22 Jul 2026",
    courier: "DHL Express",
    trackingCode: "DHL-NG-5834912",
    address: "14 Adeola Odeku St, Victoria Island, Lagos",
    paymentMethod: "Bank Transfer (Zenith Bank)",
    items: [
      { title: "Smart LED TV 43-inch Full HD HDR with Voice Remote", qty: 1, price: "₦235,000", img: "/products/tv.jpg" },
      { title: "Wireless Noise-Cancelling Over-Ear Headphones Pro", qty: 1, price: "₦48,900", img: "/products/headphones.jpg" },
    ],
    trackingSteps: [
      { label: "Order Placed", detail: "Your order was received", time: "18 Jul, 10:22 AM", done: true, active: false },
      { label: "Confirmed", detail: "Seller confirmed your order", time: "18 Jul, 11:00 AM", done: true, active: false },
      { label: "Shipped", detail: "Package picked up by DHL", time: "19 Jul, 8:00 AM", done: true, active: false },
      { label: "In Transit", detail: "Package en route", time: "20 Jul, 2:00 PM", done: true, active: false },
      { label: "Out for Delivery", detail: "Out for delivery", time: "22 Jul, 9:00 AM", done: true, active: false },
      { label: "Delivered", detail: "Delivered successfully", time: "22 Jul, 12:45 PM", done: true, active: true },
    ],
  },
  {
    id: "ORD-502918",
    date: "03 Jun 2026",
    status: "Cancelled",
    total: "₦185,000",
    totalRaw: 185000,
    deliveryDate: "—",
    courier: "—",
    trackingCode: "—",
    address: "14 Adeola Odeku St, Victoria Island, Lagos",
    paymentMethod: "Debit Card (GTBank ••• 4521)",
    items: [
      { title: "Zenith Pro 5G Smartphone 256GB / 8GB RAM", qty: 1, price: "₦185,000", img: "/products/phone.jpg" },
    ],
    trackingSteps: [
      { label: "Order Placed", detail: "Your order was received", time: "03 Jun, 8:45 AM", done: true, active: false },
      { label: "Cancelled", detail: "Order cancelled by buyer", time: "03 Jun, 9:12 AM", done: true, active: true },
    ],
  },
];

// ── Status config ─────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Processing:       { color: "#6b7280", bg: "#f3f4f6", icon: "⏳" },
  Confirmed:        { color: "#2563eb", bg: "#eff6ff", icon: "✅" },
  Shipped:          { color: "#7c3aed", bg: "#f5f3ff", icon: "📦" },
  "In Transit":     { color: "#d97706", bg: "#fffbeb", icon: "🚚" },
  "Out for Delivery": { color: "#059669", bg: "#ecfdf5", icon: "🛵" },
  Delivered:        { color: "#16a34a", bg: "#dcfce7", icon: "🎉" },
  Cancelled:        { color: "#dc2626", bg: "#fef2f2", icon: "✖" },
  Returned:         { color: "#9ca3af", bg: "#f9fafb", icon: "↩" },
};

const FILTER_TABS = ["All", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Returned"];

// ── Sub-components ────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Processing"];
  return (
    <span
      className="order-status-pill"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      {cfg.icon} {status}
    </span>
  );
}

function TrackingTimeline({ steps, status }: { steps: TrackingStep[]; status: string }) {
  if (status === "Cancelled") {
    return (
      <div className="tracking-cancelled">
        <span>✖</span>
        <div>
          <strong>Order Cancelled</strong>
          <p>This order was cancelled. If you paid, a refund will be processed within 3–5 business days.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="tracking-timeline">
      {steps.map((step, i) => (
        <div key={i} className={`tracking-step ${step.done ? "done" : ""} ${step.active ? "active" : ""}`}>
          <div className="tracking-dot" />
          {i < steps.length - 1 && <div className="tracking-line" />}
          <div className="tracking-content">
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
            <time>{step.time}</time>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, onExpand, expanded }: { order: Order; onExpand: () => void; expanded: boolean }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Processing"];
  return (
    <article className={`order-card ${expanded ? "expanded" : ""}`}>
      {/* Card Header */}
      <div className="order-card-header" onClick={onExpand} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onExpand()}>
        <div className="order-card-left">
          <div className="order-thumb-stack">
            {order.items.slice(0, 2).map((item, i) => (
              <img key={i} src={item.img} alt={item.title} className="order-thumb" style={{ zIndex: 2 - i, left: `${i * 16}px` }} />
            ))}
            {order.items.length > 2 && (
              <span className="order-thumb-more" style={{ left: `${2 * 16}px` }}>+{order.items.length - 2}</span>
            )}
          </div>
          <div className="order-card-meta">
            <span className="order-id">{order.id}</span>
            <span className="order-date">Placed {order.date}</span>
            <span className="order-items-preview">
              {order.items[0].title}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
            </span>
          </div>
        </div>
        <div className="order-card-right">
          <strong className="order-total">{order.total}</strong>
          <StatusPill status={order.status} />
          <span className="order-chevron" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="order-card-body">
          {/* Items */}
          <div className="order-section">
            <h4>Items Ordered</h4>
            <div className="order-items-list">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <img src={item.img} alt={item.title} />
                  <div>
                    <span>{item.title}</span>
                    <small>Qty: {item.qty}</small>
                  </div>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking */}
          <div className="order-section">
            <h4>Order Tracking</h4>
            {order.courier !== "—" && (
              <div className="tracking-meta-row">
                <div className="tracking-meta-item">
                  <span>Courier</span>
                  <strong>{order.courier}</strong>
                </div>
                <div className="tracking-meta-item">
                  <span>Tracking No.</span>
                  <strong>{order.trackingCode}</strong>
                </div>
                <div className="tracking-meta-item">
                  <span>{order.status === "Delivered" ? "Delivered On" : "Est. Delivery"}</span>
                  <strong>{order.deliveryDate}</strong>
                </div>
              </div>
            )}
            <TrackingTimeline steps={order.trackingSteps} status={order.status} />
          </div>

          {/* Order Info */}
          <div className="order-section order-info-grid">
            <div>
              <h4>Delivery Address</h4>
              <p>{order.address}</p>
            </div>
            <div>
              <h4>Payment Method</h4>
              <p>{order.paymentMethod}</p>
            </div>
            <div>
              <h4>Order Total</h4>
              <p className="order-total-detail">{order.total}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="order-actions">
            {order.status === "Delivered" && (
              <>
                <button className="order-btn order-btn-primary">Write a Review</button>
                <button className="order-btn order-btn-outline">Request Return</button>
              </>
            )}
            {(order.status === "Processing" || order.status === "Confirmed") && (
              <button className="order-btn order-btn-danger">Cancel Order</button>
            )}
            {order.status === "In Transit" || order.status === "Shipped" ? (
              <button className="order-btn order-btn-outline">Track on Courier Site</button>
            ) : null}
            <button className="order-btn order-btn-outline">Need Help?</button>
          </div>
        </div>
      )}
    </article>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("ORD-948201");

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setOrders(data.data);
          setExpandedId(data.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load orders from backend", err);
      }
    }
    loadOrders();
  }, [user]);

  const filtered = useMemo(() => {
    let items = orders;
    if (activeFilter !== "All") items = items.filter((o) => o.status.toLowerCase() === activeFilter.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.title.toLowerCase().includes(q))
      );
    }
    return items;
  }, [orders, activeFilter, search]);

  // Gate: must be logged in
  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="orders-page">
          <div className="orders-empty-auth">
            <span>🔒</span>
            <h2>Sign In to View Your Orders</h2>
            <p>Track deliveries, request returns, and review your purchase history.</p>
            <a href="/login?redirect=/orders" className="order-btn order-btn-primary">
              Sign In
            </a>
          </div>
        </main>
      </>
    );
  }

  const totalSpend = mockOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalRaw, 0);

  return (
    <>
      <SiteHeader />
      <main className="orders-page">
        {/* Page Header */}
        <div className="orders-page-header">
          <div className="orders-page-header-inner">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/account">Account</a>
                <span>/</span>
                <strong>My Orders</strong>
              </nav>
              <h1>My Orders</h1>
              <p>Track, manage and review all your purchases in one place.</p>
            </div>
            <div className="orders-stats-row">
              <div className="orders-stat">
                <strong>{mockOrders.length}</strong>
                <span>Total Orders</span>
              </div>
              <div className="orders-stat">
                <strong>{mockOrders.filter((o) => o.status === "Delivered").length}</strong>
                <span>Delivered</span>
              </div>
              <div className="orders-stat">
                <strong>₦{totalSpend.toLocaleString()}</strong>
                <span>Total Spent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="orders-controls">
          {/* Search */}
          <div className="orders-search-wrap">
            <span className="orders-search-icon">🔍</span>
            <input
              id="orders-search"
              type="search"
              placeholder="Search by order ID or product name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="orders-search-input"
            />
          </div>

          {/* Filter Tabs */}
          <div className="orders-filter-tabs" role="tablist">
            {FILTER_TABS.map((tab) => {
              const count = tab === "All" ? mockOrders.length : mockOrders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeFilter === tab}
                  className={`orders-filter-tab ${activeFilter === tab ? "active" : ""}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                  {count > 0 && <span className="orders-tab-count">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filtered.length > 0 ? (
            filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedId === order.id}
                onExpand={() => setExpandedId(expandedId === order.id ? null : order.id)}
              />
            ))
          ) : (
            <div className="orders-empty-state">
              <span>📋</span>
              <h3>No orders found</h3>
              <p>
                {search
                  ? `No orders match "${search}". Try a different search.`
                  : `You have no ${activeFilter !== "All" ? activeFilter.toLowerCase() : ""} orders yet.`}
              </p>
              {search ? (
                <button className="order-btn order-btn-outline" onClick={() => setSearch("")}>Clear Search</button>
              ) : (
                <a href="/" className="order-btn order-btn-primary">Start Shopping</a>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
