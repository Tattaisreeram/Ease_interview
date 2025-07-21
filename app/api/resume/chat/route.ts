import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: NextRequest) {
  try {
    const { message, resumeText, analysisData, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build context from previous messages
    const conversationContext = chatHistory?.map((msg: any) => 
      `${msg.role}: ${msg.content}`
    ).join('\n') || '';

    const systemPrompt = `
You are an expert resume coach and career advisor. You help professionals improve their resumes and advance their careers.

Context:
${resumeText ? `Resume Text: ${resumeText}` : 'No resume provided yet.'}

${analysisData ? `Previous Analysis: ${JSON.stringify(analysisData, null, 2)}` : 'No analysis data available.'}

${conversationContext ? `Previous Conversation:\n${conversationContext}` : ''}

Instructions:
- Provide specific, actionable advice for resume improvement
- Reference the user's actual resume content when giving feedback
- Suggest concrete improvements with examples
- Help with career development strategies
- Recommend specific skills, projects, or experiences to add
- Assist with formatting, wording, and presentation
- Provide industry-specific insights
- Help optimize for ATS (Applicant Tracking Systems)
- Suggest quantifiable achievements and metrics
- Be encouraging while being honest about areas for improvement
- Format your response using Markdown for better readability:
  * Use **bold** for emphasis and important points
  * Use bullet points for lists
  * Use backticks for technical terms, skills, or specific keywords
  * Use ## for section headers when organizing longer responses
  * Use > for important quotes or tips

Current User Question: ${message}

Provide a helpful, specific response that addresses their question while considering their resume and career goals. Format your response with markdown for better readability.
`;

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 800,
    });

    return NextResponse.json({
      response: result.text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Resume chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
