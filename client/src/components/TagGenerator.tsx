import { useState } from "react";
import { generateTagsFromUrl } from "../action";
import { UrlAnalysisResult, TagGenerationResult } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TagGenerator() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<TagGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const result = await generateTagsFromUrl(url);
      setData(result);
    } catch (err: any) {
      setError("Failed to fetch tag data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (data?.generatedCode) {
      await navigator.clipboard.writeText(data.generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Tags"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}

      {data?.generatedCode && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated HTML:</h3>
            <Button onClick={handleCopy} variant="secondary">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="bg-gray-100 p-4 mt-2 rounded overflow-auto text-sm">
            {data.generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
// TagGenerator.tsx
// This component allows users to input a URL, fetches the tag data, and displays the generated HTML tags.
// It also provides a button to copy the generated HTML to the clipboard.

// It uses the `generateTagsFromUrl` function from the action module to perform the tag generation.
// The component maintains local state for the URL input, loading status, error messages, and the generated tag data.