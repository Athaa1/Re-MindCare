"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarCheck, MessageSquareWarning } from "lucide-react"
import { UpcomingDoctorAppointments } from "@/components/doctor-dashboard/UpcomingDoctorAppointments"
import { RecentPatients } from "@/components/doctor-dashboard/RecentPatients"

const overviewStats = [
    {
        icon: Users,
        title: "Total Pasien",
        value: "78",
        description: "+5 dari bulan lalu",
    },
    {
        icon: CalendarCheck,
        title: "Janji Temu Hari Ini",
        value: "4",
        description: "2 selesai, 2 mendatang",
    },
    {
        icon: MessageSquareWarning,
        title: "Pesan Mendesak",
        value: "1",
        description: "Perlu perhatian segera",
    }
]

export function DoctorOverview() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Dasbor Dokter</h1>
                <p className="text-muted-foreground">Selamat datang kembali. Berikut ringkasan hari Anda.</p>
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {overviewStats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <UpcomingDoctorAppointments />
                <RecentPatients />
            </div>
        </div>
    )
}
