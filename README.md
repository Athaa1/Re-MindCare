# Re-MindCare

Re-MindCare adalah aplikasi kesehatan mental berbasis web yang dirancang untuk menyediakan dukungan, sumber daya, dan akses mudah ke para profesional. Aplikasi ini dibangun menggunakan Next.js untuk frontend dan PHP untuk backend.

## ✨ Fitur Utama

*   **Dashboard Pengguna:** Ringkasan aktivitas, statistik, dan janji temu yang akan datang.
*   **Pelacak Suasana Hati (Mood Tracker):** Membantu pengguna memantau dan mencatat keadaan emosional mereka dari waktu ke waktu.
*   **Forum Komunitas:** Ruang yang aman bagi pengguna untuk berdiskusi dan berbagi pengalaman, didukung oleh AI untuk analisis.
*   **Manajemen Janji Temu:** Sistem untuk membuat dan mengelola jadwal konsultasi dengan spesialis kesehatan mental.
*   **Pencarian Spesialis:** Fitur pencarian untuk membantu pengguna menemukan dokter atau terapis yang sesuai dengan kebutuhan mereka.
*   **Sumber Daya Edukasi:** Akses ke artikel dan informasi terpercaya terkait kesehatan mental.

## 🛠️ Tumpukan Teknologi

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) - React Framework
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/) - Utilitas-First CSS Framework
    *   [Shadcn/ui](https://ui.shadcn.com/) - Pustaka Komponen UI
*   **Backend:**
    *   [PHP](https://www.php.net/)
*   **Database:**
    *   MySQL (diasumsikan berjalan melalui XAMPP)
*   **AI & GenAI:**
    *   [Google Gemini](https://gemini.google.com/)
    *   [Firebase Genkit](https://firebase.google.com/docs/genkit)

## 🚀 Instalasi dan Setup

### Prasyarat

Pastikan perangkat Anda telah terpasang perangkat lunak berikut:
*   [Node.js](https://nodejs.org/en/) (versi 18.x atau yang lebih baru)
*   [XAMPP](https://www.apachefriends.org/index.html) (atau lingkungan server lokal lain yang mendukung PHP & MySQL)

### 1. Pengaturan Backend (PHP & Database)

1.  **Jalankan Server Lokal:** Buka XAMPP Control Panel, lalu jalankan modul **Apache** dan **MySQL**.
2.  **Pindahkan Proyek:** Pastikan folder proyek `Re-MindCare` ini berada di dalam direktori `htdocs` dari instalasi XAMPP Anda.
3.  **Buat Database:** Buka `phpMyAdmin` (biasanya di `http://localhost/phpmyadmin`) dan buat sebuah database baru. Contoh: `remindcare_db`.
4.  **Konfigurasi Koneksi:** Sesuaikan detail koneksi database di dalam file `backendPHP/connect.php` agar cocok dengan konfigurasi database Anda (host, username, password, nama database).
5.  **Inisialisasi Tabel:** Untuk membuat tabel yang diperlukan, akses skrip setup melalui browser Anda: `http://localhost/Re-MindCare/backendPHP/setup_doctors_table.php`.

### 2. Pengaturan Frontend (Next.js)

1.  **Install Dependensi:** Buka terminal di direktori root proyek `Re-MindCare` dan jalankan perintah berikut:
    ```bash
    npm install
    ```

2.  **Konfigurasi Environment Variable:**
    Buat sebuah file baru bernama `.env.local` di direktori root proyek. Tambahkan API Key Anda untuk Gemini.
    ```env
    # Ganti dengan API Key Google Gemini Anda
    NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

## 🏃‍♂️ Menjalankan Aplikasi

Setelah semua langkah instalasi dan setup selesai, jalankan server pengembangan Next.js dengan perintah:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi berjalan.