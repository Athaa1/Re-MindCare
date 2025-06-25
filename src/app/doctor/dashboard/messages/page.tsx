
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Data dummy untuk dokter dan pasien
const doctor = {
    name: 'Dr. Anya Sharma',
    imageUrl: 'https://placehold.co/100x100.png',
    imageHint: 'female psychologist portrait',
};

const patient = {
    name: 'Alex R.',
    imageUrl: 'https://placehold.co/40x40.png',
    imageHint: 'person portrait',
};

type Message = {
  sender: 'user' | 'doctor';
  text: string;
  timestamp: string;
};

// Data dummy untuk percakapan
const initialMessages: Message[] = [
  {
    sender: 'user',
    text: 'Halo, Dok. Akhir-akhir ini saya merasa sangat cemas dengan sekolah dan sulit untuk fokus pada tugas-tugas saya. Rasanya kewalahan.',
    timestamp: "09:01",
  },
  {
      sender: 'doctor',
      text: 'Halo Alex. Terima kasih sudah berbagi. Saya mengerti perasaan kewalahan itu bisa sangat mengganggu. Bisa ceritakan lebih lanjut apa yang membuat Anda merasa cemas terkait sekolah?',
      timestamp: "09:02"
  },
  {
    sender: 'user',
    text: 'Tumpukan tugas, ujian yang akan datang, dan ekspektasi dari orang tua saya. Rasanya semua menumpuk jadi satu.',
    timestamp: "09:05",
  }
];

export default function DoctorMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll ke bawah saat pesan baru ditambahkan
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const doctorMessage: Message = {
      sender: 'doctor',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, doctorMessage]);
    setNewMessage('');
    
    // Simulasi respons pasien
    setTimeout(() => {
        const userResponse: Message = {
            sender: 'user',
            text: 'Terima kasih, Dok. Saya akan mencoba untuk mengingat itu.',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, userResponse]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
        <Card className="flex flex-col flex-1 w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={patient.imageUrl} alt={patient.name} data-ai-hint={patient.imageHint} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-lg font-bold">{patient.name}</h1>
                    <p className="text-sm text-muted-foreground">Konsultasi mengenai Kecemasan Sekolah</p>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-end gap-2 ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'user' && (
                                    <Avatar className="h-8 w-8 self-start">
                                        <AvatarImage src={patient.imageUrl} alt={patient.name} data-ai-hint={patient.imageHint} />
                                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl ${
                                    msg.sender === 'doctor' 
                                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                                    : 'bg-muted rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 text-right ${
                                        msg.sender === 'doctor' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    }`}>{msg.timestamp}</p>
                                </div>
                                {msg.sender === 'doctor' && (
                                    <Avatar className="h-8 w-8 self-start">
                                        <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                    <Textarea
                        placeholder="Ketik balasan Anda..."
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
