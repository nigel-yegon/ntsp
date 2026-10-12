// app/review/ps/page.tsx
import { requireRole } from "@/app/components/review/require-role";
import { StageList } from "@/app/components/review/stage-list";

export default async function PsListPage() {
  await requireRole(["PERMANENT_SECRETARY", "ADMIN"]);
  return (
    <StageList
      statuses={["AWAITING_PS_APPROVAL", "PS_APPROVED"]}
      basePath="/review/ps"
      title="Permanent Secretary review"
      subtitle="Applications awaiting final approval and forwarding to the Ministry of Interior."
      emptyMessage="No applications awaiting final approval."
    />
  );
}