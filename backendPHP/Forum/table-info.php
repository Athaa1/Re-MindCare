<?php
require_once '../connect.php';

header('Content-Type: text/plain');

try {
    echo "=== FORUM TABLE STRUCTURE ===\n";
    $result = $pdo->query("DESCRIBE forum");
    if ($result) {
        foreach ($result as $row) {
            echo sprintf("%-20s %-20s\n", $row['Field'], $row['Type']);
        }
    }
    
    echo "\n=== FORUM_REPLY TABLE STRUCTURE ===\n";
    $result = $pdo->query("DESCRIBE forum_reply");
    if ($result) {
        foreach ($result as $row) {
            echo sprintf("%-20s %-20s\n", $row['Field'], $row['Type']);
        }
    }
    
    echo "\n=== SAMPLE DATA COUNT ===\n";
    $forumCount = $pdo->query("SELECT COUNT(*) as count FROM forum")->fetch()['count'];
    $replyCount = $pdo->query("SELECT COUNT(*) as count FROM forum_reply")->fetch()['count'];
    
    echo "Forum posts: $forumCount\n";
    echo "Forum replies: $replyCount\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
