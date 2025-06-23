
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
import { Calendar, Clock } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const appointments = [
    {
        name: "Dr. Anya Sharma",
        specialty: "Clinical Psychologist",
        date: "2024-07-25",
        time: "14:30",
        avatar: "https://placehold.co/40x40.png"
    },
    {
        name: "David Chen",
        specialty: "LCSW, Counselor",
        date: "2024-07-28",
        time: "11:00",
        avatar: "https://placehold.co/40x40.png"
    },
    {
        name: "Dr. Emily Carter",
        specialty: "Adolescent Psychiatry",
        date: "2024-08-02",
        time: "16:00",
        avatar: "https://placehold.co/40x40.png"
    }
]

export function UpcomingAppointments() {
  return (
    <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
            You have {appointments.length} upcoming sessions.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
            {appointments.map((appt, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={appt.avatar} alt={appt.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{appt.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="text-sm font-medium leading-none">{appt.name}</p>
                        <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-sm">
                           <Calendar className="h-4 w-4" />
                           {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                         <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {appt.time}
                        </div>
                    </div>
                </div>
            ))}
             <Button variant="outline" asChild className="mt-4">
                <Link href="/dashboard/appointments">View All Appointments</Link>
            </Button>
        </CardContent>
    </Card>
  )
}
