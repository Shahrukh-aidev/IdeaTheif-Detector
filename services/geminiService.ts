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
    You are the 'Idea Thief Detector' AI Engine.
    Analyze the originality of this startup idea: "${idea}"
    Prior projects context: "${localContext}"

    Return ONLY a valid JSON object with NO extra text, NO markdown, NO backticks:
    {
      "uniquenessScore": 45,
      "noveltyLevel": "MODERATE",
      "honestVerdict": "One brutal honest sentence about this idea",
      "summary": "2-3 sentence summary of the competitive landscape",
      "explainability": "Why this score was given",
      "hotZoneAlert": true,
      "dimensions": { "concept": 40, "execution": 50, "domainTransfer": 60 },
      "lineage": {
        "ancestors": ["ancestor 1", "ancestor 2"],
        "siblings": ["Competitor A", "Competitor B"],
        "unexploredBranches": ["Pivot idea 1", "Pivot idea 2"]
      },
      "psychology": {
        "marketHook": "What would make people buy this",
        "failureSignals": ["Risk 1", "Risk 2", "Risk 3"]
      },
      "intel": {
        "industryTrend": "Current trend in this space",
        "activityLevel": 75,
        "intelDrop": "Key intelligence about the market"
      },
      "matches": [
        {
          "id": "1",
          "title": "Similar Product Name",
          "description": "What this competitor does",
          "url": "https://example.com",
          "source": "Product Hunt",
          "similarity": 85,
          "matchType": "Direct Competitor",
          "metadata": { "year": "2024", "classification": { "type": "SaaS", "focus": "AI" } }
        }
      ],
      "suggestions": ["Pivot 1", "Pivot 2", "Pivot 3"],
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
```

---

**Fix 2 — Add environment variable in Vercel:**

Go to Vercel → your project → **Settings → Environment Variables** → add:
```
Key:   VITE_GEMINI_API_KEY
Value: your full gemini api key
