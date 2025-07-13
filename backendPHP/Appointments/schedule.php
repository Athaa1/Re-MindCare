<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../connect.php';

// Check if PDO connection exists
if (!isset($pdo)) {
    echo json_encode(['success' => false, 'error' => 'PDO connection not found']);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST method allowed']);
    exit;
}

try {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Debug: Log received data
    error_log("Received appointment data: " . json_encode($input));
    
    // Validate required fields
    if (!isset($input['user_id']) || !isset($input['doctor_id']) || 
        !isset($input['appointment_date']) || !isset($input['appointment_time'])) {
        echo json_encode([
            'success' => false, 
            'message' => 'Missing required fields: user_id, doctor_id, appointment_date, appointment_time',
            'received_data' => $input
        ]);
        exit;
    }
    
    $user_id = $input['user_id'];
    $doctor_id = $input['doctor_id'];
    $appointment_date = $input['appointment_date'];
    $appointment_time = $input['appointment_time'];
    $notes = $input['notes'] ?? '';
    $status = $input['status'] ?? 'pending';
    
    // Validate user exists
    $userCheck = $pdo->prepare("SELECT id, name FROM user WHERE id = ?");
    $userCheck->execute([$user_id]);
    $user = $userCheck->fetch();
    if (!$user) {
        echo json_encode([
            'success' => false, 
            'message' => "User with ID $user_id not found",
            'available_users' => $pdo->query("SELECT id, name FROM user LIMIT 5")->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }
    
    // Validate doctor exists
    $doctorCheck = $pdo->prepare("SELECT id, name FROM doctors WHERE id = ?");
    $doctorCheck->execute([$doctor_id]);
    $doctor = $doctorCheck->fetch();
    if (!$doctor) {
        echo json_encode([
            'success' => false, 
            'message' => "Doctor with ID $doctor_id not found",
            'available_doctors' => $pdo->query("SELECT id, name FROM doctors LIMIT 5")->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }
    
    error_log("Creating appointment: User {$user['name']} (ID: $user_id) with Doctor {$doctor['name']} (ID: $doctor_id)");
    
    // Insert appointment
    $stmt = $pdo->prepare("
        INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $user_id,
        $doctor_id, 
        $appointment_date,
        $appointment_time,
        $notes,
        $status
    ]);
    
    if ($result) {
        $appointmentId = $pdo->lastInsertId();
        
        // Get appointment details with doctor info
        $detailStmt = $pdo->prepare("
            SELECT 
                a.*,
                d.name as doctor_name,
                d.title as doctor_title
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.id = ?
        ");
        $detailStmt->execute([$appointmentId]);
        $appointmentDetails = $detailStmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Appointment scheduled successfully',
            'data' => $appointmentDetails
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to schedule appointment'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error scheduling appointment: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
}
?>
