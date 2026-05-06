"use client";

import Link from "next/link";
import { EVENT_NAME, VOTE_PRICE_NAIRA } from "@/lib/awards.config";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#111" }}>
      {/* Eyebrow */}
      <p
        className="animate-fade-in text-[10px] uppercase tracking-[0.14em] mb-6"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Class of 2026 presents
      </p>

      {/* Title */}
      <h1
        className="animate-fade-in font-heading text-[44px] leading-[1.05] text-white mb-6"
        style={{ animationDelay: "0.1s" }}
      >
        {EVENT_NAME.split(" ").slice(0, -1).join(" ")}{" "}
        <em style={{ color: "#C8BF9E" }}>{EVENT_NAME.split(" ").pop()}</em>
      </h1>

      {/* Divider */}
      <div
        className="animate-fade-in w-8 h-px mx-auto mb-6"
        style={{ background: "rgba(255,255,255,0.15)", animationDelay: "0.15s" }}
      />

      {/* Description */}
      <p
        className="animate-fade-in text-[13px] font-light max-w-xs mx-auto mb-2"
        style={{ color: "rgba(255,255,255,0.55)", animationDelay: "0.2s" }}
      >
        Celebrate and vote for your classmates across multiple award categories.
      </p>

      {/* Price */}
      <p
        className="animate-fade-in text-[11px] mb-10"
        style={{ color: "rgba(255,255,255,0.3)", animationDelay: "0.25s" }}
      >
        ₦{VOTE_PRICE_NAIRA} per vote · No limits
      </p>

      {/* CTA */}
      <div className="animate-fade-in w-full max-w-xs" style={{ animationDelay: "0.3s" }}>
        <Link
          href="/vote"
          className="flex items-center justify-between w-full bg-white text-ink font-medium text-[13px] py-[14px] px-[18px] rounded-[6px] no-underline"
          id="start-voting-btn"
        >
          <span>Start Voting</span>
          <i className="ti ti-arrow-right text-[14px]" />
        </Link>
      </div>
    </div>
  );
}
