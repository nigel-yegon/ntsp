// app/review/committee/page.tsx
import { requireRole } from "@/app/components/review/require-role";
import { StageList } from "@/app/components/review/stage-list";

export default async function CommitteeListPage() {
  await requireRole(["COMMITTEE_MEMBER", "ADMIN"]);
  return (
    <StageList
      statuses={["AWAITING_COMMITTEE"]}
      basePath="/review/committee"
      title="Committee review"
      subtitle="Applications escalated for committee decision."
      emptyMessage="No applications awaiting committee."
    />
  );
}