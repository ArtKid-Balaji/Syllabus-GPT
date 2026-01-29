
import { GoogleGenAI, Type } from "@google/genai";
import { Document, Message } from "../types";

// Always initialize with named parameter and direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are SyllabusGPT, a strict academic assistant.
Your goal is to answer questions ONLY using the provided documents (the "Syllabus Context").

RULES:
1. If the answer is NOT in the context, strictly respond: "This topic is not covered in your uploaded syllabus."
2. DO NOT use external knowledge.
3. ALWAYS cite the document name used for the answer.
4. Format your response clearly with Markdown.
5. If you find partial information, provide it and state what is missing.
6. If the user asks for summaries, exam notes, or viva questions, generate them based ONLY on the context.

Response Format:
- Use clear headings.
- Bullet points for lists.
- A "Sources" section at the end listing the documents referenced.
`;

export async function getChatResponse(
  query: string, 
  history: Message[], 
  documents: Document[]
): Promise<{ text: string }> {
  const contextText = documents
    .map(doc => `--- DOCUMENT: ${doc.name} ---\n${doc.content}`)
    .join('\n\n');

  const model = 'gemini-3-flash-preview';
  
  const contents = [
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: [{ text: `CONTEXT:\n${contextText}\n\nQUERY: ${query}` }]
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for factual accuracy
      }
    });

    // Access .text property (getter), do not use .text()
    return { text: response.text || "No response generated." };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to SyllabusGPT Engine.");
  }
}

export async function generateStudyTool(
  toolType: 'summary' | 'simple' | 'notes' | 'viva',
  documents: Document[]
): Promise<string> {
  const contextText = documents.map(doc => doc.content).join('\n\n');
  const prompts = {
    summary: "Provide a comprehensive chapter-wise summary of this syllabus.",
    simple: "Explain the key concepts of this syllabus in very simple terms for a beginner.",
    notes: "Generate detailed exam study notes including key formulas, definitions, and diagrams descriptions.",
    viva: "Generate 10 possible viva/exam questions with detailed answers based on this content."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `CONTEXT:\n${contextText}\n\nTASK: ${prompts[toolType]}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3
    }
  });

  // Access .text property (getter), do not use .text()
  return response.text || "Failed to generate study content.";
}
