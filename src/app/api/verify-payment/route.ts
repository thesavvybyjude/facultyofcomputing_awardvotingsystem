import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { VOTE_PRICE_KOBO } from "@/lib/awards.config";
import type { VoteSelection } from "@/types";

export async function POST(req: Request) {
  try {
    const { reference, selections } = (await req.json()) as {
      reference: string;
      selections: VoteSelection[];
    };

    if (!reference || !selections || selections.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing reference or selections" },
        { status: 400 }
      );
    }

    // ── Recalculate amount server-side (anti-tampering) ─────────
    const totalVotes = selections.reduce((sum, s) => sum + s.votes, 0);
    const expectedAmountKobo = totalVotes * VOTE_PRICE_KOBO;

    // ── Verify with Paystack ────────────────────────────────────
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (
      !paystackData.status ||
      paystackData.data?.status !== "success" ||
      paystackData.data?.amount !== expectedAmountKobo
    ) {
      // Log failed attempt
      const supabase = createAdminClient();
      await supabase.from("transactions").insert({
        reference,
        amount_total: expectedAmountKobo,
        total_votes: totalVotes,
        status: "failed",
        paystack_response: paystackData,
      });

      return NextResponse.json(
        {
          success: false,
          error:
            paystackData.data?.amount !== expectedAmountKobo
              ? "Amount mismatch detected"
              : "Payment verification failed",
        },
        { status: 400 }
      );
    }

    // ── Record in database ──────────────────────────────────────
    const supabase = createAdminClient();

    // Insert transaction
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        reference,
        amount_total: expectedAmountKobo,
        total_votes: totalVotes,
        status: "success",
        paystack_response: paystackData.data,
      })
      .select("id")
      .single();

    if (txError || !transaction) {
      console.error("Transaction insert error:", txError);
      return NextResponse.json(
        { success: false, error: "Failed to record transaction" },
        { status: 500 }
      );
    }

    // Insert votes
    const voteRows = selections.map((sel) => ({
      transaction_id: transaction.id,
      category_id: sel.categoryId,
      nominee_id: sel.nomineeId,
      vote_count: sel.votes,
    }));

    const { error: votesError } = await supabase
      .from("votes")
      .insert(voteRows);

    if (votesError) {
      console.error("Votes insert error:", votesError);
      // Transaction is still recorded, but votes failed – flag for manual review
      return NextResponse.json(
        { success: false, error: "Failed to record votes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
