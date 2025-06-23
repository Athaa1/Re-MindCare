import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HeartPulse, Users, BookOpen, ShieldCheck, MessageCircle, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Your Path to Mental Wellness Starts Here
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Re-MindCare offers accessible and compassionate e-Healthcare for adolescent mental health. We're here to support you on your journey to a healthier mind.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="font-semibold">
                    <Link href="/services">Explore Services</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x600.png"
                width="600"
                height="600"
                alt="Hero"
                data-ai-hint="wellness meditation"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground">Our Services</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A new way to find support</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide a range of services tailored to meet the unique needs of adolescents. Our platform connects you with professionals in a safe and confidential environment.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="items-center gap-4 p-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <HeartPulse className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Counseling</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-center">
                  <p>One-on-one sessions with licensed therapists to discuss your thoughts and feelings.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="items-center gap-4 p-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Community Support</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-center">
                  <p>Join our community forum to connect with peers who share similar experiences.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="items-center gap-4 p-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Resource Hub</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-center">
                  <p>Access a curated library of articles, videos, and tools for mental wellness.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Why Choose Re-MindCare?</h2>
              <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is built on trust, confidentiality, and a commitment to your well-being.
              </p>
            </div>
            <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center space-y-2 p-4">
                  <ShieldCheck className="w-12 h-12 text-primary"/>
                  <h3 className="text-lg font-bold font-headline">Secure & Confidential</h3>
                  <p className="text-sm text-muted-foreground">Your privacy is our top priority. All communications are encrypted.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4">
                  <MessageCircle className="w-12 h-12 text-primary"/>
                  <h3 className="text-lg font-bold font-headline">Expert Professionals</h3>
                  <p className="text-sm text-muted-foreground">Access to a network of vetted and experienced mental health professionals.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4">
                  <BrainCircuit className="w-12 h-12 text-primary"/>
                  <h3 className="text-lg font-bold font-headline">AI-Powered Tools</h3>
                  <p className="text-sm text-muted-foreground">Smart resource suggestions to guide you to the most relevant help.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
