'use server';
/**
 * @fileOverview An AI flow to match users with mental health specialists.
 * 
 * - findSpecialist - A function that recommends specialists based on user input.
 * - FindSpecialistInput - The input type for the findSpecialist function.
 * - FindSpecialistOutput - The return type for the findSpecialist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Function to fetch doctors from database
async function fetchDoctorsFromDatabase() {
  try {
    // Use Next.js API route which works in both server and client side
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/doctors`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to fetch doctors:', data.message);
      return getFallbackDoctors();
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return getFallbackDoctors();
  }
}

// Fallback doctors if database fails
function getFallbackDoctors() {
  return [
    {
      id: "1",
      name: "atha",
      title: "S.kom",
      specialties: ["kecemasan", "strict parents"],
      bio: "dokter kecemasan",
      imageUrl: "https://placehold.co/100x100.png",
      imageHint: "doctor portrait"
    }
  ];
}

const FindSpecialistInputSchema = z.object({
  complaint: z.string().describe("Deskripsi keluhan kesehatan mental pengguna atau apa yang mereka cari dari seorang terapis."),
});
export type FindSpecialistInput = z.infer<typeof FindSpecialistInputSchema>;

const RecommendedSpecialistSchema = z.object({
  id: z.string().describe("ID unik spesialis."),
  name: z.string().describe("Nama spesialis yang direkomendasikan."),
  title: z.string().describe("Gelar profesional spesialis."),
  specialties: z.array(z.string()).describe("Daftar bidang keahlian spesialis."),
  bio: z.string().describe("Biografi singkat spesialis."),
  imageUrl: z.string().describe("URL ke foto spesialis."),
  imageHint: z.string().describe("Hint untuk gambar spesialis."),
  reason: z.string().describe("Penjelasan rinci mengapa spesialis ini cocok untuk pengguna berdasarkan keluhan mereka."),
});

const FindSpecialistOutputSchema = z.object({
  recommendations: z.array(RecommendedSpecialistSchema).describe("Daftar hingga 3 spesialis yang direkomendasikan."),
});
export type FindSpecialistOutput = z.infer<typeof FindSpecialistOutputSchema>;


export async function findSpecialist(input: FindSpecialistInput): Promise<FindSpecialistOutput> {
  return findSpecialistFlow(input);
}

const prompt = ai.definePrompt({
    name: 'findSpecialistPrompt',
    input: { schema: z.object({ complaint: z.string(), specialists: z.array(z.any()) }) },
    output: { schema: FindSpecialistOutputSchema },
    prompt: `Anda adalah asisten AI ahli untuk Re-MindCare, platform kesehatan mental untuk remaja dan dewasa muda. Tugas Anda adalah mencocokkan pengguna dengan spesialis kesehatan mental yang paling sesuai dari daftar yang disediakan.

    Analisis keluhan pengguna dengan cermat. Kemudian, tinjau daftar spesialis yang tersedia, perhatikan baik-baik spesialisasi dan bio mereka.

    Pilih hingga 3 spesialis yang paling sesuai dengan kebutuhan pengguna. Untuk setiap rekomendasi, Anda HARUS memberikan 'alasan' yang jelas dan berbelas kasih yang menjelaskan *mengapa* mereka cocok, dengan merujuk langsung pada keluhan pengguna dan keahlian spesialis. Pastikan untuk menyertakan ID spesialis.

    Keluhan pengguna: "{{complaint}}"

    Spesialis yang tersedia:
    \`\`\`json
    {{{json specialists}}}
    \`\`\`

    Respons Anda harus dalam format JSON yang ditentukan.
    `,
});

const findSpecialistFlow = ai.defineFlow(
  {
    name: 'findSpecialistFlow',
    inputSchema: FindSpecialistInputSchema,
    outputSchema: FindSpecialistOutputSchema,
  },
  async (input) => {
    // Fetch real doctors from database
    const doctors = await fetchDoctorsFromDatabase();
    
    const { output } = await prompt({
        complaint: input.complaint,
        specialists: doctors,
    });
    return output!;
  }
);
