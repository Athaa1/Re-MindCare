<?php
require_once __DIR__ . '/backendPHP/connect.php';

echo "=== User Table ===\n";
$users = $pdo->query('SELECT * FROM user LIMIT 5')->fetchAll(PDO::FETCH_ASSOC);
foreach ($users as $user) {
    echo "ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}\n";
}

echo "\n=== Doctors Table ===\n";
$doctors = $pdo->query('SELECT * FROM doctors LIMIT 5')->fetchAll(PDO::FETCH_ASSOC);
foreach ($doctors as $doctor) {
    echo "ID: {$doctor['id']}, User_ID: {$doctor['user_id']}, Name: {$doctor['name']}\n";
}

echo "\n=== Appointments Table ===\n";
try {
    $appointments = $pdo->query('SELECT * FROM appointments LIMIT 5')->fetchAll(PDO::FETCH_ASSOC);
    if (empty($appointments)) {
        echo "No appointments found\n";
    } else {
        foreach ($appointments as $apt) {
            echo "ID: {$apt['id']}, User_ID: {$apt['user_id']}, Doctor_ID: {$apt['doctor_id']}, Date: {$apt['appointment_date']}\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== Foreign Key Relationships ===\n";
echo "Checking if user_id=1 exists in user table: ";
$userExists = $pdo->query("SELECT COUNT(*) FROM user WHERE id = 1")->fetchColumn();
echo $userExists ? "YES\n" : "NO\n";

echo "Checking if doctor_id=1 exists in doctors table: ";
$doctorExists = $pdo->query("SELECT COUNT(*) FROM doctors WHERE id = 1")->fetchColumn();
echo $doctorExists ? "YES\n" : "NO\n";
?>
