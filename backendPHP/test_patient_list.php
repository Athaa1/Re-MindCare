<?php
// Test script untuk endpoint patient list

echo "Testing patient list endpoint...\n\n";

// Test the endpoint
$url = 'http://localhost/Re-MindCare/backendPHP/Doctor/patient-list.php';
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
echo "Response structure:\n";
print_r($data);

if (isset($data['success']) && $data['success']) {
    echo "\n✅ Successful response\n";
    echo "Total patients: " . count($data['patients']) . "\n";
    
    if (!empty($data['patients'])) {
        echo "\nSample patient data:\n";
        $sample = $data['patients'][0];
        print_r($sample);
    }
} else {
    echo "\n❌ Error in response: " . ($data['message'] ?? 'Unknown error') . "\n";
}

echo "\nTest completed!\n";
?>
