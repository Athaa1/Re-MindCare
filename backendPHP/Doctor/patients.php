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
require_once '../connect.php';

try {
    // Check if request method is GET
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }

    // Get total active patients (non-doctors)
    $totalPatientsQuery = "SELECT COUNT(*) as total FROM user WHERE is_doctor = 0";
    $totalResult = $conn->query($totalPatientsQuery);
    $totalPatients = $totalResult ? $totalResult->fetch_assoc()['total'] : 0;

    // Get new patients this month
    $newPatientsQuery = "SELECT COUNT(*) as new_patients FROM user WHERE is_doctor = 0 AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())";
    $newResult = $conn->query($newPatientsQuery);
    $newPatients = $newResult ? $newResult->fetch_assoc()['new_patients'] : 0;

    // Get patients with mood data in the last 7 days
    $moodStatsQuery = "SELECT 
        AVG(m.mood) as avg_mood,
        COUNT(DISTINCT m.user_id) as patients_with_mood
        FROM mood m 
        INNER JOIN user u ON m.user_id = u.id 
        WHERE u.is_doctor = 0 
        AND m.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)";
    $moodResult = $conn->query($moodStatsQuery);
    $moodStats = $moodResult ? $moodResult->fetch_assoc() : ['avg_mood' => null, 'patients_with_mood' => 0];

    // Get recent patient registrations
    $recentPatientsQuery = "SELECT id, name, email, created_at FROM user WHERE is_doctor = 0 ORDER BY created_at DESC LIMIT 5";
    $recentResult = $conn->query($recentPatientsQuery);
    $recentPatients = [];
    if ($recentResult) {
        while ($row = $recentResult->fetch_assoc()) {
            $recentPatients[] = $row;
        }
    }

    // Calculate growth from last month
    $lastMonthQuery = "SELECT COUNT(*) as last_month_total FROM user WHERE is_doctor = 0 AND created_at < DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)";
    $lastMonthResult = $conn->query($lastMonthQuery);
    $lastMonthTotal = $lastMonthResult ? $lastMonthResult->fetch_assoc()['last_month_total'] : 0;
    $growthFromLastMonth = $totalPatients - $lastMonthTotal;

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'total_patients' => (int)$totalPatients,
            'new_patients_this_month' => (int)$newPatients,
            'growth_from_last_month' => (int)$growthFromLastMonth,
            'average_mood' => $moodStats['avg_mood'] ? round($moodStats['avg_mood'], 1) : null,
            'patients_with_mood' => (int)$moodStats['patients_with_mood'],
            'recent_patients' => $recentPatients
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
