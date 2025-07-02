
"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
import { TrendingUp, Users, CalendarCheck, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"

const patientGrowthData = [
  { month: "Jan", newPatients: 5 },
  { month: "Feb", newPatients: 8 },
  { month: "Mar", newPatients: 12 },
  { month: "Apr", newPatients: 10 },
  { month: "Mei", newPatients: 15 },
  { month: "Jun", newPatients: 18 },
  { month: "Jul", newPatients: 20 },
];

const patientGrowthChartConfig = {
  newPatients: {
    label: "Pasien Baru",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const appointmentVolumeData = [
  { week: "Minggu 1", appointments: 10 },
  { week: "Minggu 2", appointments: 12 },
  { week: "Minggu 3", appointments: 8 },
  { week: "Minggu 4", appointments: 15 },
  { week: "Minggu 5", appointments: 18 },
];

const appointmentVolumeChartConfig = {
    appointments: {
        label: "Janji Temu",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const commonIssuesData = [
  { name: "Kecemasan", value: 45, fill: "hsl(var(--chart-1))" },
  { name: "Depresi", value: 30, fill: "hsl(var(--chart-2))" },
  { name: "Stres", value: 15, fill: "hsl(var(--chart-3))" },
  { name: "ADHD", value: 5, fill: "hsl(var(--chart-4))" },
  { name: "Lainnya", value: 5, fill: "hsl(var(--chart-5))" },
];

const commonIssuesChartConfig = {
    value: {
        label: "Kasus",
    },
    ...Object.fromEntries(commonIssuesData.map(d => [d.name.replace(" ", ""), { label: d.name, color: d.fill }]))
} satisfies ChartConfig


export default function DoctorAnalyticsPage() {

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analitik Praktik</h1>
                    <p className="text-muted-foreground">Wawasan tentang aktivitas pasien dan janji temu Anda.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pasien Aktif</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">78</div>
                        <p className="text-xs text-muted-foreground">+5 dari bulan lalu</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Janji Temu Bulan Ini</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">53</div>
                        <p className="text-xs text-muted-foreground">+10% dari bulan lalu</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tingkat Keterlibatan Pasien</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">Tingkat respons pesan rata-rata</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pertumbuhan Pasien</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+18 Pasien</div>
                        <p className="text-xs text-muted-foreground">Dalam 6 bulan terakhir</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Pertumbuhan Pasien Bulanan</CardTitle>
                        <CardDescription>
                            Jumlah pasien baru yang Anda tangani setiap bulan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={patientGrowthChartConfig} className="w-full h-[350px]">
                            <BarChart data={patientGrowthData} margin={{ left: -20, right: 20, top: 10, bottom: 10 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis 
                                    dataKey="month" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickMargin={8}
                                />
                                <YAxis 
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="newPatients" fill="var(--color-newPatients)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Masalah Umum Pasien</CardTitle>
                        <CardDescription>Distribusi masalah yang dilaporkan oleh pasien Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[350px]">
                        <ChartContainer config={commonIssuesChartConfig} className="w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Pie data={commonIssuesData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5} strokeWidth={2}>
                                        {commonIssuesData.map((entry, index) => (
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
                    <CardTitle>Volume Janji Temu Mingguan</CardTitle>
                    <CardDescription>Jumlah janji temu yang dijadwalkan setiap minggu.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={appointmentVolumeChartConfig} className="w-full h-[300px]">
                        <AreaChart data={appointmentVolumeData} margin={{ left: -20, right: 20, top: 10, bottom: 10 }}>
                             <defs>
                                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-appointments)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-appointments)" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Area type="monotone" dataKey="appointments" stroke="var(--color-appointments)" fill="url(#colorAppointments)" strokeWidth={2} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
