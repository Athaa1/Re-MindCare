
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { specialists } from '@/data/specialists';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Calendar as CalendarIcon, Clock, Video, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{
    specialistId: string;
    date: Date | undefined;
    time: string;
    notes: string;
  }>({ specialistId: '', date: undefined, time: '', notes: '' });
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!newAppointment.specialistId || !newAppointment.date || !newAppointment.time) {
      toast({
        variant: 'destructive',
        title: 'Formulir Tidak Lengkap',
        description: 'Harap pilih spesialis, tanggal, dan waktu.',
      });
      return;
    }

    const specialist = specialists.find(s => s.id === newAppointment.specialistId);
    if (!specialist) return;
    
    const combinedDateTime = new Date(newAppointment.date);
    const [hours, minutes] = newAppointment.time.split(':').map(Number);
    combinedDateTime.setHours(hours, minutes);


    const scheduledAppointment: Appointment = {
      id: new Date().toISOString(),
      specialistName: specialist.name,
      specialistTitle: specialist.title,
      date: combinedDateTime,
      time: newAppointment.time,
      notes: newAppointment.notes,
    };

    setAppointments(prev => [...prev, scheduledAppointment].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setIsDialogOpen(false);
    setNewAppointment({ specialistId: '', date: undefined, time: '', notes: '' });

    toast({
      title: 'Janji Temu Dibuat!',
      description: `Anda berhasil menjadwalkan pertemuan dengan ${specialist.name}.`,
    });
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Jadwalkan Janji Temu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Jadwalkan Janji Temu Baru</DialogTitle>
              <DialogDescription>
                Pilih spesialis dan waktu yang paling sesuai untuk Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialist" className="text-right">Spesialis</Label>
                <Select onValueChange={(value) => setNewAppointment(p => ({...p, specialistId: value}))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih seorang spesialis" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} - {s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Tanggal</Label>
                <Calendar
                  mode="single"
                  selected={newAppointment.date}
                  onSelect={(date) => setNewAppointment(p => ({...p, date: date}))}
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  className="col-span-3 p-0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Waktu</Label>
                <Input
                  id="time"
                  type="time"
                  className="col-span-3"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(p => ({...p, time: e.target.value}))}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  className="col-span-3"
                  placeholder="Beri tahu spesialis Anda topik yang ingin dibahas..."
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment(p => ({...p, notes: e.target.value}))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSchedule}>Konfirmasi Janji Temu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
