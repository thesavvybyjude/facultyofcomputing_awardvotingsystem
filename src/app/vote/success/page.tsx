"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface TransactionDetails {
  reference: string;
  totalVotes: number;
  totalAmount: number;
  votes: Array<{ nomineeName: string; categoryName: string; voteCount: number }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [details, setDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }
    fetch(`/api/transaction/${ref}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setDetails(d.transaction); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ref]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Check */}
      <div className="success-check animate-scale-in">
        <i className="ti ti-check" />
      </div>

      <h1 className="font-heading text-[28px] text-ink mb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        Votes Confirmed
      </h1>
      <p className="text-[13px] text-ink-muted mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
        Your votes have been recorded successfully.
      </p>

      {/* Receipt */}
      {loading ? (
        <div className="w-full max-w-xs animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="receipt">
            {[1, 2, 3].map((i) => (
              <div key={i} className="receipt-row">
                <span className="receipt-label">Loading…</span>
                <span className="receipt-value">—</span>
              </div>
            ))}
          </div>
        </div>
      ) : details ? (
        <div className="w-full max-w-xs animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="receipt">
            <div className="receipt-row">
              <span className="receipt-label">Reference</span>
              <span className="receipt-value text-[10px] font-mono">{details.reference}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Total Votes</span>
              <span className="receipt-value">{details.totalVotes}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount</span>
              <span className="receipt-value">₦{(details.totalAmount / 100).toLocaleString()}</span>
            </div>
            {details.votes?.map((v, i) => (
              <div key={i} className="receipt-row">
                <span className="receipt-label">{v.categoryName}</span>
                <span className="receipt-value">{v.nomineeName} ×{v.voteCount}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Link href="/" className="btn-outline">
          <i className="ti ti-refresh" style={{ fontSize: 14 }} />
          Vote again
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-ink-muted text-[13px]">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
