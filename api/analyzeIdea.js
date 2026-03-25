import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { idea, localProjects } = req.body;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const localContext = localProjects && localProjects.length > 0
    ? localProjects.map(p => `[LOCAL] ${p.title}: ${p.description}`).join('\n')
    : "No prior local projects.";

  const prompt = `
    You are the Idea Thief Detector AI Engine.
    Analyze the originality of this startup idea: "${idea}"
    Prior projects: "${localContext}"
    Return ONLY valid JSON, no extra text, no markdown, no backticks:
    {
      "uniquenessScore": 45,
      "noveltyLevel": "MODERATE",
      "honestVerdict": "verdict here",
      "summary": "summary here",
      "explainability": "explanation here",
      "hotZoneAlert": true,
      "dimensions": { "concept": 40, "execution": 50, "domainTransfer": 60 },
      "lineage": {
        "ancestors": ["ancestor 1", "ancestor 2"],
        "siblings": ["sibling 1", "sibling 2"],
        "unexploredBranches": ["branch 1", "branch 2"]
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
        "title": "Competitor Name",
        "description": "what they do",
        "url": "https://example.com",
        "source": "Product Hunt",
        "similarity": 85,
        "matchType": "Direct Competitor",
        "metadata": { "year": "2024", "classification": { "type": "SaaS", "focus": "AI" }}
      }],
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
      "confidence": 80
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
    });

    const text = response.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const result = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
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
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "AI Analysis failed.", details: error.message });
  }
}
