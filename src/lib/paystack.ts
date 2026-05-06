import type { PaystackOptions } from "@/types";

export function openPaystackPopup({
  amount,
  email,
  reference,
  onSuccess,
  onClose,
}: PaystackOptions) {
  // Dynamically import @paystack/inline-js (client-only)
  import("@paystack/inline-js").then(({ default: PaystackPop }) => {
    const popup = new PaystackPop();
    popup.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount, // in kobo
      reference,
      onSuccess: (transaction: Record<string, unknown>) => {
        onSuccess({
          reference: (transaction.reference as string) || reference,
          trans: (transaction.trans as string) || "",
          status: (transaction.status as string) || "success",
          message: (transaction.message as string) || "Payment successful",
          transaction: (transaction.transaction as string) || "",
          trxref: (transaction.trxref as string) || reference,
        });
      },
      onClose,
    });
  });
}

export function generateReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `vot_${timestamp}_${random}`;
}
