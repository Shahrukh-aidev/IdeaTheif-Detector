import { GoogleGenAI } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { idea, localProjects } = JSON.parse(event.body);
    
    // This pulls your key securely from Netlify's environment settings
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const localContext = localProjects && localProjects.length > 0
      ? localProjects.map((p: any) => `[LOCAL] ${p.title}: ${p.description}`).join('\n')
      : "No prior local projects.";

    // I copied your exact prompt from your screenshot
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
        "lineage": ["idea 1", "idea 2"],
        "pivots": ["pivot 1", "pivot 2"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    // Clean up markdown block if Gemini wraps the JSON
    let resultText = response.text || "{}";
    resultText = resultText.replace(/```json\n/g, '').replace(/```/g, '');

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: resultText,
    };

  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to analyze idea.", details: error.message }),
    };
  }
};
