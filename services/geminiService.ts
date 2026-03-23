import { AnalysisResult, LocalProject } from "../types";

export const analyzeIdea = async (
  idea: string,
  localProjects: LocalProject[] = []
): Promise<AnalysisResult> => {
  try {
    // Calls your secure backend instead of exposing the API key
    const response = await fetch('/.netlify/functions/analyzeIdea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idea, localProjects }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data as AnalysisResult;
    
  } catch (error: any) {
    console.error("Gemini High-Speed Engine Error:", error);
    throw new Error("Rapid analysis failed. The idea may be too complex or the network is congested.");
  }
};
