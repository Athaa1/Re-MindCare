
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import AiResourceTool from '@/components/forum/AiResourceTool';

type Resource = {
  id: number;
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  type: "Artikel" | "Video";
  content?: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/Re-MindCare/backendPHP/resource/resource.php?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResources(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        setError('Failed to load resources');
      }
    } catch (err) {
      setError('Error loading resources. Please try again.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchResources(newPage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchResources(pagination.page)}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }


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
          
          {resources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada sumber daya yang tersedia.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {resources.map((resource) => (
                  <Card key={resource.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="relative">
                      <Image
                        src={resource.imageUrl || 'https://placehold.co/600x400.png'}
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
              
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Halaman {pagination.page} dari {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    variant="outline"
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          )}
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
