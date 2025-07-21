import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  sections: z.object({
    experience: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string()
    }),
    skills: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string()
    }),
    education: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string()
    }),
    projects: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string()
    }),
    formatting: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string()
    })
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  keywordAnalysis: z.object({
    present: z.array(z.string()),
    missing: z.array(z.string()),
    relevanceScore: z.number().min(0).max(100)
  }),
  nextSteps: z.object({
    projects: z.array(z.string()),
    dsaBalance: z.object({
      currentLevel: z.string(),
      recommendation: z.string(),
      suggestedTopics: z.array(z.string())
    }),
    developmentSkills: z.object({
      currentLevel: z.string(),
      recommendation: z.string(),
      suggestedSkills: z.array(z.string())
    }),
    timeAllocation: z.object({
      dsa: z.number().min(0).max(100),
      development: z.number().min(0).max(100),
      projects: z.number().min(0).max(100)
    })
  })
});

export async function POST(request: NextRequest) {
  try {
    const { resumeText, targetRole } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const prompt = `
Analyze the following resume and provide a comprehensive evaluation. Focus on technical skills, experience relevance, and career development opportunities.

Resume Text:
${resumeText}

Target Role: ${targetRole || 'Software Developer'}

Please provide a detailed analysis including:

1. Overall score (0-100) based on resume quality and completeness
2. Section-specific scores and feedback for:
   - Experience (relevance, impact, descriptions)
   - Skills (technical depth, variety, relevance)
   - Education (relevance, achievements)
   - Projects (complexity, impact, technical skills demonstrated)
   - Formatting (readability, structure, professionalism)

3. Strengths: Key positive aspects of the resume (3-5 items)
4. Weaknesses: Areas that need improvement (3-5 items)
5. Keyword analysis:
   - Present keywords that are valuable
   - Missing important keywords for the target role
   - Relevance score for current keywords

6. Next steps for career development:
   - Project suggestions (3-5 specific project ideas)
   - DSA (Data Structures & Algorithms) assessment:
     * Current level (Beginner/Intermediate/Advanced)
     * Specific recommendation
     * Suggested topics to focus on (5-7 topics)
   - Development skills assessment:
     * Current level
     * Recommendation for improvement
     * Suggested skills to learn (5-7 skills)
   - Time allocation recommendation:
     * Percentage for DSA practice
     * Percentage for development/project work
     * Percentage for building projects

Be specific, actionable, and constructive in your feedback. Consider the current job market and industry standards.
`;

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: ResumeAnalysisSchema,
      prompt,
      temperature: 0.3,
    });

    return NextResponse.json(result.object);

  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
