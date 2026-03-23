import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, LocalProject } from "../types";

const MODEL_NAME = 'gemini-2.0-flash-lite';

export const analyzeIdea = async (
  idea: string,
  localProjects: LocalProject[] = []
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const localContext = localProjects.length > 0
    ? localProjects.map(p => `[LOCAL] ${p.title}: ${p.description}`).join('\n')
    : "No prior local projects.";

  const prompt = `
    You are the Idea Thief Detector AI Engine.
    Analyze the originality of this startup idea: "${idea}"
    Prior projects: "${localContext}"
    Return ONLY valid JSON, no extra text:
    {
      "uniquenessScore": 45,
      "noveltyLevel": "MODERATE",
      "honestVerdict": "verdict here",
      "summary": "summary here",
      "explainability": "explanation here",
      "hotZoneAlert": true,
      "dimensions": { "concept": 40, "execution": 50, "domainTransfer": 60 },
      "lineage": {
        "ancestors": ["ancestor 1"],
        "siblings": ["sibling 1"],
        "unexploredBranches": ["branch 1"]
      },
      "psychology": {
        "marketHook": "hook here",
        "failureSignals": ["risk 1", "risk 2"]
      },
      "intel": {
        "industryTrend": "trend here",
        "activityLevel": 75,
        "intelDrop": "intel here"
      },
      "matches": [{
        "id": "1",
        "title": "Competitor",
        "description": "what they do",
        "url": "https://example.com",
        "source": "Product Hunt",
        "similarity": 85,
        "matchType": "Direct Competitor",
        "metadata": { "year": "2024", "classification": { "type": "SaaS", "focus": "AI" }}
      }],
      "suggestions": ["suggestion 1", "suggestion 2"],
      "confidence": 80
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const result = JSON.parse(jsonMatch[0]);

    return {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ideaText: idea,
      groundingUrls: [],
      matches: result.matches || [],
      suggestions: result.suggestions || [],
      lineage: {
        ancestors: result.lineage?.ancestors || [],
        siblings: result.lineage?.siblings || [],
        unexploredBranches: result.lineage?.unexploredBranches || [],
      }
    };
  } catch (error: any) {
    console.error("Analysis Engine Error:", error);
    throw new Error("Rapid analysis failed. The idea may be too complex or the network is congested.");
  }
};
