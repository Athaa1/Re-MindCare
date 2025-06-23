import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Smile, User, UserPlus, Users, Video } from "lucide-react";

const services = [
  {
    icon: User,
    title: "Individual Therapy",
    description: "Confidential one-on-one sessions with a licensed therapist to address personal challenges and goals.",
  },
  {
    icon: Users,
    title: "Couples Counseling",
    description: "Support for improving communication and resolving conflicts within a relationship, guided by a professional.",
  },
  {
    icon: Home,
    title: "Family Sessions",
    description: "Therapy involving family members to improve dynamics, communication, and resolve family-wide issues.",
  },
  {
    icon: UserPlus,
    title: "Group Therapy",
    description: "A supportive environment to share experiences and learn from others facing similar challenges.",
  },
  {
    icon: Smile,
    title: "Teen & Adolescent Counseling",
    description: "Specialized therapy to help young individuals navigate the unique challenges of adolescence.",
  },
  {
    icon: Video,
    title: "Online Workshops",
    description: "Interactive workshops on various mental health topics, such as stress management and mindfulness.",
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Our Mental Health Services</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          We offer a variety of services to support your mental wellness journey. Find the right fit for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="items-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <service.icon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
