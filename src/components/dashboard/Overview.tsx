
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments"
import { BookUser, Users, HeartHandshake, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const chartData = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 5 },
  { day: "Sat", mood: 3 },
  { day: "Sun", mood: 4 },
];

const chartConfig = {
  mood: {
    label: "Mood",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const quickLinks = [
    {
        icon: BookUser,
        title: "Find a Specialist",
        description: "Get AI-powered recommendations for therapists and counselors.",
        href: "/services",
        cta: "Find a Match"
    },
    {
        icon: Users,
        title: "Community Forum",
        description: "Connect with peers and share your experiences in a safe space.",
        href: "/forum",
        cta: "Go to Forum"
    },
    {
        icon: FolderKanban,
        title: "Resource Hub",
        description: "Explore articles, videos, and tools for your mental wellness.",
        href: "/resources",
        cta: "Browse Resources"
    },
    {
        icon: HeartHandshake,
        title: "AI Resource Tool",
        description: "Get AI-powered resource suggestions based on your posts.",
        href: "/forum",
        cta: "Get Suggestions"
    }
]

export function Overview() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
                <p className="text-muted-foreground">Here's your personalized mental wellness overview.</p>
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
                        <CardTitle>Your Weekly Mood Journey</CardTitle>
                        <CardDescription>Track your mood fluctuations over the past week.</CardDescription>
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
                                        labelFormatter={(value, payload) => `Mood on ${payload[0]?.payload.day}: ${payload[0]?.value}/5`}
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
