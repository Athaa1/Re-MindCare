"use client";

import { useState } from "react";
import { analyzeForumContent, AnalyzeForumContentOutput } from "@/ai/flows/community-forum-analyzer";
import { availableResourcesForAI } from "@/data/resources";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type SuggestedResource = AnalyzeForumContentOutput["suggestedResources"][0];

export default function AiResourceTool() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedResource[] | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please write something before getting suggestions.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const result = await analyzeForumContent({
        forumContent: text,
        availableResources: availableResourcesForAI,
      });
      setSuggestions(result.suggestedResources);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't get suggestions at this time. Please try again later.");
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to fetch AI suggestions.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-full">
                <Lightbulb className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
                <CardTitle className="font-headline text-xl">AI Resource Suggestions</CardTitle>
                <CardDescription>Share your thoughts to get personalized resources.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="For example: 'I'm feeling anxious about my upcoming exams...'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            disabled={loading}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Get Suggestions"
            )}
          </Button>
        </CardFooter>
      </form>

      <div className="p-6 pt-0 space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {suggestions && (
          <div>
            <h3 className="mb-4 text-lg font-semibold font-headline">Here are some resources for you:</h3>
            <div className="space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <Card key={suggestion.title} className="bg-secondary/30">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center justify-between">
                        {suggestion.title}
                        <Button variant="ghost" size="icon" asChild>
                           <Link href={suggestion.url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                           </Link>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No specific resources found, but feel free to browse our <Link href="/resources" className="underline text-primary">Resources</Link> page.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
