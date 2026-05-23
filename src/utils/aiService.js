import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// ─── FORMATTING RULES (appended to every prompt) ───────────────────────────
const SYSTEM_PROMPTS = {
  thesis: `You are a thesis writing coach for high school students. Your goal is to help them develop strong, arguable thesis statements.

Guidelines:
- Speak in an encouraging, mentor-like tone
- Evaluate the thesis on: clarity, arguability, and specificity
- Provide specific, actionable suggestions for improvement
- Ask questions that help them refine their thesis
- Never write the thesis for them
- Keep responses concise (2-3 sentences)
- Focus on one improvement at a time`,
  
  sources: `You are a research coach helping students evaluate sources for credibility.

Guidelines:
- Speak in an encouraging, mentor-like tone
- Evaluate sources on: author credibility, publication quality, date relevance, and bias
- Provide specific feedback on why a source is or isn't credible
- Suggest better alternatives when appropriate
- Keep responses concise (2-3 sentences)
- Focus on one evaluation at a time`,
  
  drafting: `You are a writing coach helping students draft their research papers.

Guidelines:
- Speak in a warm, supportive tone
- Evaluate each paragraph on: does it support the thesis? is evidence cited? is the argument logical?
- Provide specific, actionable feedback
- Ask questions that help them improve their writing
- Never write content for them
- Keep responses concise (2-3 sentences)
- Focus on one improvement at a time`,
  
  revision: `You are an encouraging writing coach for high school students. Your goal is to help students revise their paper.

Guidelines:
- Speak in a warm, mentor-like tone
- Evaluate the paper on: argument strength, evidence quality, transitions, introduction/conclusion, and citation format
- Provide specific, actionable suggestions
- Create an annotated checklist with priorities
- Be encouraging while pointing out areas for improvement
- Organize feedback by category with specific examples`
};

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function callAI(stage, userMessage, conversationHistory = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    let fullPrompt = SYSTEM_PROMPTS[stage] + '\n\n';
    
    if (conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'Student' : 'Coach'}: ${msg.content}\n\n`;
      });
    }

    fullPrompt += `Student: ${userMessage}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

export async function evaluateThesis(thesis) {
  const prompt = `Evaluate this thesis statement: "${thesis}"

Rate it on a scale of 1-10 for:
1. Clarity
2. Arguability
3. Specificity

Provide your evaluation in this exact JSON format:
{
  "clarity": number,
  "arguability": number,
  "specificity": number,
  "overall": number,
  "feedback": "string"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const fullPrompt = SYSTEM_PROMPTS.thesis + '\n\n' + prompt;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Thesis evaluation error:', error);
    return {
      clarity: 5,
      arguability: 5,
      specificity: 5,
      overall: 5,
      feedback: 'Could not evaluate thesis. Please try again.'
    };
  }
}

export async function evaluateSource(source) {
  const prompt = `Evaluate this source for credibility:
Title: ${source.title}
Author: ${source.author}
URL: ${source.url}
Publication Date: ${source.publicationDate}

Rate it on a scale of 1-10 for credibility and provide feedback. Return in JSON format:
{
  "credibility": number,
  "feedback": "string",
  "flags": ["string"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const fullPrompt = SYSTEM_PROMPTS.sources + '\n\n' + prompt;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Source evaluation error:', error);
    return {
      credibility: 5,
      feedback: 'Could not evaluate source.',
      flags: []
    };
  }
}

export async function evaluateParagraph(paragraph, thesis) {
  const prompt = `Evaluate this paragraph in relation to the thesis:
Thesis: "${thesis}"
Paragraph: "${paragraph}"

Provide feedback on:
1. Does it support the thesis?
2. Is evidence cited?
3. Is the argument logical?

Return in JSON format:
{
  "supportsThesis": boolean,
  "evidenceCited": boolean,
  "logical": boolean,
  "feedback": "string"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const fullPrompt = SYSTEM_PROMPTS.drafting + '\n\n' + prompt;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Paragraph evaluation error:', error);
    return {
      supportsThesis: true,
      evidenceCited: false,
      logical: true,
      feedback: 'Could not evaluate paragraph.'
    };
  }
}

export async function generateRevisionChecklist(draft, thesis) {
  const prompt = `Evaluate this research paper:
Thesis: "${thesis}"
Draft: "${draft}"

Create a revision checklist evaluating:
1. Argument strength
2. Evidence quality
3. Transitions
4. Introduction/conclusion
5. Citation format

Return in JSON format:
{
  "argumentStrength": {"score": number, "feedback": "string", "suggestions": ["string"]},
  "evidenceQuality": {"score": number, "feedback": "string", "suggestions": ["string"]},
  "transitions": {"score": number, "feedback": "string", "suggestions": ["string"]},
  "introConclusion": {"score": number, "feedback": "string", "suggestions": ["string"]},
  "citations": {"score": number, "feedback": "string", "suggestions": ["string"]}
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const fullPrompt = SYSTEM_PROMPTS.revision + '\n\n' + prompt;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Revision checklist error:', error);
    return {
      argumentStrength: { score: 5, feedback: 'Could not evaluate.', suggestions: [] },
      evidenceQuality: { score: 5, feedback: 'Could not evaluate.', suggestions: [] },
      transitions: { score: 5, feedback: 'Could not evaluate.', suggestions: [] },
      introConclusion: { score: 5, feedback: 'Could not evaluate.', suggestions: [] },
      citations: { score: 5, feedback: 'Could not evaluate.', suggestions: [] }
    };
  }
}
