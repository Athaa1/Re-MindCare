"use client";

import { useState } from "react";
import Link from "next/link";
import { findSpecialist, FindSpecialistOutput } from "@/ai/flows/find-specialist-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Sparkles, UserCheck, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type RecommendedSpecialist = FindSpecialistOutput["recommendations"][0];

export default function DoctorMatcher() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendedSpecialist[] | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please describe what you're going through to get a match.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await findSpecialist({ complaint: text });
      setResults(result.recommendations);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't find a match at this time. Please try again later.");
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to fetch AI recommendations.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
        <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Find the Right Specialist for You</CardTitle>
                <CardDescription className="text-lg">
                    Describe what you're feeling or what challenges you're facing. Our AI will match you with professionals who can help.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                <Textarea
                    placeholder="For example: 'I feel anxious all the time, especially in social situations. I have trouble sleeping and can't focus on my studies...'"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    disabled={loading}
                    className="text-base"
                />
                </CardContent>
                <CardFooter>
                <Button type="submit" size="lg" className="w-full font-semibold" disabled={loading}>
                    {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Finding Your Match...
                    </>
                    ) : (
                    "Find My Match"
                    )}
                </Button>
                </CardFooter>
            </form>
        </Card>

        <div className="max-w-4xl mx-auto">
            {error && (
                <Alert variant="destructive" className="max-w-3xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {results && (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">Your Recommended Specialists</h2>
                    <p className="text-muted-foreground mt-2">Here are some professionals who seem like a great fit for you.</p>
                </div>
                {results.length > 0 ? (
                    results.map((specialist) => (
                    <Card key={specialist.name} className="flex flex-col md:flex-row items-start gap-6 p-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <Avatar className="w-24 h-24 border-4 border-primary/20">
                            <AvatarImage src={specialist.imageUrl} alt={specialist.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{specialist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-2xl font-headline">{specialist.name}</CardTitle>
                            <p className="text-muted-foreground font-medium">{specialist.title}</p>
                            <div className="flex flex-wrap gap-2 my-3">
                                {specialist.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                            </div>
                            <p className="text-muted-foreground mb-4">{specialist.bio}</p>
                            
                            <Alert className="bg-accent/50 border-accent">
                                <UserCheck className="h-5 w-5 text-accent-foreground" />
                                <AlertTitle className="text-accent-foreground font-semibold">Why they're a good match:</AlertTitle>
                                <AlertDescription className="text-accent-foreground/90">
                                    {specialist.reason}
                                </AlertDescription>
                            </Alert>

                            <Button className="mt-4 w-full md:w-auto">
                                <MessageSquare />
                                Contact {specialist.name}
                            </Button>

                        </div>
                    </Card>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        We couldn't find a specific match based on your description. Try rephrasing or feel free to browse our <Link href="/resources" className="underline text-primary">Resources</Link> page.
                    </p>
                )}
            </div>
            )}
        </div>
    </div>
  );
}
