import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==========================================
  // USERS
  // ==========================================
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "superadmin@desasukamaju.id" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@desasukamaju.id",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@desasukamaju.id" },
    update: {},
    create: {
      name: "Admin Desa",
      email: "admin@desasukamaju.id",
      password: hashedPassword,
      role: "ADMIN_DESA",
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: "operator@desasukamaju.id" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "operator@desasukamaju.id",
      password: hashedPassword,
      role: "OPERATOR",
    },
  });

  // ==========================================
  // VILLAGE PROFILE
  // ==========================================
  await prisma.villageProfile.upsert({
    where: { id: "village-profile-1" },
    update: {},
    create: {
      id: "village-profile-1",
      history: `Desa Sukamaju berdiri sejak tahun 1945, tepat saat Indonesia memproklamasikan kemerdekaannya. Awalnya merupakan wilayah perkebunan yang kemudian berkembang menjadi pemukiman. Nama "Sukamaju" berasal dari kata "suka" yang berarti senang/gemar dan "maju" yang berarti berkembang, mencerminkan semangat warga yang selalu ingin maju dan berkembang bersama.

Pada era tahun 1960-an, Desa Sukamaju mulai berkembang pesat dengan adanya program transmigrasi lokal. Penduduk dari berbagai daerah datang dan menetap, membawa kekayaan budaya yang beragam. Infrastruktur desa mulai dibangun secara bertahap oleh pemerintah kolonial Belanda dan kemudian dilanjutkan oleh pemerintah Indonesia.

Memasuki era reformasi tahun 1998, Desa Sukamaju mengalami transformasi besar dalam tata kelola pemerintahan. Dengan diterapkannya otonomi daerah, desa mendapat kewenangan lebih besar untuk mengelola potensi dan sumber daya yang ada. Sejak saat itu, berbagai program pembangunan terus dijalankan untuk meningkatkan kesejahteraan warga.`,
      vision: "Mewujudkan Desa Sukamaju yang Maju, Mandiri, Sejahtera, dan Berkeadilan berbasis pada Potensi Lokal dan Nilai-nilai Gotong Royong",
      mission: `1. Meningkatkan kualitas pelayanan publik yang transparan, akuntabel, dan profesional
2. Mengembangkan potensi ekonomi lokal melalui pemberdayaan UMKM dan pertanian modern
3. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan
4. Membangun infrastruktur desa yang memadai dan berkelanjutan
5. Melestarikan budaya dan kearifan lokal sebagai identitas desa
6. Menciptakan lingkungan yang bersih, sehat, dan asri untuk generasi mendatang`,
      kepalaName: "H. Ahmad Fauzi, S.Sos",
      kepalaQuote: "Bersama warga, kita wujudkan Desa Sukamaju yang maju, mandiri, dan sejahtera. Setiap langkah pembangunan adalah wujud nyata dari komitmen kita untuk masa depan yang lebih baik.",
      address: "Jl. Raya Sukamaju No. 1, Kecamatan Ciawi, Kabupaten Bogor, Jawa Barat 16730",
      phone: "(0251) 123456",
      email: "desasukamaju@gmail.com",
      whatsapp: "628123456789",
      latitude: -6.6270,
      longitude: 106.8500,
    },
  });

  // ==========================================
  // STATISTIK
  // ==========================================
  const statistics = [
    // POPULATION
    { category: "POPULATION", label: "Total Penduduk", value: 4521, year: 2025 },
    { category: "POPULATION", label: "Jumlah KK", value: 1247, year: 2025 },
    { category: "POPULATION", label: "Jumlah RT", value: 24, year: 2025 },
    { category: "POPULATION", label: "Jumlah RW", value: 6, year: 2025 },
    // GENDER
    { category: "GENDER", label: "Laki-laki", value: 2280, year: 2025 },
    { category: "GENDER", label: "Perempuan", value: 2241, year: 2025 },
    // EDUCATION
    { category: "EDUCATION", label: "Tidak Sekolah", value: 120, year: 2025 },
    { category: "EDUCATION", label: "SD", value: 980, year: 2025 },
    { category: "EDUCATION", label: "SMP", value: 850, year: 2025 },
    { category: "EDUCATION", label: "SMA/SMK", value: 1450, year: 2025 },
    { category: "EDUCATION", label: "D3", value: 320, year: 2025 },
    { category: "EDUCATION", label: "S1", value: 680, year: 2025 },
    { category: "EDUCATION", label: "S2/S3", value: 121, year: 2025 },
    // OCCUPATION
    { category: "OCCUPATION", label: "Petani", value: 650, year: 2025 },
    { category: "OCCUPATION", label: "Pedagang", value: 380, year: 2025 },
    { category: "OCCUPATION", label: "PNS/TNI/Polri", value: 210, year: 2025 },
    { category: "OCCUPATION", label: "Swasta", value: 920, year: 2025 },
    { category: "OCCUPATION", label: "Wirausaha", value: 450, year: 2025 },
    { category: "OCCUPATION", label: "Buruh", value: 480, year: 2025 },
    { category: "OCCUPATION", label: "Lainnya", value: 431, year: 2025 },
    // RELIGION
    { category: "RELIGION", label: "Islam", value: 4200, year: 2025 },
    { category: "RELIGION", label: "Kristen", value: 180, year: 2025 },
    { category: "RELIGION", label: "Katolik", value: 95, year: 2025 },
    { category: "RELIGION", label: "Hindu", value: 30, year: 2025 },
    { category: "RELIGION", label: "Buddha", value: 16, year: 2025 },
    // AGE
    { category: "AGE", label: "0-14 tahun", value: 1150, year: 2025 },
    { category: "AGE", label: "15-29 tahun", value: 1230, year: 2025 },
    { category: "AGE", label: "30-44 tahun", value: 980, year: 2025 },
    { category: "AGE", label: "45-59 tahun", value: 720, year: 2025 },
    { category: "AGE", label: "60+ tahun", value: 441, year: 2025 },
  ];

  for (const stat of statistics) {
    await prisma.statistic.create({ data: stat });
  }

  // ==========================================
  // BERITA
  // ==========================================
  const news = [
    {
      title: "Pembangunan Jalan Desa Sepanjang 2 Km Selesai Dikerjakan",
      slug: "pembangunan-jalan-desa-sepanjang-2-km-selesai",
      excerpt: "Proyek pembangunan jalan desa yang didanai dari Dana Desa tahun 2025 telah berhasil diselesaikan tepat waktu.",
      content: `Desa Sukamaju kembali menorehkan prestasi dalam pembangunan infrastruktur. Proyek pembangunan jalan desa sepanjang 2 kilometer yang menghubungkan dusun Cibatu dengan pusat desa telah berhasil diselesaikan lebih cepat dari jadwal yang direncanakan.

Kepala Desa H. Ahmad Fauzi mengatakan bahwa pembangunan jalan ini merupakan salah satu prioritas utama dalam Rencana Pembangunan Jangka Menengah Desa (RPJMDes) 2021-2026. "Kami sangat bersyukur proyek ini bisa selesai dengan baik. Ini adalah bukti nyata komitmen pemerintah desa untuk meningkatkan kualitas hidup warga," ujar Kades.

Jalan dengan lebar 4 meter dan panjang 2 kilometer ini dikerjakan dengan menggunakan beton bertulang, sehingga diharapkan dapat bertahan selama minimal 20 tahun. Biaya pembangunan sebesar Rp 850 juta bersumber dari Dana Desa tahun 2025 dan swadaya masyarakat.

Dengan selesainya pembangunan jalan ini, akses warga dusun Cibatu menuju pusat desa kini menjadi lebih mudah dan aman, terutama pada musim hujan ketika jalan lama sering tergenang air.`,
      category: "INFRASTRUKTUR",
      isPublished: true,
      publishedAt: new Date("2025-12-15"),
      image: "https://picsum.photos/seed/jalan/800/450",
      authorId: operator.id,
    },
    {
      title: "Posyandu Desa Sukamaju Terima Penghargaan Terbaik Tingkat Kabupaten",
      slug: "posyandu-desa-sukamaju-terima-penghargaan-terbaik",
      excerpt: "Posyandu Melati Desa Sukamaju berhasil meraih penghargaan Posyandu Terbaik tingkat Kabupaten Bogor tahun 2025.",
      content: `Kabar membanggakan datang dari Posyandu Melati Desa Sukamaju. Posyandu yang aktif melayani warga sejak tahun 2010 ini berhasil meraih penghargaan sebagai Posyandu Terbaik tingkat Kabupaten Bogor dalam rangka Hari Kesehatan Nasional 2025.

Penghargaan diserahkan langsung oleh Bupati Bogor kepada Ketua Posyandu Ibu Sari Dewi di Aula Pemkab Bogor. Penilaian dilakukan berdasarkan berbagai indikator, termasuk kelengkapan fasilitas, kualitas pelayanan, cakupan balita, dan inovasi program.

Salah satu inovasi yang menjadi keunggulan Posyandu Melati adalah program "Cegah Stunting dengan Gizi Lokal" yang memanfaatkan bahan pangan lokal untuk memenuhi kebutuhan gizi balita. Program ini terbukti berhasil menurunkan angka stunting di Desa Sukamaju dari 18% menjadi 8% dalam waktu dua tahun.`,
      category: "KESEHATAN",
      isPublished: true,
      publishedAt: new Date("2025-12-10"),
      image: "https://picsum.photos/seed/posyandu/800/450",
      authorId: operator.id,
    },
    {
      title: "UMKM Desa Sukamaju Berhasil Tembus Pasar Ekspor ke Malaysia",
      slug: "umkm-desa-sukamaju-tembus-pasar-ekspor-malaysia",
      excerpt: "Kelompok pengrajin batik Desa Sukamaju berhasil melakukan ekspor perdana batik motif khas desa ke Malaysia.",
      content: `Prestasi membanggakan diraih oleh kelompok pengrajin batik Desa Sukamaju. Untuk pertama kalinya, produk batik dengan motif khas desa berhasil diekspor ke Malaysia dengan order senilai Rp 120 juta.

Produk batik motif "Padi Menguning" khas Desa Sukamaju berhasil menarik minat buyer dari Malaysia setelah dipromosikan melalui platform digital dan pameran virtual ASEAN Craft Festival 2025. Kelompok pengrajin yang beranggotakan 25 orang ibu rumah tangga ini kini mendapatkan pesanan rutin setiap bulannya.

Kepala Desa H. Ahmad Fauzi mengungkapkan rasa bangganya atas pencapaian ini. "Ini membuktikan bahwa produk lokal kita memiliki kualitas internasional. Ke depan, kita akan terus mendorong dan mendukung UMKM desa untuk berkembang lebih jauh," katanya.`,
      category: "UMKM",
      isPublished: true,
      publishedAt: new Date("2025-12-05"),
      image: "https://picsum.photos/seed/batik/800/450",
      authorId: operator.id,
    },
    {
      title: "Musrenbang Desa 2026: Warga Usulkan Program Digitalisasi Pelayanan",
      slug: "musrenbang-desa-2026-program-digitalisasi",
      excerpt: "Musyawarah Rencana Pembangunan Desa tahun 2026 berlangsung meriah dengan berbagai usulan inovatif dari warga.",
      content: `Musyawarah Rencana Pembangunan (Musrenbang) Desa Sukamaju untuk tahun anggaran 2026 telah digelar di Balai Desa dengan dihadiri oleh seluruh perangkat desa, tokoh masyarakat, dan perwakilan warga dari 6 RW.

Dalam musyawarah yang berlangsung selama setengah hari tersebut, berbagai usulan disampaikan oleh warga. Yang paling menonjol adalah usulan program digitalisasi pelayanan publik desa, termasuk pembangunan website desa modern, aplikasi pengaduan digital, dan sistem layanan surat online.

Usulan lainnya yang mendapat banyak dukungan antara lain: pembangunan gedung serbaguna, renovasi kantor desa, pengembangan wisata alam, dan pelatihan keterampilan digital bagi generasi muda.`,
      category: "PEMERINTAHAN",
      isPublished: true,
      publishedAt: new Date("2025-11-28"),
      image: "https://picsum.photos/seed/musrenbang/800/450",
      authorId: operator.id,
    },
    {
      title: "Festival Panen Raya 2025 Meriah dengan Ratusan Pengunjung",
      slug: "festival-panen-raya-2025-meriah",
      excerpt: "Festival Panen Raya tahunan Desa Sukamaju sukses digelar dengan berbagai pertunjukan seni budaya dan pameran produk lokal.",
      content: `Festival Panen Raya Desa Sukamaju 2025 sukses digelar selama tiga hari berturut-turut di lapangan desa. Festival yang telah menjadi agenda tahunan ini berhasil menarik ratusan pengunjung dari berbagai daerah di Kabupaten Bogor.

Acara dibuka oleh Kepala Desa H. Ahmad Fauzi dengan penampilan tari tradisional dan prosesi syukuran panen. Selama tiga hari, berbagai pertunjukan seni dan budaya ditampilkan, mulai dari wayang golek, pencak silat, hingga hiburan modern.

Pameran produk UMKM lokal menjadi daya tarik tersendiri, dengan lebih dari 50 stand yang menampilkan berbagai produk unggulan desa seperti batik, kerajinan bambu, produk pertanian organik, dan kuliner khas desa.`,
      category: "KEGIATAN",
      isPublished: true,
      publishedAt: new Date("2025-11-20"),
      image: "https://picsum.photos/seed/festival/800/450",
      authorId: operator.id,
    },
    {
      title: "Program Beasiswa Desa untuk 10 Mahasiswa Berprestasi",
      slug: "program-beasiswa-desa-10-mahasiswa-berprestasi",
      excerpt: "Pemerintah Desa Sukamaju meluncurkan program beasiswa untuk mendukung putra-putri desa yang berprestasi namun kurang mampu.",
      content: `Pemerintah Desa Sukamaju resmi meluncurkan Program Beasiswa Desa Sukamaju (PBDS) untuk tahun akademik 2025/2026. Program ini bertujuan untuk mendukung akses pendidikan tinggi bagi putra-putri desa yang berprestasi namun mengalami kendala ekonomi.

Sebanyak 10 penerima beasiswa terpilih melalui proses seleksi ketat yang meliputi penilaian prestasi akademik, kondisi ekonomi keluarga, dan wawancara. Para penerima akan mendapatkan bantuan biaya kuliah sebesar Rp 5 juta per semester selama maksimal 4 tahun.

Kepala Desa menjelaskan bahwa program ini merupakan bentuk investasi jangka panjang desa dalam meningkatkan kualitas sumber daya manusia. "Kami percaya bahwa pendidikan adalah kunci kemajuan. Dengan mendukung generasi muda kita, kita sedang membangun masa depan desa yang lebih cerah," ujarnya.`,
      category: "PENDIDIKAN",
      isPublished: true,
      publishedAt: new Date("2025-11-15"),
      image: "https://picsum.photos/seed/beasiswa/800/450",
      authorId: operator.id,
    },
  ];

  for (const item of news) {
    await prisma.news.create({ data: item });
  }

  // ==========================================
  // AGENDA
  // ==========================================
  const agendas = [
    {
      title: "Rapat Koordinasi Perangkat Desa",
      description: "Rapat koordinasi bulanan seluruh perangkat desa untuk evaluasi program dan perencanaan kegiatan bulan depan.",
      location: "Kantor Desa Sukamaju",
      date: new Date("2026-01-08"),
      startTime: "09:00",
      endTime: "12:00",
      status: "UPCOMING",
    },
    {
      title: "Posyandu Balita RW 01-03",
      description: "Kegiatan Posyandu rutin untuk pemantauan tumbuh kembang balita, imunisasi, dan konsultasi gizi.",
      location: "Balai RW 01, RW 02, RW 03",
      date: new Date("2026-01-12"),
      startTime: "08:00",
      endTime: "11:00",
      status: "UPCOMING",
    },
    {
      title: "Gotong Royong Kebersihan Desa",
      description: "Kegiatan gotong royong membersihkan lingkungan desa, selokan, dan fasilitas umum bersama seluruh warga.",
      location: "Seluruh wilayah Desa Sukamaju",
      date: new Date("2026-01-15"),
      startTime: "07:00",
      endTime: "10:00",
      status: "UPCOMING",
    },
    {
      title: "Pelatihan Digital Marketing UMKM",
      description: "Pelatihan pemasaran digital untuk pelaku UMKM desa. Materi meliputi media sosial, marketplace, dan foto produk.",
      location: "Aula Balai Desa",
      date: new Date("2026-01-20"),
      startTime: "09:00",
      endTime: "15:00",
      status: "UPCOMING",
    },
    {
      title: "Musyawarah Desa Pertanggungjawaban APBDes 2025",
      description: "Musyawarah desa untuk menyampaikan pertanggungjawaban penggunaan Anggaran Pendapatan dan Belanja Desa tahun 2025.",
      location: "Balai Desa Sukamaju",
      date: new Date("2026-01-25"),
      startTime: "09:00",
      endTime: "13:00",
      status: "UPCOMING",
    },
    {
      title: "Pemeriksaan Kesehatan Gratis Lansia",
      description: "Pemeriksaan kesehatan gratis untuk warga lansia meliputi cek tekanan darah, gula darah, kolesterol, dan konsultasi dokter.",
      location: "Puskesdes Desa Sukamaju",
      date: new Date("2026-02-05"),
      startTime: "08:00",
      endTime: "12:00",
      status: "UPCOMING",
    },
  ];

  for (const item of agendas) {
    await prisma.agenda.create({ data: item });
  }

  // ==========================================
  // GALERI
  // ==========================================
  const galleries = [
    { title: "Kantor Desa Sukamaju", url: "https://picsum.photos/seed/kantor/800/600", category: "Fasilitas" },
    { title: "Sawah Desa yang Subur", url: "https://picsum.photos/seed/sawah/800/600", category: "Pertanian" },
    { title: "Festival Budaya 2025", url: "https://picsum.photos/seed/budaya/800/600", category: "Kegiatan" },
    { title: "Posyandu Balita", url: "https://picsum.photos/seed/posyandu2/800/600", category: "Kesehatan" },
    { title: "Pelatihan UMKM Digital", url: "https://picsum.photos/seed/umkm/800/600", category: "UMKM" },
    { title: "Pemandangan Alam Desa", url: "https://picsum.photos/seed/alam/800/600", category: "Wisata" },
    { title: "Gotong Royong Warga", url: "https://picsum.photos/seed/gotongroyong/800/600", category: "Kegiatan" },
    { title: "Jembatan Desa Baru", url: "https://picsum.photos/seed/jembatan/800/600", category: "Infrastruktur" },
    { title: "Produk Kerajinan Lokal", url: "https://picsum.photos/seed/kerajinan/800/600", category: "UMKM" },
    { title: "Upacara Kemerdekaan", url: "https://picsum.photos/seed/upacara/800/600", category: "Kegiatan" },
    { title: "Embung Desa", url: "https://picsum.photos/seed/embung/800/600", category: "Fasilitas" },
    { title: "Taman Bermain Anak", url: "https://picsum.photos/seed/taman/800/600", category: "Fasilitas" },
  ];

  for (const item of galleries) {
    await prisma.gallery.create({ data: { ...item, type: "PHOTO" } });
  }

  // ==========================================
  // POTENSI DESA
  // ==========================================
  const potentials = [
    {
      title: "Curug Sukamaju",
      slug: "curug-sukamaju",
      description: "Air terjun setinggi 15 meter dengan kolam alami yang jernih. Dikelilingi hutan tropis yang asri, menjadi destinasi wisata alam favorit warga Bogor dan sekitarnya. Tersedia area camping, warung makan, dan toilet umum.",
      category: "WISATA",
      image: "https://picsum.photos/seed/curug/800/600",
      location: "Dusun Cibatu, Desa Sukamaju",
      contact: "0812-3456-7890",
    },
    {
      title: "Kebun Strawberry Organik",
      slug: "kebun-strawberry-organik",
      description: "Perkebunan strawberry organik seluas 3 hektar yang dikelola oleh Kelompok Tani Maju Bersama. Pengunjung dapat memetik langsung buah segar. Tersedia paket wisata agro dan edukasi pertanian organik.",
      category: "PERTANIAN",
      image: "https://picsum.photos/seed/strawberry/800/600",
      location: "RW 04, Desa Sukamaju",
      contact: "0813-5678-9012",
    },
    {
      title: "Batik Sukamaju",
      slug: "batik-sukamaju",
      description: "Kelompok pengrajin batik yang telah menghasilkan motif-motif khas Sukamaju sejak 1985. Produk telah diekspor ke Malaysia dan Singapura. Tersedia workshop membatik untuk wisatawan dengan pemandu berpengalaman.",
      category: "KERAJINAN",
      image: "https://picsum.photos/seed/batik2/800/600",
      location: "Jl. Kerajinan No. 5, Desa Sukamaju",
      contact: "0814-7890-1234",
    },
    {
      title: "Peternakan Lebah Madu",
      slug: "peternakan-lebah-madu",
      description: "Peternakan lebah madu trigona dengan 200 koloni. Produk madu murni tanpa campuran telah bersertifikat BPOM. Tersedia paket eduwisata peternakan lebah dan penjualan langsung madu serta produk turunannya.",
      category: "PETERNAKAN",
      image: "https://picsum.photos/seed/madu/800/600",
      location: "Dusun Mekar, Desa Sukamaju",
      contact: "0815-2345-6789",
    },
    {
      title: "Warung Kopi Desa",
      slug: "warung-kopi-desa",
      description: "Sentra kuliner kopi arabika lokal yang diproses dari biji kopi kebun sendiri. Menggunakan metode pengolahan modern namun tetap mempertahankan cita rasa tradisional. Menjadi UMKM unggulan desa.",
      category: "UMKM",
      image: "https://picsum.photos/seed/kopi/800/600",
      location: "Jl. Utama No. 12, Desa Sukamaju",
      contact: "0816-3456-7890",
    },
    {
      title: "Camping Ground Hutan Pinus",
      slug: "camping-ground-hutan-pinus",
      description: "Area camping di tengah hutan pinus dengan view perbukitan yang memukau. Fasilitas lengkap termasuk toilet, area api unggun, dan spot foto instagram-worthy. Kapasitas hingga 100 tenda.",
      category: "WISATA",
      image: "https://picsum.photos/seed/camping/800/600",
      location: "Puncak Desa Sukamaju",
      contact: "0817-4567-8901",
    },
  ];

  for (const item of potentials) {
    await prisma.potential.create({ data: item });
  }

  // ==========================================
  // STRUKTUR ORGANISASI
  // ==========================================
  const org = [
    { name: "H. Ahmad Fauzi, S.Sos", position: "Kepala Desa", order: 1 },
    { name: "Drs. Hendra Gunawan", position: "Sekretaris Desa", order: 2 },
    { name: "Siti Aminah, A.Md", position: "Kaur Keuangan", order: 3 },
    { name: "Rudi Hartono", position: "Kaur Tata Usaha & Umum", order: 4 },
    { name: "Dewi Kusuma", position: "Kaur Perencanaan", order: 5 },
    { name: "Asep Supriatna", position: "Kasie Pemerintahan", order: 6 },
    { name: "Nurul Hidayah", position: "Kasie Kesejahteraan", order: 7 },
    { name: "Bambang Triyono", position: "Kasie Pelayanan", order: 8 },
    { name: "Agus Salim", position: "Kepala Dusun Cibatu", order: 9 },
    { name: "Rina Marlina", position: "Kepala Dusun Mekar", order: 10 },
  ];

  for (const item of org) {
    await prisma.organization.create({ data: item });
  }

  console.log("✅ Seeding selesai!");
  console.log("\n📋 Login credentials:");
  console.log("  Super Admin: superadmin@desasukamaju.id / admin123");
  console.log("  Admin Desa:  admin@desasukamaju.id / admin123");
  console.log("  Operator:    operator@desasukamaju.id / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
