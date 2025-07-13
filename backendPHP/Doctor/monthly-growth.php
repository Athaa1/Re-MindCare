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

    // Get monthly patient growth for the last 12 months
    $monthlyGrowthQuery = "
        SELECT 
            YEAR(created_at) as year,
            MONTH(created_at) as month,
            COUNT(*) as new_patients,
            DATE_FORMAT(created_at, '%b') as month_name,
            DATE_FORMAT(created_at, '%Y-%m') as month_key
        FROM user 
        WHERE is_doctor = 0 
        AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
        GROUP BY YEAR(created_at), MONTH(created_at)
        ORDER BY year ASC, month ASC
    ";
    
    $result = $conn->query($monthlyGrowthQuery);
    
    if (!$result) {
        throw new Exception('Database query failed: ' . $conn->error);
    }
    
    $monthlyData = [];
    $totalNewPatients = 0;
    
    // Get Indonesian month names
    $monthNames = [
        1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
        5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agt',
        9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
    ];
    
    // Create array for last 12 months (even if no data)
    $currentDate = new DateTime();
    $months = [];
    
    for ($i = 11; $i >= 0; $i--) {
        $date = clone $currentDate;
        $date->sub(new DateInterval('P' . $i . 'M'));
        $monthKey = $date->format('Y-m');
        $monthName = $monthNames[(int)$date->format('n')];
        
        $months[$monthKey] = [
            'month' => $monthName,
            'newPatients' => 0,
            'year' => (int)$date->format('Y'),
            'month_number' => (int)$date->format('n')
        ];
    }
    
    // Fill in actual data
    while ($row = $result->fetch_assoc()) {
        $monthKey = $row['month_key'];
        if (isset($months[$monthKey])) {
            $months[$monthKey]['newPatients'] = (int)$row['new_patients'];
            $totalNewPatients += (int)$row['new_patients'];
        }
    }
    
    // Convert to indexed array
    $monthlyData = array_values($months);
    
    // Get growth comparison
    $currentMonth = (int)date('n');
    $currentYear = (int)date('Y');
    $lastMonth = $currentMonth == 1 ? 12 : $currentMonth - 1;
    $lastMonthYear = $currentMonth == 1 ? $currentYear - 1 : $currentYear;
    
    // Get current month data
    $currentMonthQuery = "
        SELECT COUNT(*) as current_month_patients
        FROM user 
        WHERE is_doctor = 0 
        AND MONTH(created_at) = ? 
        AND YEAR(created_at) = ?
    ";
    $stmt = $conn->prepare($currentMonthQuery);
    $stmt->bind_param('ii', $currentMonth, $currentYear);
    $stmt->execute();
    $currentMonthResult = $stmt->get_result();
    $currentMonthPatients = $currentMonthResult->fetch_assoc()['current_month_patients'];
    
    // Get last month data
    $lastMonthQuery = "
        SELECT COUNT(*) as last_month_patients
        FROM user 
        WHERE is_doctor = 0 
        AND MONTH(created_at) = ? 
        AND YEAR(created_at) = ?
    ";
    $stmt2 = $conn->prepare($lastMonthQuery);
    $stmt2->bind_param('ii', $lastMonth, $lastMonthYear);
    $stmt2->execute();
    $lastMonthResult = $stmt2->get_result();
    $lastMonthPatients = $lastMonthResult->fetch_assoc()['last_month_patients'];
    
    // Calculate growth percentage
    $growthPercentage = 0;
    if ($lastMonthPatients > 0) {
        $growthPercentage = round((($currentMonthPatients - $lastMonthPatients) / $lastMonthPatients) * 100, 1);
    }
    
    // Get peak month
    $peakMonth = null;
    $maxPatients = 0;
    foreach ($monthlyData as $month) {
        if ($month['newPatients'] > $maxPatients) {
            $maxPatients = $month['newPatients'];
            $peakMonth = $month['month'];
        }
    }
    
    $stmt->close();
    $stmt2->close();

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'monthly_growth' => $monthlyData,
            'total_new_patients_12_months' => $totalNewPatients,
            'current_month_patients' => (int)$currentMonthPatients,
            'last_month_patients' => (int)$lastMonthPatients,
            'growth_percentage' => $growthPercentage,
            'peak_month' => $peakMonth,
            'peak_patients' => $maxPatients
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
