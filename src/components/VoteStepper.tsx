"use client";

interface VoteStepperProps {
  votes: number;
  nomineeName?: string;
  costPerVote: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function VoteStepper({ votes, nomineeName, costPerVote, onAdd, onRemove }: VoteStepperProps) {
  return (
    <div className="vctr">
      {nomineeName && <div className="vctr-label">Votes for {nomineeName}</div>}
      <div className="vctr-row">
        <button onClick={onRemove} className="vctr-btn" disabled={votes === 0} style={{ opacity: votes === 0 ? 0.3 : 1 }}>
          −
        </button>
        <span className="vctr-num">{votes}</span>
        <button onClick={onAdd} className="vctr-btn">+</button>
      </div>
      <div className="vctr-cost">₦{(votes * costPerVote).toLocaleString()}</div>
    </div>
  );
}
