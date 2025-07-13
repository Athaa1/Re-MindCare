"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moodEmojis = {
  1: "😢",
  2: "😕", 
  3: "😐",
  4: "😊",
  5: "😄"
};

const moodLabels = {
  1: "Sangat Buruk",
  2: "Buruk",
  3: "Biasa",
  4: "Baik", 
  5: "Sangat Baik"
};

export default function MoodTracker({ onMoodUpdated }: { onMoodUpdated?: () => void }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [moodDate, setMoodDate] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      fetchCurrentMood(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentMood = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost/Re-MindCare/backendPHP/Mood/mood.php?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setCurrentMood(data.todayMood);
        setMoodDate(data.todayDate);
        setSelectedMood(data.todayMood);
        setMoodHistory(data.moodHistory || []);
      }
    } catch (error) {
      console.error('Error fetching mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (dateString: string | null) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const handleSaveMood = async () => {
    if (!selectedMood || !currentUser) return;

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost/Re-MindCare/backendPHP/Mood/mood.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          mood: selectedMood,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentMood(selectedMood);
        setMoodDate(data.date);
        toast({
          title: 'Berhasil!',
          description: data.message || 'Mood Anda telah tersimpan',
        });
        // Refresh data after save
        fetchCurrentMood(currentUser.id);
        // Call the callback to refresh chart data
        if (onMoodUpdated) {
          onMoodUpdated();
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Gagal menyimpan mood',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan mood. Silakan coba lagi.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentMood && (
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Mood saat ini:</p>
            <p className="text-2xl">{moodEmojis[currentMood as keyof typeof moodEmojis]}</p>
            <p className="text-sm font-medium">{moodLabels[currentMood as keyof typeof moodLabels]}</p>
            {moodDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Disimpan pada: {new Date(moodDate).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
        )}

        {moodHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Riwayat Mood (7 hari terakhir):</p>
            <div className="flex gap-1 justify-center">
              {moodHistory.slice(0, 7).map((entry, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {new Date(entry.date).toLocaleDateString('id-ID', { 
                      weekday: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm">{moodEmojis[entry.mood as keyof typeof moodEmojis]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-3">Bagaimana perasaan Anda hari ini?</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => setSelectedMood(mood)}
                disabled={submitting}
              >
                <span className="text-lg">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                <span className="text-xs">{mood}</span>
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSaveMood} 
          className="w-full" 
          disabled={submitting || !selectedMood}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            isToday(moodDate) ? "Perbarui Mood" : "Simpan Mood"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
