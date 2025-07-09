// client/src/lib/api.ts
export async function analyzeUrl(url: string) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) throw new Error("Failed to analyze URL");
  return res.json();
}

export async function generateTags(input: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  type?: string;
  siteName?: string;
}) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to generate tags");
  return res.json();
}
