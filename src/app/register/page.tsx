import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Buat Akun</CardTitle>
          <CardDescription className="text-center">
            Masukkan informasi Anda untuk membuat akun baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Nama Lengkap</Label>
              <Input id="full-name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" type="password" required />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
              <Input id="confirm-password" type="password" required />
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard">Daftar</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
                <Link href="/">
                    <>
                    <ArrowLeft />
                    Kembali ke Beranda
                    </>
                </Link>
            </Button>
            <div className="mt-4 text-center text-sm">
                Sudah punya akun?{' '}
                <Link href="/login" className="underline">
                    Masuk
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
