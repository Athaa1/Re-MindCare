<?php
// Simple mood tracker endpoint
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
        // Update user's mood
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['user_id']) || !isset($input['mood'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and mood are required']);
            exit;
        }
        
        $userId = (int)$input['user_id'];
        $mood = (int)$input['mood'];
        
        // Validate mood scale (1-5)
        if ($mood < 1 || $mood > 5) {
            http_response_code(400);
            echo json_encode(['error' => 'Mood must be between 1 and 5']);
            exit;
        }
        
        // Update user mood and mood_date
        $updateQuery = "UPDATE user SET mood = ?, mood_date = CURDATE() WHERE id = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param('ii', $mood, $userId);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Mood berhasil disimpan',
                'mood' => $mood,
                'mood_date' => date('Y-m-d')
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save mood']);
        }
        
        $stmt->close();
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user's current mood
        if (!isset($_GET['user_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            exit;
        }
        
        $userId = (int)$_GET['user_id'];
        
        $query = "SELECT mood, mood_date FROM user WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode([
                'success' => true,
                'mood' => $row['mood'] ? (int)$row['mood'] : null,
                'mood_date' => $row['mood_date']
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        
        $stmt->close();
    }
    
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
