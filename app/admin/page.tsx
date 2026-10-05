import { DashboardClient } from "./dashboard-client";

export const metadata = {
  title: "Admin — NTSP",
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <DashboardClient />;
}