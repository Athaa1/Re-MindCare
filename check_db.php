<?php
require_once __DIR__ . '/backendPHP/connect.php';

echo "=== Database Tables ===\n";
$tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
echo 'Available tables: ' . implode(', ', $tables) . "\n";

echo "\n=== Doctors Table Structure ===\n";
$doctorsDesc = $pdo->query('DESCRIBE doctors')->fetchAll(PDO::FETCH_ASSOC);
foreach ($doctorsDesc as $column) {
    echo $column['Field'] . ' - ' . $column['Type'] . "\n";
}

echo "\n=== Sample Doctors Data ===\n";
$doctors = $pdo->query('SELECT * FROM doctors LIMIT 3')->fetchAll(PDO::FETCH_ASSOC);
foreach ($doctors as $doctor) {
    echo "ID: {$doctor['id']}, Name: {$doctor['name']}, Title: {$doctor['title']}\n";
}
?>
