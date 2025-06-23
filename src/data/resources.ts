export type Resource = {
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  type: "Artikel" | "Video";
};

export const resources: Resource[] = [
  {
    title: "Memahami Kecemasan pada Remaja",
    url: "/resources/understanding-anxiety",
    description: "Artikel mendalam yang membahas penyebab umum dan gejala kecemasan di kalangan remaja serta cara mengatasinya.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "teenager thinking",
    type: "Artikel",
  },
  {
    title: "Meditasi Kesadaran untuk Pemula",
    url: "/resources/mindfulness-meditation",
    description: "Sesi video terpandu untuk memperkenalkan remaja pada praktik kesadaran untuk mengurangi stres dan kejernihan mental.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person meditating",
    type: "Video",
  },
  {
    title: "Pentingnya Tidur untuk Kesehatan Mental",
    url: "/resources/sleep-importance",
    description: "Pelajari hubungan penting antara kualitas tidur dan kesejahteraan mental bagi dewasa muda.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person sleeping",
    type: "Artikel",
  },
  {
    title: "Membangun Persahabatan Sehat",
    url: "/resources/healthy-friendships",
    description: "Panduan video tentang cara membina persahabatan yang suportif dan positif selama masa remaja.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "friends talking",
    type: "Video",
  },
  {
    title: "Mengatasi Stres Ujian",
    url: "/resources/exam-stress",
    description: "Kiat dan strategi praktis untuk mengelola stres dan kecemasan selama masa ujian.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "student studying",
    type: "Artikel",
  },
  {
    title: "Cara Berbicara dengan Orang Tua",
    url: "/resources/talk-to-parents",
    description: "Panduan tentang cara terbuka kepada orang tua mengenai masalah kesehatan mental Anda.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "family conversation",
    type: "Artikel",
  },
];

export const availableResourcesForAI = resources.map(
  ({ title, url, description }) => ({
    title,
    url,
    description,
  })
);
