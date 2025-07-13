
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    
    fetchPosts();
  }, []);

  const fetchPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/Re-MindCare/backendPHP/Forum/forum.php?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
        setPagination(data.pagination);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load forum posts',
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load forum posts. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please login to create a post',
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost/Re-MindCare/backendPHP/Forum/forum.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_post',
          author: currentUser.name,
          avatar: 'https://placehold.co/40x40.png',
          avatarHint: 'person portrait',
          content: newPostContent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewPostContent('');
        toast({
          title: 'Success',
          description: 'Post created successfully!',
        });
        // Refresh posts to show the new post
        fetchPosts(1);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to create post',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create post. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (postId: number) => {
    const replyContent = replyInputs[postId];
    if (!replyContent || !replyContent.trim()) return;

    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please login to reply',
      });
      return;
    }

    setReplyingTo(postId);
    
    try {
      const response = await fetch('http://localhost/Re-MindCare/backendPHP/Forum/forum.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_reply',
          forum_id: postId,
          author: currentUser.name,
          avatar: 'https://placehold.co/40x40.png',
          avatarHint: 'person portrait',
          content: replyContent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReplyInputs(prev => ({ ...prev, [postId]: '' }));
        toast({
          title: 'Success',
          description: 'Reply posted successfully!',
        });
        // Refresh posts to show the new reply
        fetchPosts(pagination.page);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to post reply',
        });
      }
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
      });
    } finally {
      setReplyingTo(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays < 7) return `${diffDays} hari yang lalu`;
      
      return date.toLocaleDateString('id-ID');
    } catch {
      return timestamp;
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

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
        {currentUser ? (
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
                  disabled={submitting}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={submitting || !newPostContent.trim()}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Kirim
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="mb-8 shadow-md">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Silakan login untuk membuat post dan berpartisipasi dalam diskusi
              </p>
              <Button onClick={() => window.location.href = '/login'}>
                Login
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-headline">Diskusi Terbaru</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchPosts(pagination.page)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                Belum ada diskusi. Jadilah yang pertama memulai percakapan!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} data-ai-hint={post.avatarHint} />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
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
                              <p className="text-xs text-muted-foreground">{formatTimestamp(reply.timestamp)}</p>
                            </div>
                            <p className="text-sm mt-1">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {currentUser ? (
                  <CardFooter className="p-4 bg-muted/30">
                    <div className="flex w-full items-start gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt={currentUser.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
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
                            disabled={replyingTo === post.id}
                          />
                          <div className="flex justify-end mt-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleReplySubmit(post.id)}
                                disabled={replyingTo === post.id || !replyInputs[post.id]?.trim()}
                              >
                                {replyingTo === post.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    Mengirim...
                                  </>
                                ) : (
                                  'Balas'
                                )}
                              </Button>
                          </div>
                        </div>
                    </div>
                  </CardFooter>
                ) : (
                  <CardFooter className="p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground text-center w-full">
                      <a href="/login" className="text-primary hover:underline">Login</a> untuk membalas diskusi ini
                    </p>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || loading}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || loading}
              variant="outline"
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
