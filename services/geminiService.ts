import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LocalProject } from "../types";

const MODEL_NAME = 'gemini-2.0-flash';

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
    Objective: Detect originality of this idea by searching:
    - Academic: IEEE, ACM, Springer, arXiv, Google Scholar, ResearchGate.
    - Code: GitHub, GitLab, Bitbucket, Devpost, HackerRank, Kaggle.
    - Startups: Product Hunt, Crunchbase, AngelList/Wellfound.
    - Social: Reddit (r/SideProject, r/startups), Hacker News.
    
    USER IDEA:
    "${idea}"
    
    LOCAL PRIOR PROJECTS:
    "${localContext}"

    CRITICAL REQUIREMENTS:
    1. Be incredibly fast and high-precision.
    2. Provide Uniqueness Score (0-100).
    3. Generate a Brutally Honest Verdict (1 sentence).
    4. Trace Lineage & identify "zombie idea" status.
    5. Suggest 3-5 high-impact pivots to reach 100% uniqueness.
    
    RESPONSE FORMAT: 
    Valid JSON matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2048 }, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            uniquenessScore: { type: Type.NUMBER },
            noveltyLevel: { type: Type.STRING },
            honestVerdict: { type: Type.STRING },
            summary: { type: Type.STRING },
            explainability: { type: Type.STRING },
            hotZoneAlert: { type: Type.BOOLEAN },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                concept: { type: Type.NUMBER },
                execution: { type: Type.NUMBER },
                domainTransfer: { type: Type.NUMBER }
              }
            },
            lineage: {
              type: Type.OBJECT,
              properties: {
                ancestors: { type: Type.ARRAY, items: { type: Type.STRING } },
                siblings: { type: Type.ARRAY, items: { type: Type.STRING } },
                unexploredBranches: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            psychology: {
              type: Type.OBJECT,
              properties: {
                marketHook: { type: Type.STRING },
                failureSignals: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            intel: {
              type: Type.OBJECT,
              properties: {
                industryTrend: { type: Type.STRING },
                activityLevel: { type: Type.NUMBER },
                intelDrop: { type: Type.STRING }
              }
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  url: { type: Type.STRING },
                  source: { type: Type.STRING },
                  similarity: { type: Type.NUMBER },
                  matchType: { type: Type.STRING },
                  metadata: {
                    type: Type.OBJECT,
                    properties: {
                      year: { type: Type.STRING },
                      classification: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING },
                          focus: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER }
          },
          required: ["uniquenessScore", "noveltyLevel", "honestVerdict", "summary", "lineage", "dimensions", "psychology", "intel", "suggestions"]
        }
      }
    });

    const result = JSON.parse(response.text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingUrls = groundingChunks.map((c: any) => c.web?.uri).filter((u: any) => !!u);

    return {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ideaText: idea,
      groundingUrls: Array.from(new Set(groundingUrls))
    };
  } catch (error: any) {
    console.error("Gemini High-Speed Engine Error:", error);
    throw new Error("Rapid analysis failed. The idea may be too complex or the network is congested.");
  }
};
