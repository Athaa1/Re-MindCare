
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Pengaturan</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Panel Pengaturan</CardTitle>
                    <CardDescription>Kelola akun dan pengaturan aplikasi Anda di sini.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Opsi pengaturan akan segera tersedia di sini.</p>
                </CardContent>
            </Card>
        </div>
    )
}
