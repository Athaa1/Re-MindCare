
export type Resource = {
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  type: "Artikel" | "Video";
  content?: string;
};

export const resources: Resource[] = [
  {
    title: "Memahami Kecemasan pada Remaja",
    url: "/resources/understanding-anxiety",
    description: "Artikel mendalam yang membahas penyebab umum dan gejala kecemasan di kalangan remaja serta cara mengatasinya.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "teenager thinking",
    type: "Artikel",
    content: `Kecemasan adalah bagian normal dari kehidupan, tetapi ketika menjadi berlebihan, hal itu dapat mengganggu kehidupan sehari-hari seorang remaja. Gejalanya bisa berupa perasaan gelisah yang terus-menerus, kesulitan berkonsentrasi, dan bahkan gejala fisik seperti detak jantung yang cepat.

Penting untuk mengenali tanda-tanda ini. Beberapa penyebab umum kecemasan pada remaja termasuk tekanan akademis, masalah sosial, dan perubahan besar dalam hidup.

Ada beberapa strategi yang bisa membantu. Teknik relaksasi seperti pernapasan dalam dapat menenangkan sistem saraf. Olahraga teratur juga terbukti efektif dalam mengurangi gejala kecemasan. Jika kecemasan terasa luar biasa, berbicara dengan orang dewasa yang tepercaya atau mencari bantuan profesional adalah langkah yang sangat penting.`
  },
  {
    title: "Meditasi Kesadaran untuk Pemula",
    url: "https://www.youtube.com/embed/O-6f5wQXSu8",
    description: "Sesi video terpandu untuk memperkenalkan remaja pada praktik kesadaran untuk mengurangi stres dan kejernihan mental.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person meditating",
    type: "Video",
  },
  {
    title: "Pentingnya Tidur untuk Kesehatan Mental",
    url: "/resources/sleep-importance",
    description: "Pelajari hubungan penting antara kualitas tidur dan kesejahteraan mental bagi dewasa muda.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "person sleeping",
    type: "Artikel",
    content: `Tidur bukan hanya tentang mengistirahatkan tubuh; itu sangat penting untuk kesehatan mental. Selama tidur, otak memproses emosi dan mengkonsolidasikan ingatan. Kurang tidur dapat secara signifikan memengaruhi suasana hati, menyebabkan iritabilitas dan kesulitan mengelola stres.

Remaja membutuhkan sekitar 8-10 jam tidur per malam. Namun, banyak yang tidak mendapatkan cukup tidur karena jadwal yang padat dan penggunaan perangkat elektronik sebelum tidur.

Untuk meningkatkan kualitas tidur, coba buat rutinitas tidur yang konsisten, bahkan di akhir pekan. Hindari layar setidaknya satu jam sebelum tidur dan ciptakan lingkungan tidur yang tenang, gelap, dan sejuk.`
  },
  {
    title: "Membangun Persahabatan Sehat",
    url: "https://www.youtube.com/embed/gCarD8_i2fE",
    description: "Panduan video tentang cara membina persahabatan yang suportif dan positif selama masa remaja.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "friends talking",
    type: "Video",
  },
  {
    title: "Mengatasi Stres Ujian",
    url: "/resources/exam-stress",
    description: "Kiat dan strategi praktis untuk mengelola stres dan kecemasan selama masa ujian.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "student studying",
    type: "Artikel",
    content: `Stres ujian adalah pengalaman umum, tetapi ada cara efektif untuk mengelolanya. Kunci utamanya adalah persiapan. Membuat jadwal belajar yang terstruktur dan membaginya menjadi sesi-sesi yang lebih kecil dapat membuat materi terasa tidak terlalu menakutkan.

Jangan lupakan istirahat. Mengambil jeda singkat selama belajar dapat meningkatkan fokus dan retensi. Teknik seperti metode Pomodoro (25 menit belajar, 5 menit istirahat) bisa sangat membantu.

Pada hari ujian, pastikan Anda cukup tidur dan sarapan sehat. Latihan pernapasan cepat sebelum memasuki ruang ujian juga dapat membantu menenangkan saraf.`
  },
  {
    title: "Cara Berbicara dengan Orang Tua",
    url: "/resources/talk-to-parents",
    description: "Panduan tentang cara terbuka kepada orang tua mengenai masalah kesehatan mental Anda.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "family conversation",
    type: "Artikel",
    content: `Membicarakan kesehatan mental dengan orang tua bisa terasa sulit. Penting untuk memilih waktu dan tempat yang tepat, di mana Anda tidak akan terganggu.

Mulailah dengan mengungkapkan perasaan Anda menggunakan pernyataan "Saya". Misalnya, "Saya merasa sangat cemas akhir-akhir ini," bukan "Kalian membuat saya cemas."

Siapkan beberapa informasi dasar tentang apa yang Anda alami. Ini dapat membantu orang tua Anda memahami situasi dengan lebih baik. Jika Anda merasa gugup, Anda bahkan bisa menuliskan poin-poin utama yang ingin Anda sampaikan. Ingat, meminta bantuan adalah tanda kekuatan.`
  },
];

export const availableResourcesForAI = resources.map(
  ({ title, url, description }) => ({
    title,
    url,
    description,
  })
);
