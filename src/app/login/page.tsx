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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Email dan password harus diisi.',
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost/Re-MindCare/backendPHP/Login/authLogin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login response data:', data); // Debug log
        console.log('User is_doctor value:', data.user.is_doctor); // Debug log
        console.log('Type of is_doctor:', typeof data.user.is_doctor); // Debug log
        
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang kembali, ${data.user.name}!`,
        });
        
        // Store user data in localStorage for client-side usage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Clear form
        setEmail('');
        setPassword('');
        
        // Redirect based on user type
        console.log('Checking doctor status...'); // Debug log
        if (data.user.is_doctor === 1 || data.user.is_doctor === '1') {
          console.log('Redirecting to doctor dashboard'); // Debug log
          router.push('/doctor/dashboard');
        } else {
          console.log('Redirecting to user dashboard'); // Debug log
          router.push('/dashboard');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Gagal',
          description: data.error || 'Terjadi kesalahan saat login.',
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Terjadi kesalahan koneksi. Pastikan server PHP berjalan.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Masuk</CardTitle>
          <CardDescription className="text-center">
            Masukkan email Anda di bawah ini untuk masuk ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Kata Sandi</Label>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Masuk'}
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
                Belum punya akun?{" "}
                <Link href="/register" className="underline">
                  Daftar
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
