'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  password_DO_NOT_USE_IN_PROD: string;
  role: 'user' | 'doctor';
};

const initialUsers: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', password_DO_NOT_USE_IN_PROD: 'password123', role: 'user' },
    { id: '2', name: 'Dr. Anya Sharma', email: 'anya.sharma@example.com', password_DO_NOT_USE_IN_PROD: 'doctorpass', role: 'doctor' }
];

export function useAuth() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedUsersRaw = localStorage.getItem('dummy_users');
        const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        // Create a map from stored users
        const combinedUsersMap = new Map(storedUsers.map((u: User) => [u.email, u]));

        // Merge initial users from code, overwriting any with the same email
        initialUsers.forEach(initialUser => {
            combinedUsersMap.set(initialUser.email, initialUser);
        });

        const allUsers = Array.from(combinedUsersMap.values());

        setUsers(allUsers);
        localStorage.setItem('dummy_users', JSON.stringify(allUsers));

        const sessionUser = localStorage.getItem('dummy_session');
        if (sessionUser) {
            setCurrentUser(JSON.parse(sessionUser));
        } else {
            setCurrentUser(null);
        }
    } catch (error) {
        console.error("Could not access localStorage. Auth features will be limited.");
        setUsers(initialUsers);
        setCurrentUser(null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find((u) => u.email === email);

    if (user && user.password_DO_NOT_USE_IN_PROD === password) {
      setCurrentUser(user);
      localStorage.setItem('dummy_session', JSON.stringify(user));
      toast({
        title: 'Login Berhasil',
        description: `Selamat datang kembali, ${user.name}!`,
      });
      
      if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        router.push('/dashboard');
      }
      return true;
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Email atau kata sandi salah.',
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      toast({
        variant: 'destructive',
        title: 'Registrasi Gagal',
        description: 'Email ini sudah terdaftar.',
      });
      return false;
    }

    const newUser: User = {
      id: new Date().getTime().toString(),
      name,
      email,
      password_DO_NOT_USE_IN_PROD: password,
      role: 'user', // Default role for new registrations
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('dummy_users', JSON.stringify(updatedUsers));

    toast({
      title: 'Registrasi Berhasil',
      description: 'Akun Anda telah dibuat. Silakan masuk.',
    });

    router.push('/login');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dummy_session');
    router.push('/login');
    toast({
      title: 'Logout Berhasil',
    });
  };

  return { currentUser, users, login, register, logout };
}
