import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

const appointments = [
    { name: "Alex R.", time: "14:30", issue: "Kecemasan Sekolah", avatar: "https://placehold.co/40x40.png" },
    { name: "Jamie L.", time: "15:30", issue: "Penetapan Batasan", avatar: "https://placehold.co/40x40.png" },
    { name: "Sam K.", time: "16:00", issue: "Kecemasan Sosial", avatar: "https://placehold.co/40x40.png" },
    { name: "Taylor M.", time: "17:00", issue: "Depresi Ringan", avatar: "https://placehold.co/40x40.png" },
]

export function UpcomingDoctorAppointments() {
  return (
    <Card className="col-span-4">
        <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
            <CardDescription>Anda memiliki {appointments.length} janji temu hari ini.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
            {appointments.map((appt, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={appt.avatar} alt={appt.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{appt.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="text-sm font-medium leading-none">{appt.name}</p>
                        <p className="text-sm text-muted-foreground">{appt.issue}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appt.time}</span>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </CardContent>
    </Card>
  )
}
