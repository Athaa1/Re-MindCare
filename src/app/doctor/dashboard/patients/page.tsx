"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Calendar, Heart, Loader2, User } from "lucide-react";

type Patient = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    last_mood?: number;
    last_mood_date?: string;
    total_mood_entries: number;
};

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        // Filter patients based on search term
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(filtered);
    }, [patients, searchTerm]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/patient-list.php');
            const data = await response.json();

            if (data.success) {
                setPatients(data.patients);
            } else {
                setError(data.message || 'Failed to fetch patients');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getMoodEmoji = (mood: number) => {
        const moodEmojis = {
            1: "😢",
            2: "😕",
            3: "😐",
            4: "😊",
            5: "😄"
        };
        return moodEmojis[mood as keyof typeof moodEmojis] || "❓";
    };

    const getMoodLabel = (mood: number) => {
        const moodLabels = {
            1: "Sangat Buruk",
            2: "Buruk",
            3: "Biasa",
            4: "Baik",
            5: "Sangat Baik"
        };
        return moodLabels[mood as keyof typeof moodLabels] || "Unknown";
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Memuat data pasien...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Manajemen Pasien</h1>
                    <p className="text-muted-foreground">Kelola dan pantau pasien Anda</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari pasien..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[250px]"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                        <p className="text-xs text-muted-foreground">Pasien terdaftar</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pasien Aktif Mood</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {patients.filter(p => p.total_mood_entries > 0).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Melacak mood</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pasien Baru</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {patients.filter(p => {
                                const created = new Date(p.created_at);
                                const now = new Date();
                                const thisMonth = created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                                return thisMonth;
                            }).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Bulan ini</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hasil Pencarian</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredPatients.length}</div>
                        <p className="text-xs text-muted-foreground">Dari {patients.length} pasien</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pasien</CardTitle>
                    <CardDescription>
                        Semua pasien yang terdaftar dalam sistem ({filteredPatients.length} pasien)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredPatients.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                {searchTerm ? "Tidak ada pasien yang sesuai dengan pencarian" : "Belum ada pasien yang terdaftar"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Tanggal Daftar</TableHead>
                                        <TableHead>Mood Terakhir</TableHead>
                                        <TableHead>Total Mood</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPatients.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{patient.name}</p>
                                                        <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span>{patient.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(patient.created_at)}</TableCell>
                                            <TableCell>
                                                {patient.last_mood ? (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{getMoodEmoji(patient.last_mood)}</span>
                                                        <div>
                                                            <p className="text-sm font-medium">{getMoodLabel(patient.last_mood)}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {patient.last_mood_date ? formatDate(patient.last_mood_date) : '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">Belum ada data</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {patient.total_mood_entries} entri
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={patient.total_mood_entries > 0 ? "default" : "outline"}
                                                >
                                                    {patient.total_mood_entries > 0 ? "Aktif" : "Tidak Aktif"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
