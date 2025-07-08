import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Code, ExternalLink } from "lucide-react";

interface TagPreviewProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  siteName?: string;
  type: string;
}

export default function TagPreview({ 
  title, 
  description, 
  image, 
  url, 
  siteName, 
  type 
}: TagPreviewProps) {
  if (!title || !description || !url) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Tag Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Fill in the form fields to see a live preview of your tags
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
  const previewImage = image || defaultImage;
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'example.com';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Real-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Meta Tags Preview */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Code className="h-4 w-4" />
              Meta Tags
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
              <div className="text-blue-600">&lt;meta property="og:title" content="{title}" /&gt;</div>
              <div className="text-blue-600">&lt;meta property="og:description" content="{description}" /&gt;</div>
              <div className="text-blue-600">&lt;meta property="og:url" content="{url}" /&gt;</div>
              <div className="text-blue-600">&lt;meta property="og:type" content="{type}" /&gt;</div>
              {image && <div className="text-blue-600">&lt;meta property="og:image" content="{image}" /&gt;</div>}
              {siteName && <div className="text-blue-600">&lt;meta property="og:site_name" content="{siteName}" /&gt;</div>}
            </div>
          </div>

          {/* Visual Previews */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Social Media Appearance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Facebook Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-facebook text-white p-2 text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded text-facebook flex items-center justify-center text-xs">f</div>
                  Facebook
                </div>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultImage;
                  }}
                />
                <div className="p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1 uppercase">
                    {getDomain(url)}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {title}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {description}
                  </div>
                </div>
              </div>

              {/* Twitter Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-twitter text-white p-2 text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded text-twitter flex items-center justify-center text-xs">t</div>
                  Twitter
                </div>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultImage;
                  }}
                />
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {title}
                  </div>
                  <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {description}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {getDomain(url)}
                  </div>
                </div>
              </div>

              {/* LinkedIn Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden md:col-span-2">
                <div className="bg-linkedin text-white p-2 text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded text-linkedin flex items-center justify-center text-xs">in</div>
                  LinkedIn
                </div>
                <div className="flex">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-32 h-24 object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                  <div className="p-3 flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                      {title}
                    </div>
                    <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getDomain(url)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* JSON-LD Preview */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">JSON-LD Schema</h4>
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
              <pre className="whitespace-pre-wrap">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": type === "article" ? "Article" : "WebSite",
  "name": title,
  "description": description,
  "url": url,
  ...(image && { "image": image }),
  ...(siteName && { "publisher": { "@type": "Organization", "name": siteName } })
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}