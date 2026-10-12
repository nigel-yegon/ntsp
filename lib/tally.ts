// lib/tally.ts
export type VoteLike = { decision: "APPROVE" | "DECLINE" | "ABSTAIN" | string };

export type TallyOutcome = "APPROVED" | "DECLINED" | "TIE";

export function tallyVotes(votes: VoteLike[]): TallyOutcome {
  const approvals = votes.filter((v) => v.decision === "APPROVE").length;
  const declines = votes.filter((v) => v.decision === "DECLINE").length;

  if (approvals === 0 && declines === 0) return "TIE";
  if (approvals > declines) return "APPROVED";
  if (declines > approvals) return "DECLINED";
  return "TIE";
}