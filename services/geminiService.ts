import { AnalysisResult, LocalProject } from "../types";

export const analyzeIdea = async (
  idea: string,
  localProjects: LocalProject[] = []
): Promise<AnalysisResult> => {
  try {
    // Point directly to your new Vercel API folder
    const response = await fetch('/api/analyzeIdea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, localProjects }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to contact engine.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Frontend Service Error:", error);
    throw new Error(error.message || "Rapid analysis failed. Check your connection.");
  }
};
