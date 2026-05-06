import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardsConfig } from "@/lib/awards.config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;

    if (!ref) {
      return NextResponse.json(
        { success: false, error: "Missing reference" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch transaction
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference", ref)
      .eq("status", "success")
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Fetch votes for this transaction
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("*")
      .eq("transaction_id", transaction.id);

    if (votesError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch votes" },
        { status: 500 }
      );
    }

    // Map nominee/category IDs to names from config
    const votesWithNames = (votes || []).map((v) => {
      const category = awardsConfig.find((c) => c.id === v.category_id);
      const nominee = category?.nominees.find((n) => n.id === v.nominee_id);
      return {
        nomineeName: nominee?.name || v.nominee_id,
        categoryName: category?.name || v.category_id,
        voteCount: v.vote_count,
      };
    });

    return NextResponse.json({
      success: true,
      transaction: {
        reference: transaction.reference,
        totalVotes: transaction.total_votes,
        totalAmount: transaction.amount_total,
        votes: votesWithNames,
      },
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
