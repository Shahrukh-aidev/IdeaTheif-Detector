import { GoogleGenAI, Type } from "@google/genai";
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
    Task: Act as the 'Idea Thief Detector' Ultra-Fast Reasoning Engine.
    Objective: Detect originality of this idea.
    
    USER IDEA: "${idea}"
    LOCAL PRIOR PROJECTS: "${localContext}"

    CRITICAL REQUIREMENTS:
    1. Provide Uniqueness Score (0-100).
    2. Generate a Brutally Honest Verdict (1 sentence).
    3. Trace Lineage & identify zombie idea status.
    4. Suggest 3-5 high-impact pivots to reach 100% uniqueness.
    
    Respond ONLY with this exact JSON structure, no extra text:
    {
      "uniquenessScore": 45,
      "noveltyLevel": "MODERATE",
      "honestVerdict": "One sentence verdict here",
      "summary": "Brief summary here",
      "explainability": "Why this score",
      "hotZoneAlert": true,
      "dimensions": { "concept": 40, "execution": 50, "domainTransfer": 60 },
      "lineage": {
        "ancestors": ["ancestor 1", "ancestor 2"],
        "siblings": ["sibling 1", "sibling 2"],
        "unexploredBranches": ["branch 1", "branch 2"]
      },
      "psychology": {
        "marketHook": "The hook here",
        "failureSignals": ["signal 1", "signal 2"]
      },
      "intel": {
        "industryTrend": "trend description",
        "activityLevel": 75,
        "intelDrop": "intel here"
      },
      "matches": [
        {
          "id": "1",
          "title": "Competitor name",
          "description": "What they do",
          "url": "https://example.com",
          "source": "GitHub",
          "similarity": 85,
          "matchType": "Direct Competitor",
          "metadata": { "year": "2024", "classification": { "type": "SaaS", "focus": "AI" } }
        }
      ],
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
      "confidence": 80
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "text/plain",
      }
    });

    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
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
    console.error("Gemini High-Speed Engine Error:", error);
    throw new Error("Rapid analysis failed. The idea may be too complex or the network is congested.");
  }
};
