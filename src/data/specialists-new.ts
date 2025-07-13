// This file now serves as a type definition only
// Real doctor data is fetched from database via API

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
    const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/list.php');
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

// Fallback empty array - no more dummy data
export const specialists: Specialist[] = [];
