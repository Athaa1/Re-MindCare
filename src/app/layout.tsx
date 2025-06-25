
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import PageWrapper from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "Re-MindCare",
  description: "Jalan Anda Menuju Kesehatan Mental",
  icons: { 
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImhzbCgyMDAgNjclIDYwJSkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1icmFpbi1jaXJjdWl0Ij48cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAtNS45LTEuNCIvPjxwYXRoIGQ9Ik0xMiA1YTMgMyAwIDEgMSA1LjktMS40Ii8+PHBhdGggZD0iTTE1IDEzYTMgMyAwIDEgMC01LjktMS40Ii8+PHBhdGggZD0iTTE1IDEzYTMgMyAwIDEgMSA1LjktMS40Ii8+PHBhdGggZD0iTTkgMTNhMyAzIDAgMSAwLTUuOS0xLjQiLz48cGF0aCBkPSJNOSAxM2EzIDMgMCAxIDEgNS45LTEuNCIvPjxwYXRoIGQ9Ik02LjEgMTEuNmEzIDMgMCAxIDAtNC4yIDQuMiIvPjxwYXRoIGQ9Ik0xNy45IDExLjZhMyAzIDAgMSAxIDQuMiA0LjIiLz48cGF0aCBkPSJNNi4xIDExLjZBMyAzIDAgMSAxIDEyIDEzYTMgMyAwIDEgMS01LjktMS40Ii8+PHBhdGggZD0iTTE3LjkgMTEuNkEzIDMgMCAxIDAgMTIgMTNhMyAzIDAgMSAwIDUuOS0xLjQiLz48cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAgMC02IDMgMyAwIDEgMCAwIDZaIi8+PHBhdGggZD0iTTEyIDEzYTMgMyAwIDEgMCAwLTYgMyAzIDAgMSAwIDAgNloiLz48L3N2Zz4=",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <PageWrapper>{children}</PageWrapper>
        <Toaster />
      </body>
    </html>
  );
}
