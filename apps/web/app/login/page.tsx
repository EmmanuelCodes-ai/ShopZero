"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { useAuth } from "../../context/auth-context";
import { IconShield, IconTruck, IconBadge } from "../../components/icons";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/account";
  const defaultTab = searchParams?.get("tab") === "register" ? "register" : "login";

  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);

  // Form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Registration fields
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER");
  const [regName, setRegName] = useState("");
  const [regStoreName, setRegStoreName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    try {
      const res = await login(loginEmail, loginPass);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(res.error || "Unable to sign in. Please try again.");
      }
    } catch {
      setErrorMessage("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    if (selectedRole === "VENDOR" && !regStoreName) {
      setErrorMessage("Please provide your Store / Business Name.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to continue.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    try {
      const res = await register(
        regName,
        regEmail,
        regPhone || "+234 800 000 0000",
        regPass,
        selectedRole,
        selectedRole === "VENDOR" ? regStoreName : undefined
      );
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(res.error || "Registration failed. Please try again.");
      }
    } catch {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await login("chidi.okafor@example.com", "google-oauth", selectedRole);
    router.push(redirectUrl);
  };

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button
          className={tab === "login" ? "auth-tab active" : "auth-tab"}
          onClick={() => { setTab("login"); setErrorMessage(""); }}
          type="button"
        >
          Sign In
        </button>
        <button
          className={tab === "register" ? "auth-tab active" : "auth-tab"}
          onClick={() => { setTab("register"); setErrorMessage(""); }}
          type="button"
        >
          Create Account
        </button>
      </div>

      {errorMessage && (
        <div className="auth-alert error">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}

      {/* ── Social Login ── */}
      <div className="social-auth-wrap">
        <button className="google-auth-btn" onClick={handleGoogleAuth} disabled={isLoading} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="auth-divider">
        <span>or with email &amp; password</span>
      </div>

      {/* ── Sign In Form ── */}
      {tab === "login" ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email or Phone Number</label>
            <input
              id="login-email"
              type="text"
              placeholder="e.g. chidi@example.com or 08012345678"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="login-pass">Password</label>
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div>
            <div className="pass-input-wrap">
              <input
                id="login-pass"
                type={showLoginPass ? "text" : "password"}
                placeholder="Enter your password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass-btn"
                onClick={() => setShowLoginPass(!showLoginPass)}
                aria-label="Toggle password visibility"
              >
                {showLoginPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-checkbox">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Stay signed in on this device</span>
            </label>
          </div>

          <button className="auth-submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign In to Shop Zero"}
          </button>
        </form>
      ) : (
        /* ── Registration Form ── */
        <form className="auth-form" onSubmit={handleRegister}>
          {/* Account Type Selection */}
          <div className="role-selection-group">
            <label className="role-group-title">I want to join Shop Zero as:</label>
            <div className="role-cards-grid">
              <button
                type="button"
                className={`role-card ${selectedRole === "CUSTOMER" ? "selected" : ""}`}
                onClick={() => setSelectedRole("CUSTOMER")}
              >
                <span className="role-icon">🛍️</span>
                <div>
                  <strong>Buyer / Shopper</strong>
                  <p>Discover deals, shop genuine brands &amp; fast delivery</p>
                </div>
              </button>

              <button
                type="button"
                className={`role-card ${selectedRole === "VENDOR" ? "selected" : ""}`}
                onClick={() => setSelectedRole("VENDOR")}
              >
                <span className="role-icon">🏪</span>
                <div>
                  <strong>Seller / Merchant</strong>
                  <p>Open a store, list products &amp; reach 500k+ buyers</p>
                </div>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-name">{selectedRole === "VENDOR" ? "Contact Person / Owner Name" : "Full Name"}</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Chidi Okafor"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />
          </div>

          {selectedRole === "VENDOR" && (
            <div className="form-group">
              <label htmlFor="reg-store">Store / Business Name</label>
              <input
                id="reg-store"
                type="text"
                placeholder="e.g. Lagos Tech Hub Electronics"
                value={regStoreName}
                onChange={(e) => setRegStoreName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reg-email">{selectedRole === "VENDOR" ? "Business Email Address" : "Email Address"}</label>
            <input
              id="reg-email"
              type="email"
              placeholder="e.g. store@example.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number (WhatsApp for Orders)</label>
            <input
              id="reg-phone"
              type="tel"
              placeholder="+234 803 123 4567"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-pass">Create Password</label>
            <div className="pass-input-wrap">
              <input
                id="reg-pass"
                type={showRegPass ? "text" : "password"}
                placeholder="At least 6 characters"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="toggle-pass-btn"
                onClick={() => setShowRegPass(!showRegPass)}
                aria-label="Toggle password visibility"
              >
                {showRegPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to the <a href="/terms">Terms of Service</a> &amp; <a href="/privacy">Privacy Policy</a></span>
            </label>
          </div>

          <button className="auth-submit-btn" type="submit" disabled={isLoading}>
            {isLoading
              ? "Creating account…"
              : selectedRole === "VENDOR"
              ? "Create Merchant Store"
              : "Create Buyer Account"}
          </button>
        </form>
      )}

      {/* Role-Aware Bonus Callout */}
      <div className="auth-callout">
        <span className="callout-icon">{selectedRole === "VENDOR" ? "🚀" : "🎁"}</span>
        <div>
          {selectedRole === "VENDOR" ? (
            <>
              <strong>0% Commission for First 30 Days</strong>
              <p>Sell with zero listing fees and get direct access to nationwide buyers.</p>
            </>
          ) : (
            <>
              <strong>₦2,000 Welcome Voucher</strong>
              <p>Get instant discount applied to your first order upon creating an account.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page-container">
        <div className="auth-wrapper">
          {/* Left Column: Brand Benefits */}
          <div className="auth-benefits-col">
            <a className="logo auth-brand-logo" href="/">
              SHOP<span>ZERO</span>
            </a>
            <h1>Welcome to smarter online shopping in Nigeria.</h1>
            <p className="auth-subtext">
              Join over 500,000 shoppers and 50,000 merchants enjoying zero guesswork, verified genuine brands, and lightning-fast doorstep delivery.
            </p>

            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon"><IconTruck size={24} /></span>
                <div>
                  <strong>Free Express Delivery</strong>
                  <p>On orders above ₦15,000 across Lagos, Abuja &amp; Port Harcourt.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon"><IconShield size={24} /></span>
                <div>
                  <strong>Buyer Protection &amp; Merchant Escrow</strong>
                  <p>Secure automated payments with guaranteed payouts for sellers.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon"><IconBadge size={24} /></span>
                <div>
                  <strong>100% Genuine Products</strong>
                  <p>Direct from verified Nigerian merchants and official distributors.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card */}
          <div className="auth-card-col">
            <Suspense fallback={<div className="auth-card">Loading...</div>}>
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
