import { TagGenerationResult, TagGeneratorRequest } from "@shared/schema";

export async function generateTagsFromUrl(input: TagGeneratorRequest): Promise<TagGenerationResult> {
  // Basic validation
  if (!input.url || !input.title || !input.description || !input.type) {
    throw new Error('All required fields must be provided');
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to generate tags");
  }

  return response.json();
}