'use client';

import { useState, useEffect } from 'react';
import { getCurrentUserId, getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Calendar as CalendarIcon, Clock, User, MessageSquare, Phone, FileText, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleAppointmentDialog from '@/components/appointments/ScheduleAppointmentDialog';
import { useToast } from '@/hooks/use-toast';

type Appointment = {
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
  updated_at: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userId = getCurrentUserId();
        console.log('Loading all appointments for user:', userId);
        
        const response = await fetch(`/api/appointments?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          // Sort by date and time (newest first)
          const sortedAppointments = data.data.sort((a: Appointment, b: Appointment) => {
            const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
            return dateB.getTime() - dateA.getTime();
          });
          
          setAppointments(sortedAppointments);
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

    loadAppointments();
  }, []);

  const handleAppointmentScheduled = (scheduledAppointment: any) => {
    // Refresh the appointments list
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
        return <Badge variant="default" className="bg-green-500">Dikonfirmasi</Badge>;
      case 'pending':
        return <Badge variant="secondary">Menunggu Konfirmasi</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filterAppointments = (filter: 'all' | 'upcoming' | 'past' | 'pending') => {
    const now = new Date();
    
    return appointments.filter(appointment => {
      const appointmentDateTime = new Date(`${appointment.appointment_date} ${appointment.appointment_time}`);
      
      switch (filter) {
        case 'upcoming':
          return appointmentDateTime > now && appointment.status !== 'canceled';
        case 'past':
          return appointmentDateTime <= now;
        case 'pending':
          return appointment.status === 'pending';
        default:
          return true;
      }
    });
  };

  const now = new Date();

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const appointmentDateTime = new Date(`${appointment.appointment_date} ${appointment.appointment_time}`);
    const isUpcoming = appointmentDateTime > now;
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.doctor_image} alt={appointment.doctor_name} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{appointment.doctor_name}</CardTitle>
                <CardDescription>{appointment.doctor_title}</CardDescription>
              </div>
            </div>
            {getStatusBadge(appointment.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(appointment.appointment_date)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Pukul {formatTime(appointment.appointment_time)} WIB</span>
          </div>
          {appointment.notes && (
            <div className="flex items-start text-sm">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-muted-foreground"><strong>Catatan:</strong> {appointment.notes}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-4">
            {isUpcoming ? (
              <>
                <Button size="sm" variant="default">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Hubungi
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Lihat Catatan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Janji Temu Saya</h1>
          <p className="text-muted-foreground">Kelola semua jadwal konsultasi Anda di sini.</p>
        </div>
        <ScheduleAppointmentDialog onAppointmentScheduled={handleAppointmentScheduled}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Jadwalkan Janji Temu
          </Button>
        </ScheduleAppointmentDialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">Semua ({appointments.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Akan Datang ({filterAppointments('upcoming').length})</TabsTrigger>
          <TabsTrigger value="past">Selesai ({filterAppointments('past').length})</TabsTrigger>
          <TabsTrigger value="pending">Menunggu ({filterAppointments('pending').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada janji temu</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filterAppointments('upcoming').length > 0 ? (
            filterAppointments('upcoming').map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada janji temu yang akan datang</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {filterAppointments('past').length > 0 ? (
            filterAppointments('past').map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada janji temu yang telah selesai</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {filterAppointments('pending').length > 0 ? (
            filterAppointments('pending').map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada janji temu yang menunggu konfirmasi</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
