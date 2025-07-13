<?php
// Test script for specialties handling
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/backendPHP/connect.php';

echo "=== Testing Specialties Handling ===\n";

// Test JSON encoding
$testSpecialties = ['Psychology', 'Cognitive Behavioral Therapy', 'Anxiety Disorders'];
echo "Test array: " . print_r($testSpecialties, true) . "\n";

$encoded = json_encode($testSpecialties);
echo "JSON encoded: " . $encoded . "\n";

$decoded = json_decode($encoded, true);
echo "JSON decoded: " . print_r($decoded, true) . "\n";

// Test database handling
$testDoctorId = 1; // Use existing doctor ID
$testData = [
    'name' => 'Test Doctor',
    'title' => 'Clinical Psychologist',
    'specialties' => $testSpecialties,
    'bio' => 'Test bio'
];

echo "\nTest data: " . print_r($testData, true) . "\n";

// Test SQL query
$specialtiesJson = json_encode($testData['specialties']);
echo "Specialties JSON for SQL: " . $specialtiesJson . "\n";

try {
    $stmt = $pdo->prepare("INSERT INTO doctors (user_id, name, title, specialties, bio) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, title=?, specialties=?, bio=?");
    $result = $stmt->execute([
        $testDoctorId,
        $testData['name'],
        $testData['title'],
        $specialtiesJson,
        $testData['bio'],
        $testData['name'],
        $testData['title'],
        $specialtiesJson,
        $testData['bio']
    ]);
    
    echo "SQL execution result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";
    
    // Fetch back to verify
    $fetchStmt = $pdo->prepare("SELECT * FROM doctors WHERE user_id = ?");
    $fetchStmt->execute([$testDoctorId]);
    $fetchResult = $fetchStmt->fetch(PDO::FETCH_ASSOC);
    
    echo "Fetched result: " . print_r($fetchResult, true) . "\n";
    
    if ($fetchResult) {
        $decodedSpecialties = json_decode($fetchResult['specialties'], true);
        echo "Decoded specialties from DB: " . print_r($decodedSpecialties, true) . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== End Test ===\n";
?>
