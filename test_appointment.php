<?php
// Test appointment scheduling
require_once __DIR__ . '/backendPHP/connect.php';

echo "=== Testing Appointment System ===\n";

// Test data
$testData = [
    'user_id' => 1,
    'doctor_id' => 1,
    'appointment_date' => '2025-07-15',
    'appointment_time' => '10:00:00',
    'notes' => 'Test appointment untuk kecemasan',
    'status' => 'pending'
];

echo "Test data: " . json_encode($testData, JSON_PRETTY_PRINT) . "\n";

try {
    // Insert test appointment
    $stmt = $pdo->prepare("
        INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $testData['user_id'],
        $testData['doctor_id'], 
        $testData['appointment_date'],
        $testData['appointment_time'],
        $testData['notes'],
        $testData['status']
    ]);
    
    if ($result) {
        $appointmentId = $pdo->lastInsertId();
        echo "✅ Appointment created with ID: $appointmentId\n";
        
        // Fetch the created appointment
        $fetchStmt = $pdo->prepare("
            SELECT 
                a.*,
                d.name as doctor_name,
                d.title as doctor_title
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.id = ?
        ");
        $fetchStmt->execute([$appointmentId]);
        $appointment = $fetchStmt->fetch(PDO::FETCH_ASSOC);
        
        echo "Created appointment details:\n";
        echo json_encode($appointment, JSON_PRETTY_PRINT) . "\n";
        
    } else {
        echo "❌ Failed to create appointment\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== End Test ===\n";
?>
