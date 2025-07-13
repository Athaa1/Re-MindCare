<?php
// Test script khusus untuk menguji specialties

echo "Testing specialties handling...\n\n";

// Test data dengan specialties
$testData = [
    'user_id' => 1,
    'name' => 'Dr. Test Specialties',
    'title' => 'Sp.KJ',
    'specialties' => ['Kecemasan', 'Depresi', 'Terapi Kognitif', 'Konseling Keluarga'],
    'bio' => 'Test bio untuk specialties',
    'imageUrl' => '',
    'imageHint' => ''
];

echo "📤 Sending data to server:\n";
echo "Specialties array: " . json_encode($testData['specialties']) . "\n";
echo "Full data: " . json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Send POST request
$url = "http://localhost/Re-MindCare/backendPHP/Doctor/profile.php";
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($testData)
    ]
]);

echo "📡 Sending POST request...\n";
$response = file_get_contents($url, false, $context);

if ($response !== FALSE) {
    echo "✅ Response received:\n";
    echo $response . "\n\n";
    
    $responseData = json_decode($response, true);
    if ($responseData && $responseData['success']) {
        echo "✅ POST successful!\n\n";
        
        // Now fetch the data back to verify
        echo "📥 Fetching data back to verify...\n";
        $getUrl = $url . "?user_id=1";
        $getResponse = file_get_contents($getUrl);
        
        if ($getResponse !== FALSE) {
            $getData = json_decode($getResponse, true);
            if ($getData && $getData['success']) {
                $profile = $getData['data']['doctor_profile'];
                echo "✅ Data retrieved successfully!\n";
                echo "Stored specialties: " . json_encode($profile['specialties']) . "\n";
                echo "Specialties type: " . gettype($profile['specialties']) . "\n";
                echo "Specialties count: " . count($profile['specialties']) . "\n";
                
                if (is_array($profile['specialties']) && count($profile['specialties']) > 0) {
                    echo "✅ Specialties are correctly stored as array!\n";
                    foreach ($profile['specialties'] as $index => $specialty) {
                        echo "  [$index]: $specialty\n";
                    }
                } else {
                    echo "❌ Specialties are not stored correctly!\n";
                    echo "Raw specialties from DB: " . var_export($profile['specialties'], true) . "\n";
                }
            } else {
                echo "❌ Failed to retrieve data: " . ($getData['message'] ?? 'Unknown error') . "\n";
            }
        } else {
            echo "❌ Failed to fetch verification data\n";
        }
    } else {
        echo "❌ POST failed: " . ($responseData['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "❌ Failed to send POST request\n";
}

echo "\n📋 Checking PHP error log for debug info...\n";
echo "Check your PHP error log for detailed debug output.\n";

echo "\nTest completed!\n";
?>
