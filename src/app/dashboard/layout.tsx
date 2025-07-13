'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DashboardNav } from "@/components/dashboard/nav";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is a regular user
    const userData = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!userData || !isLoggedIn) {
      router.replace("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.is_doctor === 1) {
      // If user is a doctor, redirect them to doctor dashboard
      router.replace("/doctor/dashboard");
      return;
    }
    
    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If user is logged in, render the dashboard layout.
  return (
    <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)]">
            <DashboardNav />
            <main className="flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <div className="p-4 sm:p-6">{children}</div>
            </main>
        </div>
    </div>
  );
}
