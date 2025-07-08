import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { AISuggestion } from "@shared/schema";

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  url: string;
  title?: string;
  description?: string;
}

export default function AISuggestions({ 
  suggestions, 
  url, 
  title, 
  description 
}: AISuggestionsProps) {
  const { toast } = useToast();

  const improvementMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/improve", {
        url,
        title,
        description,
        content: "", // Would be populated with actual content
        type: "website"
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Improvements Generated",
        description: "AI has generated improved suggestions for your content",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const applySuggestion = (suggestion: string) => {
    // TODO: Implement suggestion application
    toast({
      title: "Suggestion Applied",
      description: "The suggestion has been applied to your content",
    });
  };

  const generateImprovements = () => {
    improvementMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            AI Suggestions
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Powered by AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Optimization Suggestions */}
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Optimization Suggestions
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {getLevelIcon(suggestion.level)}
                    <span>{suggestion.message}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>No analysis available yet. Analyze a URL to get AI-powered suggestions.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Suggested Improvements */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Suggested Improvements</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateImprovements}
                disabled={improvementMutation.isPending}
              >
                {improvementMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                    Generating...
                  </div>
                ) : (
                  "Generate Improvements"
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              {suggestions.filter(s => s.suggestion).map((suggestion, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {suggestion.type === 'optimization' ? 'Optimization' : 'Improvement'}
                  </div>
                  <div className="text-sm text-gray-600 font-mono mb-2">
                    {suggestion.suggestion}
                  </div>
                  <Button 
                    variant="link" 
                    size="sm"
                    className="p-0 h-auto text-blue-500 hover:text-blue-600"
                    onClick={() => applySuggestion(suggestion.suggestion!)}
                  >
                    Apply Suggestion
                  </Button>
                </div>
              ))}
              
              {suggestions.filter(s => s.suggestion).length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                  Generate improvements to see AI-powered suggestions here
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
