<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../connect.php';

try {
    // Get today's date
    $today = date('Y-m-d');
    
    // Query to get today's appointments for doctors
    $query = "
        SELECT 
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.notes,
            u.name as patient_name,
            u.email as patient_email,
            d.specialties
        FROM appointments a
        JOIN user u ON a.user_id = u.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.appointment_date = ?
        AND a.status IN ('confirmed', 'pending')
        ORDER BY a.appointment_time ASC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$today]);
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the appointments data
    $formattedAppointments = array_map(function($appointment) {
        // Format time to HH:MM
        $time = date('H:i', strtotime($appointment['appointment_time']));
        
        // Generate issue/concern based on specialties and notes
        $specialties = json_decode($appointment['specialties'], true);
        $specialty = is_array($specialties) && !empty($specialties) ? $specialties[0] : 'Umum';
        $issue = $appointment['notes'] ?: 'Konsultasi ' . $specialty;
        
        // Limit issue text length
        if (strlen($issue) > 50) {
            $issue = substr($issue, 0, 47) . '...';
        }
        
        return [
            'id' => (int)$appointment['id'],
            'name' => $appointment['patient_name'],
            'email' => $appointment['patient_email'],
            'time' => $time,
            'issue' => $issue,
            'avatar' => null, // No avatar field available in database
            'status' => $appointment['status'],
            'appointment_date' => $appointment['appointment_date'],
            'appointment_time' => $appointment['appointment_time'],
            'specialization' => $specialty
        ];
    }, $appointments);
    
    // Get summary statistics for today
    $totalAppointments = count($formattedAppointments);
    $confirmedAppointments = count(array_filter($formattedAppointments, function($appt) {
        return $appt['status'] === 'confirmed';
    }));
    $pendingAppointments = count(array_filter($formattedAppointments, function($appt) {
        return $appt['status'] === 'pending';
    }));
    
    // Get next appointment
    $nextAppointment = null;
    $currentTime = date('H:i:s');
    foreach ($formattedAppointments as $appointment) {
        if ($appointment['appointment_time'] > $currentTime) {
            $nextAppointment = $appointment;
            break;
        }
    }
    
    $response = [
        'success' => true,
        'data' => [
            'appointments' => $formattedAppointments,
            'summary' => [
                'total_appointments' => $totalAppointments,
                'confirmed_appointments' => $confirmedAppointments,
                'pending_appointments' => $pendingAppointments,
                'next_appointment' => $nextAppointment,
                'date' => $today
            ]
        ]
    ];
    
    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
