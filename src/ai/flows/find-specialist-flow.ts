'use server';
/**
 * @fileOverview An AI flow to match users with mental health specialists.
 * 
 * - findSpecialist - A function that recommends specialists based on user input.
 * - FindSpecialistInput - The input type for the findSpecialist function.
 * - FindSpecialistOutput - The return type for the findSpecialist function.
 */

import {ai} from '@/ai/genkit';
import { specialists } from '@/data/specialists';
import {z} from 'genkit';

const FindSpecialistInputSchema = z.object({
  complaint: z.string().describe('A description of the user\'s mental health concerns or what they are looking for in a therapist.'),
});
export type FindSpecialistInput = z.infer<typeof FindSpecialistInputSchema>;

const RecommendedSpecialistSchema = z.object({
  name: z.string().describe('The name of the recommended specialist.'),
  title: z.string().describe('The professional title of the specialist.'),
  specialties: z.array(z.string()).describe('A list of the specialist\'s areas of expertise.'),
  bio: z.string().describe('A brief biography of the specialist.'),
  imageUrl: z.string().describe('A URL to a photo of the specialist.'),
  reason: z.string().describe('A detailed explanation of why this specialist is a good match for the user based on their complaint.'),
});

const FindSpecialistOutputSchema = z.object({
  recommendations: z.array(RecommendedSpecialistSchema).describe('A list of up to 3 recommended specialists.'),
});
export type FindSpecialistOutput = z.infer<typeof FindSpecialistOutputSchema>;


export async function findSpecialist(input: FindSpecialistInput): Promise<FindSpecialistOutput> {
  return findSpecialistFlow(input);
}

const prompt = ai.definePrompt({
    name: 'findSpecialistPrompt',
    input: { schema: z.object({ complaint: z.string(), specialists: z.array(z.any()) }) },
    output: { schema: FindSpecialistOutputSchema },
    prompt: `You are an expert AI assistant for Re-MindCare, a mental health platform for adolescents and young adults. Your task is to match a user with the most suitable mental health specialists from a provided list.

    Analyze the user's complaint carefully. Then, review the list of available specialists, paying close attention to their specialties and bios.

    Select up to 3 specialists who are the best fit for the user's needs. For each recommendation, you MUST provide a clear and compassionate 'reason' explaining *why* they are a good match, directly referencing both the user's complaint and the specialist's expertise.

    User's complaint: "{{complaint}}"

    Available specialists:
    \`\`\`json
    {{{json specialists}}}
    \`\`\`

    Your response must be in the specified JSON format.
    `,
});

const findSpecialistFlow = ai.defineFlow(
  {
    name: 'findSpecialistFlow',
    inputSchema: FindSpecialistInputSchema,
    outputSchema: FindSpecialistOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        complaint: input.complaint,
        specialists: specialists,
    });
    return output!;
  }
);
