'use client';

import { useState, useEffect } from 'react';
import { fetchSpecialistsFromDatabase } from '@/data/specialists';
import type { Specialist } from '@/data/specialists';
import { getCurrentUserId, getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Appointment = {
  id: string;
  specialistName: string;
  specialistTitle: string;
  date: Date;
  time: string;
  notes: string;
};

type ScheduleAppointmentDialogProps = {
    children: React.ReactNode;
    specialistId?: string;
    onAppointmentScheduled: (appointment: Appointment) => void;
};

export default function ScheduleAppointmentDialog({ children, specialistId, onAppointmentScheduled }: ScheduleAppointmentDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState<{
    specialistId: string;
    date: Date | undefined;
    time: string;
    notes: string;
  }>({ specialistId: specialistId || '', date: undefined, time: '', notes: '' });
  const { toast } = useToast();

  // Load current user
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Load specialists from database
  useEffect(() => {
    const loadSpecialists = async () => {
      setLoading(true);
      try {
        const data = await fetchSpecialistsFromDatabase();
        setSpecialists(data);
      } catch (error) {
        console.error('Error loading specialists:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Gagal memuat data dokter.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSpecialists();
  }, [toast]);

  useEffect(() => {
    if(specialistId){
      setNewAppointment(p => ({...p, specialistId: specialistId}))
    }
  }, [specialistId]);

  const handleSchedule = async () => {
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
    
    setLoading(true);
    
    try {
      // Get user session using helper function
      const userId = getCurrentUserId();
      
      console.log('Using user_id:', userId);
      
      // Format date for database (YYYY-MM-DD)
      const formattedDate = newAppointment.date.toISOString().split('T')[0];
      
      // Prepare appointment data
      const appointmentData = {
        user_id: userId,
        doctor_id: parseInt(newAppointment.specialistId),
        appointment_date: formattedDate,
        appointment_time: newAppointment.time,
        notes: newAppointment.notes,
        status: 'pending'
      };
      
      console.log('Scheduling appointment:', appointmentData);
      
      // Send to API
      const response = await fetch('/api/appointments/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        const combinedDateTime = new Date(newAppointment.date);
        const [hours, minutes] = newAppointment.time.split(':').map(Number);
        combinedDateTime.setHours(hours, minutes);

        const scheduledAppointment: Appointment = {
          id: data.data.id.toString(),
          specialistName: specialist.name,
          specialistTitle: specialist.title,
          date: combinedDateTime,
          time: newAppointment.time,
          notes: newAppointment.notes,
        };

        onAppointmentScheduled(scheduledAppointment);
        
        setIsDialogOpen(false);
        setNewAppointment({ specialistId: specialistId || '', date: undefined, time: '', notes: '' });

        toast({
          title: 'Janji Temu Berhasil Dibuat!',
          description: `Appointment Anda dengan ${specialist.name} telah disimpan ke database.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Gagal Membuat Janji Temu',
          description: data.message || 'Terjadi kesalahan saat menyimpan appointment.',
        });
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan saat menghubungi server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Jadwalkan Janji Temu Baru</DialogTitle>
          <DialogDescription>
            Pilih spesialis dan waktu yang paling sesuai untuk Anda.
            {currentUser && (
              <div className="mt-2 text-sm text-muted-foreground">
                📋 Appointment untuk: <span className="font-medium">{currentUser.name}</span> (ID: {currentUser.id})
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialist" className="text-right">Spesialis</Label>
            <Select 
                value={newAppointment.specialistId}
                onValueChange={(value) => setNewAppointment(p => ({...p, specialistId: value}))}
                defaultValue={specialistId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih seorang spesialis" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Memuat dokter...</SelectItem>
                ) : specialists.length > 0 ? (
                  specialists.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} - {s.title}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-doctors" disabled>Tidak ada dokter tersedia</SelectItem>
                )}
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
          <Button type="submit" onClick={handleSchedule} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Konfirmasi Janji Temu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
