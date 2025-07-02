import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { MessageSquare } from "lucide-react";

const patients = [
    { id: "alex-r", name: "Alex R.", lastContact: "Baru saja", avatar: "https://placehold.co/40x40.png" },
    { id: "casey-b", name: "Casey B.", lastContact: "1 hari yang lalu", avatar: "https://placehold.co/40x40.png" },
    { id: "jordan-p", name: "Jordan P.", lastContact: "3 hari yang lalu", avatar: "https://placehold.co/40x40.png" },
    { id: "sam-k", name: "Sam K.", lastContact: "5 hari yang lalu", avatar: "https://placehold.co/40x40.png" },
]

export function RecentPatients() {
  return (
    <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
            <CardTitle>Pasien yang Baru Dihubungi</CardTitle>
            <CardDescription>Daftar pasien yang baru-baru ini berinteraksi.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
            {patients.map((patient, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="text-sm font-medium leading-none">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.lastContact}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/doctor/dashboard/messages/${patient.id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Pesan
                      </Link>
                    </Button>
                </div>
            ))}
        </CardContent>
    </Card>
  )
}
