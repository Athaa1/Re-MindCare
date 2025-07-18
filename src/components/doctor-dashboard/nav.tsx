
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Users, CalendarDays, Settings, Package, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/doctor/dashboard", label: "Ringkasan", icon: Home },
    { href: "/doctor/dashboard/patients", label: "Pasien", icon: Users },
    { href: "/doctor/dashboard/schedule", label: "Jadwal", icon: CalendarDays },
    { href: "/doctor/dashboard/messages", label: "Pesan", icon: MessageSquare },
    { href: "/doctor/dashboard/settings", label: "Pengaturan", icon: Settings },
]

export function DoctorDashboardNav() {
    const pathname = usePathname();

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="#"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Re-MindCare Inc</span>
                    </Link>
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={href}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                                        pathname.startsWith(href) && href !== '/doctor/dashboard' || pathname === href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="sr-only">{label}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                    ))}
                </nav>
            </aside>
        </TooltipProvider>
    )
}
