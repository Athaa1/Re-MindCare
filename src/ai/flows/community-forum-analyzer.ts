'use server';

/**
 * @fileOverview Analyzes community forum content and suggests relevant resources.
 *
 * - analyzeForumContent - A function that handles the analysis and suggestion process.
 * - AnalyzeForumContentInput - The input type for the analyzeForumContent function.
 * - AnalyzeForumContentOutput - The return type for the analyzeForumContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeForumContentInputSchema = z.object({
  forumContent: z
    .string()
    .describe('Konten teks dari postingan atau interaksi forum komunitas.'),
  availableResources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    description: z.string(),
  })).describe('Daftar sumber daya yang tersedia dengan judul, URL, dan deskripsi.'),
});
export type AnalyzeForumContentInput = z.infer<typeof AnalyzeForumContentInputSchema>;

const AnalyzeForumContentOutputSchema = z.object({
  suggestedResources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    reason: z.string().describe('Alasan mengapa sumber daya ini disarankan.'),
  })).describe('Daftar sumber daya yang disarankan dengan alasan untuk setiap saran.'),
});
export type AnalyzeForumContentOutput = z.infer<typeof AnalyzeForumContentOutputSchema>;

export async function analyzeForumContent(input: AnalyzeForumContentInput): Promise<AnalyzeForumContentOutput> {
  return analyzeForumContentFlow(input);
}

const resourceEvaluatorTool = ai.defineTool({
  name: 'resourceEvaluator',
  description: 'Tentukan apakah sumber daya yang diberikan relevan dengan konten forum.',
  inputSchema: z.object({
    resource: z.object({
      title: z.string(),
      url: z.string(),
      description: z.string(),
    }).describe('Sumber daya untuk dievaluasi.'),
    forumContent: z.string().describe('Konten dari forum komunitas.'),
  }),
  outputSchema: z.object({
    isRelevant: z.boolean().describe('Apakah sumber daya tersebut relevan dengan konten forum.'),
    reason: z.string().describe('Alasan penilaian relevansi.'),
  }),
},
async (input) => {
  // Implementation of the tool will be handled by the LLM, this is a placeholder
  return {isRelevant: false, reason: 'Not implemented yet'};
}
);

const prompt = ai.definePrompt({
  name: 'communityForumAnalyzerPrompt',
  input: {schema: AnalyzeForumContentInputSchema},
  output: {schema: AnalyzeForumContentOutputSchema},
  tools: [resourceEvaluatorTool],
  prompt: `Anda adalah asisten AI yang dirancang untuk menganalisis konten forum komunitas dan menyarankan sumber daya yang relevan kepada pengguna.

  Tugas Anda adalah menganalisis konten forum yang disediakan dan, dengan menggunakan sumber daya yang tersedia, menentukan sumber daya mana yang paling membantu pengguna.
  Untuk setiap sumber daya yang Anda sarankan, jelaskan mengapa sumber daya tersebut akan membantu pengguna berdasarkan konten forum mereka.

  Konten Forum: {{{forumContent}}}

  Sumber Daya Tersedia:
  {{#each availableResources}}
  - Judul: {{{this.title}}}
    URL: {{{this.url}}}
    Deskripsi: {{{this.description}}}
  {{/each}}

  Berdasarkan konten forum, sarankan sumber daya yang paling membantu pengguna. Jelaskan alasan Anda untuk setiap saran.
  Pastikan sumber daya yang disarankan sangat relevan dengan kebutuhan dan minat pengguna seperti yang diungkapkan dalam konten forum.
  Jika pengguna mengungkapkan pemikiran atau niat bunuh diri, rekomendasikan sumber daya untuk mencegah bunuh diri.

  Keluaran harus dalam format JSON berikut:
  {
    "suggestedResources": [
      {
        "title": "Resource Title",
        "url": "Resource URL",
        "reason": "Penjelasan mengapa sumber daya ini bermanfaat berdasarkan konten forum."
      }
    ]
  }
  `,
});

const analyzeForumContentFlow = ai.defineFlow(
  {
    name: 'analyzeForumContentFlow',
    inputSchema: AnalyzeForumContentInputSchema,
    outputSchema: AnalyzeForumContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
