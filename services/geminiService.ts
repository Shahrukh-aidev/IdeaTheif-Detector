
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LocalProject } from "../types";

// Using Gemini 3 Flash for significantly faster response times as requested.
const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeIdea = async (
  idea: string, 
  localProjects: LocalProject[] = []
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const localContext = localProjects.length > 0 
    ? localProjects.map(p => `[LOCAL] ${p.title}: ${p.description}`).join('\n')
    : "No prior local projects.";

  const prompt = `
    Task: Act as the 'Idea Thief Detector' High-Efficiency Engine. 
    Analyze the novelty of the provided idea by scanning major code hosting and research platforms.
    
    IDEA TO ANALYZE:
    "${idea}"
    
    LOCAL PRIOR PROJECTS:
    "${localContext}"

    EXTENDED SEARCH TARGETS:
    - Code Repositories: Deeply search GitHub, GitLab, and Bitbucket. Extract repository names, full descriptions, and topic tags to assess conceptual similarity.
    - Academic: arXiv, IEEE, ACM, Google Scholar.
    - Product/Business: Product Hunt, Crunchbase, Y-Combinator.
    
    CRITICAL INSTRUCTIONS:
    1. Assess if similar implementations or concepts exist on GitHub, GitLab, or Bitbucket.
    2. Provide a Uniqueness Score (0-100).
    3. Return a sharp, direct 'Brutally Honest Verdict'.
    4. Provide 3-5 specific pivots to reach 100% uniqueness.
    5. Find at least 4 competitive matches with URLs.

    CONSTRAINT: Response must be extremely fast and valid JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Setting thinkingBudget to 0 for maximum speed/low latency.
        thinkingConfig: { thinkingBudget: 0 }, 
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
          required: ["uniquenessScore", "noveltyLevel", "honestVerdict", "summary", "lineage", "dimensions", "psychology", "intel", "suggestions", "matches"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingUrls = groundingChunks.map((c: any) => c.web?.uri).filter((u: any) => !!u);

    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ideaText: idea,
      groundingUrls: Array.from(new Set(groundingUrls)),
      matches: parsed.matches || [],
      suggestions: parsed.suggestions || [],
      lineage: {
        ancestors: parsed.lineage?.ancestors || [],
        siblings: parsed.lineage?.siblings || [],
        unexploredBranches: parsed.lineage?.unexploredBranches || [],
      }
    };
  } catch (error: any) {
    console.error("Analysis Engine Error:", error);
    throw new Error("Rapid analysis failed. The idea might be too complex or search traffic is high.");
  }
};
