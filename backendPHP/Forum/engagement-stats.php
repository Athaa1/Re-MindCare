<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../connect.php';

// Check if PDO connection exists
if (!isset($pdo)) {
    echo json_encode(['success' => false, 'error' => 'PDO connection not found']);
    exit;
}

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Only GET method allowed']);
    exit;
}

try {
    // Get user_id from query parameter
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$user_id) {
        // Return default stats if no user_id provided
        echo json_encode([
            'success' => true,
            'post_count' => 0,
            'reply_count' => 0,
            'total_engagement' => 0
        ]);
        exit;
    }

    // Get user name to match against forum.author and forum_reply.author
    $userQuery = "SELECT name FROM user WHERE id = ?";
    $userStmt = $pdo->prepare($userQuery);
    $userStmt->execute([$user_id]);
    $userResult = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$userResult) {
        // User not found, return zero stats
        echo json_encode([
            'success' => true,
            'post_count' => 0,
            'reply_count' => 0,
            'total_engagement' => 0
        ]);
        exit;
    }
    
    $userName = $userResult['name'];
    $post_count = 0;
    $reply_count = 0;

    // Get post count (check if forum table exists)
    try {
        $post_query = "SELECT COUNT(*) as post_count FROM forum WHERE author = ?";
        $stmt = $pdo->prepare($post_query);
        $stmt->execute([$userName]);
        $post_result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($post_result) {
            $post_count = (int)$post_result['post_count'];
        }
    } catch (PDOException $e) {
        // Table might not exist, keep post_count as 0
        error_log('Forum table not found: ' . $e->getMessage());
    }

    // Get reply count (check if forum_reply table exists)
    try {
        $reply_query = "SELECT COUNT(*) as reply_count FROM forum_reply WHERE author = ?";
        $stmt = $pdo->prepare($reply_query);
        $stmt->execute([$userName]);
        $reply_result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($reply_result) {
            $reply_count = (int)$reply_result['reply_count'];
        }
    } catch (PDOException $e) {
        // Table might not exist, keep reply_count as 0
        error_log('Forum_reply table not found: ' . $e->getMessage());
    }

    $total_engagement = $post_count + $reply_count;

    echo json_encode([
        'success' => true,
        'post_count' => $post_count,
        'reply_count' => $reply_count,
        'total_engagement' => $total_engagement
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>