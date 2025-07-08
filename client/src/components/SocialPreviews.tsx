import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlAnalysis } from "@shared/schema";

interface SocialPreviewsProps {
  analysis: UrlAnalysis;
}

// Normalize keys to lowercase for robust access
function normalizeKeys(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [k.toLowerCase(), v])
  );
}

export default function SocialPreviews({ analysis }: SocialPreviewsProps) {
  const openGraphTags = normalizeKeys(analysis?.openGraphTags ?? {});
  const twitterTags = normalizeKeys(analysis?.twitterTags ?? {});
  const url = analysis?.url ?? "";

  // Fallbacks
  const defaultImage =
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
  const defaultTitle = "Untitled";
  const defaultDescription = "No description available";
  const defaultSite = "@yoursite";
  const defaultCard = "summary_large_image";

  // Prevent infinite fallback loop
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e.currentTarget.src !== defaultImage) {
      e.currentTarget.src = defaultImage;
    }
  };

  // Open Graph tags
  const ogTitle = openGraphTags["og:title"] || analysis?.title || defaultTitle;
  const ogDescription =
    openGraphTags["og:description"] ||
    analysis?.description ||
    defaultDescription;
  const ogImage = openGraphTags["og:image"] || defaultImage;
  const ogSiteName = openGraphTags["og:site_name"] || "Website Name";
  const ogUrl = openGraphTags["og:url"] || url;
  const ogType = openGraphTags["og:type"] || "article";

  // Twitter tags
  const twTitle = twitterTags["twitter:title"] || ogTitle;
  const twDescription = twitterTags["twitter:description"] || ogDescription;
  const twImage = twitterTags["twitter:image"] || ogImage;
  const twSite = twitterTags["twitter:site"] || defaultSite;
  const twCard = twitterTags["twitter:card"] || defaultCard;

  const metaTags = [
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:image", content: ogImage },
    { property: "og:site_name", content: ogSiteName },
    { property: "og:url", content: ogUrl },
    { property: "og:type", content: ogType },
  ];

  return (
    <div className="space-y-8">
      {/* Open Graph Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Open Graph Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={ogImage}
              alt={`Preview for ${ogTitle}`}
              className="w-full h-48 object-cover"
              onError={handleImgError}
            />
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{ogSiteName}</div>
              <div className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {ogTitle}
              </div>
              <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                {ogDescription}
              </div>
              <div className="text-xs text-gray-400 mb-1">{ogUrl}</div>
              <div className="text-xs text-gray-400">Type: {ogType}</div>
            </div>
          </div>
          {/* Show the meta tags as HTML for reference */}
          <div className="mt-6">
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {metaTags.map((tag) => (
                `<meta property="${tag.property}" content="${tag.content}">\n`
              ))}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Card Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-600">
            Twitter Card Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={twImage}
              alt={`Twitter preview for ${twTitle}`}
              className="w-full h-48 object-cover"
              onError={handleImgError}
            />
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{twSite}</div>
              <div className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {twTitle}
              </div>
              <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                {twDescription}
              </div>
              <div className="text-xs text-gray-400">Card: {twCard}</div>
            </div>
          </div>
          {/* Show the meta tags as HTML for reference */}
          <div className="mt-6">
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {`<meta name="twitter:card" content="${twCard}">
<meta name="twitter:title" content="${twTitle}">
<meta name="twitter:description" content="${twDescription}">
<meta name="twitter:image" content="${twImage}">
<meta name="twitter:site" content="${twSite}">`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
