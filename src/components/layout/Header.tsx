
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, Menu, Search, UserCircle, Sparkles, Home, Settings, Users, CalendarDays, MessageSquare, Package } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "../ui/input";

const mainNavLinks = [
  { href: "/", label: "Beranda" },
  { href: "/services", label: "Cari Spesialis" },
  { href: "/resources", label: "Sumber Daya" },
  { href: "/forum", label: "Forum Komunitas" },
];

const userDashboardLinks = [
    { href: "/dashboard", label: "Ringkasan", icon: Home },
    { href: "/dashboard/analytics", label: "Analitik", icon: Users }, // Assuming LineChart is not defined, using Users
    { href: "/dashboard/appointments", label: "Janji Temu", icon: CalendarDays },
    { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
];

const doctorDashboardLinks = [
    { href: "/doctor/dashboard", label: "Ringkasan", icon: Home },
    { href: "/doctor/dashboard/patients", label: "Pasien", icon: Users },
    { href: "/doctor/dashboard/schedule", label: "Jadwal", icon: CalendarDays },
    { href: "/doctor/dashboard/messages", label: "Pesan", icon: MessageSquare },
    { href: "/doctor/dashboard/settings", label: "Pengaturan", icon: Settings },
];


export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (userData && loginStatus === 'true') {
      setCurrentUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const logout = async () => {
    try {
      // Call the PHP logout endpoint
      const response = await fetch('http://localhost/Re-MindCare/backendPHP/Logout/authLogout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear localStorage regardless of server response
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      setCurrentUser(null);
      setIsLoggedIn(false);
      
      // Redirect to login page
      router.push('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear localStorage and redirect even if server request fails
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      setCurrentUser(null);
      setIsLoggedIn(false);
      router.push('/login');
    }
  };

  const isUserDashboard = pathname.startsWith('/dashboard');
  const isDoctorDashboard = pathname.startsWith('/doctor/dashboard');
  const isDoctor = currentUser?.is_doctor === 1;

  if (isUserDashboard || isDoctorDashboard) {
    const mobileNavLinks = isDoctor ? doctorDashboardLinks : userDashboardLinks;
    const dashboardHome = isDoctor ? '/doctor/dashboard' : '/dashboard';

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Alihkan Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                        href={dashboardHome}
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                        <Package className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">Dasbor</span>
                    </Link>
                    {mobileNavLinks.map(({ href, label, icon: Icon }) => (
                         <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-4 px-2.5",
                                pathname.startsWith(href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    ))}
                    <div className="my-2 h-px bg-muted"></div>
                    <Link
                        href="/"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Home className="h-5 w-5" />
                        Halaman Utama
                    </Link>
                </nav>
                </SheetContent>
            </Sheet>
             <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Cari..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="overflow-hidden rounded-full flex items-center gap-2 px-3 py-2 h-auto"
                >
                    <UserCircle className="h-6 w-6" />
                    {currentUser && (
                        <span className="text-sm font-medium">
                            {isDoctor ? `dr. ${currentUser.name}` : currentUser.name}
                        </span>
                    )}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    {currentUser ? (isDoctor ? `dr. ${currentUser.name}` : currentUser.name) : 'Akun Saya'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(isDoctor ? '/doctor/dashboard/settings' : '/dashboard/settings')}>Pengaturan</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Dukungan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>Keluar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block font-headline">Re-MindCare</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {mainNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors hover:text-primary flex items-center gap-1.5",
                pathname === href ? "text-primary" : "text-muted-foreground",
                href === "/services" && "font-bold"
              )}
            >
              {href === "/services" && <Sparkles className="w-4 h-4 text-primary/80" />}
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end">
            {currentUser ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        <UserCircle className="h-8 w-8" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(currentUser.role === 'doctor' ? '/doctor/dashboard' : '/dashboard')}>Dasbor</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Dukungan</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={logout}>Keluar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild>
                    <Link href="/login">Masuk</Link>
                </Button>
            )}
            <div className="md:hidden ml-4">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Alihkan menu navigasi</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                    <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        <span className="font-bold inline-block font-headline">Re-MindCare</span>
                    </Link>
                    <nav className="grid gap-4">
                        {mainNavLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                            "text-lg font-medium transition-colors hover:text-primary flex items-center gap-2",
                            pathname === href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                          {href === "/services" && <Sparkles className="w-5 h-5 text-primary/80" />}
                          {label}
                        </Link>
                        ))}
                    </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
