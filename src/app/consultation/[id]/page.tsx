
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { specialists, Specialist } from '@/data/specialists';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  sender: 'user' | 'doctor';
  text: string;
  timestamp: string;
};

export default function ConsultationPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const foundSpecialist = specialists.find((s) => s.id === id);
    if (foundSpecialist) {
      setSpecialist(foundSpecialist);
      setMessages([
        {
          sender: 'doctor',
          text: `Halo! Saya ${foundSpecialist.name}. Silakan ceritakan apa yang Anda rasakan. Saya di sini untuk mendengarkan.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate doctor's response
    setTimeout(() => {
        const doctorResponse: Message = {
            sender: 'doctor',
            text: 'Terima kasih telah berbagi. Saya memahami apa yang Anda rasakan. Bisakah Anda ceritakan lebih lanjut?',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, doctorResponse]);
    }, 1500);
  };

  if (!specialist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold">Spesialis tidak ditemukan</h1>
        <p className="text-muted-foreground">Spesialis yang Anda cari mungkin tidak ada.</p>
        <Button asChild className="mt-4">
          <Link href="/services">Kembali ke Pencarian</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 flex flex-col h-screen bg-background">
        <Card className="flex flex-col flex-1 w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/services"><ArrowLeft /></Link>
                </Button>
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={specialist.imageUrl} alt={specialist.name} data-ai-hint={specialist.imageHint} />
                    <AvatarFallback>{specialist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-lg font-bold">{specialist.name}</h1>
                    <p className="text-sm text-muted-foreground">{specialist.title}</p>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'doctor' && (
                                    <Avatar className="h-8 w-8 self-start">
                                        <AvatarImage src={specialist.imageUrl} alt={specialist.name} data-ai-hint={specialist.imageHint} />
                                        <AvatarFallback>{specialist.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl ${
                                    msg.sender === 'user' 
                                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                                    : 'bg-muted rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 text-right ${
                                        msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    }`}>{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                    <Textarea
                        placeholder="Ketik pesan Anda..."
                        className="flex-1 resize-none"
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <Button type="submit" size="icon" aria-label="Kirim Pesan">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    </div>
  );
}

