"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/use-auth";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/doctor/dashboard');
    const isLoginOrRegister = pathname === '/login' || pathname === '/register';
    const isConsultation = pathname.startsWith('/consultation');

    if (isDashboard || isLoginOrRegister || isConsultation) {
        return (
            <AuthProvider>
                {children}
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </AuthProvider>
    );
}
