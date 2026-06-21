import groq from '../config/gemini.js';

const MAX_RETRIES = 3;

const extractJson = (text) => {
if (!text) throw new Error('Empty AI response');

try {
return JSON.parse(text);
} catch (e) {}

const jsonMatch = text.match(/`json\s*([\s\S]*?)\s*`/);
if (jsonMatch && jsonMatch[1]) {
try {
return JSON.parse(jsonMatch[1]);
} catch (e) {}
}

const firstBrace = text.indexOf('{');
const lastBrace = text.lastIndexOf('}');
if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
try {
return JSON.parse(text.substring(firstBrace, lastBrace + 1));
} catch (e) {}
}

throw new Error('Failed to extract valid JSON from AI response');
};

const callGroq = async (prompt) => {
const completion = await groq.chat.completions.create({
messages: [
{
role: 'user',
content: prompt,
},
],
model: 'llama-3.3-70b-versatile',
temperature: 0.3,
});

return completion.choices[0].message.content;
};

const generateWithRetry = async (prompt) => {
let lastError;

for (let i = 0; i < MAX_RETRIES; i++) {
try {
const text = await callGroq(prompt);
return extractJson(text);
} catch (error) {
console.error(`AI Generation Attempt ${i + 1} failed:`, error.message);
lastError = error;
await new Promise(resolve => setTimeout(resolve, 2000));
}
}

throw lastError || new Error('AI generation failed after multiple retries');
};

export const generateNotes = async (title, content) => {
const prompt = `Based on the topic "${title}", generate study notes. Content context: ${content.substring(0, 10000)}

Generate a JSON object EXACTLY matching this structure. Return ONLY JSON:

{
"summary": "string",
"keyConcepts": ["string"],
"importantPoints": ["string"],
"structuredSections": [{"heading": "string", "content": "string"}],
"revisionNotes": ["string"],
"interviewQuestions": ["string"],
"commonMistakes": ["string"]
}`;

return generateWithRetry(prompt);
};

export const generateFlashcards = async (title, content) => {
const prompt = `Based on the topic "${title}", generate flashcards. Content context: ${content.substring(0, 10000)}

Generate a JSON object EXACTLY matching this structure. Return ONLY JSON:

{
"cards": [
{
"front": "string",
"back": "string",
"hint": "string",
"difficulty": "Easy"
}
]
}`;

return generateWithRetry(prompt);
};

export const generateQuiz = async (title, content, count = 10) => {
const prompt = `Based on the topic "${title}", generate a quiz with ${count} questions. Content context: ${content.substring(0, 10000)}

Generate a JSON object EXACTLY matching this structure. Return ONLY JSON:

{
"questions": [
{
"question": "string",
"options": ["string","string","string","string"],
"correctAnswer": "string",
"explanation": "string",
"difficulty": "Easy"
}
]
}`;

return generateWithRetry(prompt);
};


export const chatWithAI = async (history, contextPrompt) => {
  try {
    const messages = [...history];

    messages.push({
      role: 'user',
      content: contextPrompt,
    });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Tutor Chat Error:', error);
    throw new Error('Failed to get response from AI tutor');
  }
};