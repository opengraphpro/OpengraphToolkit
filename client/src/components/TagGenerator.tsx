import { useState } from "react";
import { generateTagsFromUrl } from "../action"; // ✅ Corrected path
import { UrlAnalysisResult } from "@shared/schema";
import { Input } from "@/components/ui/input"; // adjust if wrong
import { Button } from "@/components/ui/button"; // adjust if wrong


export default function TagGenerator() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<UrlAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
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

      {data && (
        <div className="space-y-2 mt-4">
          <h3 className="text-lg font-bold">Title: {data.title ?? "N/A"}</h3>
          <p>Description: {data.description ?? "N/A"}</p>
          <p>URL: {data.url}</p>
        </div>
      )}
    </div>
  );
}
