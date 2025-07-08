import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Globe, Search, Bot, Monitor, Smartphone } from "lucide-react";
import { UrlAnalysis } from "@shared/schema";

interface URLInputProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (analysis: UrlAnalysis) => void;
  onAnalysisError: () => void;
  isAnalyzing: boolean;
}

export default function URLInput({ 
  onAnalysisStart, 
  onAnalysisComplete, 
  onAnalysisError, 
  isAnalyzing 
}: URLInputProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data);
      toast({
        title: "Analysis Complete",
        description: "URL has been successfully analyzed",
      });
    },
    onError: (error: Error) => {
      onAnalysisError();
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url);
      onAnalysisStart();
      analyzeMutation.mutate(url);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
    }
  };

  const processingStatus = isAnalyzing ? "Processing..." : "Ready";
  const statusColor = isAnalyzing ? "bg-yellow-500" : "bg-green-500";

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Debug URL
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{processingStatus}</span>
            <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="url"
                placeholder="Enter URL to analyze (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-4 pr-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAnalyze();
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Globe className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || analyzeMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              {isAnalyzing || analyzeMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Analyze
                </div>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bot className="h-4 w-4 text-blue-500" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="h-4 w-4 text-emerald-500" />
              <span>Headless Browser</span>
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="h-4 w-4 text-purple-500" />
              <span>Mobile Ready</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
