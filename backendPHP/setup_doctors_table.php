<?php
// Script to create doctors table if it doesn't exist

require_once 'connect.php';

try {
    // Check if doctors table exists
    $checkTableQuery = "SHOW TABLES LIKE 'doctors'";
    $result = $conn->query($checkTableQuery);
    
    if ($result->num_rows == 0) {
        echo "Creating doctors table...\n";
        
        $createTableQuery = "
            CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                title VARCHAR(255),
                specialties JSON,
                bio TEXT,
                imageUrl VARCHAR(255),
                imageHint VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        if ($conn->query($createTableQuery) === TRUE) {
            echo "✅ Doctors table created successfully!\n";
        } else {
            throw new Exception("Error creating table: " . $conn->error);
        }
    } else {
        echo "✅ Doctors table already exists.\n";
    }
    
    // Check table structure
    echo "\nTable structure:\n";
    $describeQuery = "DESCRIBE doctors";
    $result = $conn->query($describeQuery);
    
    while ($row = $result->fetch_assoc()) {
        echo "- {$row['Field']}: {$row['Type']} " . 
             ($row['Null'] == 'YES' ? '(NULL)' : '(NOT NULL)') . 
             ($row['Key'] ? " [{$row['Key']}]" : '') . "\n";
    }
    
    echo "\nSetup completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
