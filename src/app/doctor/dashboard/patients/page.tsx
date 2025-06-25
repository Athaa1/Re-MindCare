import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PatientsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manajemen Pasien</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pasien</CardTitle>
                    <CardDescription>Lihat dan kelola semua pasien Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Daftar pasien akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    )
}
