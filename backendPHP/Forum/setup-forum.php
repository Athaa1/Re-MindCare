<?php
require_once '../connect.php';

try {
    // Check if forum table exists and create if not
    $checkForum = $pdo->query("SHOW TABLES LIKE 'forum'");
    if ($checkForum->rowCount() == 0) {
        $createForum = "
            CREATE TABLE forum (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )
        ";
        $pdo->exec($createForum);
        echo "Created forum table\n";
    } else {
        echo "Forum table exists\n";
    }
    
    // Check if forum_reply table exists and create if not
    $checkReply = $pdo->query("SHOW TABLES LIKE 'forum_reply'");
    if ($checkReply->rowCount() == 0) {
        $createReply = "
            CREATE TABLE forum_reply (
                id INT AUTO_INCREMENT PRIMARY KEY,
                forum_id INT NOT NULL,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (forum_id) REFERENCES forum(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )
        ";
        $pdo->exec($createReply);
        echo "Created forum_reply table\n";
    } else {
        echo "Forum_reply table exists\n";
    }
    
    // Add some sample data - check if data already exists first
    $checkExisting = $pdo->prepare("SELECT COUNT(*) as count FROM forum WHERE title LIKE 'Cara mengatasi kecemasan sosial%'");
    $checkExisting->execute();
    $existing = $checkExisting->fetch(PDO::FETCH_ASSOC);
    
    if ($existing['count'] == 0) {
        try {
            $insertForum = "INSERT INTO forum (user_id, title, content) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($insertForum);
            
            // Insert sample posts
            $posts = [
                [2, 'Cara mengatasi kecemasan sosial', 'Saya sering merasa cemas ketika harus berbicara di depan umum. Ada tips?'],
                [2, 'Pengalaman dengan terapi kognitif', 'Saya ingin berbagi pengalaman terapi CBT yang sangat membantu saya.'],
                [2, 'Pentingnya dukungan keluarga', 'Bagaimana cara mendapatkan dukungan keluarga untuk kesehatan mental?']
            ];
            
            foreach ($posts as $post) {
                $stmt->execute($post);
            }
            
            // Get the inserted forum IDs
            $forumQuery = $pdo->prepare("SELECT id FROM forum WHERE user_id = 2 ORDER BY id DESC LIMIT 3");
            $forumQuery->execute();
            $forums = $forumQuery->fetchAll(PDO::FETCH_ASSOC);
            
            // Add some replies
            if (count($forums) > 0) {
                $insertReply = "INSERT INTO forum_reply (forum_id, user_id, content) VALUES (?, ?, ?)";
                $replyStmt = $pdo->prepare($insertReply);
                
                $replies = [
                    'Terima kasih untuk berbagi pengalaman ini!',
                    'Saya juga mengalami hal yang sama.',
                    'Ini sangat membantu, akan saya coba.',
                    'Dukungan komunitas sangat penting.',
                    'Saya setuju dengan pendapat ini.'
                ];
                
                foreach ($forums as $forum) {
                    foreach ($replies as $reply) {
                        $replyStmt->execute([$forum['id'], 2, $reply]);
                    }
                }
            }
            
            echo "Sample data added successfully\n";
        } catch (Exception $e) {
            echo "Error adding sample data: " . $e->getMessage() . "\n";
        }
    } else {
        echo "Sample data already exists\n";
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Forum tables created and sample data added successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
