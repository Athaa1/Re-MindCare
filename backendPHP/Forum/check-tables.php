<?php
require_once '../connect.php';

try {
    // Check forum table structure
    echo "Forum table structure:\n";
    $result = $pdo->query("DESCRIBE forum");
    if ($result) {
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            echo "- " . $row['Field'] . " (" . $row['Type'] . ")\n";
        }
    } else {
        echo "Forum table does not exist\n"; 
    }
    
    echo "\n";
    
    // Check forum_reply table structure
    echo "Forum_reply table structure:\n";
    $result = $pdo->query("DESCRIBE forum_reply");
    if ($result) {
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            echo "- " . $row['Field'] . " (" . $row['Type'] . ")\n";
        }
    } else {
        echo "Forum_reply table does not exist\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
