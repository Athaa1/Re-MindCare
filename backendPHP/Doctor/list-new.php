<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../connect.php';

// Debug: Check if PDO connection exists
if (!isset($pdo)) {
    echo json_encode(['success' => false, 'error' => 'PDO connection not found']);
    exit;
}

try {
    // Get all doctors
    $stmt = $pdo->prepare("
        SELECT 
            d.id,
            d.user_id,
            d.name,
            d.title,
            d.specialties,
            d.bio,
            d.imageUrl,
            d.imageHint
        FROM doctors d
        WHERE d.name IS NOT NULL AND d.name != ''
        ORDER BY d.id
    ");
    
    $stmt->execute();
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Debug: Log number of doctors found
    error_log("Found " . count($doctors) . " doctors");
    
    // Process the results
    $processedDoctors = [];
    foreach ($doctors as $doctor) {
        // Decode specialties JSON
        $specialties = json_decode($doctor['specialties'], true);
        if (!is_array($specialties)) {
            $specialties = [];
        }
        
        $processedDoctors[] = [
            'id' => (string)$doctor['id'],
            'user_id' => $doctor['user_id'],
            'name' => $doctor['name'],
            'title' => $doctor['title'] ?: 'Dokter',
            'specialties' => $specialties,
            'bio' => $doctor['bio'] ?: 'Dokter berpengalaman yang siap membantu Anda.',
            'imageUrl' => $doctor['imageUrl'] ?: 'https://placehold.co/100x100.png',
            'imageHint' => $doctor['imageHint'] ?: 'doctor portrait'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $processedDoctors,
        'count' => count($processedDoctors)
    ]);
    
} catch (Exception $e) {
    error_log("Error fetching doctors: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil data dokter',
        'error' => $e->getMessage()
    ]);
}
?>
