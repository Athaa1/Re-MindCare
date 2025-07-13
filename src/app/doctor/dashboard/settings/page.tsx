"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, User, Mail, Stethoscope, X, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DoctorProfile = {
    id?: number;
    user_id: number;
    name: string;
    title: string;
    specialties: string[];
    bio: string;
    imageUrl: string;
    imageHint: string;
};

type UserData = {
    id: number;
    name: string;
    email: string;
};

export default function SettingsPage() {
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newSpecialty, setNewSpecialty] = useState("");
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        specialties: [] as string[],
        bio: "",
        imageUrl: "",
        imageHint: ""
    });

    useEffect(() => {
        // Get current user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentUser(user);
            fetchDoctorProfile(user.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchDoctorProfile = async (userId: number) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost/Re-MindCare/backendPHP/Doctor/profile.php?user_id=${userId}`);
            const data = await response.json();

            if (data.success) {
                const { user, doctor_profile } = data.data;
                console.log('Fetched doctor profile:', doctor_profile);
                console.log('Profile specialties:', doctor_profile?.specialties);
                
                setCurrentUser(user);
                setDoctorProfile(doctor_profile);
                
                // Initialize form data
                if (doctor_profile) {
                    setFormData({
                        name: doctor_profile.name || "",
                        title: doctor_profile.title || "",
                        specialties: doctor_profile.specialties || [],
                        bio: doctor_profile.bio || "",
                        imageUrl: doctor_profile.imageUrl || "",
                        imageHint: doctor_profile.imageHint || ""
                    });
                } else {
                    // Initialize with user data if no doctor profile
                    setFormData({
                        name: user.name || "",
                        title: "",
                        specialties: [],
                        bio: "",
                        imageUrl: "",
                        imageHint: ""
                    });
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to fetch profile data"
                });
            }
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Network error occurred"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addSpecialty = () => {
        if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
            setFormData(prev => ({
                ...prev,
                specialties: [...prev.specialties, newSpecialty.trim()]
            }));
            setNewSpecialty("");
        }
    };

    const removeSpecialty = (specialtyToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.filter(s => s !== specialtyToRemove)
        }));
    };

    const handleSave = async () => {
        if (!currentUser) return;

        try {
            setSaving(true);
            
            // Debug: Log the data being sent
            const dataToSend = {
                user_id: currentUser.id,
                ...formData
            };
            console.log('Sending data to server:', dataToSend);
            console.log('Specialties array:', formData.specialties);
            console.log('Specialties type:', typeof formData.specialties);
            console.log('Specialties is array:', Array.isArray(formData.specialties));
            
            const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (data.success) {
                toast({
                    title: "Berhasil!",
                    description: data.message || "Profil berhasil disimpan"
                });
                // Refresh data
                fetchDoctorProfile(currentUser.id);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Gagal menyimpan profil"
                });
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Network error occurred"
            });
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Memuat data profil...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pengaturan Akun</h1>
                <p className="text-muted-foreground">Kelola informasi profesional dan pengaturan akun Anda.</p>
            </div>

            {/* Account Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informasi Akun
                    </CardTitle>
                    <CardDescription>
                        Informasi dasar akun yang tidak dapat diubah di sini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{currentUser?.email}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>User ID</Label>
                            <div className="text-sm text-muted-foreground">#{currentUser?.id}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Doctor Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Profil Dokter
                    </CardTitle>
                    <CardDescription>
                        Kelola informasi profesional yang akan ditampilkan kepada pasien.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex items-center space-x-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={formData.imageUrl} alt={formData.name} />
                            <AvatarFallback className="text-lg">
                                {getInitials(formData.name || currentUser?.name || "Dr")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="imageUrl">URL Foto Profil</Label>
                            <Input
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                            />
                            <Label htmlFor="imageHint">Deskripsi Foto</Label>
                            <Input
                                id="imageHint"
                                value={formData.imageHint}
                                onChange={(e) => handleInputChange('imageHint', e.target.value)}
                                placeholder="Foto profil dokter"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Dr. Nama Lengkap"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Gelar/Titel</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Sp.KJ, M.Psi, dll"
                            />
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-3">
                        <Label>Spesialisasi</Label>
                        <div className="flex flex-wrap gap-2">
                            {formData.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {specialty}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeSpecialty(specialty)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newSpecialty}
                                onChange={(e) => setNewSpecialty(e.target.value)}
                                placeholder="Tambah spesialisasi"
                                onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                            />
                            <Button onClick={addSpecialty} variant="outline" size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biografi</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            placeholder="Ceritakan tentang pengalaman, pendidikan, dan pendekatan Anda dalam menangani pasien..."
                            rows={5}
                        />
                        <p className="text-xs text-muted-foreground">
                            Biografi akan ditampilkan kepada pasien ketika mereka mencari dokter.
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Profil
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Info */}
                    <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-blue-900">Informasi Profil</p>
                            <p className="text-blue-700">
                                Profil yang Anda buat di sini akan ditampilkan kepada pasien saat mereka mencari dokter. 
                                Pastikan informasi yang Anda berikan akurat dan profesional.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
