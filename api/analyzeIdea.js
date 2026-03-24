import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { idea, localProjects } = req.body;

  // This uses the key you will set in the Vercel Dashboard later
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this project idea: "${idea}". 
    Compare it against these existing local projects: ${JSON.stringify(localProjects)}. 
    Return a detailed JSON analysis including uniquenessScore (0-100), noveltyLevel, honestVerdict, summary, suggestions, and market insights. 
    Ensure the response is ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean markdown if AI includes it
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "AI Analysis failed. Check API Key." });
  }
}
