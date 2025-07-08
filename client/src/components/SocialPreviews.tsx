import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlAnalysis } from "@shared/schema";

interface SocialPreviewsProps {
  analysis: UrlAnalysis;
}

export default function SocialPreviews({ analysis }: SocialPreviewsProps) {
  const { openGraphTags, twitterTags, url } = analysis;

  // Helper function to get domain from URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.toUpperCase();
    } catch {
      return 'EXAMPLE.COM';
    }
  };

  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";

  const facebookPreview = {
    image: openGraphTags?.image || defaultImage,
    title: openGraphTags?.title || analysis.title || 'Untitled',
    description: openGraphTags?.description || analysis.description || 'No description available',
    domain: getDomain(url)
  };

  const twitterPreview = {
    image: twitterTags?.image || openGraphTags?.image || defaultImage,
    title: twitterTags?.title || openGraphTags?.title || analysis.title || 'Untitled',
    description: twitterTags?.description || openGraphTags?.description || analysis.description || 'No description available',
    domain: getDomain(url).toLowerCase()
  };

  const linkedinPreview = {
    image: openGraphTags?.image || defaultImage,
    title: openGraphTags?.title || analysis.title || 'Untitled',
    description: openGraphTags?.description || analysis.description || 'No description available',
    domain: getDomain(url).toLowerCase()
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Social Media Previews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Facebook Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-facebook rounded text-white flex items-center justify-center text-xs">
                f
              </div>
              <span className="font-medium text-gray-900">Facebook</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={facebookPreview.image} 
                alt="Facebook preview" 
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
              <div className="p-3 bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">
                  {facebookPreview.domain}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {facebookPreview.title}
                </div>
                <div className="text-xs text-gray-600 line-clamp-2">
                  {facebookPreview.description}
                </div>
              </div>
            </div>
          </div>

          {/* Twitter Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-twitter rounded text-white flex items-center justify-center text-xs">
                t
              </div>
              <span className="font-medium text-gray-900">Twitter</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={twitterPreview.image} 
                alt="Twitter preview" 
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
              <div className="p-3">
                <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {twitterPreview.title}
                </div>
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {twitterPreview.description}
                </div>
                <div className="text-xs text-gray-500">
                  {twitterPreview.domain}
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-linkedin rounded text-white flex items-center justify-center text-xs">
                in
              </div>
              <span className="font-medium text-gray-900">LinkedIn</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={linkedinPreview.image} 
                alt="LinkedIn preview" 
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
              <div className="p-3">
                <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {linkedinPreview.title}
                </div>
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {linkedinPreview.description}
                </div>
                <div className="text-xs text-gray-500">
                  {linkedinPreview.domain}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
