<?php
// Turn off error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(0);

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
require_once '../connect.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get doctor profile
        if (!isset($_GET['user_id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            exit;
        }
        
        $userId = (int)$_GET['user_id'];
        
        // Get user basic info
        $userQuery = "SELECT id, name, email FROM user WHERE id = ? AND is_doctor = 1";
        $stmt = $conn->prepare($userQuery);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $userResult = $stmt->get_result();
        
        if ($userResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Doctor not found']);
            exit;
        }
        
        $user = $userResult->fetch_assoc();
        
        // Get doctor profile info
        $doctorQuery = "SELECT * FROM doctors WHERE user_id = ?";
        $doctorStmt = $conn->prepare($doctorQuery);
        $doctorStmt->bind_param('i', $userId);
        $doctorStmt->execute();
        $doctorResult = $doctorStmt->get_result();
        
        $doctorProfile = null;
        if ($doctorResult->num_rows > 0) {
            $doctorProfile = $doctorResult->fetch_assoc();
            // Decode JSON specialties
            if ($doctorProfile['specialties']) {
                $doctorProfile['specialties'] = json_decode($doctorProfile['specialties'], true);
            }
        }
        
        $stmt->close();
        $doctorStmt->close();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'user' => $user,
                'doctor_profile' => $doctorProfile
            ]
        ]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update or create doctor profile
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Debug logging
        error_log('Received input: ' . print_r($input, true));
        
        if (!isset($input['user_id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            exit;
        }
        
        $userId = (int)$input['user_id'];
        $name = $input['name'] ?? '';
        $title = $input['title'] ?? '';
        $bio = $input['bio'] ?? '';
        $imageUrl = $input['imageUrl'] ?? '';
        $imageHint = $input['imageHint'] ?? '';
        
        // Debug specialties
        error_log('Raw specialties from input: ' . print_r($input['specialties'] ?? 'NOT SET', true));
        $specialties = isset($input['specialties']) && is_array($input['specialties']) ? json_encode($input['specialties']) : '[]';
        error_log('Encoded specialties for database: ' . $specialties);
        
        // Validate required fields
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            exit;
        }
        
        // Check if doctor profile exists
        $checkQuery = "SELECT id FROM doctors WHERE user_id = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param('i', $userId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            // Update existing profile
            $updateQuery = "UPDATE doctors SET name = ?, title = ?, specialties = ?, bio = ?, imageUrl = ?, imageHint = ? WHERE user_id = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param('ssssssi', $name, $title, $specialties, $bio, $imageUrl, $imageHint, $userId);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Doctor profile updated successfully'
                ]);
            } else {
                throw new Exception('Failed to update doctor profile');
            }
        } else {
            // Create new profile
            $insertQuery = "INSERT INTO doctors (user_id, name, title, specialties, bio, imageUrl, imageHint) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            $stmt->bind_param('issssss', $userId, $name, $title, $specialties, $bio, $imageUrl, $imageHint);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Doctor profile created successfully'
                ]);
            } else {
                throw new Exception('Failed to create doctor profile');
            }
        }
        
        $checkStmt->close();
        $stmt->close();
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
