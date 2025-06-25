import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Pengaturan Akun</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Profil Dokter</CardTitle>
                    <CardDescription>Kelola informasi profesional dan pengaturan akun Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Opsi pengaturan akun dokter akan segera tersedia di sini.</p>
                </CardContent>
            </Card>
        </div>
    )
}
