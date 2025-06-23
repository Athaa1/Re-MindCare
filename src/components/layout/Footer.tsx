import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Re-MindCare. All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
          <Link href="/forum" className="hover:text-primary transition-colors">Forum</Link>
        </div>
      </div>
    </footer>
  );
}
