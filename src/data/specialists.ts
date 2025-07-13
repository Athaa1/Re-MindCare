export type Specialist = {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  imageUrl: string;
  imageHint: string;
};

// Database fetching function
export async function fetchSpecialistsFromDatabase(): Promise<Specialist[]> {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? '' // Client-side can use relative URLs
      : 'http://localhost:3000'; // Server-side needs full URL
    
    const response = await fetch(`${baseUrl}/api/doctors`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to fetch specialists:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return [];
  }
}

// No more dummy data - all data comes from database
export const specialists: Specialist[] = [];
