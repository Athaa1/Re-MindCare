'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate password confirmation
        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Kesalahan',
                description: 'Konfirmasi kata sandi tidak cocok.',
            });
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            toast({
                variant: 'destructive',
                title: 'Kesalahan',
                description: 'Password minimal 6 karakter.',
            });
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('http://localhost/Re-MindCare/backendPHP/Register/authRegister.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const userType = data.user.is_doctor ? 'dokter' : 'pengguna';
                toast({
                    title: 'Registrasi Berhasil',
                    description: `Akun ${userType} Anda telah dibuat. Silakan masuk.`,
                });
                
                // Reset form
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                // Redirect to login page
                router.push('/login');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Registrasi Gagal',
                    description: data.error || 'Terjadi kesalahan saat membuat akun.',
                });
            }
        } catch (error) {
            console.error('Registration failed:', error);
            
            // Try to get the response text for debugging
            try {
                const response = await fetch('http://localhost/Re-MindCare/backendPHP/Register/authRegister.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });
                const text = await response.text();
                console.log('Raw response:', text);
            } catch (debugError) {
                console.log('Debug error:', debugError);
            }
            
            toast({
                variant: 'destructive',
                title: 'Kesalahan',
                description: 'Terjadi kesalahan koneksi. Pastikan server PHP berjalan dan database memiliki kolom is_doctor.',
            });
        } finally {
            setLoading(false);
        }
    }

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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="full-name">Nama Lengkap</Label>
                <Input id="full-name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                    Gunakan @doctor.com untuk akun dokter
                </p>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Daftar'}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
