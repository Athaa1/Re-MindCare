import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AiResourceTool from "@/components/forum/AiResourceTool";

const forumPosts = [
  {
    author: "Alex R.",
    avatar: "https://placehold.co/40x40.png",
    content: "Akhir-akhir ini merasa sangat tertekan dengan tugas sekolah. Sulit sekali menemukan motivasi bahkan untuk memulai. Ada yang merasa seperti ini juga?",
    timestamp: "2 jam yang lalu",
  },
  {
    author: "Jamie L.",
    avatar: "https://placehold.co/40x40.png",
    content: "Sesi dengan terapis hari ini menyenangkan! Kami bicara tentang menetapkan batasan dan rasanya beban jadi lebih ringan.",
    timestamp: "5 jam yang lalu",
  },
  {
    author: "Sam K.",
    avatar: "https://placehold.co/40x40.png",
    content: "Ada yang punya tips mengatasi kecemasan sosial? Akhir pekan ini ada pesta dan aku sudah cemas dari sekarang.",
    timestamp: "1 hari yang lalu",
  },
];


export default function ForumPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Forum Komunitas</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Ruang aman untuk berbagi pengalaman, bertanya, dan terhubung dengan teman sebaya yang memahami.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-headline">Postingan Terbaru</h2>
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
