import { UrlAnalysisResult } from '@shared/schema';
import { TagGenerationResult } from "@shared/schema";
// Removed direct server import and function
export async function generateTagsFromUrl(url: string): Promise<TagGenerationResult> {
  if (!url) {
    throw new Error('URL is required');
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate tags");
  }

  return response.json();
}