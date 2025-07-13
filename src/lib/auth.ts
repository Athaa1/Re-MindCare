// Helper functions for user session management
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try different storage keys
    const storageKeys = ['currentUser', 'userSession', 'user'];
    
    for (const key of storageKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.id || parsed.user_id || parsed.userId) {
          return {
            id: parsed.id || parsed.user_id || parsed.userId,
            name: parsed.name || parsed.username,
            email: parsed.email,
            ...parsed
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error reading user session:', error);
    return null;
  }
}

export function getCurrentUserId(): number {
  const user = getCurrentUser();
  return user?.id || 1; // Default to user ID 1 if no session
}

export function setCurrentUser(user: any) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return;
  
  const keys = ['currentUser', 'userSession', 'user'];
  keys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  });
}
