import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Data Deletion Instructions | ShopZero",
  description:
    "Instructions for requesting deletion of your personal data and account on ShopZero in compliance with Meta Platform Policies and NDPR.",
};

export default function DataDeletionPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page-container">
        <header className="legal-header">
          <div className="legal-header-inner">
            <span className="legal-badge">Meta Policy &amp; NDPR Compliance</span>
            <h1>User Data Deletion Instructions</h1>
            <p className="legal-effective-date">
              ShopZero Technologies Ltd · Last Updated: October 8, 2026
            </p>
          </div>
        </header>

        <div className="legal-body-layout">
          {/* Quick-Nav Sidebar */}
          <aside className="legal-nav-sidebar">
            <div className="legal-nav-card">
              <h3>Navigation</h3>
              <nav aria-label="Data Deletion Sections">
                <a href="#commitment">1. Our Commitment</a>
                <a href="#methods">2. How to Request Deletion</a>
                <a href="#whatsapp-deletion">3. WhatsApp Data Deletion</a>
                <a href="#what-gets-deleted">4. What Data Is Deleted</a>
                <a href="#timeline">5. Processing Timeline</a>
                <a href="#request-form">6. Submit a Request</a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <article className="legal-article-content">
            <section id="commitment" className="legal-section">
              <h2>1. Our Commitment to Data Privacy</h2>
              <p>
                In accordance with <strong>Meta Platform Policy</strong> and the{" "}
                <strong>Nigeria Data Protection Regulation (NDPR)</strong>, ShopZero values your
                right to privacy and provides users with complete autonomy over their personal
                information.
              </p>
              <p>
                If you have registered an account, authenticated through Facebook/Meta, or used our
                automated WhatsApp services, you have the right to request the permanent deletion of
                all your personal data held on our servers.
              </p>
            </section>

            <section id="methods" className="legal-section">
              <h2>2. How to Request Account &amp; Data Deletion</h2>
              <p>You can request data deletion using any of the three following methods:</p>

              <div className="legal-callout">
                <h4>Method A: Self-Service in Account Dashboard</h4>
                <p>
                  1. Log into your account at{" "}
                  <a href="https://shop-zero-inky.vercel.app/account">shopzero.ng/account</a>.
                  <br />
                  2. Navigate to <strong>Settings</strong> &gt; <strong>Privacy &amp; Security</strong>.
                  <br />
                  3. Click <strong>&quot;Delete My Account &amp; Personal Data&quot;</strong> and
                  confirm your request.
                </p>
              </div>

              <div className="legal-callout">
                <h4>Method B: Direct Email to our Data Protection Officer</h4>
                <p>
                  Send an email from your registered email address to:
                  <br />
                  <strong>privacy@shopzero.ng</strong> with the subject line{" "}
                  <code>&quot;Data Deletion Request&quot;</code>. Include your full name and registered
                  phone number or email address.
                </p>
              </div>
            </section>

            <section id="whatsapp-deletion" className="legal-section">
              <h2>3. WhatsApp Conversational Commerce Deletion</h2>
              <p>
                If you have interacted with the ShopZero WhatsApp Bot or registered using your
                WhatsApp phone number:
              </p>
              <ul>
                <li>
                  Open your WhatsApp chat with the official ShopZero business number.
                </li>
                <li>
                  Type and send the command: <code>DELETE MY DATA</code>.
                </li>
                <li>
                  Our system will verify your phone number and schedule your WhatsApp profile,
                  saved delivery details, and session logs for deletion.
                </li>
              </ul>
            </section>

            <section id="what-gets-deleted" className="legal-section">
              <h2>4. What Data Is Deleted?</h2>
              <p>Upon verifying your deletion request, we permanently remove:</p>
              <ul>
                <li>Your profile details (Name, Email, Phone number, Profile picture).</li>
                <li>Saved delivery addresses and recipient contacts.</li>
                <li>Saved payment tokens and billing references.</li>
                <li>WhatsApp bot session history and automated preferences.</li>
                <li>Wishlist and shopping bag items.</li>
              </ul>
              <p>
                <em>
                  Note: Transactional receipts and escrow ledger records required by the Central
                  Bank of Nigeria (CBN) and anti-money laundering (AML) laws will be anonymized
                  and retained strictly for statutory auditing periods before destruction.
                </em>
              </p>
            </section>

            <section id="timeline" className="legal-section">
              <h2>5. Processing Timeline &amp; Confirmation</h2>
              <p>
                Requests are acknowledged within <strong>24 hours</strong> and processed to completion
                within <strong>7 business days</strong>. You will receive an official confirmation
                code via email or SMS once your data has been purged from our active databases.
              </p>
            </section>

            <section id="request-form" className="legal-section">
              <h2>6. Submit a Deletion Request Online</h2>
              <p>
                You may also submit your deletion request directly through this web form:
              </p>
              <div className="legal-contact-box">
                <form
                  action="mailto:privacy@shopzero.ng?subject=User%20Data%20Deletion%20Request"
                  method="POST"
                  encType="text/plain"
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <label>
                    <strong>Registered Email or Phone Number:</strong>
                    <input
                      type="text"
                      name="identifier"
                      placeholder="e.g. user@example.com or +2348012345678"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        marginTop: "6px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                  </label>
                  <label>
                    <strong>Reason for Deletion (Optional):</strong>
                    <textarea
                      name="reason"
                      rows={3}
                      placeholder="Please let us know why you are leaving..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        marginTop: "6px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                  </label>
                  <button
                    type="submit"
                    style={{
                      background: "#ff5900",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    Submit Data Deletion Request
                  </button>
                </form>
              </div>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
