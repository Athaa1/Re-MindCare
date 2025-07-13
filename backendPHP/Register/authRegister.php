<?php
// Turn off error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(0);

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
try {
    require_once '../connect.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input data
    if (!isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Nama, email, dan password harus diisi']);
        exit;
    }

    $name = trim($input['name']);
    $email = trim($input['email']);
    $password = $input['password'];

    // Basic validation
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Semua field harus diisi']);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Format email tidak valid']);
        exit;
    }

    // Validate password length
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password minimal 6 karakter']);
        exit;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email sudah terdaftar']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if user is admin/doctor based on email domain
    $isDoctor = 0;
    if (strpos($email, '@doctor.com') !== false) {
        $isDoctor = 1;
    }

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO user (name, email, password, is_doctor) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $name, $email, $hashedPassword, $isDoctor);

    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        
        // Return success response
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Akun berhasil dibuat',
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'is_doctor' => $isDoctor
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal membuat akun: ' . $conn->error]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>