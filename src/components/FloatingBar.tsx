"use client";

import Link from "next/link";
import { useVote } from "@/contexts/VoteContext";
import { VOTE_PRICE_NAIRA } from "@/lib/awards.config";

export function FloatingBar() {
  const { getTotalVotes, getTotalAmount } = useVote();
  const totalVotes = getTotalVotes();
  const totalNaira = getTotalAmount() / 100;

  return (
    <div className={`cbar ${totalVotes > 0 ? "visible" : ""}`}>
      <div>
        <div className="cbar-label">{totalVotes} vote{totalVotes !== 1 ? "s" : ""} · ₦{VOTE_PRICE_NAIRA}/vote</div>
        <div className="cbar-total">₦{totalNaira.toLocaleString()}</div>
      </div>
      <Link href="/vote/summary" className="cbar-btn">
        Review <i className="ti ti-arrow-right ml-1" style={{ fontSize: 12 }} />
      </Link>
    </div>
  );
}
