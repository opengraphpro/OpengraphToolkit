import { useState } from "react";
import { Share2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import URLInput from "@/components/URLInput";
import TagDisplay from "@/components/TagDisplay";
import AISuggestions from "@/components/AISuggestions";
import SocialPreviews from "@/components/SocialPreviews";
import TagGenerator from "@/components/TagGenerator";
import ToolsSection from "@/components/ToolsSection";
import MetadataEditor from "@/components/MetadataEditor";
import { OpenGraphTags, TwitterTags, UrlAnalysis } from "@shared/schema";

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<UrlAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState<string | null>(null);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    setGeneratedHTML(null);
  };

  const handleAnalysisComplete = (analysis: UrlAnalysis) => {
    setCurrentAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleAnalysisError = () => {
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Share2 className="text-blue-500 mr-2" size={24} />
              OpenGraph Pro
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Upgrade Pro
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <URLInput
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisError={handleAnalysisError}
          isAnalyzing={isAnalyzing}
        />

        {currentAnalysis && (
          <>
            {/* Tags & AI Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TagDisplay
                title={currentAnalysis.title ?? ""}
                description={currentAnalysis.description ?? ""}
                url={currentAnalysis.url}
                openGraphTags={currentAnalysis.openGraphTags as OpenGraphTags}
                twitterTags={currentAnalysis.twitterTags as TwitterTags}
                jsonLd={Array.isArray(currentAnalysis.jsonLd) ? currentAnalysis.jsonLd : []}
                aiSuggestions={
                  Array.isArray(currentAnalysis.aiSuggestions)
                    ? currentAnalysis.aiSuggestions
                    : []
                }
              />

              <AISuggestions
                suggestions={
                  Array.isArray(currentAnalysis.aiSuggestions)
                    ? currentAnalysis.aiSuggestions
                    : []
                }
                url={currentAnalysis.url}
                title={currentAnalysis.title ?? undefined}
                description={currentAnalysis.description ?? undefined}
              />
            </div>

            {/* Social Media Preview */}
            <SocialPreviews analysis={currentAnalysis} />

            {/* Metadata Editor */}
            <MetadataEditor
              initialTitle={currentAnalysis.title ?? ""}
              initialDescription={currentAnalysis.description ?? ""}
              initialImage={currentAnalysis.favicon ?? ""}
              url={currentAnalysis.url}
              onGenerated={setGeneratedHTML}
            />

            {/* Generated HTML Output */}
            {generatedHTML && (
              <div className="mt-8 border rounded-lg bg-white shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Generated Tags</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {generatedHTML}
                </pre>
              </div>
            )}
          </>
        )}

        {/* Tag Generator */}
        <TagGenerator />

        {/* Tools */}
        <ToolsSection />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">OpenGraph Pro</h5>
              <p className="text-sm text-gray-600">
                Professional OpenGraph debugging and generation tool for developers and marketers.
              </p>
            </div>
            <div>
              <h6 className="font-medium text-gray-900 mb-3">Tools</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">URL Debugger</a></li>
                <li><a href="#" className="hover:text-gray-900">Tag Generator</a></li>
                <li><a href="#" className="hover:text-gray-900">Bulk Processor</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-900 mb-3">Resources</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900">Best Practices</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-900 mb-3">Support</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Status Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 OpenGraph Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
