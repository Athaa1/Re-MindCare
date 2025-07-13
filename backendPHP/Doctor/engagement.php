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

    // Calculate growth from last month
    $lastMonthQuery = "SELECT COUNT(*) as last_month_total FROM user WHERE is_doctor = 0 AND created_at < DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)";
    $lastMonthResult = $conn->query($lastMonthQuery);
    $lastMonthTotal = $lastMonthResult ? $lastMonthResult->fetch_assoc()['last_month_total'] : 0;
    $growthFromLastMonth = $totalPatients - $lastMonthTotal;

    // Get engagement statistics
    // 1. Patients who have tracked mood in the last 7 days
    $recentlyActiveQuery = "SELECT COUNT(DISTINCT m.user_id) as recently_active_patients
        FROM mood m 
        INNER JOIN user u ON m.user_id = u.id 
        WHERE u.is_doctor = 0 
        AND m.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)";
    $recentlyActiveResult = $conn->query($recentlyActiveQuery);
    $recentlyActivePatients = $recentlyActiveResult ? $recentlyActiveResult->fetch_assoc()['recently_active_patients'] : 0;

    // 2. Patients who have ever tracked mood
    $everTrackedQuery = "SELECT COUNT(DISTINCT m.user_id) as ever_tracked_patients
        FROM mood m 
        INNER JOIN user u ON m.user_id = u.id 
        WHERE u.is_doctor = 0";
    $everTrackedResult = $conn->query($everTrackedQuery);
    $everTrackedPatients = $everTrackedResult ? $everTrackedResult->fetch_assoc()['ever_tracked_patients'] : 0;

    // 3. Average mood over the last 7 days
    $avgMoodQuery = "SELECT AVG(m.mood) as avg_mood
        FROM mood m 
        INNER JOIN user u ON m.user_id = u.id 
        WHERE u.is_doctor = 0 
        AND m.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)";
    $avgMoodResult = $conn->query($avgMoodQuery);
    $avgMood = $avgMoodResult ? $avgMoodResult->fetch_assoc()['avg_mood'] : null;

    // 4. Patients who tracked mood today
    $todayActiveQuery = "SELECT COUNT(DISTINCT m.user_id) as today_active_patients
        FROM mood m 
        INNER JOIN user u ON m.user_id = u.id 
        WHERE u.is_doctor = 0 
        AND m.date = CURRENT_DATE()";
    $todayActiveResult = $conn->query($todayActiveQuery);
    $todayActivePatients = $todayActiveResult ? $todayActiveResult->fetch_assoc()['today_active_patients'] : 0;

    // 5. Get recent patient registrations
    $recentPatientsQuery = "SELECT id, name, email, created_at FROM user WHERE is_doctor = 0 ORDER BY created_at DESC LIMIT 5";
    $recentResult = $conn->query($recentPatientsQuery);
    $recentPatients = [];
    if ($recentResult) {
        while ($row = $recentResult->fetch_assoc()) {
            $recentPatients[] = $row;
        }
    }

    // Calculate engagement percentage (patients who tracked mood in last 7 days / total patients)
    $engagementPercentage = $totalPatients > 0 ? round(($recentlyActivePatients / $totalPatients) * 100) : 0;

    // Calculate overall mood tracking adoption (patients who ever tracked / total patients)
    $adoptionPercentage = $totalPatients > 0 ? round(($everTrackedPatients / $totalPatients) * 100) : 0;

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'total_patients' => (int)$totalPatients,
            'new_patients_this_month' => (int)$newPatients,
            'growth_from_last_month' => (int)$growthFromLastMonth,
            'recently_active_patients' => (int)$recentlyActivePatients,
            'ever_tracked_patients' => (int)$everTrackedPatients,
            'today_active_patients' => (int)$todayActivePatients,
            'engagement_percentage' => (int)$engagementPercentage,
            'adoption_percentage' => (int)$adoptionPercentage,
            'average_mood' => $avgMood ? round($avgMood, 1) : null,
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
