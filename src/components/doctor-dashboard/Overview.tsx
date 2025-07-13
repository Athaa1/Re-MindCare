"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarCheck, Activity, TrendingUp, Loader2 } from "lucide-react"
import { UpcomingDoctorAppointments } from "@/components/doctor-dashboard/UpcomingDoctorAppointments"
import { RecentPatients } from "@/components/doctor-dashboard/RecentPatients"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
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

type PatientData = {
    total_patients: number;
    new_patients_this_month: number;
    growth_from_last_month: number;
    recently_active_patients: number;
    ever_tracked_patients: number;
    today_active_patients: number;
    engagement_percentage: number;
    adoption_percentage: number;
    average_mood: number | null;
    recent_patients: Array<{
        id: number;
        name: string;
        email: string;
        created_at: string;
    }>;
};

type MonthlyGrowthData = {
    monthly_growth: Array<{
        month: string;
        newPatients: number;
        year: number;
        month_number: number;
    }>;
    total_new_patients_12_months: number;
    current_month_patients: number;
    last_month_patients: number;
    growth_percentage: number;
    peak_month: string;
    peak_patients: number;
};

type AppointmentStatsData = {
    current_month_appointments: number;
    last_month_appointments: number;
    growth_percentage: number;
    upcoming_appointments: number;
    weekly_breakdown: Array<{
        week: string;
        appointments: number;
    }>;
    status_breakdown: Array<{
        status: string;
        count: number;
    }>;
    month_name: string;
    current_month: number;
    current_year: number;
};

export function DoctorOverview() {
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [monthlyGrowthData, setMonthlyGrowthData] = useState<MonthlyGrowthData | null>(null);
    const [appointmentStats, setAppointmentStats] = useState<AppointmentStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [appointmentStatsLoading, setAppointmentStatsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPatientData();
        fetchMonthlyGrowthData();
        fetchAppointmentStats();
    }, []);

    const fetchMonthlyGrowthData = async () => {
        try {
            setChartLoading(true);
            const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/monthly-growth.php');
            const data = await response.json();

            if (data.success) {
                setMonthlyGrowthData(data.data);
            } else {
                console.error('Failed to fetch monthly growth data:', data.message);
            }
        } catch (err) {
            console.error('Error fetching monthly growth data:', err);
        } finally {
            setChartLoading(false);
        }
    };

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/engagement.php');
            const data = await response.json();

            if (data.success) {
                setPatientData(data.data);
            } else {
                setError(data.message || 'Failed to fetch patient data');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Error fetching patient data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointmentStats = async () => {
        try {
            setAppointmentStatsLoading(true);
            const response = await fetch('/api/appointments/stats');
            const data = await response.json();

            if (data.success) {
                setAppointmentStats(data.data);
            } else {
                console.error('Failed to fetch appointment statistics:', data.message);
            }
        } catch (err) {
            console.error('Error fetching appointment statistics:', err);
        } finally {
            setAppointmentStatsLoading(false);
        }
    };

    const getMoodEngagement = () => {
        if (!patientData) return 0;
        return patientData.engagement_percentage;
    };
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dasbor Dokter</h1>
                    <p className="text-muted-foreground">Selamat datang kembali. Berikut ringkasan dan analitik praktik Anda.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pasien Aktif</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <div className="text-2xl font-bold">-</div>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{patientData?.total_patients || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    {patientData?.growth_from_last_month ? 
                                        `+${patientData.growth_from_last_month} dari bulan lalu` : 
                                        'Tidak ada pertumbuhan'
                                    }
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Janji Temu Bulan Ini</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {appointmentStatsLoading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <div className="text-2xl font-bold">-</div>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{appointmentStats?.current_month_appointments || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    {appointmentStats?.growth_percentage !== undefined ? 
                                        `${appointmentStats.growth_percentage >= 0 ? '+' : ''}${appointmentStats.growth_percentage}% dari bulan lalu` : 
                                        'Belum ada data bulan lalu'
                                    }
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tingkat Keterlibatan Pasien</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <div className="text-2xl font-bold">-</div>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{getMoodEngagement()}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {patientData?.recently_active_patients || 0} dari {patientData?.total_patients || 0} pasien aktif 7 hari terakhir
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pasien Baru Bulan Ini</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <div className="text-2xl font-bold">-</div>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{patientData?.new_patients_this_month || 0}</div>
                                <p className="text-xs text-muted-foreground">Pasien yang baru mendaftar</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <UpcomingDoctorAppointments />
                <RecentPatients />
            </div>

            {/* Additional engagement statistics */}
            {!loading && patientData && (
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Statistik Keterlibatan Harian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Aktif Hari Ini</span>
                                    <span className="font-semibold">{patientData.today_active_patients} pasien</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Aktif 7 Hari Terakhir</span>
                                    <span className="font-semibold">{patientData.recently_active_patients} pasien</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Pernah Melacak Mood</span>
                                    <span className="font-semibold">{patientData.ever_tracked_patients} pasien</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Rata-rata Mood Pasien</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-2">
                                <div className="text-3xl font-bold">
                                    {patientData.average_mood ? patientData.average_mood : 'N/A'}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {patientData.average_mood ? 
                                        `${patientData.average_mood >= 4 ? 'Baik' : 
                                          patientData.average_mood >= 3 ? 'Biasa' : 
                                          patientData.average_mood >= 2 ? 'Kurang' : 'Buruk'} (7 hari terakhir)` : 
                                        'Belum ada data mood'
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tingkat Adopsi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-2">
                                <div className="text-3xl font-bold">{patientData.adoption_percentage}%</div>
                                <p className="text-sm text-muted-foreground">
                                    Pasien yang pernah menggunakan mood tracker
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Pertumbuhan Pasien Bulanan</CardTitle>
                        <CardDescription>
                            {monthlyGrowthData ? 
                                `${monthlyGrowthData.total_new_patients_12_months} pasien baru dalam 12 bulan terakhir` :
                                'Jumlah pasien baru yang Anda tangani setiap bulan.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartLoading ? (
                            <div className="flex items-center justify-center h-[350px]">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2 text-muted-foreground">Memuat data pertumbuhan...</span>
                            </div>
                        ) : (
                            <ChartContainer config={patientGrowthChartConfig} className="w-full h-[350px]">
                                <BarChart 
                                    data={monthlyGrowthData?.monthly_growth || patientGrowthData} 
                                    margin={{ left: -20, right: 20, top: 10, bottom: 10 }}
                                >
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
                                    <ChartTooltip 
                                        cursor={false} 
                                        content={<ChartTooltipContent 
                                            indicator="dot"
                                            labelFormatter={(value, payload) => {
                                                const monthData = payload[0]?.payload;
                                                return `${monthData?.month || value}: ${payload[0]?.value || 0} pasien baru`;
                                            }}
                                        />} 
                                    />
                                    <Bar dataKey="newPatients" fill="var(--color-newPatients)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        )}
                        {monthlyGrowthData && (
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <p className="text-muted-foreground">Bulan Ini</p>
                                    <p className="font-semibold">{monthlyGrowthData.current_month_patients} pasien</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground">Pertumbuhan</p>
                                    <p className={`font-semibold ${monthlyGrowthData.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {monthlyGrowthData.growth_percentage >= 0 ? '+' : ''}{monthlyGrowthData.growth_percentage}%
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground">Puncak</p>
                                    <p className="font-semibold">{monthlyGrowthData.peak_month} ({monthlyGrowthData.peak_patients})</p>
                                </div>
                            </div>
                        )}
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
                    {appointmentStatsLoading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <ChartContainer config={appointmentVolumeChartConfig} className="w-full h-[300px]">
                            <AreaChart data={appointmentStats?.weekly_breakdown || appointmentVolumeData} margin={{ left: -20, right: 20, top: 10, bottom: 10 }}>
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
