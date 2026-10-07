"use client";

import { useState } from "react";
import { SiteHeader } from "../../components/site-header";
import { IconShield } from "../../components/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="auth-page-container">
        <div className="auth-wrapper single-col">
          <div className="auth-card">
            <div className="auth-card-head">
              <h2>Reset Password</h2>
              <p>Enter the email associated with your Shop Zero account and we'll send recovery instructions.</p>
            </div>

            {submitted ? (
              <div className="auth-success-box">
                <span className="success-icon">📬</span>
                <h3>Check your inbox</h3>
                <p>We sent password reset instructions to <strong>{email}</strong>.</p>
                <a href="/login" className="auth-submit-btn inline-btn">Return to Sign In</a>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="e.g. chidi.okafor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button className="auth-submit-btn" type="submit">
                  Send Reset Link
                </button>

                <div className="auth-foot-link">
                  <a href="/login">← Back to Sign In</a>
                </div>
              </form>
            )}

            <div className="security-notice">
              <IconShield size={18} />
              <span>Reset links are encrypted and expire in 30 minutes.</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
