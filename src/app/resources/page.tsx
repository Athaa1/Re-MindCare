
'use client';

import { useState } from 'react';
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resources, Resource } from "@/data/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import AiResourceTool from '@/components/forum/AiResourceTool';

export default function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Pusat Sumber Daya</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Jelajahi koleksi artikel dan video pilihan kami. Butuh saran yang dipersonalisasi? Gunakan alat AI kami untuk menemukan sumber daya yang tepat untuk Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                  <Button onClick={() => setSelectedResource(resource)} className="w-full font-semibold">
                    {resource.type === 'Artikel' ? 'Baca Selengkapnya' : 'Tonton Sekarang'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <AiResourceTool />
          </div>
        </aside>
      </div>


      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{selectedResource.title}</DialogTitle>
              <DialogDescription>
                {selectedResource.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedResource.type === 'Artikel' ? (
                <ScrollArea className="max-h-[60vh] pr-6">
                  <div className="text-muted-foreground whitespace-pre-line">
                    {selectedResource.content}
                  </div>
                </ScrollArea>
              ) : (
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedResource.url}
                    title={selectedResource.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
