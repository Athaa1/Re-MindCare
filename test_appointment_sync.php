<?php
// Test appointment with proper IDs
require_once __DIR__ . '/backendPHP/connect.php';

echo "=== Testing Appointment with Correct IDs ===\n";

// Show available users and doctors
echo "Available Users:\n";
$users = $pdo->query("SELECT id, name, email FROM user")->fetchAll(PDO::FETCH_ASSOC);
foreach ($users as $user) {
    echo "  ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}\n";
}

echo "\nAvailable Doctors:\n";
$doctors = $pdo->query("SELECT id, name, title FROM doctors")->fetchAll(PDO::FETCH_ASSOC);
foreach ($doctors as $doctor) {
    echo "  ID: {$doctor['id']}, Name: {$doctor['name']}, Title: {$doctor['title']}\n";
}

// Test appointment creation with proper validation
echo "\n=== Testing Appointment Creation ===\n";

$testData = [
    'user_id' => 2, // User 'atha' with email atha@gmail.com
    'doctor_id' => 1, // Doctor 'atha' with title S.kom
    'appointment_date' => '2025-07-15',
    'appointment_time' => '14:00:00',
    'notes' => 'Test appointment dengan ID yang benar',
    'status' => 'pending'
];

echo "Test data: " . json_encode($testData, JSON_PRETTY_PRINT) . "\n";

// Simulate the PHP endpoint
$postData = json_encode($testData);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $postData
    ]
]);

$response = file_get_contents('http://localhost/Re-MindCare/backendPHP/Appointments/schedule.php', false, $context);
echo "\nAPI Response:\n";
echo $response . "\n";
?>
