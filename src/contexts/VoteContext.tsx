"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { VoteSelection } from "@/types";
import { VOTE_PRICE_KOBO } from "@/lib/awards.config";

// ── State & Actions ─────────────────────────────────────────────────

interface VoteState {
  selections: VoteSelection[];
  hydrated: boolean;
}

type VoteAction =
  | { type: "ADD_VOTE"; payload: Omit<VoteSelection, "votes"> }
  | { type: "REMOVE_VOTE"; payload: { categoryId: string; nomineeId: string } }
  | {
      type: "REMOVE_NOMINEE";
      payload: { categoryId: string; nomineeId: string };
    }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: VoteSelection[] };

function voteReducer(state: VoteState, action: VoteAction): VoteState {
  switch (action.type) {
    case "ADD_VOTE": {
      const existing = state.selections.find(
        (s) =>
          s.categoryId === action.payload.categoryId &&
          s.nomineeId === action.payload.nomineeId
      );
      if (existing) {
        return {
          ...state,
          selections: state.selections.map((s) =>
            s.categoryId === action.payload.categoryId &&
            s.nomineeId === action.payload.nomineeId
              ? { ...s, votes: s.votes + 1 }
              : s
          ),
        };
      }
      return {
        ...state,
        selections: [...state.selections, { ...action.payload, votes: 1 }],
      };
    }

    case "REMOVE_VOTE": {
      const existing = state.selections.find(
        (s) =>
          s.categoryId === action.payload.categoryId &&
          s.nomineeId === action.payload.nomineeId
      );
      if (!existing) return state;
      if (existing.votes <= 1) {
        return {
          ...state,
          selections: state.selections.filter(
            (s) =>
              !(
                s.categoryId === action.payload.categoryId &&
                s.nomineeId === action.payload.nomineeId
              )
          ),
        };
      }
      return {
        ...state,
        selections: state.selections.map((s) =>
          s.categoryId === action.payload.categoryId &&
          s.nomineeId === action.payload.nomineeId
            ? { ...s, votes: s.votes - 1 }
            : s
        ),
      };
    }

    case "REMOVE_NOMINEE":
      return {
        ...state,
        selections: state.selections.filter(
          (s) =>
            !(
              s.categoryId === action.payload.categoryId &&
              s.nomineeId === action.payload.nomineeId
            )
        ),
      };

    case "CLEAR":
      return { ...state, selections: [] };

    case "HYDRATE":
      return { ...state, selections: action.payload, hydrated: true };

    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────────────────

interface VoteContextValue {
  selections: VoteSelection[];
  hydrated: boolean;
  addVote: (
    categoryId: string,
    nomineeId: string,
    nomineeName: string,
    categoryName: string
  ) => void;
  removeVote: (categoryId: string, nomineeId: string) => void;
  removeNominee: (categoryId: string, nomineeId: string) => void;
  getVotesForNominee: (categoryId: string, nomineeId: string) => number;
  getTotalVotes: () => number;
  getTotalAmount: () => number;
  clearSelections: () => void;
}

const VoteContext = createContext<VoteContextValue | null>(null);

const STORAGE_KEY = "vote-selections";

export function VoteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(voteReducer, {
    selections: [],
    hydrated: false,
  });

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VoteSelection[];
        dispatch({ type: "HYDRATE", payload: parsed });
      } else {
        dispatch({ type: "HYDRATE", payload: [] });
      }
    } catch {
      dispatch({ type: "HYDRATE", payload: [] });
    }
  }, []);

  // Persist to sessionStorage on every change (after hydration)
  useEffect(() => {
    if (state.hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.selections));
    }
  }, [state.selections, state.hydrated]);

  const addVote = useCallback(
    (
      categoryId: string,
      nomineeId: string,
      nomineeName: string,
      categoryName: string
    ) => {
      dispatch({
        type: "ADD_VOTE",
        payload: { categoryId, nomineeId, nomineeName, categoryName },
      });
    },
    []
  );

  const removeVote = useCallback(
    (categoryId: string, nomineeId: string) => {
      dispatch({ type: "REMOVE_VOTE", payload: { categoryId, nomineeId } });
    },
    []
  );

  const removeNominee = useCallback(
    (categoryId: string, nomineeId: string) => {
      dispatch({
        type: "REMOVE_NOMINEE",
        payload: { categoryId, nomineeId },
      });
    },
    []
  );

  const getVotesForNominee = useCallback(
    (categoryId: string, nomineeId: string) => {
      const sel = state.selections.find(
        (s) => s.categoryId === categoryId && s.nomineeId === nomineeId
      );
      return sel?.votes ?? 0;
    },
    [state.selections]
  );

  const getTotalVotes = useCallback(() => {
    return state.selections.reduce((sum, s) => sum + s.votes, 0);
  }, [state.selections]);

  const getTotalAmount = useCallback(() => {
    return getTotalVotes() * VOTE_PRICE_KOBO;
  }, [getTotalVotes]);

  const clearSelections = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <VoteContext.Provider
      value={{
        selections: state.selections,
        hydrated: state.hydrated,
        addVote,
        removeVote,
        removeNominee,
        getVotesForNominee,
        getTotalVotes,
        getTotalAmount,
        clearSelections,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
}

export function useVote() {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVote must be used within a VoteProvider");
  }
  return context;
}
