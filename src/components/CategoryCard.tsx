"use client";

import { useState } from "react";
import { NomineeCard } from "./NomineeCard";
import { VoteStepper } from "./VoteStepper";
import { useVote } from "@/contexts/VoteContext";
import { VOTE_PRICE_NAIRA } from "@/lib/awards.config";
import type { CategoryConfig } from "@/lib/awards.config";

interface CategoryCardProps {
  category: CategoryConfig;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const { selections, addVote, removeVote, getVotesForNominee } = useVote();

  const categoryVotes = selections
    .filter((s) => s.categoryId === category.id)
    .reduce((sum, s) => sum + s.votes, 0);

  // Find if any nominee is being voted on (for stepper display)
  const activeNominee = selectedNominee
    ? category.nominees.find((n) => n.id === selectedNominee)
    : null;

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Category label */}
      <div className="cat-label">{category.emoji} {category.name}</div>

      {/* Nominee list */}
      <div>
        {category.nominees.map((nominee, i) => {
          const votes = getVotesForNominee(category.id, nominee.id);
          return (
            <div
              key={nominee.id}
              className="arow"
              onClick={() => {
                setSelectedNominee(nominee.id === selectedNominee ? null : nominee.id);
                if (votes === 0) {
                  addVote(category.id, nominee.id, nominee.name, category.name);
                }
              }}
            >
              {/* Index */}
              <span className="arow-idx">{String(i + 1).padStart(2, "0")}</span>

              {/* Body */}
              <div className="arow-body">
                <div className="arow-name">{nominee.name}</div>
                {votes > 0 && (
                  <div className="arow-meta">{votes} vote{votes !== 1 ? "s" : ""}</div>
                )}
              </div>

              {/* Check or chevron */}
              {votes > 0 ? (
                <div className="arow-check on">
                  <i className="ti ti-check" style={{ fontSize: 12 }} />
                </div>
              ) : (
                <span className="arow-chev">
                  <i className="ti ti-chevron-right" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote counter for selected nominee */}
      {activeNominee && (
        <div className="mt-3 mb-4 animate-scale-in">
          <VoteStepper
            votes={getVotesForNominee(category.id, activeNominee.id)}
            nomineeName={activeNominee.name}
            costPerVote={VOTE_PRICE_NAIRA}
            onAdd={() => addVote(category.id, activeNominee.id, activeNominee.name, category.name)}
            onRemove={() => removeVote(category.id, activeNominee.id)}
          />
        </div>
      )}
    </div>
  );
}
