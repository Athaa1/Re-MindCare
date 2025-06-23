
"use client"

import { useState } from "react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
import { Calendar as CalendarIcon, TrendingUp, Clock, BookOpen, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"

const moodData = [
  { date: "2024-07-01", mood: 3, anxiety: 2 },
  { date: "2024-07-02", mood: 4, anxiety: 1 },
  { date: "2024-07-03", mood: 2, anxiety: 3 },
  { date: "2024-07-04", mood: 4, anxiety: 2 },
  { date: "2024-07-05", mood: 5, anxiety: 1 },
  { date: "2024-07-06", mood: 3, anxiety: 2 },
  { date: "2024-07-07", mood: 4, anxiety: 1 },
  { date: "2024-07-08", mood: 3, anxiety: 3 },
  { date: "2024-07-09", mood: 5, anxiety: 2 },
  { date: "2024-07-10", mood: 4, anxiety: 1 },
];

const activityData = [
  { name: "Sesi Terapi", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Menulis Jurnal", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Postingan Komunitas", value: 200, fill: "hsl(var(--chart-3))" },
  { name: "Akses Sumber Daya", value: 278, fill: "hsl(var(--chart-4))" },
];

const resourceData = [
  { name: "Kecemasan", views: 4000 },
  { name: "Depresi", views: 3000 },
  { name: "Stres", views: 2000 },
  { name: "Tidur", views: 2780 },
  { name: "Hubungan", views: 1890 },
];

const moodChartConfig = {
  mood: {
    label: "Suasana Hati Keseluruhan",
    color: "hsl(var(--chart-2))",
  },
  anxiety: {
    label: "Tingkat Kecemasan",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const activityChartConfig = {
    value: {
        label: "Aktivitas",
    },
    ...Object.fromEntries(activityData.map(d => [d.name, { label: d.name, color: d.fill }]))
} satisfies ChartConfig


export default function AnalyticsPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 6, 1),
        to: addDays(new Date(2024, 6, 1), 9),
    })

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dasbor Analitik</h1>
                    <p className="text-muted-foreground">Ringkasan perjalanan kesehatan mental Anda.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pilih tanggal</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tren Suasana Hati</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Sedikit Membaik</div>
                        <p className="text-xs text-muted-foreground">+2% dari minggu lalu</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jam Sesi</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12j</div>
                        <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sumber Daya Diakses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">28</div>
                        <p className="text-xs text-muted-foreground">5 artikel baru minggu ini</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Keterlibatan Komunitas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+5 Postingan</div>
                        <p className="text-xs text-muted-foreground">Bergabung dalam 1 percakapan baru</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Analisis Suasana Hati & Kecemasan</CardTitle>
                        <CardDescription>
                            Catatan harian tingkat suasana hati dan kecemasan Anda (1: Rendah, 5: Tinggi).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={moodChartConfig} className="w-full h-[350px]">
                            <AreaChart data={moodData} margin={{ left: -20, right: 20, top: 10, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-mood)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--color-mood)" stopOpacity={0.1}/>
                                    </linearGradient>
                                     <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-anxiety)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--color-anxiety)" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickMargin={8}
                                    tickFormatter={(value) => format(new Date(value), "MMM d")} 
                                />
                                <YAxis 
                                    domain={[0, 5]}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Area type="monotone" dataKey="mood" stroke="var(--color-mood)" fill="url(#colorMood)" strokeWidth={2} />
                                <Area type="monotone" dataKey="anxiety" stroke="var(--color-anxiety)" fill="url(#colorAnxiety)" strokeWidth={2} />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Rincian Aktivitas</CardTitle>
                        <CardDescription>Bagaimana Anda menggunakan platform ini.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[350px]">
                        <ChartContainer config={activityChartConfig} className="w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Pie data={activityData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5} strokeWidth={2}>
                                        {activityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Legend content={({ payload }) => (
                                        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
                                            {payload?.map((entry, index) => (
                                                <li key={`item-${index}`} className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    {entry.value}
                                                </li>
                                            ))}
                                        </ul>
                                    )} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Keterlibatan Sumber Daya</CardTitle>
                    <CardDescription>Topik paling banyak dilihat di Pusat Sumber Daya.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{ views: { label: "Dilihat", color: "hsl(var(--chart-1))" } }} className="w-full h-[300px]">
                        <BarChart data={resourceData} margin={{ left: -20, right: 20, top: 10, bottom: 10 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="views" fill="var(--color-views)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
