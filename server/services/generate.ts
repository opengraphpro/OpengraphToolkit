import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  tagGeneratorRequestSchema,
  TagGenerationResult,
} from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTagsFromMetadata(
  input: unknown
): Promise<TagGenerationResult> {
  const validation = tagGeneratorRequestSchema.safeParse(input);

  if (!validation.success) {
    throw new Error("Invalid input");
  }

  const {
    title,
    description,
    image,
    url,
    siteName,
    type,
    // locale,
    // imageAlt,
  } = validation.data;

  const prompt = `
Generate full OpenGraph, Twitter Card, and JSON-LD meta tags for a webpage using this metadata:

- Title: ${title}
- Description: ${description}
- URL: ${url}
- Image: ${image || "N/A"}
- Site Name: ${siteName || "N/A"}
- Type: ${type}

- Image Alt: ${ImageData || "Image description"}

Return only valid HTML <meta> tags and <script type="application/ld+json"> inside a <head> section.
Do not include any explanation, just the raw HTML.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const generatedCode = result.response.text();

  return {
    title,
    description,
    image,
    url,
    siteName,
    type,
    // locale,
    // imageAlt,
    generatedCode,
  };
}
