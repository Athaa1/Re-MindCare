
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                   <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4"/>
                    AI-Powered Matching
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Feeling Lost? Find the Right Therapist for You.
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Describe what's on your mind, and our AI will connect you with qualified specialists who understand and can help. Your path to wellness starts with the right match.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="font-semibold text-lg px-8 py-6">
                    <Link href="/services">Find My Match Now</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex aspect-square w-full max-w-[600px] items-center justify-center overflow-hidden rounded-xl lg:order-last">
                 <Image
                  src="https://placehold.co/600x600.png"
                  width={600}
                  height={600}
                  alt="A supportive conversation"
                  data-ai-hint="supportive conversation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                  <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Getting support has never been easier. Our simple, confidential process connects you with the right help in three steps.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-3 md:gap-12 mt-12">
                  <div className="flex flex-col items-center text-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-full text-primary font-bold text-2xl w-16 h-16 flex items-center justify-center">1</div>
                      <h3 className="font-headline text-xl font-semibold">Describe Your Needs</h3>
                      <p className="text-muted-foreground">Share what you're going through in your own words. The more detail you provide, the better our AI can understand your situation.</p>
                  </div>
                   <div className="flex flex-col items-center text-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-full text-primary font-bold text-2xl w-16 h-16 flex items-center justify-center">2</div>
                      <h3 className="font-headline text-xl font-semibold">Get Your Matches</h3>
                      <p className="text-muted-foreground">Our AI analyzes your input and compares it against our network of vetted professionals to find the best fits for you.</p>
                  </div>
                   <div className="flex flex-col items-center text-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-full text-primary font-bold text-2xl w-16 h-16 flex items-center justify-center">3</div>
                      <h3 className="font-headline text-xl font-semibold">Connect & Heal</h3>
                      <p className="text-muted-foreground">Review your recommended specialists, learn why they were chosen for you, and take the next step on your wellness journey.</p>
                  </div>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
