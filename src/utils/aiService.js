import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

console.log('Gemini API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', GEMINI_API_KEY.length);

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
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing. Please check your .env file.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    
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
    if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    }
    throw new Error('Failed to get AI response: ' + error.message);
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
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
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
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
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
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
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
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
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

export function formatCitation(source) {
  // Simple citation formatter - can be enhanced with AI
  const { author, title, publicationDate, url } = source;
  return `${author}. "${title}". ${publicationDate}. ${url}`;
}

export function getSmartTip(stage) {
  const tips = {
    topic: "Start with a broad subject area, then narrow down to something specific and arguable.",
    thesis: "A good thesis takes a position and can be supported with evidence.",
    planning: "Break your research into manageable steps with clear deadlines.",
    sources: "Look for peer-reviewed sources from academic journals and reputable institutions.",
    outline: "Organize your main points logically to build a strong argument.",
    drafting: "Write your first draft without worrying about perfection - focus on getting ideas down.",
    revision: "Let your draft sit for a day before revising with fresh eyes."
  };
  return tips[stage] || "Keep going! You're making progress.";
}

export async function evaluateProfile(studentData) {
  const prompt = `Evaluate this student's college readiness profile:

Name: ${studentData.name || 'Student'}
Grade: ${studentData.grade || 'Not specified'}
School: ${studentData.school || 'Not specified'}
GPA: ${studentData.gpa || 'Not specified'}
Target Major: ${studentData.targetMajor || 'Not specified'}
Skills: ${(studentData.skills || []).map(s => `${s.name} (${s.proficiency})`).join(', ')}
Projects: ${studentData.projects?.length || 0} projects
Extracurriculars: ${studentData.extracurriculars?.length || 0} activities
Competitions: ${studentData.competitions || 0} competitions
Achievements: ${studentData.achievements || 0} achievements
Bio: ${studentData.bio || 'Not provided'}

Evaluate the profile on a scale of 1-100 for:
1. Skills (25 points max)
2. Projects (20 points max)
3. Extracurriculars (20 points max)
4. Competitions (15 points max)
5. Achievements (10 points max)
6. Profile Completeness (10 points max)

Provide your evaluation in this exact JSON format:
{
  "skills": {"score": number, "max": 25, "details": "string"},
  "projects": {"score": number, "max": 20, "details": "string"},
  "extracurriculars": {"score": number, "max": 20, "details": "string"},
  "competitions": {"score": number, "max": 15, "details": "string"},
  "achievements": {"score": number, "max": 10, "details": "string"},
  "completeness": {"score": number, "max": 10, "details": "string"},
  "totalScore": number,
  "grade": "string",
  "insights": ["string"],
  "recommendations": ["string"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Profile evaluation error:', error);
    // Fallback to heuristic calculation if AI fails
    return null;
  }
}
