"use client";

import { useVote } from "@/contexts/VoteContext";
import type { NomineeConfig } from "@/lib/awards.config";

interface NomineeCardProps {
  nominee: NomineeConfig;
  categoryId: string;
  categoryName: string;
}

export function NomineeCard({ nominee, categoryId, categoryName }: NomineeCardProps) {
  const { addVote, getVotesForNominee } = useVote();
  const votes = getVotesForNominee(categoryId, nominee.id);
  const isSelected = votes > 0;

  const initials = nominee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`ncard ${isSelected ? "sel" : ""}`}
      onClick={() => addVote(categoryId, nominee.id, nominee.name, categoryName)}
    >
      {/* Radio */}
      <div className={`ncard-radio ${isSelected ? "sel" : ""}`}>
        <div className="ncard-radio-dot" />
      </div>

      {/* Avatar */}
      <div className="ncard-avatar">{initials}</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="ncard-name">{nominee.name}</div>
        {isSelected && (
          <div className="ncard-dept">{votes} vote{votes !== 1 ? "s" : ""} selected</div>
        )}
      </div>
    </div>
  );
}
