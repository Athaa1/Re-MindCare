import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MessagesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Kotak Masuk Pesan</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Konsultasi Pengguna</CardTitle>
                    <CardDescription>Lihat dan balas pesan dari pasien di sini.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Antarmuka perpesanan akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    )
}
