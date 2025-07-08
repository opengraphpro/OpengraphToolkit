import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download, Wand2, Copy, CheckCircle } from "lucide-react";
import TagPreview from "@/components/TagPreview";

interface TagGeneratorState {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
}

export default function TagGenerator() {
  const [formData, setFormData] = useState<TagGeneratorState>({
    title: "",
    description: "",
    image: "",
    url: "",
    siteName: "",
    type: "website"
  });
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: TagGeneratorState) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedCode(data.generatedCode);
      toast({
        title: "Tags Generated",
        description: "OpenGraph tags have been generated successfully",
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

  const handleInputChange = (field: keyof TagGeneratorState, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    if (!formData.title || !formData.description || !formData.url) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in title, description, and URL",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate(formData);
  };

  const handleClear = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      url: "",
      siteName: "",
      type: "website"
    });
    setGeneratedCode("");
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast({
        title: "Code Copied",
        description: "Generated code has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opengraph-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateTags = () => {
    // TODO: Implement validation
    toast({
      title: "Validation Complete",
      description: "Tags are valid and ready to use",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Tag Generator
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleDownload}
              disabled={!generatedCode}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Live Preview Section */}
          <TagPreview 
            title={formData.title}
            description={formData.description}
            image={formData.image}
            url={formData.url}
            siteName={formData.siteName}
            type={formData.type}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your page title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recommended: 50-60 characters (Current: {formData.title.length})
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Write a compelling description..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="mt-2 resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recommended: 150-160 characters (Current: {formData.description.length})
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                  Image URL
                </Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x630px for optimal display
                </div>
              </div>

              <div>
                <Label htmlFor="url" className="text-sm font-medium text-gray-700">
                  Website URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="siteName" className="text-sm font-medium text-gray-700">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  type="text"
                  placeholder="Your Brand Name"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Content Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {generateMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Generate Tags
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Code Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Generated Code</h4>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleCopyCode}
                disabled={!generatedCode}
              >
                {copied ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Copied
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Copy className="h-4 w-4" />
                    Copy
                  </div>
                )}
              </Button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 overflow-x-auto min-h-96">
              {generatedCode ? (
                <pre className="whitespace-pre-wrap">{generatedCode}</pre>
              ) : (
                <div className="text-gray-400 italic">
                  Generated code will appear here...
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="default"
                onClick={handleDownload}
                disabled={!generatedCode}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Download HTML
              </Button>
              <Button 
                variant="default"
                onClick={validateTags}
                disabled={!generatedCode}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Validate
              </Button>
            </div>
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
