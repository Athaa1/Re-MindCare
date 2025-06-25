'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar as CalendarIcon, Clock, Video, MoreVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleAppointmentDialog from '@/components/appointments/ScheduleAppointmentDialog';

type Appointment = {
  id: string;
  specialistName: string;
  specialistTitle: string;
  date: Date;
  time: string;
  notes: string;
};

const initialAppointments: Appointment[] = [
  { id: '1', specialistName: 'Dr. Anya Sharma', specialistTitle: 'Psikolog Klinis, PhD', date: new Date('2024-07-25T14:30:00'), time: '14:30', notes: 'Diskusi awal tentang kecemasan.' },
  { id: '2', specialistName: 'David Chen', specialistTitle: 'Pekerja Sosial Klinis', date: new Date('2024-07-28T11:00:00'), time: '11:00', notes: 'Sesi tindak lanjut tentang strategi manajemen stres.' },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleAppointmentScheduled = (scheduledAppointment: Appointment) => {
    setAppointments(prev => [...prev, scheduledAppointment].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(a => a.date >= now);
  const pastAppointments = appointments.filter(a => a.date < now);

  const AppointmentCard = ({ appt }: { appt: Appointment }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{appt.specialistName}</CardTitle>
        <CardDescription>{appt.specialistTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(appt.date, 'EEEE, dd MMMM yyyy', { locale: id })}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Pukul {appt.time} WIB</span>
        </div>
        {appt.notes && <p className="text-sm text-muted-foreground pt-2"><strong>Catatan:</strong> {appt.notes}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={appt.date < now}>
          <Video className="mr-2 h-4 w-4" />
          Gabung Sesi
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

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

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Akan Datang ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Selesai ({pastAppointments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
            ) : (
              <p className="text-muted-foreground col-span-2 text-center py-10">Anda tidak memiliki janji temu yang akan datang.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
            <div className="grid gap-6 mt-6 md:grid-cols-2">
            {pastAppointments.length > 0 ? (
              pastAppointments.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
            ) : (
              <p className="text-muted-foreground col-span-2 text-center py-10">Anda belum memiliki janji temu yang selesai.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
