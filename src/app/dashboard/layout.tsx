'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DashboardNav } from "@/components/dashboard/nav";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished (currentUser is not undefined) and there's no user, redirect to login.
    if (currentUser === null) {
      router.replace("/login");
    }
  }, [currentUser, router]);

  // While loading, show a full-screen spinner.
  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in, render the dashboard layout.
  return currentUser ? (
    <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)]">
            <DashboardNav />
            <main className="flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <div className="p-4 sm:p-6">{children}</div>
            </main>
        </div>
    </div>
  ) : null;
}
