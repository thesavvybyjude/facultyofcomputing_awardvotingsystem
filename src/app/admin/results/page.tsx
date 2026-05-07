"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PinGate } from "@/components/admin/PinGate";
import { createClient } from "@/lib/supabase/client";
import type { CategoryResult } from "@/types";

export default function RealtimeResultsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [categories, setCategories] = useState<(CategoryResult & { emoji?: string })[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  useEffect(() => {
    const pin = sessionStorage.getItem("admin-pin");
    if (pin) setAuthenticated(true);
  }, []);

  const fetchResults = useCallback(async () => {
    const pin = sessionStorage.getItem("admin-pin");
    if (!pin) return;
    try {
      const res = await fetch("/api/admin/stats", { headers: { "x-admin-pin": pin } });
      const data = await res.json();
      if (data.success) {
        setCategories(data.stats.categoryResults);
        setTotalVotes(data.stats.totalVotes);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchResults();
    const supabase = createClient();
    const channel = supabase
      .channel("votes-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, () => fetchResults())
      .subscribe();
    channelRef.current = channel;
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [authenticated, fetchResults]);

  if (!authenticated) return <PinGate onAuthenticated={() => setAuthenticated(true)} />;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-[6px] h-[6px] rounded-full bg-live animate-pulse" />
          <span className="text-[10px] text-live font-medium uppercase tracking-wider">Live</span>
          <span className="text-[11px] text-ink-muted ml-auto font-medium">{totalVotes} total votes</span>
        </div>
        <h1 className="text-[24px] text-ink font-semibold" style={{ letterSpacing: "-0.01em" }}>Results</h1>
        <p className="text-[12px] text-ink-light font-medium">Live vote tallies by category</p>
      </div>

      <div className="scroll-area px-5 pb-24">
        {loading ? (
          <div className="mt-4 space-y-6">
            {[1,2,3].map((i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-surface-alt rounded mb-3" />
                <div className="space-y-2">
                  {[1,2,3].map((j) => <div key={j} className="h-4 bg-surface-alt rounded" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          categories.map((cat, ci) => {
            const maxVotes = Math.max(...cat.nominees.map((n) => n.totalVotes), 1);
            return (
              <div key={cat.categoryId} className="mb-5 animate-fade-in" style={{ animationDelay: `${ci * 0.06}s` }}>
                {/* Section title */}
                <div className="text-[13px] font-semibold text-ink pb-2 mb-3 border-b border-border-light">
                  {cat.categoryName}
                </div>

                {/* Bar rows */}
                {cat.nominees.map((n, ni) => {
                  const pct = n.totalVotes > 0 ? (n.totalVotes / maxVotes) * 100 : 0;
                  const isLeader = ni === 0 && n.totalVotes > 0;
                  return (
                    <div key={n.nomineeId} className="bar-row">
                      <span className="bar-name">{n.nomineeName}</span>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${ni === 1 ? "s2" : ni >= 2 ? "s3" : ""}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="bar-count">{n.totalVotes}</span>
                      {isLeader ? (
                        <span className="bar-crown"><i className="ti ti-crown" /></span>
                      ) : (
                        <span className="bar-crown" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Tabs */}
      <div className="atabs">
        <Link href="/admin" className="atab">
          <i className="ti ti-layout-dashboard" />
          <span>Overview</span>
        </Link>
        <button className="atab on">
          <i className="ti ti-trophy" />
          <span>Results</span>
        </button>
        <button className="atab" onClick={() => { sessionStorage.removeItem("admin-pin"); window.location.reload(); }}>
          <i className="ti ti-lock" />
          <span>Lock</span>
        </button>
      </div>
    </div>
  );
}
