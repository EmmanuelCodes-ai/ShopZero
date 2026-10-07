"use client";

import React, { useState, useEffect } from "react";
import { SiteHeader } from "../../../components/site-header";
import { useAuth } from "../../../context/auth-context";
import { IconShield, IconBadge } from "../../../components/icons";

interface VendorKycData {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  kycStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  idType?: string;
  idNumber?: string;
  businessAddress?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  rejectionReason?: string;
  kycSubmittedAt?: string;
}

export default function VendorKycPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [kycData, setKycData] = useState<VendorKycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form inputs
  const [idType, setIdType] = useState("NIN");
  const [idNumber, setIdNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [bankName, setBankName] = useState("Access Bank");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  useEffect(() => {
    async function fetchKyc() {
      try {
        const res = await fetch("/api/vendor/kyc");
        const data = await res.json();
        if (data.success && data.vendor) {
          setKycData(data.vendor);
          if (data.vendor.idType) setIdType(data.vendor.idType);
          if (data.vendor.idNumber) setIdNumber(data.vendor.idNumber);
          if (data.vendor.businessAddress) setBusinessAddress(data.vendor.businessAddress);
          if (data.vendor.bankName) setBankName(data.vendor.bankName);
          if (data.vendor.bankAccountNumber) setBankAccountNumber(data.vendor.bankAccountNumber);
          if (data.vendor.bankAccountName) setBankAccountName(data.vendor.bankAccountName);
        }
      } catch (err) {
        console.error("KYC fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchKyc();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/vendor/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idType,
          idNumber,
          businessAddress,
          bankName,
          bankAccountNumber,
          bankAccountName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: "Verification details submitted successfully! Your account status is now PENDING REVIEW.",
        });
        setKycData((prev) => (prev ? { ...prev, kycStatus: "PENDING" } : null));
      } else {
        setFeedback({ type: "error", text: data.error || "Submission failed." });
      }
    } catch (err) {
      setFeedback({ type: "error", text: "Network error occurred during KYC submission." });
    } finally {
      setSubmitting(false);
    }
  };

  const status = kycData?.kycStatus || "NOT_SUBMITTED";

  return (
    <div className="kyc-page-container">
      <SiteHeader />

      <main className="container kyc-main-content">
        <div className="kyc-header-block">
          <div className="kyc-title-group">
            <span className="kyc-shield-badge">🛡️ Merchant Verification</span>
            <h1>Vendor Identity &amp; Anti-Fraud KYC</h1>
            <p>
              To protect buyers on Shop Zero and eliminate fraudulent listings, all vendors must verify their legal
              identity and bank payout details before listing products.
            </p>
          </div>

          {/* Real-time Status Card */}
          <div className={`kyc-status-card status-${status.toLowerCase()}`}>
            <div className="status-icon-wrap">
              {status === "APPROVED" && "🟢"}
              {status === "PENDING" && "🟡"}
              {status === "REJECTED" && "🔴"}
              {status === "NOT_SUBMITTED" && "⚪"}
            </div>
            <div className="status-info">
              <h3>
                Verification Status:{" "}
                <span className="status-title-text">
                  {status === "APPROVED" && "VERIFIED MERCHANT ✓"}
                  {status === "PENDING" && "UNDER REVIEW ⏳"}
                  {status === "REJECTED" && "ACTION REQUIRED ⚠️"}
                  {status === "NOT_SUBMITTED" && "NOT SUBMITTED"}
                </span>
              </h3>
              <p>
                {status === "APPROVED" &&
                  "Your merchant account is fully verified! You can list products and receive payouts."}
                {status === "PENDING" &&
                  "Your KYC documents are currently being reviewed by our Trust & Risk Security Team (takes 2-4 hours)."}
                {status === "REJECTED" &&
                  `Verification rejected: ${kycData?.rejectionReason || "Details did not match bank records. Please resubmit."}`}
                {status === "NOT_SUBMITTED" &&
                  "Please submit your government ID and bank payout details below to activate your storefront."}
              </p>
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`kyc-alert-banner ${feedback.type}`}>
            <span>{feedback.type === "success" ? "✅" : "⚠️"} {feedback.text}</span>
          </div>
        )}

        {/* KYC Form */}
        {status !== "APPROVED" && (
          <form className="kyc-form-card" onSubmit={handleSubmit}>
            <div className="kyc-section-header">
              <h2>1. Government Identity Verification</h2>
              <p>Verify your official business or personal government identification.</p>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>ID Document Type</label>
                <select value={idType} onChange={(e) => setIdType(e.target.value)}>
                  <option value="NIN">National Identity Number (NIN)</option>
                  <option value="CAC">CAC Business Certificate (RC / BN Number)</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                  <option value="PASSPORT">International Passport</option>
                  <option value="VOTERS_CARD">Permanent Voter's Card (PVC)</option>
                </select>
              </div>

              <div className="form-group">
                <label>ID / Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. 12345678901 or RC-987654"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Business / Operating Address</label>
              <input
                type="text"
                placeholder="e.g. Suite 4, Computer Village, Ikeja, Lagos"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
              />
            </div>

            <div className="kyc-section-header margin-top">
              <h2>2. Payout Bank Account Details</h2>
              <p>Escrow payouts for sold items will be credited to this verified bank account.</p>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Bank Name</label>
                <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                  <option value="Access Bank">Access Bank</option>
                  <option value="GTBank">Guaranty Trust Bank (GTB)</option>
                  <option value="First Bank">First Bank of Nigeria</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="UBA">United Bank for Africa (UBA)</option>
                  <option value="Kuda Bank">Kuda Microfinance Bank</option>
                  <option value="OPay">OPay Digital Services</option>
                  <option value="Palmpay">PalmPay</option>
                </select>
              </div>

              <div className="form-group">
                <label>Account Number (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 0123456789"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Name (Must match ID)</label>
                <input
                  type="text"
                  placeholder="e.g. Chidi Okafor Electronics"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="kyc-submit-bar">
              <button className="kyc-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting Verification…" : "Submit Verification Documents"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
