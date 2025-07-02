
'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resources, Resource } from "@/data/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const handleReadMore = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const closeDialog = () => {
    setSelectedResource(null);
  };

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
              {resource.type === 'Artikel' ? (
                <Button onClick={() => handleReadMore(resource)} className="w-full font-semibold">
                  Baca Selengkapnya
                </Button>
              ) : (
                <Button asChild className="w-full font-semibold">
                  <Link href={resource.url}>
                    Tonton Sekarang
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{selectedResource.title}</DialogTitle>
              <DialogDescription>
                {selectedResource.description}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-6">
              <div className="text-muted-foreground whitespace-pre-line py-4">
                {selectedResource.content}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
