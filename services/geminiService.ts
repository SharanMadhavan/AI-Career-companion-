
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { QuestionAnswer, InterviewFeedback } from '../types';

// Get API key from environment - Vite automatically exposes VITE_* variables
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

let ai: GoogleGenAI | null = null;

// Initialize AI with proper error handling
if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY environment variable not set. AI features will not work. Make sure .env.local contains: VITE_GEMINI_API_KEY=your_key_here");
} else {
    try {
        ai = new GoogleGenAI({ apiKey });
        console.log("✓ Google Gemini AI initialized successfully");
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        ai = null;
    }
}

const ensureAIInitialized = () => {
    if (!ai || !apiKey) {
        const msg = !apiKey 
            ? "API key not set. Please add VITE_GEMINI_API_KEY to .env.local" 
            : "AI service failed to initialize";
        throw new Error(msg);
    }
};

export const generateTextSuggestion = async (prompt: string): Promise<string> => {
    ensureAIInitialized();
    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating text suggestion:", error);
        throw new Error("Failed to get suggestion from AI.");
    }
};

export const extractTextFromPdf = async (base64Data: string, mimeType: string): Promise<string> => {
    ensureAIInitialized();
    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    },
                    {
                        text: "Extract all the text from this document exactly as it appears. Do not summarize."
                    }
                ]
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to parse document with AI.");
    }
};


export const generateTailoredBullets = async (resume: string, jobDescription: string): Promise<{ originalBullets: string[], tailoredBullets: string[] }> => {
    ensureAIInitialized();
    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following resume and job description. First, extract the most important bullet points or responsibilities from the resume. Then, rewrite those points to be better aligned with the keywords and requirements of the job description.

            **Resume:**
            ${resume}
            
            **Job Description:**
            ${jobDescription}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        originalBullets: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "An array of the key bullet points extracted from the original resume."
                        },
                        tailoredBullets: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "An array of the rewritten, tailored resume bullet points."
                        }
                    },
                    required: ["originalBullets", "tailoredBullets"]
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse || { originalBullets: [], tailoredBullets: [] };
    } catch (error) {
        console.error("Error generating tailored bullets:", error);
        throw new Error("Failed to generate tailored bullets from AI.");
    }
};

export const generateInterviewQuestions = async (
    jobDescription: string, 
    type: 'Technical' | 'Behavioral', 
    existingQuestions: string[] = []
): Promise<QuestionAnswer[]> => {
    ensureAIInitialized();
    try {
        let prompt = `Generate a list of 5 UNIQUE ${type.toLowerCase()} interview questions for a candidate applying for the role described below. For each question, provide a detailed model answer. For behavioral questions, use the STAR (Situation, Task, Action, Result) method for the answer.`;

        if (existingQuestions.length > 0) {
            prompt += `\n\nIMPORTANT: Do NOT repeat any of the following questions:\n${JSON.stringify(existingQuestions)}`;
        }

        prompt += `\n\n**Job Description:**\n${jobDescription}`;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING }
                        },
                        required: ["question", "answer"],
                    },
                },
            },
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error(`Error generating ${type} questions:`, error);
        throw new Error(`Failed to generate ${type} interview questions.`);
    }
};

export const createInterviewChat = (): Chat => {
    ensureAIInitialized();
    return ai!.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly but professional interviewer. Ask one question at a time based on the provided job description. Wait for the user\'s response before asking the next question. Start by greeting the candidate and asking if they are ready to begin.',
        },
    });
};

export const generateInterviewFeedback = async (jobDescription: string, chatHistory: string): Promise<InterviewFeedback> => {
    ensureAIInitialized();
    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following job description and interview transcript, provide constructive feedback for the candidate. 
            
            1.  Provide an overall rating on a scale of 1 to 5, where 5 is excellent. This can be a decimal.
            2.  Provide an overall score out of 100.
            3.  Write detailed feedback. Analyze their responses for clarity, relevance to the role, and overall performance. Structure the feedback into: 
                - **Overall Summary**
                - **Strengths** (list 2-3 points)
                - **Areas for Improvement** (list 2-3 points with suggestions)
            
            Format the detailed feedback in Markdown.

            **Job Description:**
            ${jobDescription}

            **Interview Transcript:**
            ${chatHistory}
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        rating: {
                            type: Type.NUMBER,
                            description: "The candidate's overall rating from 1 to 5."
                        },
                        score: {
                            type: Type.INTEGER,
                            description: "The candidate's overall score out of 100."
                        },
                        feedbackText: {
                            type: Type.STRING,
                            description: "The detailed feedback in Markdown format (Summary, Strengths, Areas for Improvement)."
                        }
                    },
                    required: ["rating", "score", "feedbackText"]
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        if (!jsonResponse.rating || !jsonResponse.score || !jsonResponse.feedbackText) {
            throw new Error("AI response did not contain the required feedback fields.");
        }
        return jsonResponse;
    } catch (error) {
        console.error("Error generating interview feedback:", error);
        throw new Error("Failed to generate interview feedback.");
    }
};
