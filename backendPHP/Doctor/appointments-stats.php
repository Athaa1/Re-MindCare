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
    // Get current month and year
    $currentYear = date('Y');
    $currentMonth = date('m');
    $lastMonth = date('m', strtotime('-1 month'));
    $lastMonthYear = date('Y', strtotime('-1 month'));
    
    // Get appointments for current month
    $currentMonthQuery = "
        SELECT COUNT(*) as current_month_appointments
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id  
        WHERE YEAR(a.appointment_date) = ? 
        AND MONTH(a.appointment_date) = ?
        AND a.status != 'canceled'
    ";
    
    $stmt = $pdo->prepare($currentMonthQuery);
    $stmt->execute([$currentYear, $currentMonth]);
    $currentMonthResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $currentMonthAppointments = $currentMonthResult['current_month_appointments'];
    
    // Get appointments for last month
    $lastMonthQuery = "
        SELECT COUNT(*) as last_month_appointments
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id  
        WHERE YEAR(a.appointment_date) = ? 
        AND MONTH(a.appointment_date) = ?
        AND a.status != 'canceled'
    ";
    
    $stmt = $pdo->prepare($lastMonthQuery);
    $stmt->execute([$lastMonthYear, $lastMonth]);
    $lastMonthResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $lastMonthAppointments = $lastMonthResult['last_month_appointments'];
    
    // Calculate growth percentage
    $growthPercentage = 0;
    if ($lastMonthAppointments > 0) {
        $growthPercentage = round((($currentMonthAppointments - $lastMonthAppointments) / $lastMonthAppointments) * 100, 1);
    } elseif ($currentMonthAppointments > 0) {
        $growthPercentage = 100; // 100% growth if no appointments last month but some this month
    }
    
    // Get weekly breakdown for current month
    $weeklyQuery = "
        SELECT 
            WEEK(a.appointment_date, 1) - WEEK(DATE_SUB(a.appointment_date, INTERVAL DAYOFMONTH(a.appointment_date) - 1 DAY), 1) + 1 AS week_of_month,
            COUNT(*) as appointments_count
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id  
        WHERE YEAR(a.appointment_date) = ? 
        AND MONTH(a.appointment_date) = ?
        AND a.status != 'canceled'
        GROUP BY week_of_month
        ORDER BY week_of_month
    ";
    
    $stmt = $pdo->prepare($weeklyQuery);
    $stmt->execute([$currentYear, $currentMonth]);
    $weeklyData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format weekly data
    $formattedWeeklyData = [];
    for ($week = 1; $week <= 5; $week++) {
        $weekData = array_filter($weeklyData, function($item) use ($week) {
            return $item['week_of_month'] == $week;
        });
        
        $appointmentsCount = !empty($weekData) ? reset($weekData)['appointments_count'] : 0;
        
        $formattedWeeklyData[] = [
            'week' => "Minggu $week",
            'appointments' => intval($appointmentsCount)
        ];
    }
    
    // Get status breakdown for current month
    $statusQuery = "
        SELECT 
            a.status,
            COUNT(*) as count
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id  
        WHERE YEAR(a.appointment_date) = ? 
        AND MONTH(a.appointment_date) = ?
        GROUP BY a.status
    ";
    
    $stmt = $pdo->prepare($statusQuery);
    $stmt->execute([$currentYear, $currentMonth]);
    $statusData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get upcoming appointments count for this month
    $upcomingQuery = "
        SELECT COUNT(*) as upcoming_count
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id  
        WHERE a.appointment_date >= CURDATE()
        AND YEAR(a.appointment_date) = ? 
        AND MONTH(a.appointment_date) = ?
        AND a.status = 'confirmed'
    ";
    
    $stmt = $pdo->prepare($upcomingQuery);
    $stmt->execute([$currentYear, $currentMonth]);
    $upcomingResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $upcomingAppointments = $upcomingResult['upcoming_count'];
    
    $response = [
        'success' => true,
        'data' => [
            'current_month_appointments' => intval($currentMonthAppointments),
            'last_month_appointments' => intval($lastMonthAppointments),
            'growth_percentage' => $growthPercentage,
            'upcoming_appointments' => intval($upcomingAppointments),
            'weekly_breakdown' => $formattedWeeklyData,
            'status_breakdown' => array_map(function($item) {
                return [
                    'status' => $item['status'],
                    'count' => intval($item['count'])
                ];
            }, $statusData),
            'month_name' => date('F Y'),
            'current_month' => intval($currentMonth),
            'current_year' => intval($currentYear)
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
