<?php
// Test script untuk endpoint engagement

echo "Testing engagement endpoint...\n\n";

// Test the endpoint
$url = 'http://localhost/Re-MindCare/backendPHP/Doctor/engagement.php';
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
    
    echo "📊 PATIENT ENGAGEMENT STATISTICS:\n";
    echo "=====================================\n";
    echo "Total Patients: " . $stats['total_patients'] . "\n";
    echo "New Patients This Month: " . $stats['new_patients_this_month'] . "\n";
    echo "Growth from Last Month: " . $stats['growth_from_last_month'] . "\n";
    echo "Recently Active (7 days): " . $stats['recently_active_patients'] . "\n";
    echo "Ever Tracked Mood: " . $stats['ever_tracked_patients'] . "\n";
    echo "Active Today: " . $stats['today_active_patients'] . "\n";
    echo "Engagement Percentage: " . $stats['engagement_percentage'] . "%\n";
    echo "Adoption Percentage: " . $stats['adoption_percentage'] . "%\n";
    echo "Average Mood: " . ($stats['average_mood'] ?? 'N/A') . "\n";
    echo "Recent Patients Count: " . count($stats['recent_patients']) . "\n";
    
    echo "\n📈 ENGAGEMENT INSIGHTS:\n";
    echo "======================\n";
    
    if ($stats['engagement_percentage'] >= 50) {
        echo "✅ High engagement - " . $stats['engagement_percentage'] . "% of patients are actively tracking mood\n";
    } elseif ($stats['engagement_percentage'] >= 25) {
        echo "⚠️ Moderate engagement - " . $stats['engagement_percentage'] . "% of patients are actively tracking mood\n";
    } else {
        echo "🔴 Low engagement - Only " . $stats['engagement_percentage'] . "% of patients are actively tracking mood\n";
    }
    
    if ($stats['adoption_percentage'] >= 75) {
        echo "✅ Excellent adoption rate - " . $stats['adoption_percentage'] . "% of patients have tried mood tracking\n";
    } elseif ($stats['adoption_percentage'] >= 50) {
        echo "✅ Good adoption rate - " . $stats['adoption_percentage'] . "% of patients have tried mood tracking\n";
    } else {
        echo "⚠️ Room for improvement - " . $stats['adoption_percentage'] . "% adoption rate\n";
    }
    
    if ($stats['average_mood']) {
        if ($stats['average_mood'] >= 4) {
            echo "😊 Patients are generally feeling good (avg mood: " . $stats['average_mood'] . "/5)\n";
        } elseif ($stats['average_mood'] >= 3) {
            echo "😐 Patients are feeling okay (avg mood: " . $stats['average_mood'] . "/5)\n";
        } else {
            echo "😟 Patients may need more support (avg mood: " . $stats['average_mood'] . "/5)\n";
        }
    } else {
        echo "❓ No mood data available for analysis\n";
    }
    
} else {
    echo "❌ Error in response: " . ($data['message'] ?? 'Unknown error') . "\n";
}

echo "\nTest completed!\n";
?>
