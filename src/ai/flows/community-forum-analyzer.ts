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
    .describe('The text content from the community forum post or interaction.'),
  availableResources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    description: z.string(),
  })).describe('A list of available resources with titles, URLs, and descriptions.'),
});
export type AnalyzeForumContentInput = z.infer<typeof AnalyzeForumContentInputSchema>;

const AnalyzeForumContentOutputSchema = z.object({
  suggestedResources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    reason: z.string().describe('The reason why this resource is suggested.'),
  })).describe('A list of suggested resources with reasons for each suggestion.'),
});
export type AnalyzeForumContentOutput = z.infer<typeof AnalyzeForumContentOutputSchema>;

export async function analyzeForumContent(input: AnalyzeForumContentInput): Promise<AnalyzeForumContentOutput> {
  return analyzeForumContentFlow(input);
}

const resourceEvaluatorTool = ai.defineTool({
  name: 'resourceEvaluator',
  description: 'Determine if a given resource is relevant to the forum content.',
  inputSchema: z.object({
    resource: z.object({
      title: z.string(),
      url: z.string(),
      description: z.string(),
    }).describe('The resource to evaluate.'),
    forumContent: z.string().describe('The content from the community forum.'),
  }),
  outputSchema: z.object({
    isRelevant: z.boolean().describe('Whether the resource is relevant to the forum content.'),
    reason: z.string().describe('The reason for the relevance assessment.'),
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
  prompt: `You are an AI assistant designed to analyze community forum content and suggest relevant resources to users.

  Your task is to analyze the provided forum content and, using the available resources, determine which resources would be most helpful to the user.
  For each resource you suggest, explain why it would be helpful to the user based on their forum content.

  Forum Content: {{{forumContent}}}

  Available Resources:
  {{#each availableResources}}
  - Title: {{{this.title}}}
    URL: {{{this.url}}}
    Description: {{{this.description}}}
  {{/each}}

  Based on the forum content, suggest resources that would be most helpful to the user. Explain your reasoning for each suggestion.
  Ensure that the suggested resources are highly relevant to the user's needs and interests as expressed in the forum content.
  If a user is expressing suicidal thoughts or intent, recommend resources to prevent suicide.

  Output should be in the following JSON format:
  {
    "suggestedResources": [
      {
        "title": "Resource Title",
        "url": "Resource URL",
        "reason": "Explanation of why this resource is helpful based on the forum content."
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
