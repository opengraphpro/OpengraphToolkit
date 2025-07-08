import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy } from "lucide-react";
import { UrlAnalysisResult } from "@shared/schema";

interface TagDisplayProps {
  analysis: UrlAnalysisResult;
}

export default function TagDisplay({ analysis }: TagDisplayProps) {
  const { openGraphTags, twitterTags, jsonLd } = analysis;

  const handleRefresh = () => {
    console.log("Refresh tags");
  };

  const handleCopyTags = () => {
    const tagsToCopy = {
      openGraphTags,
      twitterTags,
      jsonLd,
    };

    const text = JSON.stringify(tagsToCopy, null, 2);

    navigator.clipboard.writeText(text)
      .then(() => console.log("Tags copied to clipboard"))
      .catch((err) => console.error("Failed to copy tags", err));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Extracted Tags
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyTags}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* OpenGraph Tags */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-facebook rounded text-white flex items-center justify-center text-xs">f</div>
              OpenGraph Tags
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { key: "og:title", value: openGraphTags?.title },
                { key: "og:description", value: openGraphTags?.description },
                { key: "og:image", value: openGraphTags?.image },
                { key: "og:url", value: openGraphTags?.url },
                { key: "og:type", value: openGraphTags?.type },
                { key: "og:site_name", value: openGraphTags?.siteName },
                { key: "og:locale", value: openGraphTags?.locale },
                { key: "og:image:alt", value: openGraphTags?.imageAlt }
              ].map(({ key, value }, idx) => (
                <div
                  key={`${key}-${value}-${idx}`}
                  className="flex justify-between items-start py-1 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-600">{key}</span>
                  <span
                    className="text-gray-900 font-mono text-right max-w-48 truncate"
                    title={value || "Not set"}
                  >
                    {value || "Not set"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Twitter Cards */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-twitter rounded text-white flex items-center justify-center text-xs">t</div>
              Twitter Cards
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { key: "twitter:card", value: twitterTags?.card },
                { key: "twitter:title", value: twitterTags?.title },
                { key: "twitter:description", value: twitterTags?.description },
                { key: "twitter:image", value: twitterTags?.image },
                { key: "twitter:site", value: twitterTags?.site },
              ].map(({ key, value }, idx) => (
                <div
                  key={`${key}-${value}-${idx}`}
                  className="flex justify-between items-start py-1 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-600">{key}</span>
                  <span
                    className="text-gray-900 font-mono text-right max-w-48 truncate"
                    title={value || "Not set"}
                  >
                    {value || "Not set"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* JSON-LD */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded text-white flex items-center justify-center text-xs" />
              JSON-LD Schema
            </h4>
            <div className="bg-gray-50 rounded p-3 text-sm">
              <pre className="text-gray-700 font-mono overflow-x-auto">
                {jsonLd && jsonLd.length > 0
                  ? JSON.stringify(jsonLd[0], null, 2)
                  : "No JSON-LD schema found"}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
