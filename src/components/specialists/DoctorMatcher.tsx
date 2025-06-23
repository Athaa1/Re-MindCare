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
        title: "Input diperlukan",
        description: "Harap jelaskan apa yang sedang Anda alami untuk mendapatkan pasangan yang cocok.",
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
      setError("Maaf, kami tidak dapat menemukan yang cocok saat ini. Silakan coba lagi nanti.");
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Gagal mengambil rekomendasi AI.",
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
                <CardTitle className="font-headline text-3xl">Temukan Spesialis yang Tepat untuk Anda</CardTitle>
                <CardDescription className="text-lg">
                    Jelaskan apa yang Anda rasakan atau tantangan apa yang Anda hadapi. AI kami akan mencocokkan Anda dengan para profesional yang dapat membantu.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                <Textarea
                    placeholder="Contoh: 'Saya merasa cemas sepanjang waktu, terutama dalam situasi sosial. Saya sulit tidur dan tidak bisa fokus belajar...'"
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
                        Mencari Kecocokan Anda...
                    </>
                    ) : (
                    "Temukan Kecocokan Saya"
                    )}
                </Button>
                </CardFooter>
            </form>
        </Card>

        <div className="max-w-4xl mx-auto">
            {error && (
                <Alert variant="destructive" className="max-w-3xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Kesalahan</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {results && (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">Spesialis yang Direkomendasikan untuk Anda</h2>
                    <p className="text-muted-foreground mt-2">Berikut adalah beberapa profesional yang tampaknya cocok untuk Anda.</p>
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
                                <AlertTitle className="text-accent-foreground font-semibold">Mengapa mereka cocok:</AlertTitle>
                                <AlertDescription className="text-accent-foreground/90">
                                    {specialist.reason}
                                </AlertDescription>
                            </Alert>

                            <Button className="mt-4 w-full md:w-auto">
                                <MessageSquare />
                                Hubungi {specialist.name}
                            </Button>

                        </div>
                    </Card>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Kami tidak dapat menemukan kecocokan spesifik berdasarkan deskripsi Anda. Coba ulangi dengan kalimat lain atau jangan ragu untuk menelusuri halaman <Link href="/resources" className="underline text-primary">Sumber Daya</Link> kami.
                    </p>
                )}
            </div>
            )}
        </div>
    </div>
  );
}
