<?php
require_once __DIR__ . '/backendPHP/connect.php';

echo "=== Fixing Foreign Key Constraints ===\n";

try {
    // Drop existing foreign key constraints
    echo "Dropping existing foreign key constraints...\n";
    $pdo->exec("ALTER TABLE appointments DROP FOREIGN KEY appointments_ibfk_1");
    $pdo->exec("ALTER TABLE appointments DROP FOREIGN KEY appointments_ibfk_2");
    echo "✅ Dropped existing constraints\n";
} catch (Exception $e) {
    echo "Note: " . $e->getMessage() . "\n";
}

try {
    // Add correct foreign key constraints
    echo "Adding correct foreign key constraints...\n";
    $pdo->exec("ALTER TABLE appointments ADD CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES user(id)");
    $pdo->exec("ALTER TABLE appointments ADD CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id)");
    echo "✅ Added correct foreign key constraints\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== Verifying Constraints ===\n";
$constraints = $pdo->query("
    SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = 'remindcare' 
    AND TABLE_NAME = 'appointments' 
    AND REFERENCED_TABLE_NAME IS NOT NULL
")->fetchAll(PDO::FETCH_ASSOC);

foreach ($constraints as $constraint) {
    echo "✅ {$constraint['CONSTRAINT_NAME']}: {$constraint['TABLE_NAME']}.{$constraint['COLUMN_NAME']} -> {$constraint['REFERENCED_TABLE_NAME']}.{$constraint['REFERENCED_COLUMN_NAME']}\n";
}
?>
