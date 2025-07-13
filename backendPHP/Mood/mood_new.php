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
        
        // Insert or update mood for today using ON DUPLICATE KEY UPDATE
        $upsertQuery = "INSERT INTO mood (user_id, mood, date) VALUES (?, ?, ?) 
                       ON DUPLICATE KEY UPDATE mood = VALUES(mood)";
        $stmt = $conn->prepare($upsertQuery);
        $stmt->bind_param('iis', $userId, $mood, $today);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Mood berhasil disimpan',
                'mood' => $mood,
                'date' => $today
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save mood']);
        }
        
        $stmt->close();
        $checkStmt->close();
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user's mood data
        if (!isset($_GET['user_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            exit;
        }
        
        $userId = (int)$_GET['user_id'];
        
        // Get today's mood
        $todayQuery = "SELECT mood, date FROM mood WHERE user_id = ? AND date = CURDATE()";
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
        
        // Get recent mood history (last 7 days)
        $historyQuery = "SELECT mood, date FROM mood WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) ORDER BY date DESC";
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
