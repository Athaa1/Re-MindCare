<?php
// Test script untuk endpoint monthly growth

echo "Testing monthly growth endpoint...\n\n";

// Test the endpoint
$url = 'http://localhost/Re-MindCare/backendPHP/Doctor/monthly-growth.php';
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json'
    ]
]);

$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    echo "❌ Failed to connect to endpoint\n";
    exit;
}

$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ Invalid JSON response\n";
    echo "Raw response: " . $response . "\n";
    exit;
}

echo "✅ Endpoint accessible\n";

if (isset($data['success']) && $data['success']) {
    echo "✅ Successful response\n\n";
    
    $stats = $data['data'];
    
    echo "📈 MONTHLY GROWTH STATISTICS:\n";
    echo "==============================\n";
    echo "Total New Patients (12 months): " . $stats['total_new_patients_12_months'] . "\n";
    echo "Current Month Patients: " . $stats['current_month_patients'] . "\n";
    echo "Last Month Patients: " . $stats['last_month_patients'] . "\n";
    echo "Growth Percentage: " . $stats['growth_percentage'] . "%\n";
    echo "Peak Month: " . $stats['peak_month'] . " (" . $stats['peak_patients'] . " patients)\n";
    
    echo "\n📊 MONTHLY BREAKDOWN:\n";
    echo "=====================\n";
    foreach ($stats['monthly_growth'] as $month) {
        $bar = str_repeat('█', min(20, $month['newPatients'])); // Visual bar
        echo sprintf("%-4s: %2d patients %s\n", $month['month'], $month['newPatients'], $bar);
    }
    
    echo "\n📋 INSIGHTS:\n";
    echo "============\n";
    
    if ($stats['growth_percentage'] > 0) {
        echo "✅ Positive growth: +" . $stats['growth_percentage'] . "% from last month\n";
    } elseif ($stats['growth_percentage'] < 0) {
        echo "📉 Negative growth: " . $stats['growth_percentage'] . "% from last month\n";
    } else {
        echo "➖ No growth change from last month\n";
    }
    
    $avg_patients = round($stats['total_new_patients_12_months'] / 12, 1);
    echo "📊 Average patients per month: " . $avg_patients . "\n";
    
    if ($stats['current_month_patients'] > $avg_patients) {
        echo "🎯 Current month is above average\n";
    } elseif ($stats['current_month_patients'] < $avg_patients) {
        echo "⚠️ Current month is below average\n";
    } else {
        echo "📈 Current month is at average\n";
    }
    
} else {
    echo "❌ Error in response: " . ($data['message'] ?? 'Unknown error') . "\n";
}

echo "\nTest completed!\n";
?>
