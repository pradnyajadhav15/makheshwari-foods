import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/ui";
import AuthGate from "@/components/admin/AuthGate";

export const metadata: Metadata = {
  title: "Admin · Makheshwari Foods",
  robots: { index: false, follow: false },
};

export default function AdminV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthGate>{children}</AuthGate>
    </ToastProvider>
  );
}
