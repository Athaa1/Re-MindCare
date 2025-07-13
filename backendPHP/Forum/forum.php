<?php
// Turn off error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(0);

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
try {
    require_once '../connect.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all forum posts with their replies
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        // Validate page and limit
        if ($page < 1) $page = 1;
        if ($limit < 1 || $limit > 50) $limit = 10;
        
        $offset = ($page - 1) * $limit;
        
        // Get forum posts
        $postsQuery = "SELECT id, author, avatar, avatar_hint, content, timestamp 
                       FROM forum 
                       ORDER BY id DESC 
                       LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($postsQuery);
        $stmt->bind_param('ii', $limit, $offset);
        $stmt->execute();
        $postsResult = $stmt->get_result();
        
        $posts = [];
        while ($post = $postsResult->fetch_assoc()) {
            // Get replies for each post
            $repliesQuery = "SELECT author, avatar, avatar_hint, content, timestamp 
                            FROM forum_reply 
                            WHERE forum_id = ? 
                            ORDER BY id ASC";
            $replyStmt = $conn->prepare($repliesQuery);
            $replyStmt->bind_param('i', $post['id']);
            $replyStmt->execute();
            $repliesResult = $replyStmt->get_result();
            
            $replies = [];
            while ($reply = $repliesResult->fetch_assoc()) {
                $replies[] = [
                    'author' => $reply['author'],
                    'avatar' => $reply['avatar'] ?: 'https://placehold.co/40x40.png',
                    'avatarHint' => $reply['avatar_hint'] ?: 'person portrait',
                    'content' => $reply['content'],
                    'timestamp' => $reply['timestamp']
                ];
            }
            
            $posts[] = [
                'id' => (int)$post['id'],
                'author' => $post['author'],
                'avatar' => $post['avatar'] ?: 'https://placehold.co/40x40.png',
                'avatarHint' => $post['avatar_hint'] ?: 'person portrait',
                'content' => $post['content'],
                'timestamp' => $post['timestamp'],
                'replies' => $replies
            ];
            
            $replyStmt->close();
        }
        
        // Get total count for pagination
        $countQuery = "SELECT COUNT(*) as total FROM forum";
        $countResult = $conn->query($countQuery);
        $totalCount = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($totalCount / $limit);
        
        echo json_encode([
            'success' => true,
            'data' => $posts,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$totalCount,
                'totalPages' => $totalPages,
                'hasNext' => $page < $totalPages,
                'hasPrev' => $page > 1
            ]
        ]);
        
        $stmt->close();
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new post or reply
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['action'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Action is required']);
            exit;
        }
        
        if ($input['action'] === 'create_post') {
            // Create new forum post
            if (!isset($input['content']) || empty(trim($input['content']))) {
                http_response_code(400);
                echo json_encode(['error' => 'Content is required']);
                exit;
            }
            
            $author = $input['author'] ?? 'Anonymous';
            $avatar = $input['avatar'] ?? 'https://placehold.co/40x40.png';
            $avatarHint = $input['avatarHint'] ?? 'person portrait';
            $content = trim($input['content']);
            $timestamp = date('Y-m-d H:i:s');
            
            $insertQuery = "INSERT INTO forum (author, avatar, avatar_hint, content, timestamp) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            $stmt->bind_param('sssss', $author, $avatar, $avatarHint, $content, $timestamp);
            
            if ($stmt->execute()) {
                $postId = $conn->insert_id;
                echo json_encode([
                    'success' => true,
                    'message' => 'Post created successfully',
                    'post' => [
                        'id' => $postId,
                        'author' => $author,
                        'avatar' => $avatar,
                        'avatarHint' => $avatarHint,
                        'content' => $content,
                        'timestamp' => $timestamp,
                        'replies' => []
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create post']);
            }
            
            $stmt->close();
            
        } elseif ($input['action'] === 'create_reply') {
            // Create new reply
            if (!isset($input['forum_id']) || !isset($input['content']) || empty(trim($input['content']))) {
                http_response_code(400);
                echo json_encode(['error' => 'Forum ID and content are required']);
                exit;
            }
            
            $forumId = (int)$input['forum_id'];
            $author = $input['author'] ?? 'Anonymous';
            $avatar = $input['avatar'] ?? 'https://placehold.co/40x40.png';
            $avatarHint = $input['avatarHint'] ?? 'person portrait';
            $content = trim($input['content']);
            $timestamp = date('Y-m-d H:i:s');
            
            // Check if forum post exists
            $checkQuery = "SELECT id FROM forum WHERE id = ?";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->bind_param('i', $forumId);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Forum post not found']);
                exit;
            }
            
            $insertQuery = "INSERT INTO forum_reply (forum_id, author, avatar, avatar_hint, content, timestamp) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            $stmt->bind_param('isssss', $forumId, $author, $avatar, $avatarHint, $content, $timestamp);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Reply created successfully',
                    'reply' => [
                        'author' => $author,
                        'avatar' => $avatar,
                        'avatarHint' => $avatarHint,
                        'content' => $content,
                        'timestamp' => $timestamp
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create reply']);
            }
            
            $stmt->close();
            $checkStmt->close();
            
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        
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