// ── Vote Selection (client-side state) ──────────────────────────────
export interface VoteSelection {
  categoryId: string;
  nomineeId: string;
  nomineeName: string;
  categoryName: string;
  votes: number;
}

// ── Database Records ────────────────────────────────────────────────
export interface TransactionRecord {
  id: string;
  reference: string;
  amount_total: number; // in kobo
  total_votes: number;
  status: "pending" | "success" | "failed";
  paystack_response?: Record<string, unknown>;
  created_at: string;
}

export interface VoteRecord {
  id: string;
  transaction_id: string;
  category_id: string;
  nominee_id: string;
  vote_count: number;
  created_at: string;
}

// ── Admin Stats ─────────────────────────────────────────────────────
export interface AdminStats {
  totalVotes: number;
  totalAmount: number; // in kobo
  totalVoters: number;
  categoryResults: CategoryResult[];
}

export interface CategoryResult {
  categoryId: string;
  categoryName: string;
  nominees: NomineeResult[];
}

export interface NomineeResult {
  nomineeId: string;
  nomineeName: string;
  totalVotes: number;
}

// ── Paystack ────────────────────────────────────────────────────────
export interface PaystackSuccessResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

export interface PaystackOptions {
  amount: number;
  email: string;
  reference: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose: () => void;
}
