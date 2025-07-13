<?php
// Test script untuk endpoint doctor profile

echo "Testing doctor profile endpoint...\n\n";

// Test data
$testUserId = 1; // Assuming user ID 1 is a doctor
$testProfileData = [
    'user_id' => $testUserId,
    'name' => 'Dr. John Doe',
    'title' => 'Sp.KJ, M.Psi',
    'specialties' => ['Kecemasan', 'Depresi', 'Terapi Kognitif'],
    'bio' => 'Dokter spesialis kejiwaan dengan pengalaman 10 tahun dalam menangani masalah kesehatan mental. Berpengalaman dalam terapi kognitif behavioral dan konseling keluarga.',
    'imageUrl' => 'https://example.com/doctor-photo.jpg',
    'imageHint' => 'Foto profil Dr. John Doe'
];

echo "1. Testing GET endpoint (fetch profile)...\n";
$getUrl = "http://localhost/Re-MindCare/backendPHP/Doctor/profile.php?user_id=" . $testUserId;
$getContext = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json'
    ]
]);

$getResponse = file_get_contents($getUrl, false, $getContext);
if ($getResponse !== FALSE) {
    $getData = json_decode($getResponse, true);
    if ($getData && isset($getData['success'])) {
        if ($getData['success']) {
            echo "✅ GET request successful\n";
            echo "User data: " . json_encode($getData['data']['user'], JSON_PRETTY_PRINT) . "\n";
            if ($getData['data']['doctor_profile']) {
                echo "Doctor profile exists: " . json_encode($getData['data']['doctor_profile'], JSON_PRETTY_PRINT) . "\n";
            } else {
                echo "ℹ️ No doctor profile found (will create new)\n";
            }
        } else {
            echo "❌ GET request failed: " . $getData['message'] . "\n";
        }
    } else {
        echo "❌ Invalid JSON response from GET\n";
    }
} else {
    echo "❌ Failed to connect for GET request\n";
}

echo "\n2. Testing POST endpoint (create/update profile)...\n";
$postUrl = "http://localhost/Re-MindCare/backendPHP/Doctor/profile.php";
$postContext = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($testProfileData)
    ]
]);

$postResponse = file_get_contents($postUrl, false, $postContext);
if ($postResponse !== FALSE) {
    $postData = json_decode($postResponse, true);
    if ($postData && isset($postData['success'])) {
        if ($postData['success']) {
            echo "✅ POST request successful: " . $postData['message'] . "\n";
        } else {
            echo "❌ POST request failed: " . $postData['message'] . "\n";
        }
    } else {
        echo "❌ Invalid JSON response from POST\n";
        echo "Raw response: " . $postResponse . "\n";
    }
} else {
    echo "❌ Failed to connect for POST request\n";
}

echo "\n3. Verifying data after POST...\n";
$verifyResponse = file_get_contents($getUrl, false, $getContext);
if ($verifyResponse !== FALSE) {
    $verifyData = json_decode($verifyResponse, true);
    if ($verifyData && $verifyData['success'] && $verifyData['data']['doctor_profile']) {
        echo "✅ Profile verified after POST\n";
        $profile = $verifyData['data']['doctor_profile'];
        echo "Name: " . $profile['name'] . "\n";
        echo "Title: " . $profile['title'] . "\n";
        echo "Specialties: " . json_encode($profile['specialties']) . "\n";
        echo "Bio length: " . strlen($profile['bio']) . " characters\n";
    } else {
        echo "❌ Failed to verify profile after POST\n";
    }
}

echo "\nTest completed!\n";
?>
