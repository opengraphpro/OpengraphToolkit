import { useState } from "react";
import { generateTagsFromUrl } from "../action";
import { TagGenerationResult, TagGeneratorRequest } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function TagGenerator() {
  const [form, setForm] = useState<TagGeneratorRequest>({
    url: "",
    title: "",
    description: "",
    type: "website",
    image: "",
    siteName: ""
  });
  const [data, setData] = useState<TagGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!form.url || !form.title || !form.description || !form.type) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const result = await generateTagsFromUrl(form);
      setData(result);
    } catch (err: any) {
      setError("Failed to fetch tag data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (data?.generatedCode) {
      await navigator.clipboard.writeText(data.generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter URL"
        name="url"
        value={form.url}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Image URL (optional)"
        name="image"
        value={form.image}
        onChange={handleChange}
      />
      <Input
        placeholder="Site Name (optional)"
        name="siteName"
        value={form.siteName}
        onChange={handleChange}
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      >
        <option value="website">Website</option>
        <option value="article">Article</option>
        <option value="product">Product</option>
        <option value="video">Video</option>
      </select>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Tags"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}

      {data?.generatedCode && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated HTML:</h3>
            <Button onClick={handleCopy} variant="secondary">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="bg-gray-100 p-4 mt-2 rounded overflow-auto text-sm">
            {data.generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TagGenerator;