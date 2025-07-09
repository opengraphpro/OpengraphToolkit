import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy } from "lucide-react";

interface TagDisplayProps {
  title: string;
  description: string;
  url: string;
  showCopyButton?: boolean;
}

export default function TagDisplay({
  title,
  description,
  url,
  showCopyButton = true,
}: TagDisplayProps) {
  const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;

  const handleRefresh = () => {
    console.log("Refresh tags");
  };

  const handleCopyTags = () => {
    const tagsToCopy = {
      title,
      description,
      favicon,
      url,
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
          {showCopyButton && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyTags}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
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
                { key: "og:title", value: title },
                { key: "og:description", value: description },
                { key: "og:image", value: favicon },
                { key: "og:url", value: url },
                { key: "og:type", value: "website" },
                { key: "og:site_name", value: "My Site" },
                { key: "og:locale", value: "en_US" },
                { key: "og:image:alt", value: "Image description" }
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
                { key: "twitter:card", value: "summary_large_image" },
                { key: "twitter:title", value: title },
                { key: "twitter:description", value: description },
                { key: "twitter:image", value: favicon },
                { key: "twitter:site", value: "@mysite" },
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
{`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${title}",
  "description": "${description}",
  "url": "${url}",
  "image": "${favicon}",
  "publisher": {
    "@type": "Organization",
    "name": "My Site",
    "logo": {
      "@type": "ImageObject",
      "url": "${favicon}"
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
