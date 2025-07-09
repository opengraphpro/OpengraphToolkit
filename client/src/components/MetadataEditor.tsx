import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MetadataEditorProps {
  initialTitle: string;
  initialDescription: string;
  initialImage: string;
  url: string;
  onGenerated: (result: string) => void;
}

export default function MetadataEditor({
  initialTitle,
  initialDescription,
  initialImage,
  url,
  onGenerated,
}: MetadataEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, image, url }),
      });

      const { tags } = await response.json();
      onGenerated(tags); // HTML string
    } catch (err) {
      console.error("Failed to generate tags", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Edit Metadata</h3>

      <div className="space-y-2">
        <label className="block font-medium">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Image URL</label>
        <Input value={image} onChange={(e) => setImage(e.target.value)} />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Generate Tags"}
      </Button>
    </div>
  );
}
