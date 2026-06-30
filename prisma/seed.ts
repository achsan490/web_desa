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
    where: { email: "superadmin@desapojokklitih.id" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@desapojokklitih.id",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@desapojokklitih.id" },
    update: {},
    create: {
      name: "Admin Desa",
      email: "admin@desapojokklitih.id",
      password: hashedPassword,
      role: "ADMIN_DESA",
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: "operator@desapojokklitih.id" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "operator@desapojokklitih.id",
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
      history: `Desa Pojok Klitih merupakan salah satu desa yang berada di wilayah administratif Kecamatan Plandaan, Kabupaten Jombang, Provinsi Jawa Timur. Desa ini berada di kawasan utara Kabupaten Jombang dan memiliki karakteristik wilayah agraris dengan mayoritas penduduk bermata pencaharian di sektor pertanian, peternakan, serta usaha mikro masyarakat. Desa Pojok Klitih dikenal sebagai salah satu desa dengan jumlah dusun terbanyak di Kecamatan Plandaan, yang menunjukkan luas wilayah administratif dan persebaran penduduk yang cukup besar.

Sejarah Desa Pojok Klitih berkembang dari wilayah permukiman masyarakat agraris yang telah ada sejak masa pemerintahan tradisional Jawa. Nama "Pojok" berasal dari letak geografis wilayah yang berada pada bagian tertentu dari kawasan administratif terdahulu, sedangkan "Klitih" merupakan nama wilayah yang telah digunakan secara turun-temurun oleh masyarakat setempat.

Perkembangan desa berlangsung seiring dengan pertumbuhan sektor pertanian dan perdagangan lokal. Hingga saat ini, masyarakat Desa Pojok Klitih masih mempertahankan nilai-nilai budaya, gotong royong, musyawarah, dan kearifan lokal yang diwariskan oleh para pendahulu.

Catatan KKN: Apabila memungkinkan, sejarah ini dapat dilengkapi melalui wawancara langsung dengan Kepala Desa, Sekretaris Desa, atau tokoh masyarakat setempat.`,
      vision: "Terwujudnya Desa Pojok Klitih yang Maju, Mandiri, Sejahtera, Berbudaya, dan Berdaya Saing Berlandaskan Gotong Royong.",
      mission: `Meningkatkan kualitas pelayanan publik kepada masyarakat.
Meningkatkan pembangunan infrastruktur desa.
Mengembangkan potensi ekonomi masyarakat berbasis lokal.
Meningkatkan kualitas pendidikan dan kesehatan masyarakat.
Mendorong pemberdayaan UMKM dan kelompok usaha masyarakat.
Melestarikan budaya dan tradisi lokal.
Mewujudkan tata kelola pemerintahan desa yang transparan dan akuntabel.`,
      kepalaName: "Pemerintah Desa Pojok Klitih",
      kepalaImage: "/images/gambar5.jfif",
      kepalaQuote: "Bersama Membangun Desa yang Maju, Mandiri, Sejahtera, dan Berbudaya.",
      address: "Kantor Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang, Jawa Timur 61456",
      phone: "-",
      email: "desapojokklitih@gmail.com",
      whatsapp: "-",
      latitude: -7.4225,
      longitude: 112.1116,
    },
  });

  // ==========================================
  // STATISTIK
  // ==========================================
  const statistics = [
    // POPULATION
    { category: "POPULATION", label: "Total Penduduk", value: 3372, year: 2026 },
    { category: "POPULATION", label: "Jumlah KK", value: 900, year: 2026 },
    { category: "POPULATION", label: "Jumlah Dusun", value: 14, year: 2026 },
    { category: "POPULATION", label: "Ketinggian", value: 44, year: 2026 },
    // GENDER
    { category: "GENDER", label: "Laki-laki", value: 1698, year: 2026 },
    { category: "GENDER", label: "Perempuan", value: 1674, year: 2026 },
    // EDUCATION
    { category: "EDUCATION", label: "SD/MI", value: 750, year: 2026 },
    { category: "EDUCATION", label: "SMP", value: 980, year: 2026 },
    { category: "EDUCATION", label: "SMA/SMK", value: 1200, year: 2026 },
    { category: "EDUCATION", label: "Perguruan Tinggi", value: 442, year: 2026 },
    // OCCUPATION
    { category: "OCCUPATION", label: "Petani", value: 1800, year: 2026 },
    { category: "OCCUPATION", label: "Peternak", value: 800, year: 2026 },
    { category: "OCCUPATION", label: "Pedagang", value: 320, year: 2026 },
    { category: "OCCUPATION", label: "Buruh", value: 250, year: 2026 },
    { category: "OCCUPATION", label: "Wiraswasta", value: 180, year: 2026 },
    { category: "OCCUPATION", label: "ASN/TNI/POLRI", value: 22, year: 2026 },
    // RELIGION
    { category: "RELIGION", label: "Islam", value: 3350, year: 2026 },
    { category: "RELIGION", label: "Lainnya", value: 22, year: 2026 },
    // AGE
    { category: "AGE", label: "0-14 tahun", value: 850, year: 2026 },
    { category: "AGE", label: "15-29 tahun", value: 920, year: 2026 },
    { category: "AGE", label: "30-44 tahun", value: 780, year: 2026 },
    { category: "AGE", label: "45-59 tahun", value: 520, year: 2026 },
    { category: "AGE", label: "60+ tahun", value: 302, year: 2026 },
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
      content: `Desa Pojok Klitih kembali menorehkan prestasi dalam pembangunan infrastruktur. Proyek pembangunan jalan desa sepanjang 2 kilometer yang menghubungkan dusun Klitih dengan pusat desa telah berhasil diselesaikan lebih cepat dari jadwal yang direncanakan.

Kepala Desa mengatakan bahwa pembangunan jalan ini merupakan salah satu prioritas utama dalam Rencana Pembangunan Jangka Menengah Desa (RPJMDes) 2021-2026. "Kami sangat bersyukur proyek ini bisa selesai dengan baik. Ini adalah bukti nyata komitmen pemerintah desa untuk meningkatkan kualitas hidup warga," ujarnya.

Jalan dengan lebar 4 meter dan panjang 2 kilometer ini dikerjakan dengan menggunakan beton bertulang, sehingga diharapkan dapat bertahan selama minimal 20 tahun. Biaya pembangunan sebesar Rp 850 juta bersumber dari Dana Desa tahun 2025 dan swadaya masyarakat.

Dengan selesainya pembangunan jalan ini, akses warga dusun Klitih menuju pusat desa kini menjadi lebih mudah dan aman, terutama pada musim hujan ketika jalan lama sering tergenang air.`,
      category: "INFRASTRUKTUR",
      isPublished: true,
      publishedAt: new Date("2025-12-15"),
      image: "/images/gambar6.png",
      authorId: operator.id,
    },
    {
      title: "Posyandu Desa Pojok Klitih Terima Penghargaan Terbaik Tingkat Kabupaten",
      slug: "posyandu-desa-pojok-klitih-terima-penghargaan-terbaik",
      excerpt: "Posyandu Melati Desa Pojok Klitih berhasil meraih penghargaan Posyandu Terbaik tingkat Kabupaten Jombang tahun 2025.",
      content: `Kabar membanggakan datang dari Posyandu Melati Desa Pojok Klitih. Posyandu yang aktif melayani warga sejak tahun 2010 ini berhasil meraih penghargaan sebagai Posyandu Terbaik tingkat Kabupaten Jombang dalam rangka Hari Kesehatan Nasional 2025.

Penghargaan diserahkan langsung oleh Bupati Jombang kepada Ketua Posyandu Ibu Sari Dewi di Aula Pemkab Jombang. Penilaian dilakukan berdasarkan berbagai indikator, termasuk kelengkapan fasilitas, kualitas pelayanan, cakupan balita, dan inovasi program.

Salah satu inovasi yang menjadi keunggulan Posyandu Melati adalah program "Cegah Stunting dengan Gizi Lokal" yang memanfaatkan bahan pangan lokal untuk memenuhi kebutuhan gizi balita. Program ini terbukti berhasil menurunkan angka stunting di Desa Pojok Klitih dari 18% menjadi 8% dalam waktu dua tahun.`,
      category: "KESEHATAN",
      isPublished: true,
      publishedAt: new Date("2025-12-10"),
      image: "/images/gambar7.jpg",
      authorId: operator.id,
    },
    {
      title: "UMKM Desa Pojok Klitih Berhasil Tembus Pasar Ekspor ke Malaysia",
      slug: "umkm-desa-pojok-klitih-tembus-pasar-ekspor-malaysia",
      excerpt: "Kelompok pengrajin batik Desa Pojok Klitih berhasil melakukan ekspor perdana batik motif khas desa ke Malaysia.",
      content: `Prestasi membanggakan diraih oleh kelompok pengrajin batik Desa Pojok Klitih. Untuk pertama kalinya, produk batik dengan motif khas desa berhasil diekspor ke Malaysia dengan order senilai Rp 120 juta.

Produk batik motif "Padi Menguning" khas Desa Pojok Klitih berhasil menarik minat buyer dari Malaysia setelah dipromosikan melalui platform digital dan pameran virtual ASEAN Craft Festival 2025. Kelompok pengrajin yang beranggotakan 25 orang ibu rumah tangga ini kini mendapatkan pesanan rutin setiap bulannya.

Kepala Desa mengungkapkan rasa bangganya atas pencapaian ini. "Ini membuktikan bahwa produk lokal kita memiliki kualitas internasional. Ke depan, kita akan terus mendorong dan mendukung UMKM desa untuk berkembang lebih jauh," katanya.`,
      category: "UMKM",
      isPublished: true,
      publishedAt: new Date("2025-12-05"),
      image: "/images/gambar8.jpeg",
      authorId: operator.id,
    },
    {
      title: "Musrenbang Desa 2026: Warga Usulkan Program Digitalisasi Pelayanan",
      slug: "musrenbang-desa-2026-program-digitalisasi",
      excerpt: "Musyawarah Rencana Pembangunan Desa tahun 2026 berlangsung meriah dengan berbagai usulan inovatif dari warga.",
      content: `Musyawarah Rencana Pembangunan (Musrenbang) Desa Pojok Klitih untuk tahun anggaran 2026 telah digelar di Balai Desa dengan dihadiri oleh seluruh perangkat desa, tokoh masyarakat, dan perwakilan warga.

Dalam musyawarah yang berlangsung selama setengah hari tersebut, berbagai usulan disampaikan oleh warga. Yang paling menonjol adalah usulan program digitalisasi pelayanan publik desa, termasuk pembangunan website desa modern, aplikasi pengaduan digital, dan sistem layanan surat online.

Usulan lainnya yang mendapat banyak dukungan antara lain: pembangunan gedung serbaguna, renovasi kantor desa, pengembangan wisata alam, dan pelatihan keterampilan digital bagi generasi muda.`,
      category: "PEMERINTAHAN",
      isPublished: true,
      publishedAt: new Date("2025-11-28"),
      image: "/images/gambar9.jpg",
      authorId: operator.id,
    },
    {
      title: "Festival Panen Raya 2025 Meriah dengan Ratusan Pengunjung",
      slug: "festival-panen-raya-2025-meriah",
      excerpt: "Festival Panen Raya tahunan Desa Pojok Klitih sukses digelar dengan berbagai pertunjukan seni budaya dan pameran produk lokal.",
      content: `Festival Panen Raya Desa Pojok Klitih 2025 sukses digelar selama tiga hari berturut-turut di lapangan desa. Festival yang telah menjadi agenda tahunan ini berhasil menarik ratusan pengunjung dari berbagai daerah di Kabupaten Jombang.

Acara dibuka oleh Kepala Desa dengan penampilan tari tradisional dan prosesi syukuran panen. Selama tiga hari, berbagai pertunjukan seni dan budaya ditampilkan, mulai dari wayang, pencak silat, hingga hiburan modern.

Pameran produk UMKM lokal menjadi daya tarik tersendiri, dengan lebih dari 50 stand yang menampilkan berbagai produk unggulan desa seperti batik, kerajinan bambu, produk pertanian organik, dan kuliner khas desa.`,
      category: "KEGIATAN",
      isPublished: true,
      publishedAt: new Date("2025-11-20"),
      image: "/images/gambar10.webp",
      authorId: operator.id,
    },
    {
      title: "Program Beasiswa Desa untuk 10 Mahasiswa Berprestasi",
      slug: "program-beasiswa-desa-10-mahasiswa-berprestasi",
      excerpt: "Pemerintah Desa Pojok Klitih meluncurkan program beasiswa untuk mendukung putra-putri desa yang berprestasi namun kurang mampu.",
      content: `Pemerintah Desa Pojok Klitih resmi meluncurkan Program Beasiswa Desa (PBD) untuk tahun akademik 2025/2026. Program ini bertujuan untuk mendukung akses pendidikan tinggi bagi putra-putri desa yang berprestasi namun mengalami kendala ekonomi.

Sebanyak 10 penerima beasiswa terpilih melalui proses seleksi ketat yang meliputi penilaian prestasi akademik, kondisi ekonomi keluarga, dan wawancara. Para penerima akan mendapatkan bantuan biaya kuliah sebesar Rp 5 juta per semester selama maksimal 4 tahun.

Kepala Desa menjelaskan bahwa program ini merupakan bentuk investasi jangka panjang desa dalam meningkatkan kualitas sumber daya manusia. "Kami percaya bahwa pendidikan adalah kunci kemajuan. Dengan mendukung generasi muda kita, kita sedang membangun masa depan desa yang lebih cerah," ujarnya.`,
      category: "PENDIDIKAN",
      isPublished: true,
      publishedAt: new Date("2025-11-15"),
      image: "/images/gambar11.jfif",
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
      location: "Kantor Desa Pojok Klitih",
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
      location: "Seluruh wilayah Desa Pojok Klitih",
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
      location: "Balai Desa Pojok Klitih",
      date: new Date("2026-01-25"),
      startTime: "09:00",
      endTime: "13:00",
      status: "UPCOMING",
    },
    {
      title: "Pemeriksaan Kesehatan Gratis Lansia",
      description: "Pemeriksaan kesehatan gratis untuk warga lansia meliputi cek tekanan darah, gula darah, kolesterol, dan konsultasi dokter.",
      location: "Puskesdes Desa Pojok Klitih",
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
    { title: "Kantor Desa Pojok Klitih", url: "/images/gambar3.jfif", category: "Fasilitas" },
    { title: "Sawah Desa yang Subur", url: "/images/gambar2.jfif", category: "Pertanian" },
    { title: "Festival Budaya 2025", url: "/images/gambar10.webp", category: "Kegiatan" },
    { title: "Posyandu Balita", url: "/images/gambar7.jpg", category: "Kesehatan" },
    { title: "Pelatihan UMKM Digital", url: "/images/gambar13.jpg", category: "UMKM" },
    { title: "Pemandangan Alam Desa", url: "/images/gambar14.jpg", category: "Wisata" },
    { title: "Gotong Royong Warga", url: "/images/gambar1.jfif", category: "Kegiatan" },
    { title: "Jembatan Desa Baru", url: "/images/gambar6.png", category: "Infrastruktur" },
    { title: "Produk Kerajinan Lokal", url: "/images/gambar8.jpeg", category: "UMKM" },
    { title: "Upacara Kemerdekaan", url: "/images/gambar5.jfif", category: "Kegiatan" },
    { title: "Embung Desa", url: "/images/gambar15.jpg", category: "Fasilitas" },
    { title: "Pertemuan Musrenbang", url: "/images/gambar9.jpg", category: "Fasilitas" },
  ];

  for (const item of galleries) {
    await prisma.gallery.create({ data: { ...item, type: "PHOTO" } });
  }

  // ==========================================
  // POTENSI DESA
  // ==========================================
  const potentials = [
    {
      title: "Sektor Pertanian Unggulan",
      slug: "sektor-pertanian-unggulan",
      description: "Desa Pojok Klitih memiliki potensi pertanian yang sangat kaya, meliputi tanaman pangan seperti padi, jagung, palawija, serta berbagai produk hortikultura yang dikelola secara tekun oleh mayoritas penduduk desa.",
      category: "PERTANIAN",
      image: "/images/gambar2.jfif",
      location: "Lahan Pertanian Desa Pojok Klitih",
      contact: "-",
    },
    {
      title: "Sektor Peternakan Desa",
      slug: "sektor-peternakan-desa",
      description: "Peternakan di Desa Pojok Klitih didominasi oleh peternakan rakyat dengan komoditas unggulan berupa sapi, kambing, dan ayam kampung yang menjadi salah satu penopang utama perekonomian masyarakat.",
      category: "PETERNAKAN",
      image: "/images/gambar12.jfif",
      location: "Area Peternakan, Desa Pojok Klitih",
      contact: "-",
    },
    {
      title: "UMKM & Industri Rumah Tangga",
      slug: "umkm-industri-rumah-tangga",
      description: "Pengembangan usaha mikro di Desa Pojok Klitih berkembang dengan baik, didukung oleh warung-warung kelontong, perdagangan lokal, industri rumah tangga, serta produk-produk olahan pangan khas desa.",
      category: "UMKM",
      image: "/images/gambar13.jpg",
      location: "Sentra UMKM Desa Pojok Klitih",
      contact: "-",
    },
    {
      title: "Potensi Sosial Budaya & Kesenian",
      slug: "potensi-sosial-budaya-kesenian",
      description: "Kearifan lokal dan budaya tradisional di Desa Pojok Klitih senantiasa dijaga kelestariannya. Hal ini ditunjukkan oleh kuatnya kesenian tradisional Jawa, tradisi keagamaan yang harmonis, serta budaya gotong royong yang tinggi.",
      category: "KERAJINAN",
      image: "/images/gambar1.jfif",
      location: "Pusat Kebudayaan Desa Pojok Klitih",
      contact: "-",
    },
    {
      title: "Wisata Pedesaan & Edukasi",
      slug: "wisata-pedesaan-edukasi",
      description: "Desa Pojok Klitih memiliki potensi besar dalam pengembangan wisata berbasis pedesaan, wisata budaya lokal, serta wisata edukasi pertanian (agro-tourism) yang memanfaatkan keelokan alam pedesaan agraris.",
      category: "WISATA",
      image: "/images/gambar14.jpg",
      location: "Area Eduwisata Desa Pojok Klitih",
      contact: "-",
    },
  ];

  for (const item of potentials) {
    await prisma.potential.create({ data: item });
  }

  // ==========================================
  // STRUKTUR ORGANISASI
  // ==========================================
  const org = [
    { name: "(Belum ada data)", position: "Kepala Desa", order: 1 },
    { name: "(Belum ada data)", position: "Sekretaris Desa", order: 2 },
    { name: "(Belum ada data)", position: "Kaur Tata Usaha & Umum", order: 3 },
    { name: "(Belum ada data)", position: "Kaur Keuangan", order: 4 },
    { name: "(Belum ada data)", position: "Kaur Perencanaan", order: 5 },
    { name: "(Belum ada data)", position: "Kasi Pemerintahan", order: 6 },
    { name: "(Belum ada data)", position: "Kasi Kesejahteraan", order: 7 },
    { name: "(Belum ada data)", position: "Kasi Pelayanan", order: 8 },
    { name: "(Belum ada data)", position: "Kepala Dusun (14 Dusun)", order: 9 },
  ];

  for (const item of org) {
    await prisma.organization.create({ data: item });
  }

  console.log("✅ Seeding selesai!");
  console.log("\n📋 Login credentials:");
  console.log("  Super Admin: superadmin@desapojokklitih.id / admin123");
  console.log("  Admin Desa:  admin@desapojokklitih.id / admin123");
  console.log("  Operator:    operator@desapojokklitih.id / admin123");
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
