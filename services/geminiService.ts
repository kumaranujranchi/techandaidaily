import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || ''; 

const createClient = () => {
    if (!API_KEY) {
        console.warn("Gemini API Key is missing. AI features will operate in mock mode.");
        return null;
    }
    return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateArticleSummary = async (content: string): Promise<string> => {
  const ai = createClient();
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve("AI Summary unavailable (Missing API Key). This is a mock summary generated client-side because the API key was not found."), 1000));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following tech article into a 3-sentence TL;DR that captures the main insight, the implication for the industry, and a key takeaway. Keep the tone professional and editorial.\n\nArticle Content:\n${content}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service.";
  }
};

export const generateArticleTags = async (title: string, content: string): Promise<string[]> => {
  const ai = createClient();
  if (!ai) return ["MockTag1", "MockTag2"];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 relevant tags for this article. Return only the tags as a comma-separated list (e.g. AI, Machine Learning, Data). Do not include explanations.\n\nTitle: ${title}\nContent: ${content.substring(0, 500)}...`,
    });
    
    const text = response.text || "";
    return text.split(',').map(t => t.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Error"];
  }
};

export const generateDraftContent = async (title: string): Promise<string> => {
    const ai = createClient();
    if (!ai) return "<p>This is a mock draft generated because no API key was present.</p>";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a 300-word tech news article draft based on this title: "${title}". Use HTML tags for formatting (<h3> for subheadings, <p> for paragraphs). Tone: Professional, insightful, journalistic.`
        });
        return response.text || "";
    } catch (e) {
        console.error(e);
        return "<p>Error generating draft.</p>";
    }
}
