import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ShopZero Nigeria",
  description:
    "Official Terms of Service for ShopZero Technologies Ltd. Learn about our marketplace rules, buyer escrow protection, WhatsApp commerce, and merchant policies.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page-container">
        <header className="legal-header">
          <div className="legal-header-inner">
            <span className="legal-badge">Legal Documentation</span>
            <h1>Terms of Service</h1>
            <p className="legal-effective-date">
              Effective Date: October 2026 · Last Updated: October 8, 2026
            </p>
          </div>
        </header>

        <div className="legal-body-layout">
          {/* Sticky Quick-Nav Sidebar */}
          <aside className="legal-nav-sidebar">
            <div className="legal-nav-card">
              <h3>Table of Contents</h3>
              <nav aria-label="Terms of Service Sections">
                <a href="#acceptance">1. Acceptance of Terms</a>
                <a href="#eligibility">2. Eligibility &amp; Accounts</a>
                <a href="#whatsapp-commerce">3. WhatsApp Commerce &amp; Bot</a>
                <a href="#escrow-payments">4. Escrow &amp; Buyer Protection</a>
                <a href="#merchant-terms">5. Merchant &amp; Seller Rules</a>
                <a href="#deliveries-inspection">6. Delivery &amp; Inspection</a>
                <a href="#returns-refunds">7. Returns &amp; Refunds</a>
                <a href="#intellectual-property">8. Intellectual Property</a>
                <a href="#liability">9. Limitation of Liability</a>
                <a href="#governing-law">10. Governing Law &amp; Disputes</a>
                <a href="#contact">11. Contact Information</a>
              </nav>
            </div>
          </aside>

          {/* Legal Content */}
          <article className="legal-article-content">
            <section id="acceptance" className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to <strong>ShopZero</strong> (&quot;ShopZero&quot;, &quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;), operated by ShopZero Technologies Ltd, registered under the laws
                of the Federal Republic of Nigeria.
              </p>
              <p>
                By accessing, browsing, registering on our website (
                <a href="https://shop-zero-inky.vercel.app">shopzero.ng</a>), using our mobile
                applications, or interacting with our automated WhatsApp conversational commerce
                services, you agree to be bound by these Terms of Service (&quot;Terms&quot;), our{" "}
                <a href="/privacy">Privacy Policy</a>, and all applicable Nigerian laws and
                regulations.
              </p>
              <p>
                If you do not agree with any part of these Terms, you must immediately discontinue
                use of our marketplace and automated services.
              </p>
            </section>

            <section id="eligibility" className="legal-section">
              <h2>2. Eligibility &amp; Account Registration</h2>
              <p>
                To create an account on ShopZero, you must be at least 18 years of age and possess
                the legal capacity to enter into binding contracts under Nigerian law.
              </p>
              <ul>
                <li>
                  <strong>Account Security:</strong> You are responsible for safeguarding your login
                  credentials, phone number access, and any one-time passwords (OTP).
                </li>
                <li>
                  <strong>Accurate Information:</strong> You agree to provide truthful, accurate, and
                  up-to-date contact, shipping, and billing information.
                </li>
                <li>
                  <strong>Multiple Accounts:</strong> Creating duplicate accounts to circumvent
                  account bans, manipulate promotional vouchers, or commit fraud is strictly
                  prohibited and results in immediate termination and reporting to relevant Nigerian
                  law enforcement authorities.
                </li>
              </ul>
            </section>

            <section id="whatsapp-commerce" className="legal-section">
              <h2>3. WhatsApp Conversational Commerce &amp; Bot Terms</h2>
              <p>
                ShopZero provides automated customer onboarding, order tracking, and vendor catalog
                management through the Meta WhatsApp Business Cloud API.
              </p>
              <ul>
                <li>
                  <strong>Consent to WhatsApp Communications:</strong> By messaging our verified
                  ShopZero WhatsApp Business line, you consent to receive automated transactional
                  messages, order confirmations, dispatch alerts, and service prompts.
                </li>
                <li>
                  <strong>Phone Number Authentication:</strong> Your WhatsApp ID (phone number) is
                  treated as a verified identity token. Any action initiated from your authenticated
                  WhatsApp number (such as confirming delivery or uploading a vendor product) is
                  deemed authorized by you.
                </li>
                <li>
                  <strong>Vendor WhatsApp Product Uploads:</strong> When vendors submit product
                  photos, titles, and pricing via WhatsApp commands (e.g. <code>POST</code>), you
                  warrant that the uploaded content is accurate, complies with Nigerian intellectual
                  property laws, and represents genuine stock ready for dispatch.
                </li>
              </ul>
            </section>

            <section id="escrow-payments" className="legal-section">
              <h2>4. Escrow System &amp; Buyer Protection</h2>
              <p>
                To eliminate commerce friction and fraud across Nigeria, all transactions on
                ShopZero utilize our proprietary <strong>Automated Escrow Protection System</strong>:
              </p>
              <div className="legal-callout">
                <h4>🛡️ How the ShopZero Escrow Works:</h4>
                <ol>
                  <li>
                    When a buyer makes a payment (via Debit Card, Bank Transfer, or Paystack), the
                    funds are securely held in escrow by ShopZero.
                  </li>
                  <li>
                    The merchant receives notice to prepare and dispatch the authentic product.
                  </li>
                  <li>
                    Funds are <strong>never released to the merchant</strong> until the buyer receives
                    the product and confirms satisfactory inspection, or until the mandatory
                    48-hour inspection period elapses without dispute.
                  </li>
                </ol>
              </div>
            </section>

            <section id="merchant-terms" className="legal-section">
              <h2>5. Merchant &amp; Vendor Obligations</h2>
              <p>
                Sellers operating storefronts on ShopZero agree to strict standards of authenticity
                and reliability:
              </p>
              <ul>
                <li>
                  <strong>KYC Verification:</strong> Every vendor must complete Know Your Customer
                  (KYC) verification by submitting a valid government ID (NIN, Driver&apos;s License,
                  or International Passport) and Nigerian bank account details prior to receiving
                  payouts.
                </li>
                <li>
                  <strong>Zero Tolerance for Counterfeits:</strong> Listing fake, replica, cloned, or
                  substandard goods is prohibited. Violations result in permanent storefront
                  closure, forfeiture of pending escrow balances, and legal referral to the Federal
                  Competition and Consumer Protection Commission (FCCPC).
                </li>
                <li>
                  <strong>Dispatch SLAs:</strong> Merchants must hand over confirmed orders to our
                  designated logistics partners within 24 to 48 hours of order placement.
                </li>
              </ul>
            </section>

            <section id="deliveries-inspection" className="legal-section">
              <h2>6. Delivery &amp; Inspection Policy</h2>
              <p>
                Deliveries are fulfilled through verified logistics partners across all 36 Nigerian
                states and the Federal Capital Territory (Abuja).
              </p>
              <p>
                Buyers have the right to physically inspect packages upon delivery in the presence
                of the courier driver to ensure that seals are intact, items match the description,
                and no physical damage occurred during transit.
              </p>
            </section>

            <section id="returns-refunds" className="legal-section">
              <h2>7. Returns, Refunds &amp; Dispute Mediation</h2>
              <p>
                If an item is received broken, defective, or materially different from its product
                listing, buyers can initiate a return within <strong>7 days</strong> of delivery.
              </p>
              <ul>
                <li>
                  <strong>Escrow Holds during Disputes:</strong> Once a dispute is raised, the escrow
                  settlement is paused immediately pending investigation by ShopZero customer
                  support.
                </li>
                <li>
                  <strong>Refund Processing:</strong> Approved refunds are credited directly to the
                  original payment method or customer ShopZero Wallet within 3 to 5 business days.
                </li>
              </ul>
            </section>

            <section id="intellectual-property" className="legal-section">
              <h2>8. Intellectual Property</h2>
              <p>
                The ShopZero name, logo wordmark with orange cart icon, domain names, website code,
                and user interface designs are the exclusive intellectual property of ShopZero
                Technologies Ltd.
              </p>
              <p>
                You may not copy, reproduce, scrape, reverse-engineer, or commercially exploit any
                part of our platform without prior written authorization.
              </p>
            </section>

            <section id="liability" className="legal-section">
              <h2>9. Limitation of Liability</h2>
              <p>
                ShopZero provides an escrow-backed marketplace platform connecting independent
                buyers and sellers. To the maximum extent permitted by Nigerian law, ShopZero
                disclaims liability for indirect, incidental, or consequential damages resulting
                from third-party courier delays, power outages, or telecommunication network failures.
              </p>
            </section>

            <section id="governing-law" className="legal-section">
              <h2>10. Governing Law &amp; Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the{" "}
                <strong>Federal Republic of Nigeria</strong>.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms shall
                first be submitted to amicable negotiation. If unresolved within thirty (30) days,
                it shall be referred to and finally resolved by arbitration in Lagos State under the
                Arbitration and Mediation Act of Nigeria.
              </p>
            </section>

            <section id="contact" className="legal-section">
              <h2>11. Contact &amp; Legal Notices</h2>
              <p>For questions, legal notices, or compliance inquiries regarding these Terms, contact us:</p>
              <div className="legal-contact-box">
                <p>
                  <strong>ShopZero Technologies Ltd</strong>
                  <br />
                  Legal &amp; Compliance Department
                  <br />
                  Victoria Island, Lagos, Nigeria
                  <br />
                  Email: <a href="mailto:legal@shopzero.ng">legal@shopzero.ng</a> ·{" "}
                  <a href="mailto:support@shopzero.ng">support@shopzero.ng</a>
                  <br />
                  WhatsApp Support: +234 800 SHOPZERO
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
