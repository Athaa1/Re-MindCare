
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments"
import MoodTracker from "@/components/dashboard/MoodTracker"
import { BookUser, Users, HeartHandshake, FolderKanban, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const chartConfig = {
  mood: {
    label: "Suasana Hati",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type QuickLink = {
    icon: any;
    title: string;
    description: string;
    href: string;
    cta: string;
    isScroll?: boolean;
};

const quickLinks: QuickLink[] = [
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
        title: "Mood Tracker",
        description: "Lacak dan simpan mood Anda setiap hari untuk memantau kesehatan mental.",
        href: "#mood-tracker",
        cta: "Lacak Mood",
        isScroll: true
    }
]

const scrollToMoodTracker = () => {
    const element = document.getElementById('mood-tracker');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

export function Overview() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Get current user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentUser(user);
            fetchWeeklyMoodData(user.id);
        } else {
            setChartLoading(false);
            setChartData(getDefaultWeeklyData());
        }
    }, []);

    const fetchWeeklyMoodData = async (userId: number) => {
        try {
            setChartLoading(true);
            const response = await fetch(`http://localhost/Re-MindCare/backendPHP/Mood/mood.php?user_id=${userId}`);
            const data = await response.json();
            
            if (data.success && data.moodHistory) {
                // Process mood history to create chart data for the last 7 days
                const weeklyData = generateWeeklyChartData(data.moodHistory);
                setChartData(weeklyData);
            } else {
                // Use default data if no mood history
                setChartData(getDefaultWeeklyData());
            }
        } catch (error) {
            console.error('Error fetching weekly mood data:', error);
            setChartData(getDefaultWeeklyData());
        } finally {
            setChartLoading(false);
        }
    };

    const generateWeeklyChartData = (moodHistory: any[]) => {
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        const today = new Date();
        const weekData = [];

        // Generate data for the last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            // Find mood for this date (should be the latest entry for that date)
            const moodEntry = moodHistory.find((entry: any) => entry.date === dateString);
            const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start
            
            weekData.push({
                day: dayName,
                mood: moodEntry ? moodEntry.mood : 0,
                date: dateString,
                hasData: !!moodEntry
            });
        }

        return weekData;
    };

    const getDefaultWeeklyData = () => {
        return [
            { day: "Sen", mood: 0, date: "" },
            { day: "Sel", mood: 0, date: "" },
            { day: "Rab", mood: 0, date: "" },
            { day: "Kam", mood: 0, date: "" },
            { day: "Jum", mood: 0, date: "" },
            { day: "Sab", mood: 0, date: "" },
            { day: "Min", mood: 0, date: "" },
        ];
    };

    // Function to refresh chart data when mood is updated
    const refreshChartData = () => {
        if (currentUser) {
            fetchWeeklyMoodData(currentUser.id);
        }
    };
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
                            {link.isScroll ? (
                                <Button onClick={scrollToMoodTracker} className="w-full">
                                    {link.cta}
                                </Button>
                            ) : (
                                <Button asChild className="w-full">
                                    <Link href={link.href}>{link.cta}</Link>
                                </Button>
                            )}
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
                        {chartLoading ? (
                            <div className="flex items-center justify-center h-[300px]">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2 text-muted-foreground">Memuat data mood...</span>
                            </div>
                        ) : (
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
                                            labelFormatter={(value, payload) => {
                                                const moodValue = payload[0]?.value || 0;
                                                const day = payload[0]?.payload.day || value;
                                                return `Suasana hati pada hari ${day}: ${moodValue === 0 ? 'Belum diisi' : `${moodValue}/5`}`;
                                            }}
                                            formatter={() => ''}
                                         />} 
                                    />
                                    <Bar dataKey="mood" fill="var(--color-mood)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
                <div className="col-span-3 space-y-6">
                    <UpcomingAppointments />
                    <div id="mood-tracker">
                        <MoodTracker onMoodUpdated={refreshChartData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
