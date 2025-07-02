
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send } from 'lucide-react';

type Reply = {
  author: string;
  avatar: string;
  avatarHint: string;
  content: string;
  timestamp: string;
};

type Post = {
  id: number;
  author: string;
  avatar: string;
  avatarHint: string;
  content: string;
  timestamp: string;
  replies: Reply[];
};


const initialForumPosts: Post[] = [
  {
    id: 1,
    author: "Alex R.",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "person portrait",
    content: "Akhir-akhir ini merasa sangat tertekan dengan tugas sekolah. Sulit sekali menemukan motivasi bahkan untuk memulai. Ada yang merasa seperti ini juga?",
    timestamp: "2 jam yang lalu",
    replies: [
      {
        author: "Jamie L.",
        avatar: "https://placehold.co/40x40.png",
        avatarHint: "person portrait",
        content: "Aku juga sering merasa begitu, Alex. Kamu tidak sendirian. Biasanya aku mencoba istirahat sebentar, dengerin musik, baru mulai lagi.",
        timestamp: "1 jam yang lalu"
      },
      {
        author: "Dr. Anya Sharma",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "female psychologist portrait",
        content: "Perasaan itu sangat valid, Alex. Memecah tugas menjadi langkah-langkah yang lebih kecil seringkali bisa membantu mengurangi rasa kewalahan. Jika perasaan ini berlanjut, jangan ragu untuk mencari dukungan lebih lanjut.",
        timestamp: "45 menit yang lalu"
      }
    ]
  },
  {
    id: 2,
    author: "Sam K.",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "person portrait",
    content: "Ada yang punya tips mengatasi kecemasan sosial? Akhir pekan ini ada pesta dan aku sudah cemas dari sekarang.",
    timestamp: "1 hari yang lalu",
    replies: []
  },
];


export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>(initialForumPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<{[key: number]: string}>({});

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: "Pengguna Saat Ini", // Replace with actual user data in a real app
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "person portrait",
      content: newPostContent,
      timestamp: "Baru saja",
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleReplySubmit = (postId: number) => {
    const replyContent = replyInputs[postId];
    if (!replyContent || !replyContent.trim()) return;

    const newReply: Reply = {
      author: "Pengguna Saat Ini", // Replace with actual user data
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "person portrait",
      content: replyContent,
      timestamp: "Baru saja",
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, newReply] }
        : post
    ));

    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Forum Komunitas</h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Ruang aman untuk berbagi pengalaman, bertanya, dan terhubung dengan teman sebaya yang memahami.
          </p>
        </div>

        {/* Create Post Card */}
        <Card className="mb-8 shadow-md">
          <CardHeader>
            <p className="font-headline text-xl">Bagikan Pengalaman Anda</p>
          </CardHeader>
          <form onSubmit={handlePostSubmit}>
            <CardContent>
              <Textarea 
                placeholder="Apa yang ada di pikiran Anda?"
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Kirim
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Posts List */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold font-headline">Diskusi Terbaru</h2>
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
                <Avatar>
                  <AvatarImage src={post.avatar} alt={post.author} data-ai-hint={post.avatarHint} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              
              {/* Replies Section */}
              {post.replies.length > 0 && (
                <div className="px-6 pb-6 space-y-4">
                  <Separator />
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Balasan ({post.replies.length})
                  </h3>
                  <div className="space-y-4">
                    {post.replies.map((reply, index) => (
                      <div key={index} className="flex items-start gap-3 pl-4 border-l-2 ml-2">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={reply.avatar} alt={reply.author} data-ai-hint={reply.avatarHint}/>
                          <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">{reply.author}</p>
                            <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                          </div>
                          <p className="text-sm mt-1">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <CardFooter className="p-4 bg-muted/30">
                <div className="flex w-full items-start gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Current User" data-ai-hint="person portrait" />
                        <AvatarFallback>KU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Tulis balasan Anda..."
                        rows={1}
                        className="bg-background resize-none"
                        value={replyInputs[post.id] || ''}
                        onChange={(e) => setReplyInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit(post.id);
                            }
                        }}
                      />
                      <div className="flex justify-end mt-2">
                          <Button size="sm" onClick={() => handleReplySubmit(post.id)}>
                              Balas
                          </Button>
                      </div>
                    </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
