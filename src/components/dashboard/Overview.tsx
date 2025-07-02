
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments"
import { BookUser, Users, HeartHandshake, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const chartData = [
  { day: "Sen", mood: 3 },
  { day: "Sel", mood: 4 },
  { day: "Rab", mood: 2 },
  { day: "Kam", mood: 4 },
  { day: "Jum", mood: 5 },
  { day: "Sab", mood: 3 },
  { day: "Min", mood: 4 },
];

const chartConfig = {
  mood: {
    label: "Suasana Hati",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const quickLinks = [
    {
        icon: BookUser,
        title: "Temukan Spesialis",
        description: "Dapatkan rekomendasi terapis dan konselor berbasis AI.",
        href: "/services",
        cta: "Temukan yang Cocok"
    },
    {
        icon: Users,
        title: "Forum Komunitas",
        description: "Terhubung dengan teman sebaya dan bagikan pengalaman Anda di ruang yang aman.",
        href: "/forum",
        cta: "Buka Forum"
    },
    {
        icon: FolderKanban,
        title: "Pusat Sumber Daya",
        description: "Jelajahi artikel, video, dan alat untuk kesehatan mental Anda.",
        href: "/resources",
        cta: "Jelajahi Sumber Daya"
    },
    {
        icon: HeartHandshake,
        title: "Alat Sumber Daya AI",
        description: "Dapatkan saran sumber daya berbasis AI berdasarkan postingan Anda.",
        href: "/resources",
        cta: "Dapatkan Saran"
    }
]

export function Overview() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Selamat Datang di Dasbor Anda</h1>
                <p className="text-muted-foreground">Berikut adalah ringkasan kesehatan mental pribadi Anda.</p>
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map((link) => (
                    <Card key={link.title} className="flex flex-col">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {link.title}
                            </CardTitle>
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <link.icon className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">
                                {link.description}
                            </p>
                        </CardContent>
                        <CardContent>
                             <Button asChild className="w-full">
                                <Link href={link.href}>{link.cta}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Perjalanan Mood Mingguan Anda</CardTitle>
                        <CardDescription>Lacak fluktuasi suasana hati Anda selama seminggu terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                       <ChartContainer config={chartConfig} className="w-full h-[300px]">
                            <BarChart data={chartData} accessibilityLayer margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis domain={[0, 5]} tickLine={false} axisLine={false} tickMargin={10} />
                                <ChartTooltip 
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        indicator="dot"
                                        labelFormatter={(value, payload) => `Suasana hati pada hari ${payload[0]?.payload.day}: ${payload[0]?.value}/5`}
                                        formatter={() => ''}
                                     />} 
                                />
                                <Bar dataKey="mood" fill="var(--color-mood)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <UpcomingAppointments />
            </div>
        </div>
    )
}
