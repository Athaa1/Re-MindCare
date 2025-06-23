import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resources } from "@/data/resources";

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Pusat Sumber Daya</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Jelajahi koleksi artikel, video, dan alat pilihan kami untuk mendukung perjalanan kesehatan mental Anda.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="relative">
              <Image
                src={resource.imageUrl}
                alt={resource.title}
                width={600}
                height={400}
                data-ai-hint={resource.imageHint}
                className="object-cover w-full h-48"
              />
              <Badge 
                className="absolute top-4 right-4"
                variant={resource.type === 'Video' ? 'default' : 'secondary'}
              >
                {resource.type}
              </Badge>
            </div>
            <CardHeader className="p-6">
              <CardTitle className="font-headline text-xl h-14">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-0">
              <p className="text-muted-foreground">{resource.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button asChild className="w-full font-semibold">
                <Link href={resource.url}>
                  {resource.type === 'Video' ? 'Tonton Sekarang' : 'Baca Selengkapnya'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
