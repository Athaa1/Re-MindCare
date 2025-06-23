
import { Header } from "@/components/layout/Header";
import { DashboardNav } from "@/components/dashboard/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
