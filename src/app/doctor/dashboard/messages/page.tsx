
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const conversations = [
  {
    id: "alex-r",
    name: "Alex R.",
    lastMessage: "Terima kasih, Dok. Saya akan mencoba untuk mengingat itu.",
    timestamp: "10 menit yang lalu",
    unread: 2,
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "person portrait"
  },
  {
    id: "jamie-l",
    name: "Jamie L.",
    lastMessage: "Sesi terakhir sangat membantu. Kapan kita bisa...",
    timestamp: "1 jam yang lalu",
    unread: 0,
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "person portrait"
  },
  {
    id: "sam-k",
    name: "Sam K.",
    lastMessage: "Saya punya pertanyaan tentang kecemasan sosial.",
    timestamp: "3 jam yang lalu",
    unread: 1,
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "person portrait"
  },
  {
    id: "casey-b",
    name: "Casey B.",
    lastMessage: "Oke, saya mengerti.",
    timestamp: "1 hari yang lalu",
    unread: 0,
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "person portrait"
  },
   {
    id: "jordan-p",
    name: "Jordan P.",
    lastMessage: "Saya merasa lebih baik hari ini.",
    timestamp: "3 hari yang lalu",
    unread: 0,
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "person portrait"
  },
];


export default function MessagesListPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
        <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Pesan</h1>
            <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari percakapan..." className="pl-8" />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            <div className="space-y-0">
                {conversations.map((convo) => (
                    <Link key={convo.id} href={`/doctor/dashboard/messages/${convo.id}`} className="block">
                        <Card className="rounded-none border-x-0 border-t-0 hover:bg-accent transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={convo.avatarUrl} alt={convo.name} data-ai-hint={convo.avatarHint} />
                                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{convo.name}</p>
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">{convo.timestamp}</p>
                                    </div>
                                    <div className="flex justify-between items-start mt-1">
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                        {convo.unread > 0 && (
                                            <Badge className="h-6 w-6 flex items-center justify-center p-0 shrink-0">{convo.unread}</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
}
