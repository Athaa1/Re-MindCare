<?php
require_once '../connect.php';

try {
    $today = date('Y-m-d');
    
    // Sample appointments for today
    $sampleAppointments = [
        [
            'user_id' => 2,
            'doctor_id' => 1,
            'appointment_date' => $today,
            'appointment_time' => '09:00:00',
            'status' => 'confirmed',
            'notes' => 'Konsultasi kecemasan umum'
        ],
        [
            'user_id' => 2,
            'doctor_id' => 1,
            'appointment_date' => $today,
            'appointment_time' => '10:30:00',
            'status' => 'confirmed',
            'notes' => 'Terapi kognitif behavioral'
        ],
        [
            'user_id' => 2,
            'doctor_id' => 1,
            'appointment_date' => $today,
            'appointment_time' => '14:00:00',
            'status' => 'pending',
            'notes' => 'Sesi konseling keluarga'
        ],
        [
            'user_id' => 2,
            'doctor_id' => 1,
            'appointment_date' => $today,
            'appointment_time' => '16:00:00',
            'status' => 'confirmed',
            'notes' => 'Follow-up terapi depresi'
        ]
    ];
    
    $insertQuery = "
        INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, status, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ";
    
    $stmt = $pdo->prepare($insertQuery);
    
    $inserted = 0;
    foreach ($sampleAppointments as $appointment) {
        $result = $stmt->execute([
            $appointment['user_id'],
            $appointment['doctor_id'],
            $appointment['appointment_date'],
            $appointment['appointment_time'],
            $appointment['status'],
            $appointment['notes']
        ]);
        
        if ($result) {
            $inserted++;
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Inserted $inserted sample appointments for today ($today)",
        'date' => $today
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
