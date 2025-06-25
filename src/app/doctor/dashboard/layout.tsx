'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DoctorDashboardNav } from "@/components/doctor-dashboard/nav";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) {
      router.replace("/login");
    } else if (currentUser && currentUser.role !== 'doctor') {
      // If user is not a doctor, redirect them away
      router.replace("/dashboard"); 
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Only render if currentUser is a doctor
  return currentUser && currentUser.role === 'doctor' ? (
    <div className="flex min-h-screen w-full flex-col">
        <Header /> 
        <div className="flex min-h-[calc(100vh-4rem)]">
            <DoctorDashboardNav />
            <main className="flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <div className="p-4 sm:p-6">{children}</div>
            </main>
        </div>
    </div>
  ) : null;
}
