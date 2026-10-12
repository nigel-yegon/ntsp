// app/review/verification/page.tsx
import { requireRole } from "@/app/components/review/require-role";
import { StageList } from "@/app/components/review/stage-list";

export default async function VerificationListPage() {
  await requireRole(["VERIFIER", "ADMIN"]);
  return (
    <StageList
      statuses={["UNDER_VERIFICATION"]}
      basePath="/review/verification"
      title="Document verification"
      subtitle="Confirm the authenticity of documents already perused."
      emptyMessage="No applications awaiting verification."
    />
  );
}