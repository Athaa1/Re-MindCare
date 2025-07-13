<?php
// Turn off error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(0);

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
try {
    require_once '../connect.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get query parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    
    // Validate page and limit
    if ($page < 1) $page = 1;
    if ($limit < 1 || $limit > 100) $limit = 10;
    
    // Calculate offset
    $offset = ($page - 1) * $limit;
    
    // Build the base query
    $whereClause = '';
    $params = [];
    $types = '';
    
    if (!empty($type) && in_array($type, ['Artikel', 'Video'])) {
        $whereClause = ' WHERE type = ?';
        $params[] = $type;
        $types = 's';
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM resource" . $whereClause;
    $countStmt = $conn->prepare($countQuery);
    
    if (!empty($params)) {
        $countStmt->bind_param($types, ...$params);
    }
    
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalCount = $countResult->fetch_assoc()['total'];
    
    // Get resources with pagination
    $query = "SELECT id, title, url, description, image_url, image_hint, type, content 
              FROM resource" . $whereClause . " 
              ORDER BY id DESC 
              LIMIT ? OFFSET ?";
    
    $stmt = $conn->prepare($query);
    
    // Bind parameters
    if (!empty($params)) {
        $types .= 'ii'; // Add types for limit and offset
        $params[] = $limit;
        $params[] = $offset;
        $stmt->bind_param($types, ...$params);
    } else {
        $stmt->bind_param('ii', $limit, $offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $resources = [];
    while ($row = $result->fetch_assoc()) {
        $resources[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'url' => $row['url'],
            'description' => $row['description'],
            'imageUrl' => $row['image_url'],
            'imageHint' => $row['image_hint'],
            'type' => $row['type'],
            'content' => $row['content']
        ];
    }
    
    // Calculate pagination info
    $totalPages = ceil($totalCount / $limit);
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $resources,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => (int)$totalCount,
            'totalPages' => $totalPages,
            'hasNext' => $page < $totalPages,
            'hasPrev' => $page > 1
        ]
    ]);
    
    // Close statement and connection
    $stmt->close();
    $countStmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>