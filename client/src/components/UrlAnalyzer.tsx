// client/src/components/UrlAnalyzer.tsx
import { useState } from "react";
import { analyzeUrl } from "@/lib/api";
import type { UrlAnalysisResult } from "@shared/schema";

export function UrlAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze URL");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Analyze a URL</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={!url || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {result && (
        <div className="bg-gray-100 p-4 rounded shadow text-sm overflow-auto">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
