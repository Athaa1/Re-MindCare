import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AiResourceTool from "@/components/forum/AiResourceTool";

const forumPosts = [
  {
    author: "Alex R.",
    avatar: "https://placehold.co/40x40.png",
    content: "Feeling really overwhelmed with school lately. It's hard to find the motivation to even start my assignments. Anyone else feel this way?",
    timestamp: "2 hours ago",
  },
  {
    author: "Jamie L.",
    avatar: "https://placehold.co/40x40.png",
    content: "I had a great session with my therapist today! We talked about setting boundaries and it already feels like a weight has been lifted.",
    timestamp: "5 hours ago",
  },
  {
    author: "Sam K.",
    avatar: "https://placehold.co/40x40.png",
    content: "Does anyone have tips for dealing with social anxiety? I have a party this weekend and I'm already nervous about it.",
    timestamp: "1 day ago",
  },
];


export default function ForumPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Community Forum</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A safe space to share experiences, ask questions, and connect with peers who understand.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-headline">Recent Posts</h2>
            {forumPosts.map((post) => (
              <Card key={post.author}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} data-ai-hint="person portrait" />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
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
    </div>
  );
}
