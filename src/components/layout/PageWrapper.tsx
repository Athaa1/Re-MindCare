"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isUserDashboard = pathname.startsWith('/dashboard');
    const isDoctorDashboard = pathname.startsWith('/doctor/dashboard');
    const isLoginOrRegister = pathname === '/login' || pathname === '/register';
    const isConsultation = pathname.startsWith('/consultation');

    if (isUserDashboard || isDoctorDashboard || isLoginOrRegister || isConsultation) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
