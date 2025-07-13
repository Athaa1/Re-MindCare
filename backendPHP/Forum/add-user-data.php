<?php
require_once '../connect.php';

try {
    // Get user info
    $userQuery = "SELECT id, name, email FROM user WHERE id = 2";
    $stmt = $pdo->prepare($userQuery);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "User ID 2 info:\n";
        echo "Name: " . $user['name'] . "\n";
        echo "Email: " . $user['email'] . "\n";
        
        // Add some sample forum posts with this user's name
        $userName = $user['name'];
        
        // Check if posts already exist
        $checkQuery = "SELECT COUNT(*) as count FROM forum WHERE author = ?";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([$userName]);
        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existing['count'] == 0) {
            // Add sample posts
            $posts = [
                ['author' => $userName, 'content' => 'Sharing my experience with anxiety management techniques.'],
                ['author' => $userName, 'content' => 'Looking for support group recommendations in my area.'],
                ['author' => $userName, 'content' => 'How do you deal with stress at work?']
            ];
            
            $insertQuery = "INSERT INTO forum (author, avatar, avatar_hint, content, timestamp) VALUES (?, '', '', ?, ?)";
            $insertStmt = $pdo->prepare($insertQuery);
            
            foreach ($posts as $post) {
                $insertStmt->execute([$post['author'], $post['content'], date('Y-m-d H:i:s')]);
            }
            
            // Add some replies
            $forumIds = $pdo->query("SELECT id FROM forum WHERE author = '$userName' ORDER BY id DESC LIMIT 3")->fetchAll(PDO::FETCH_COLUMN);
            
            if (count($forumIds) > 0) {
                $replies = [
                    'Thank you for sharing!',
                    'I can relate to this.',
                    'This is very helpful.',
                    'Great advice!'
                ];
                
                $replyQuery = "INSERT INTO forum_reply (forum_id, author, avatar, avatar_hint, content, timestamp) VALUES (?, ?, '', '', ?, ?)";
                $replyStmt = $pdo->prepare($replyQuery);
                
                foreach ($forumIds as $forumId) {
                    foreach (array_slice($replies, 0, 2) as $reply) {
                        $replyStmt->execute([$forumId, $userName, $reply, date('Y-m-d H:i:s')]);
                    }
                }
            }
            
            echo "Added sample data for user: $userName\n";
        } else {
            echo "Sample data already exists for user: $userName\n";
        }
        
        // Show current stats
        $postCount = $pdo->prepare("SELECT COUNT(*) as count FROM forum WHERE author = ?");
        $postCount->execute([$userName]);
        $posts = $postCount->fetch(PDO::FETCH_ASSOC)['count'];
        
        $replyCount = $pdo->prepare("SELECT COUNT(*) as count FROM forum_reply WHERE author = ?");
        $replyCount->execute([$userName]);
        $replies = $replyCount->fetch(PDO::FETCH_ASSOC)['count'];
        
        echo "\nCurrent stats:\n";
        echo "Posts: $posts\n";
        echo "Replies: $replies\n";
        echo "Total: " . ($posts + $replies) . "\n";
        
    } else {
        echo "User with ID 2 not found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
