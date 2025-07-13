<?php
// Turn off error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(0);

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
require_once '../connect.php';

try {
    // Check if request method is GET
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }

    // Get all patients with their mood statistics
    $patientsQuery = "
        SELECT 
            u.id,
            u.name,
            u.email,
            u.created_at,
            COUNT(m.id) as total_mood_entries,
            MAX(m.mood) as last_mood,
            MAX(m.date) as last_mood_date
        FROM user u 
        LEFT JOIN mood m ON u.id = m.user_id
        WHERE u.is_doctor = 0
        GROUP BY u.id, u.name, u.email, u.created_at
        ORDER BY u.created_at DESC
    ";
    
    $result = $conn->query($patientsQuery);
    
    if (!$result) {
        throw new Exception('Database query failed: ' . $conn->error);
    }
    
    $patients = [];
    while ($row = $result->fetch_assoc()) {
        // Get the actual latest mood for this user (not just MAX which might not be the latest date)
        if ($row['total_mood_entries'] > 0) {
            $latestMoodQuery = "
                SELECT mood, date 
                FROM mood 
                WHERE user_id = ? 
                ORDER BY date DESC, id DESC 
                LIMIT 1
            ";
            $stmt = $conn->prepare($latestMoodQuery);
            $stmt->bind_param('i', $row['id']);
            $stmt->execute();
            $moodResult = $stmt->get_result();
            
            if ($moodRow = $moodResult->fetch_assoc()) {
                $row['last_mood'] = (int)$moodRow['mood'];
                $row['last_mood_date'] = $moodRow['date'];
            }
            $stmt->close();
        }
        
        $patients[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'created_at' => $row['created_at'],
            'total_mood_entries' => (int)$row['total_mood_entries'],
            'last_mood' => $row['last_mood'] ? (int)$row['last_mood'] : null,
            'last_mood_date' => $row['last_mood_date']
        ];
    }

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'patients' => $patients,
        'total_count' => count($patients)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
