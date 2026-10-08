import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ShopZero Nigeria",
  description:
    "ShopZero Privacy Policy compliant with NDPR (Nigeria Data Protection Regulation). Understand how we collect, protect, and use your personal and transaction data.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page-container">
        <header className="legal-header">
          <div className="legal-header-inner">
            <span className="legal-badge">Privacy &amp; Data Protection</span>
            <h1>Privacy Policy</h1>
            <p className="legal-effective-date">
              Effective Date: October 2026 · Compliant with NDPR &amp; Global Standards
            </p>
          </div>
        </header>

        <div className="legal-body-layout">
          {/* Quick-Nav Sidebar */}
          <aside className="legal-nav-sidebar">
            <div className="legal-nav-card">
              <h3>Table of Contents</h3>
              <nav aria-label="Privacy Policy Sections">
                <a href="#overview">1. Overview &amp; Scope</a>
                <a href="#data-collection">2. Information We Collect</a>
                <a href="#how-we-use">3. How We Use Information</a>
                <a href="#whatsapp-privacy">4. WhatsApp Data Handling</a>
                <a href="#data-sharing">5. Sharing &amp; Third Parties</a>
                <a href="#security">6. Data Security Measures</a>
                <a href="#user-rights">7. Your Privacy Rights (NDPR)</a>
                <a href="#retention">8. Data Retention</a>
                <a href="#contact">9. Contact Data Protection Officer</a>
              </nav>
            </div>
          </aside>

          {/* Privacy Content */}
          <article className="legal-article-content">
            <section id="overview" className="legal-section">
              <h2>1. Overview &amp; Scope</h2>
              <p>
                At <strong>ShopZero Technologies Ltd</strong> (&quot;ShopZero&quot;, &quot;we&quot;, &quot;our&quot;),
                we take your personal privacy seriously. This Privacy Policy details our practices
                regarding data collection, storage, and processing in strict adherence with the{" "}
                <strong>Nigeria Data Protection Regulation (NDPR)</strong> and international best
                practices.
              </p>
            </section>

            <section id="data-collection" className="legal-section">
              <h2>2. Information We Collect</h2>
              <ul>
                <li>
                  <strong>Personal Information:</strong> Name, phone number, email address, physical
                  delivery addresses, and government ID data for vendor KYC verification.
                </li>
                <li>
                  <strong>Transaction &amp; Order Data:</strong> Purchases, payments, escrow milestones,
                  order tracking history, and delivery notes.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, device information, and
                  session cookies used for fraud detection.
                </li>
              </ul>
            </section>

            <section id="how-we-use" className="legal-section">
              <h2>3. How We Use Information</h2>
              <p>We use your personal data exclusively to:</p>
              <ul>
                <li>Facilitate marketplace order fulfillment and doorstep delivery.</li>
                <li>Administer our automated buyer escrow protection and vendor payouts.</li>
                <li>Verify merchant identities to ensure 100% genuine products.</li>
                <li>Prevent financial fraud and enforce our Terms of Service.</li>
              </ul>
            </section>

            <section id="whatsapp-privacy" className="legal-section">
              <h2>4. WhatsApp Data Handling (Meta Cloud API)</h2>
              <p>
                When you interact with ShopZero via WhatsApp:
              </p>
              <ul>
                <li>
                  We receive your authenticated phone number (<code>waId</code>) and any messages,
                  images, or commands sent to our bot.
                </li>
                <li>
                  Communications transmitted through Meta&apos;s infrastructure are secured by Meta
                  Cloud API encryption protocols.
                </li>
                <li>
                  We never sell your phone number to third-party telemarketers or advertisers.
                </li>
              </ul>
            </section>

            <section id="data-sharing" className="legal-section">
              <h2>5. Sharing &amp; Third Parties</h2>
              <p>
                We only share your information with vetted partners strictly necessary to complete
                your transaction:
              </p>
              <ul>
                <li>
                  <strong>Logistics &amp; Courier Partners:</strong> Delivery name, address, and
                  recipient phone number.
                </li>
                <li>
                  <strong>Licensed Payment Processors:</strong> CBN-licensed gateways (e.g. Paystack)
                  for card and transfer processing under PCI-DSS Level 1 compliance.
                </li>
                <li>
                  <strong>Law Enforcement:</strong> Only where compelled by a valid Nigerian court
                  order or statutory regulatory obligation.
                </li>
              </ul>
            </section>

            <section id="security" className="legal-section">
              <h2>6. Data Security Measures</h2>
              <p>
                We implement bank-grade TLS 1.3 encryption, salt-hashed passwords, role-based database
                access controls, and continuous threat monitoring to safeguard your data against
                unauthorized access.
              </p>
            </section>

            <section id="user-rights" className="legal-section">
              <h2>7. Your Privacy Rights Under NDPR</h2>
              <p>
                Under the Nigeria Data Protection Act and NDPR, you have the right to request access
                to, correction of, or deletion of your personal data held by ShopZero at any time.
              </p>
            </section>

            <section id="retention" className="legal-section">
              <h2>8. Data Retention</h2>
              <p>
                We retain transaction records for a period required to comply with statutory
                tax and anti-money laundering (AML) laws in Nigeria, after which data is securely
                anonymized or purged.
              </p>
            </section>

            <section id="contact" className="legal-section">
              <h2>9. Contact Data Protection Officer</h2>
              <div className="legal-contact-box">
                <p>
                  <strong>Data Protection Officer (DPO)</strong>
                  <br />
                  ShopZero Technologies Ltd
                  <br />
                  Victoria Island, Lagos, Nigeria
                  <br />
                  Email: <a href="mailto:privacy@shopzero.ng">privacy@shopzero.ng</a>
                </p>
              </div>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
