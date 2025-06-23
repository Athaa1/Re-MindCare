export type Specialist = {
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  imageUrl: string;
  imageHint: string;
};

export const specialists: Specialist[] = [
  {
    name: "Dr. Anya Sharma",
    title: "Clinical Psychologist, PhD",
    specialties: ["Anxiety", "Depression", "Trauma", "CBT"],
    bio: "Dr. Sharma specializes in cognitive-behavioral therapy (CBT) for adolescents and young adults facing anxiety and depression.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "female psychologist portrait"
  },
  {
    name: "David Chen",
    title: "Licensed Clinical Social Worker (LCSW)",
    specialties: ["Stress Management", "Relationships", "Life Transitions", "Mindfulness"],
    bio: "David Chen focuses on mindfulness-based stress reduction and helps young people navigate relationship challenges and major life changes.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "male therapist portrait"
  },
  {
    name: "Dr. Emily Carter",
    title: "Adolescent Psychiatrist, MD",
    specialties: ["ADHD", "Mood Disorders", "Medication Management", "Behavioral Issues"],
    bio: "Dr. Carter is a psychiatrist with expertise in medication management and treatment for mood disorders and ADHD in teenagers.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "female psychiatrist portrait"
  },
  {
    name: "Samuel Jones",
    title: "Marriage and Family Therapist (MFT)",
    specialties: ["Family Conflict", "Communication", "School Issues", "Self-Esteem"],
    bio: "Samuel Jones works with teens and their families to improve communication, resolve conflicts, and build self-esteem.",
    imageUrl: "https://placehold.co/100x100.png",
    imageHint: "male counselor portrait"
  },
];
