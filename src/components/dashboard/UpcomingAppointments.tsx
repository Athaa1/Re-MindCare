
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type UpcomingAppointment = {
  id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_title: string;
  doctor_image: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'canceled';
  created_at: string;
};

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUpcomingAppointments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userId = getCurrentUserId();
        console.log('Loading appointments for user:', userId);
        
        const response = await fetch(`/api/appointments?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          // Filter for upcoming appointments only
          const now = new Date();
          const upcomingAppointments = data.data.filter((apt: UpcomingAppointment) => {
            const appointmentDateTime = new Date(`${apt.appointment_date} ${apt.appointment_time}`);
            return appointmentDateTime > now && apt.status !== 'canceled';
          });
          
          // Sort by date and time
          upcomingAppointments.sort((a: UpcomingAppointment, b: UpcomingAppointment) => {
            const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
            return dateA.getTime() - dateB.getTime();
          });
          
          setAppointments(upcomingAppointments);
        } else {
          setError(data.message || 'Gagal memuat janji temu');
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
        setError('Terjadi kesalahan saat memuat janji temu');
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-500 text-xs">Dikonfirmasi</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Menunggu</Badge>;
      case 'canceled':
        return <Badge variant="destructive" className="text-xs">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle>Janji Temu Mendatang</CardTitle>
          <CardDescription>Memuat janji temu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle>Janji Temu Mendatang</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
            <CardTitle>Janji Temu Mendatang</CardTitle>
            <CardDescription>
              Anda memiliki {appointments.length} sesi mendatang.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div key={appointment.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={appointment.doctor_image} alt={appointment.doctor_name} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium leading-none truncate">{appointment.doctor_name}</p>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{appointment.doctor_title}</p>
                        {appointment.notes && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">💬 {appointment.notes}</p>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end gap-2 text-sm">
                           <Calendar className="h-4 w-4" />
                           {formatDate(appointment.appointment_date)}
                        </div>
                         <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(appointment.appointment_time)}
                        </div>
                    </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum Ada Janji Temu
                </h3>
                <p className="text-gray-600 mb-4">
                  Anda belum memiliki janji temu yang dijadwalkan.
                </p>
                <Button onClick={() => window.location.href = '/services'} size="sm">
                  Jadwalkan Sekarang
                </Button>
              </div>
            )}
             <Button variant="outline" asChild className="mt-4">
                <Link href="/dashboard/appointments">Lihat Semua Janji Temu</Link>
            </Button>
        </CardContent>
    </Card>
  )
}
