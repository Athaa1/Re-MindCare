<?php
// Mood tracker endpoint using separate mood table
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once '../connect.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Insert or update user's mood for today
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['user_id']) || !isset($input['mood'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and mood are required']);
            exit;
        }
        
        $userId = (int)$input['user_id'];
        $mood = (int)$input['mood'];
        $today = date('Y-m-d');
        
        // Validate mood scale (1-5)
        if ($mood < 1 || $mood > 5) {
            http_response_code(400);
            echo json_encode(['error' => 'Mood must be between 1 and 5']);
            exit;
        }
        
        // Check if user exists
        $checkUserQuery = "SELECT id FROM user WHERE id = ?";
        $checkStmt = $conn->prepare($checkUserQuery);
        $checkStmt->bind_param('i', $userId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }
        
        // Check if mood already exists for today (get latest entry)
        $checkMoodQuery = "SELECT id, mood FROM mood WHERE user_id = ? AND date = ? ORDER BY id DESC LIMIT 1";
        $checkMoodStmt = $conn->prepare($checkMoodQuery);
        $checkMoodStmt->bind_param('is', $userId, $today);
        $checkMoodStmt->execute();
        $checkMoodResult = $checkMoodStmt->get_result();
        
        $isUpdate = $checkMoodResult->num_rows > 0;
        
        // Insert or update mood for today using ON DUPLICATE KEY UPDATE
        $upsertQuery = "INSERT INTO mood (user_id, mood, date) VALUES (?, ?, ?) 
                       ON DUPLICATE KEY UPDATE mood = VALUES(mood)";
        $stmt = $conn->prepare($upsertQuery);
        $stmt->bind_param('iis', $userId, $mood, $today);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => $isUpdate ? 'Mood berhasil diperbarui' : 'Mood berhasil disimpan',
                'mood' => $mood,
                'date' => $today,
                'action' => $isUpdate ? 'updated' : 'inserted'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save mood']);
        }
        
        $stmt->close();
        $checkStmt->close();
        $checkMoodStmt->close();
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user's mood data
        if (!isset($_GET['user_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            exit;
        }
        
        $userId = (int)$_GET['user_id'];
        
        // Get today's mood (latest entry for today)
        $todayQuery = "SELECT mood, date FROM mood WHERE user_id = ? AND date = CURDATE() ORDER BY id DESC LIMIT 1";
        $stmt = $conn->prepare($todayQuery);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $todayMood = null;
        $todayDate = null;
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $todayMood = (int)$row['mood'];
            $todayDate = $row['date'];
        }
        
        // Get recent mood history (last 30 days, latest entry per day)
        $historyQuery = "
            SELECT mood, date 
            FROM mood m1
            WHERE user_id = ? 
            AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND id = (
                SELECT MAX(id) 
                FROM mood m2 
                WHERE m2.user_id = m1.user_id 
                AND m2.date = m1.date
            )
            ORDER BY date DESC
        ";
        $historyStmt = $conn->prepare($historyQuery);
        $historyStmt->bind_param('i', $userId);
        $historyStmt->execute();
        $historyResult = $historyStmt->get_result();
        
        $moodHistory = [];
        while ($row = $historyResult->fetch_assoc()) {
            $moodHistory[] = [
                'mood' => (int)$row['mood'],
                'date' => $row['date']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'todayMood' => $todayMood,
            'todayDate' => $todayDate,
            'moodHistory' => $moodHistory
        ]);
        
        $stmt->close();
        $historyStmt->close();
        
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
    
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
