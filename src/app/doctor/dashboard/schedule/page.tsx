import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SchedulePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Jadwal Janji Temu</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Kalender Anda</CardTitle>
                    <CardDescription>Kelola jadwal, ketersediaan, dan janji temu Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Fitur kalender dan jadwal akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    )
}
