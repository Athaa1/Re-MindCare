export type Specialist = {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  imageUrl: string;
  imageHint: string;
};

export const specialists: Specialist[] = [
  {
    id: "1",
    name: "Dr. Anya Sharma",
    title: "Psikolog Klinis, PhD",
    specialties: ["Kecemasan", "Depresi", "Trauma", "CBT"],
    bio: "Dr. Sharma berspesialisasi dalam terapi perilaku kognitif (CBT) untuk remaja dan dewasa muda yang menghadapi kecemasan dan depresi.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "female psychologist portrait"
  },
  {
    id: "2",
    name: "David Chen",
    title: "Pekerja Sosial Klinis Berlisensi (LCSW)",
    specialties: ["Manajemen Stres", "Hubungan", "Transisi Kehidupan", "Kesadaran"],
    bio: "David Chen berfokus pada pengurangan stres berbasis kesadaran dan membantu kaum muda menavigasi tantangan hubungan dan perubahan besar dalam hidup.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "male therapist portrait"
  },
  {
    id: "3",
    name: "Dr. Emily Carter",
    title: "Psikiater Remaja, MD",
    specialties: ["ADHD", "Gangguan Mood", "Manajemen Obat", "Masalah Perilaku"],
    bio: "Dr. Carter adalah seorang psikiater dengan keahlian dalam manajemen pengobatan dan perawatan untuk gangguan suasana hati dan ADHD pada remaja.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "female psychiatrist portrait"
  },
  {
    id: "4",
    name: "Samuel Jones",
    title: "Terapis Pernikahan dan Keluarga (MFT)",
    specialties: ["Konflik Keluarga", "Komunikasi", "Masalah Sekolah", "Harga Diri"],
    bio: "Samuel Jones bekerja dengan remaja dan keluarga mereka untuk meningkatkan komunikasi, menyelesaikan konflik, dan membangun harga diri.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "male counselor portrait"
  },
  {
    id: "5",
    name: "Ahta",
    title: "Terapis Depresi dan Penyakit Mematikan (MFT)",
    specialties: ["Konflik Pasangan", "Komunikasi", "Masalah Kampus", "Depresi Karena Penyakit Mematikan"],
    bio: "Atha bekerja dengan remaja dan keluarga mereka untuk meningkatkan komunikasi, menyelesaikan konflik, dan membangun harga diri, dan percaya diri.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "male counselor portrait"
  },
];
