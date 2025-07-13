"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MoreVertical, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type TodayAppointment = {
    id: number;
    name: string;
    email: string;
    time: string;
    issue: string;
    avatar: string | null;
    status: string;
    appointment_date: string;
    appointment_time: string;
    specialization: string;
};

type TodayAppointmentsData = {
    appointments: TodayAppointment[];
    summary: {
        total_appointments: number;
        confirmed_appointments: number;
        pending_appointments: number;
        next_appointment: TodayAppointment | null;
        date: string;
    };
};

export function UpcomingDoctorAppointments() {
    const [todayData, setTodayData] = useState<TodayAppointmentsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTodayAppointments();
    }, []);

    const fetchTodayAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/appointments/today');
            const data = await response.json();

            if (data.success) {
                setTodayData(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Gagal memuat jadwal hari ini');
            console.error('Error fetching today\'s appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default" className="bg-green-500 text-xs">Dikonfirmasi</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="text-xs">Menunggu</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">{status}</Badge>;
        }
    };

    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Jadwal Hari Ini</CardTitle>
                <CardDescription>
                    {loading ? (
                        'Memuat jadwal...'
                    ) : error ? (
                        'Gagal memuat jadwal'
                    ) : (
                        `Anda memiliki ${todayData?.summary.total_appointments || 0} janji temu hari ini.`
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Memuat jadwal...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">{error}</p>
                        <Button 
                            variant="outline" 
                            onClick={fetchTodayAppointments}
                            className="mt-2"
                        >
                            Coba Lagi
                        </Button>
                    </div>
                ) : todayData?.appointments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Tidak ada jadwal hari ini</p>
                    </div>
                ) : (
                    todayData?.appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                {appointment.avatar ? (
                                    <AvatarImage src={appointment.avatar} alt={appointment.name} />
                                ) : (
                                    <AvatarFallback>
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium leading-none">{appointment.name}</p>
                                    {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{appointment.issue}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
