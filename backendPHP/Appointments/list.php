<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../connect.php';

// Check if PDO connection exists
if (!isset($pdo)) {
    echo json_encode(['success' => false, 'error' => 'PDO connection not found']);
    exit;
}

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Only GET method allowed']);
    exit;
}

try {
    // Get user_id from query parameter
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'user_id parameter required']);
        exit;
    }
    
    // Get appointments for user
    $stmt = $pdo->prepare("
        SELECT 
            a.*,
            d.name as doctor_name,
            d.title as doctor_title,
            d.imageUrl as doctor_image
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.user_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
    ");
    
    $stmt->execute([$user_id]);
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process the results
    $processedAppointments = [];
    foreach ($appointments as $appointment) {
        $processedAppointments[] = [
            'id' => $appointment['id'],
            'doctor_id' => $appointment['doctor_id'],
            'doctor_name' => $appointment['doctor_name'],
            'doctor_title' => $appointment['doctor_title'],
            'doctor_image' => $appointment['doctor_image'] ?: 'https://placehold.co/100x100.png',
            'appointment_date' => $appointment['appointment_date'],
            'appointment_time' => $appointment['appointment_time'],
            'notes' => $appointment['notes'],
            'status' => $appointment['status'],
            'created_at' => $appointment['created_at'],
            'updated_at' => $appointment['updated_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $processedAppointments,
        'count' => count($processedAppointments)
    ]);
    
} catch (Exception $e) {
    error_log("Error fetching appointments: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
}
?>
