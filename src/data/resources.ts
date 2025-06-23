export type Resource = {
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  type: "Article" | "Video";
};

export const resources: Resource[] = [
  {
    title: "Understanding Anxiety in Teens",
    url: "/resources/understanding-anxiety",
    description: "An in-depth article exploring the common causes and symptoms of anxiety among adolescents and how to cope.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "teenager thinking",
    type: "Article",
  },
  {
    title: "Mindfulness Meditation for Beginners",
    url: "/resources/mindfulness-meditation",
    description: "A guided video session to introduce teens to mindfulness practices for stress reduction and mental clarity.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person meditating",
    type: "Video",
  },
  {
    title: "The Importance of Sleep for Mental Health",
    url: "/resources/sleep-importance",
    description: "Learn about the crucial link between sleep quality and mental well-being for young adults.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person sleeping",
    type: "Article",
  },
  {
    title: "Building Healthy Friendships",
    url: "/resources/healthy-friendships",
    description: "A video guide on how to foster supportive and positive friendships during your teenage years.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "friends talking",
    type: "Video",
  },
  {
    title: "Coping with Exam Stress",
    url: "/resources/exam-stress",
    description: "Practical tips and strategies to manage stress and anxiety during exam periods.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "student studying",
    type: "Article",
  },
  {
    title: "How to Talk to Your Parents",
    url: "/resources/talk-to-parents",
    description: "Guidance on how to open up to your parents about your mental health struggles.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "family conversation",
    type: "Article",
  },
];

export const availableResourcesForAI = resources.map(
  ({ title, url, description }) => ({
    title,
    url,
    description,
  })
);
