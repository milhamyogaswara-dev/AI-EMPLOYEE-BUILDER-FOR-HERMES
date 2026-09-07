import { NavView } from '../components/Sidebar';

export type GuideCategory =
  | 'pengenalan'
  | 'membuat_ai'
  | 'training'
  | 'skills'
  | 'sop'
  | 'memory'
  | 'authority'
  | 'automation'
  | 'testlab'
  | 'integrations'
  | 'deploy';

export type GuideDifficulty = 'Pemula' | 'Menengah' | 'Lanjutan';

export interface GuideStepItem {
  number: number;
  title: string;
  description: string;
}

export interface GuideTopic {
  id: string;
  category: GuideCategory;
  title: string;
  shortDescription: string;
  difficulty: GuideDifficulty;
  badge?: string;
  modulePath?: NavView;
  searchKeywords: string[];
  content: {
    overview: string;
    whyItMatters: string;
    keyPoints?: string[];
    steps?: GuideStepItem[];
    badExample?: {
      title: string;
      description: string;
      reason: string;
    };
    goodExample?: {
      title: string;
      description: string;
      reason: string;
    };
    bestPractice?: string[];
    checklist?: string[];
    readinessNote?: string;
    securityWarning?: string;
  };
  relatedAction?: {
    label: string;
    targetView: NavView;
  };
}

export interface RoadmapStep {
  stepNumber: number;
  id: string;
  title: string;
  shortDesc: string;
  moduleView: NavView;
  guideTopicId: string;
  suggestedNextDesc: string;
  nextModuleView: NavView;
}

export interface PracticalExample {
  id: string;
  roleTitle: string;
  objective: string;
  category: string;
  sop: {
    title: string;
    steps: string[];
  };
  skills: string[];
  memoryItems: {
    category: string;
    content: string;
  }[];
  authorityRules: {
    green: string[];
    yellow: string[];
    red: string[];
  };
  automation: {
    trigger: string;
    condition: string;
    action: string;
    output: string;
  };
}

// 10-Step Quick Start Roadmap
export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    stepNumber: 1,
    id: 'step_create',
    title: 'Buat AI Employee',
    shortDesc: 'Inisialisasi profil dasar asisten baru atau pilih template kerja.',
    moduleView: 'assistants',
    guideTopicId: 'guide_create_assistant',
    suggestedNextDesc: 'Lanjut ke penentuan Role & Tujuan spesifik pekerjaan.',
    nextModuleView: 'assistants',
  },
  {
    stepNumber: 2,
    id: 'step_role',
    title: 'Tentukan Role & Tujuan',
    shortDesc: 'Definisikan misi utama, persona, gaya bahasa, dan batasan tanggung jawab.',
    moduleView: 'assistants',
    guideTopicId: 'guide_role_objective',
    suggestedNextDesc: 'Lanjut latih behavior dan aturan kerja di Training Center.',
    nextModuleView: 'training',
  },
  {
    stepNumber: 3,
    id: 'step_training',
    title: 'Latih Cara Kerja',
    shortDesc: 'Beri instruksi perilaku, format jawaban standar, dan aturan operasional.',
    moduleView: 'training',
    guideTopicId: 'guide_training_center',
    suggestedNextDesc: 'Tambahkan kemampuan spesifik (Skills) yang relevan.',
    nextModuleView: 'skills',
  },
  {
    stepNumber: 4,
    id: 'step_skills',
    title: 'Tambahkan Skills',
    shortDesc: 'Bekali asisten dengan keahlian teknis seperti riset, copywriting, atau analisis data.',
    moduleView: 'skills',
    guideTopicId: 'guide_skills',
    suggestedNextDesc: 'Skill sudah dibuat. Selanjutnya buat SOP agar AI mengetahui urutan kerja.',
    nextModuleView: 'sop',
  },
  {
    stepNumber: 5,
    id: 'step_sop',
    title: 'Buat SOP',
    shortDesc: 'Petakan urutan langkah kerja baku dari input sampai output final.',
    moduleView: 'sop',
    guideTopicId: 'guide_sop',
    suggestedNextDesc: 'SOP telah siap. Isi Memory Store dengan konteks bisnis & produk Anda.',
    nextModuleView: 'memory',
  },
  {
    stepNumber: 6,
    id: 'step_memory',
    title: 'Bangun Memory',
    shortDesc: 'Simpan konteks bisnis, profil produk, audiens, dan kebijakan yang perlu diingat.',
    moduleView: 'memory',
    guideTopicId: 'guide_memory',
    suggestedNextDesc: 'Memory siap. Atur batasan izin otonomi aman di Authority Rules.',
    nextModuleView: 'authority',
  },
  {
    stepNumber: 7,
    id: 'step_authority',
    title: 'Atur Authority',
    shortDesc: 'Tentukan batasan otonomi: Hijau (Otomatis), Kuning (Persetujuan), Merah (Dilarang).',
    moduleView: 'authority',
    guideTopicId: 'guide_authority',
    suggestedNextDesc: 'Authority terkonfigurasi. Rancang alur kerja otomatis di Automation.',
    nextModuleView: 'automation',
  },
  {
    stepNumber: 8,
    id: 'step_automation',
    title: 'Buat Automation',
    shortDesc: 'Rancang alur otomatisasi Trigger → Condition → Action → Output.',
    moduleView: 'automation',
    guideTopicId: 'guide_automation',
    suggestedNextDesc: 'Alur kerja siap. Jangan deploy sebelum menguji di Test Lab!',
    nextModuleView: 'testlab',
  },
  {
    stepNumber: 9,
    id: 'step_testlab',
    title: 'Test di Test Lab',
    shortDesc: 'Simulasikan skenario nyata untuk menguji akurasi respon dan kepatuhan aturan.',
    moduleView: 'testlab',
    guideTopicId: 'guide_testlab',
    suggestedNextDesc: 'Hasil tes valid. Lakukan integrasi runtime dan tinjau deployment.',
    nextModuleView: 'integrations',
  },
  {
    stepNumber: 10,
    id: 'step_deploy',
    title: 'Integrasi & Deploy',
    shortDesc: 'Hubungkan ke runtime Hermes, Telegram, atau Webhook dan review status kesiapan.',
    moduleView: 'deploy',
    guideTopicId: 'guide_deploy',
    suggestedNextDesc: 'Selamat! AI Employee Anda kini berstatus Ready for Review.',
    nextModuleView: 'deploy',
  },
];

// Complete Guide Topics Catalog
export const GUIDE_TOPICS: GuideTopic[] = [
  // SECTION A: PENGENALAN
  {
    id: 'guide_intro_builder',
    category: 'pengenalan',
    title: 'Apa itu AI Employee Builder?',
    shortDescription: 'Mengenal platform arsitektur untuk merancang, melatih, dan mengelola asisten AI otonom.',
    difficulty: 'Pemula',
    badge: 'Fundamental',
    searchKeywords: ['pengenalan', 'builder', 'konsep', 'arsitektur', 'ai employee'],
    content: {
      overview:
        'AI Employee Builder adalah studio perancangan komprehensif untuk menciptakan asisten AI yang tidak sekadar menjawab obrolan biasa, melainkan bertindak seperti karyawan digital terstruktur dengan pembagian tugas, wewenang, dan standar operasional yang jelas.',
      whyItMatters:
        'Model bahasa biasa (LLM generik) sering kali memberikan jawaban yang tidak konsisten, halusinasi fakta bisnis, atau bertindak melampaui wewenangnya. Builder ini memberikan guardrail dan struktur kerja yang ketat.',
      keyPoints: [
        'Memisahkan konteks bisnis permanen dari prompt instruksi sesaat.',
        'Mendukung tata kelola wewenang berjenjang (Green, Yellow, Red) agar aman dari risiko fatal.',
        'Menerjemahkan instruksi kerja manusia menjadi System Prompt, SOP, dan Skill terstruktur yang kompatibel dengan Hermes Agent.',
      ],
      checklist: [
        'Pahami bahwa AI Employee bertindak atas nama bisnis/pemilik.',
        'Ketahui alur 10 langkah dari inisialisasi hingga siap ditinjau.',
        'Siapkan konteks bisnis nyata sebelum memulai pelatihan.',
      ],
    },
    relatedAction: {
      label: 'Mulai Langkah 1: Buat AI Employee',
      targetView: 'assistants',
    },
  },
  {
    id: 'guide_intro_hermes',
    category: 'pengenalan',
    title: 'Apa itu Hermes Agent?',
    shortDescription: 'Memahami runtime eksekusi open-source Hermes untuk menjalankan instruksi agen AI.',
    difficulty: 'Pemula',
    badge: 'Runtime',
    searchKeywords: ['hermes', 'agent', 'runtime', 'cli', 'openrouter', 'model'],
    content: {
      overview:
        'Hermes Agent adalah runtime cerdas berbasis model bahasa (seperti Nous Hermes / Llama 3) yang dirancang untuk penalaran berbasis fungsi (function calling), eksekusi perintah terminal, integrasi webhook, dan komunikasi multichannel.',
      whyItMatters:
        'AI Employee Builder berfungsi sebagai "Otak dan Manajer Pelatihan", sedangkan Hermes Agent adalah "Raga dan Eksekutor" yang menjalankan instruksi di server atau komputer Anda.',
      keyPoints: [
        'Mendukung integrasi platform perpesanan seperti Telegram, Discord, dan Slack.',
        'Mampu membaca dan mengeksekusi Model Context Protocol (MCP) dan alat bantu sistem.',
        'Konfigurasi diekspor dalam format manifest standar (.hermes / config.yaml) yang aman.',
      ],
      securityWarning:
        'Semua API key (seperti token OpenRouter atau Bot Token Telegram) wajib disimpan di environment variable server, bukan di browser atau source code publik.',
    },
    relatedAction: {
      label: 'Buka Integrations Hub',
      targetView: 'integrations',
    },
  },
  {
    id: 'guide_chatbot_vs_employee',
    category: 'pengenalan',
    title: 'Perbedaan Chatbot Biasa vs AI Employee',
    shortDescription: 'Mengapa asisten terstruktur jauh lebih unggul dibandingkan sekadar jendela chat AI umum.',
    difficulty: 'Pemula',
    badge: 'Mindset',
    searchKeywords: ['chatbot', 'perbedaan', 'ai employee', 'otonomi', 'sop'],
    content: {
      overview:
        'Banyak orang mengira AI Employee sama dengan chatbot ChatGPT biasa. Padahal, perbedaannya terletak pada otonomi kerja, kepatuhan SOP, memori jangka panjang, dan batasan wewenang resmi.',
      whyItMatters:
        'Mengandalkan chatbot biasa untuk bisnis berisiko tinggi karena AI umum tidak memiliki memori kebijakan, tidak terikat SOP, dan tidak tahu kapan harus meminta persetujuan sebelum mengambil tindakan penting.',
      keyPoints: [
        'Chatbot Biasa: Pasif menunggu ditanya, tidak punya SOP tetap, lupa konteks begitu jendela ditutup.',
        'AI Employee: Memiliki SOP baku 6 langkah, mengingat profil bisnis di Memory Store, terikat batasan otoritas (Green/Yellow/Red), dan dapat dipicu otomatis oleh event bisnis.',
      ],
      badExample: {
        title: 'Menggunakan Chatbot Biasa',
        description: 'Mengetik "Tolong bales chat komplain pelanggan ini" setiap kali ada email masuk tanpa panduan aturan.',
        reason: 'Jawaban bervariasi setiap saat, berpotensi menjanjikan diskon tanpa izin, dan memakan waktu pemilik.',
      },
      goodExample: {
        title: 'Menggunakan AI Employee Terlatih',
        description: 'Asisten otomatis membaca tiket, merujuk Memory Kebijakan Refund, menyusun draf berdasarkan SOP 5 Langkah, dan meminta persetujuan (Yellow Authority) sebelum mengirim.',
        reason: 'Konsisten 100%, patuh kebijakan internal, dan pemilik hanya perlu meninjau dalam 5 detik.',
      },
    },
    relatedAction: {
      label: 'Lihat Daftar Asisten Saya',
      targetView: 'assistants',
    },
  },
  {
    id: 'guide_core_concepts',
    category: 'pengenalan',
    title: 'Konsep Inti: Role, SOP, Skill, Memory, Authority, Automation',
    shortDescription: 'Peta anatomi 6 pilar penting yang membentuk kecerdasan seorang AI Employee.',
    difficulty: 'Pemula',
    badge: 'Arsitektur',
    searchKeywords: ['konsep', 'role', 'sop', 'skill', 'memory', 'authority', 'automation'],
    content: {
      overview:
        'Setiap AI Employee di Hermes Studio dibangun di atas 6 pilar struktural yang bekerja serentak membentuk workflow yang solid.',
      whyItMatters:
        'Memahami fungsi masing-masing pilar mencegah kebingungan saat melakukan konfigurasi dan troubleshooting performa agen.',
      keyPoints: [
        'Role & Identity: Menentukan siapa agen tersebut, untuk siapa ia bekerja, misi utamanya, dan gaya bicaranya.',
        'Skills: Toolkit keahlian spesifik yang bisa dijalankan (contoh: Meta Ads Audit, Copywriting Formula AIDA).',
        'SOP Builder: Urutan langkah kerja standar dari awal hingga selesai.',
        'Memory Store: Bank data pengetahuan permanen (produk, harga, batasan, profil pemilik).',
        'Authority Rules: Matriks izin kerja (Hijau = Mandiri, Kuning = Butuh Approval, Merah = Dilarang).',
        'Automation: Mesin pemicu (Trigger) dan eksekutor otomatis saat kondisi terpenuhi.',
      ],
      bestPractice: [
        'Jangan gabungkan SOP ke dalam Memory Store; simpan SOP di modul SOP Builder.',
        'Jangan simpan kredensial rahasia di Memory Store.',
        'Gunakan Authority Red untuk tindakan destruktif seperti transfer dana atau hapus database.',
      ],
    },
    relatedAction: {
      label: 'Buka Training Center',
      targetView: 'training',
    },
  },

  // SECTION B: MEMBUAT AI EMPLOYEE
  {
    id: 'guide_create_assistant',
    category: 'membuat_ai',
    title: 'Membuat Assistant Baru & Menentukan Role',
    shortDescription: 'Langkah awal merancang identitas, misi kerja, dan profil kepribadian digital.',
    difficulty: 'Pemula',
    badge: 'Langkah 1 & 2',
    modulePath: 'assistants',
    searchKeywords: ['buat', 'asisten', 'role', 'tujuan', 'wizard', 'personality'],
    content: {
      overview:
        'Pembuatan asisten baru dimulai dari pemilihan Role dan Target Penerima Manfaat: apakah agen bekerja untuk Anda pribadi, tim internal, bisnis, atau melayani klien eksternal.',
      whyItMatters:
        'Agen tanpa Role yang jelas akan menjawab secara umum dan kurang tajam. Penentuan persona yang presisi langsung menyaring domain pengetahuan yang relevan.',
      keyPoints: [
        'Gunakan Wizard Pembuatan Asisten untuk panduan 4 langkah cepat.',
        'Tentukan sapaan bahasa yang tepat (contoh: Bahasa Indonesia formal, semi-casual, atau bilingual).',
        'Tentukan level wewenang awal (Assist Mode, Semi-Autonomous, atau Autonomous).',
      ],
      steps: [
        { number: 1, title: 'Buka Menu My Assistants', description: 'Klik tombol "+ Buat Asisten Baru" di pojok kanan atas.' },
        { number: 2, title: 'Pilih Role & Misi', description: 'Isi nama asisten, jabatan fungsional, dan tujuan spesifik yang ingin dicapai.' },
        { number: 3, title: 'Tentukan Gaya Komunikasi', description: 'Pilih preferensi ringkas, terstruktur, atau analitis sesuai kebutuhan pemilik.' },
        { number: 4, title: 'Simpan & Lanjutkan', description: 'Profil asisten akan tersimpan dan siap dibekali di Training Center.' },
      ],
    },
    relatedAction: {
      label: 'Buka My Assistants',
      targetView: 'assistants',
    },
  },
  {
    id: 'guide_role_objective',
    category: 'membuat_ai',
    title: 'Menentukan Job Description & Communication Style',
    shortDescription: 'Membuat batasan tanggung jawab harian dan gaya sapaan yang profesional.',
    difficulty: 'Pemula',
    badge: 'Spesifikasi',
    modulePath: 'assistants',
    searchKeywords: ['job description', 'tanggung jawab', 'komunikasi', 'sapaan'],
    content: {
      overview:
        'Job description merinci daftar tanggung jawab wajib yang diemban asisten, sementara Communication Style mengatur apakah jawaban berbentuk poin ringkas atau penjelasan naratif mendalam.',
      whyItMatters:
        'Mencegah asisten memberikan jawaban bertele-tele yang membuang waktu pemilik bisnis yang sibuk.',
      keyPoints: [
        'Daftar tanggung jawab harian dan scope kerja',
        'Tone of voice dan sapaan personal untuk owner',
        'Format jawaban standar (Bullet points vs Naratif)',
      ],
      bestPractice: [
        'Sertakan 3 hingga 5 tanggung jawab utama yang terukur.',
        'Tentukan sapaan spesifik (misal: "Panggil pemilik dengan sebutan Pak Ilham").',
        'Gunakan preferensi "VERY CONCISE" untuk asisten eksekutif yang hanya melaporkan metrik penting.',
      ],
    },
    relatedAction: {
      label: 'Atur Profil di My Assistants',
      targetView: 'assistants',
    },
  },

  // SECTION C: TRAINING CENTER
  {
    id: 'guide_training_center',
    category: 'training',
    title: 'Panduan Lengkap Training Center',
    shortDescription: 'Cara melatih behavior, menanamkan aturan kerja, dan memperbaiki kesalahan respon.',
    difficulty: 'Pemula',
    badge: 'Langkah 3',
    modulePath: 'training',
    searchKeywords: ['training', 'latih', 'aturan', 'behavior', 'koreksi', 'instruksi'],
    content: {
      overview:
        'Training Center adalah modul di mana Anda mengajarkan cara berpikir, aturan perilaku, dan respon standar asisten terhadap berbagai situasi pekerjaan.',
      whyItMatters:
        'Model AI membutuhkan instruksi spesifik dengan format output yang terdefinisi. Tanpa aturan di Training Center, asisten mudah keluar jalur.',
      keyPoints: [
        'Setiap aturan dapat dikategorikan sebagai Behavior Rule, User Preference, Business Knowledge, atau Restriction.',
        'Gunakan fitur Quick Rule Injection untuk menambahkan pedoman kerja cepat.',
        'Gunakan fitur Koreksi Cepat: jika asisten salah menjawab di Test Lab, ubah kesalahan menjadi Training Rule baru dalam 1 klik.',
      ],
      badExample: {
        title: 'Instruksi Terlalu Umum (Kurang Baik)',
        description: '"Jadilah marketing assistant yang bagus dan bantu jualan."',
        reason: 'Terlalu abstrak. AI tidak tahu metrik apa yang harus dihitung atau gaya bahasa apa yang diinginkan.',
      },
      goodExample: {
        title: 'Instruksi Terstruktur & Spesifik (Lebih Baik)',
        description:
          '"Setiap kali saya meminta analisis campaign Meta Ads, tampilkan Spending, CTR, CPC, CPM, Conversion Rate, dan ROAS dalam tabel ringkas sebelum memberikan 3 rekomendasi aksi perbaikan."',
        reason: 'Sangat jelas, mencantumkan metrik wajib, menentukan format tabel, dan membatasi jumlah rekomendasi aksi.',
      },
      bestPractice: [
        'Tulis aturan dalam kalimat aktif dan langsung ke sasaran.',
        'Hindari membuat aturan yang saling bertentangan.',
        'Fokus pada batasan tindakan dan format output yang disukai.',
      ],
    },
    relatedAction: {
      label: 'Buka Training Center',
      targetView: 'training',
    },
  },

  // SECTION D: SKILLS GUIDE
  {
    id: 'guide_skills',
    category: 'skills',
    title: 'Panduan Skills: Kemampuan Spesifik AI',
    shortDescription: 'Mendefinisikan, menguji, dan memperbaiki keahlian operasional asisten.',
    difficulty: 'Menengah',
    badge: 'Langkah 4',
    modulePath: 'skills',
    searchKeywords: ['skill', 'kemampuan', 'keahlian', 'testing skill', 'formula'],
    content: {
      overview:
        'Skill adalah modul kemampuan spesifik yang harus dikuasai oleh AI Employee untuk menyelesaikan jenis pekerjaan tertentu dengan standar mutu tinggi.',
      whyItMatters:
        'Memecah kompetensi asisten menjadi modul-modul Skill terpisah memudahkan Anda menguji akurasi setiap keahlian tanpa mengacaukan kepribadian dasar asisten.',
      keyPoints: [
        'Satu asisten dapat dibekali beberapa Skill yang saling melengkapi.',
        'Setiap Skill memiliki Nama, Deskripsi, Kategori, dan Instruksi Operasional Spesifik.',
        'Skill dapat diuji secara terisolasi di Test Lab untuk memastikan outputnya akurat.',
      ],
      bestPractice: [
        'Competitor Research: Melakukan audit harga, fitur, dan positioning kompetitor.',
        'Meta Ads Analysis: Menghitung metrik iklan berbayar dan menemukan bottleneck funnel.',
        'Copywriting (PAS / AIDA): Menulis naskah iklan persuasif berorientasi konversi.',
        'Customer Support Triage: Mengklasifikasi tiket keluhan dan merespons empati.',
        'Data Analysis: Mengubah raw data spreadsheet menjadi kesimpulan eksekutif.',
      ],
      steps: [
        { number: 1, title: 'Buka Menu Skills', description: 'Klik tombol "+ Tambah Skill Baru" atau pilih dari pustaka skill.' },
        { number: 2, title: 'Definisikan Input & Output', description: 'Tentukan apa yang harus diminta dari pengguna dan bagaimana output disajikan.' },
        { number: 3, title: 'Uji Coba di Test Lab', description: 'Pastikan asisten mampu menjalankan skill tersebut dengan prompt simulasi.' },
      ],
    },
    relatedAction: {
      label: 'Buka Skills Manager',
      targetView: 'skills',
    },
  },

  // SECTION E: SOP BUILDER GUIDE
  {
    id: 'guide_sop',
    category: 'sop',
    title: 'Panduan SOP Builder: Alur Kerja Standar',
    shortDescription: 'Membuat petunjuk pelaksanaan langkah demi langkah agar pekerjaan selesai tanpa cacat.',
    difficulty: 'Menengah',
    badge: 'Langkah 5',
    modulePath: 'sop',
    searchKeywords: ['sop', 'standar operasional', 'langkah kerja', 'workflow', 'prosedur'],
    content: {
      overview:
        'SOP (Standar Operasional Prosedur) mendefinisikan "Bagaimana AI Employee melakukan sebuah pekerjaan langkah demi langkah" dari awal data diterima sampai laporan diserahkan ke pemilik.',
      whyItMatters:
        'Tanpa SOP, AI sering melompati tahapan krusial (misalnya langsung memberi kesimpulan tanpa menganalisis data dasar). SOP memastikan kepatuhan prosedur 100%.',
      keyPoints: [
        'Setiap SOP tersusun atas nama prosedur, deskripsi tugas, dan urutan step 1, 2, 3... berurutan.',
        'SOP dapat diaktifkan atau dinonaktifkan per asisten.',
        'Dapat langsung diuji di Test Lab dengan opsi "Test SOP".',
      ],
      goodExample: {
        title: 'Contoh SOP: Analisis Campaign Meta Ads',
        description:
          'Step 1: Ambil data metrik campaign (Spend, Impresi, Klik, Leads).\nStep 2: Hitung CTR, CPC, CPM, dan Conversion Rate.\nStep 3: Bandingkan dengan benchmark target industri.\nStep 4: Identifikasi masalah utama (Creative fatigue, Audience saturation, atau Landing page drop).\nStep 5: Susun 3 rekomendasi perbaikan berbasis data.\nStep 6: Buat Executive Summary maksimal 10 baris untuk pemilik.',
        reason: 'Alur runtut, sistematis, dan menghasilkan output siap pakai tanpa bolak-balik bertanya.',
      },
    },
    relatedAction: {
      label: 'Buka SOP Builder',
      targetView: 'sop',
    },
  },

  // SECTION F: MEMORY STORE GUIDE
  {
    id: 'guide_memory',
    category: 'memory',
    title: 'Panduan Memory Store: Konteks Bisnis Permanen',
    shortDescription: 'Menyimpan fakta perusahaan, produk, dan kebijakan tanpa membocorkan kredensial.',
    difficulty: 'Pemula',
    badge: 'Langkah 6',
    modulePath: 'memory',
    searchKeywords: ['memory', 'store', 'ingatan', 'konteks', 'fakta bisnis', 'keamanan'],
    content: {
      overview:
        'Memory Store adalah basis data pengetahuan yang selalu diingat oleh asisten di setiap percakapan tanpa perlu Anda ketik berulang-ulang.',
      whyItMatters:
        'Asisten tidak akan tahu siapa target market Anda, berapa harga produk Anda, atau apa batasan garansi perusahaan Anda jika tidak dicatat di Memory Store.',
      keyPoints: [
        'Gunakan kategori yang sesuai: About Me, Business, Products, Projects, Decisions, Rules.',
        'Memory bersifat permanen dan otomatis disisipkan ke context window asisten.',
        'Membantu asisten menjawab akurat tentang perusahaan tanpa risiko halusinasi.',
      ],
      bestPractice: [
        'Informasi Perusahaan: Visi, misi, jam operasional, profil pemilik.',
        'Katalog Produk: Nama paket, fitur utama, harga resmi, garansi.',
        'Target Market: Karakteristik calon pembeli utama dan pain points mereka.',
        'Brand Voice: Nada bicara yang disukai (misal: "Santun, percaya diri, tanpa basa-basi berlebih").',
        'Keputusan Lalu: Catatan kesepakatan rapat terdahulu yang wajib dipatuhi.',
      ],
      badExample: {
        title: 'Praktek Buruk: Menyimpan Kredensial di Memory',
        description: '"Password cPanel hosting kita adalah Rahasia12345 dan token bot adalah 12345:ABCDEF."',
        reason: 'BERBAHAYA! Jangan pernah menyimpan password, secret key, atau token di Memory normal.',
      },
      goodExample: {
        title: 'Praktek Baik: Menyimpan Kebijakan Operasional di Memory',
        description: '"BuildRAB AI memiliki 3 paket langganan: Starter (Rp99rb/bln), Pro (Rp249rb/bln), dan Unlimited (Rp499rb/bln). Garansi refund berlaku 7 hari."',
        reason: 'Fakta bisnis penting yang aman diketahui oleh asisten untuk melayani calon pembeli.',
      },
    },
    relatedAction: {
      label: 'Buka Memory Store',
      targetView: 'memory',
    },
  },

  // SECTION G: AUTHORITY RULES GUIDE
  {
    id: 'guide_authority',
    category: 'authority',
    title: 'Panduan Authority Rules: Tingkatan Wewenang Aman',
    shortDescription: 'Membedakan tindakan mandiri (Green), butuh persetujuan (Yellow), dan terlarang (Red).',
    difficulty: 'Menengah',
    badge: 'Langkah 7',
    modulePath: 'authority',
    searchKeywords: ['authority', 'wewenang', 'green', 'yellow', 'red', 'approval', 'keamanan'],
    content: {
      overview:
        'Authority Rules adalah sistem keamanan tiga tingkat (Traffic Light Security) yang mengontrol apa yang boleh dilakukan asisten secara otomatis dan apa yang harus dicegah.',
      whyItMatters:
        'Memberi otonomi penuh pada AI tanpa batas persetujuan sangat berbahaya bagi kelangsungan bisnis dan reputasi perusahaan.',
      keyPoints: [
        'GREEN (Autonomous): Tindakan berisiko rendah yang boleh dieksekusi asisten langsung tanpa konfirmasi.',
        'YELLOW (Needs Approval): Tindakan penting di mana asisten menyiapkan draf/rekomendasi, tetapi menunggu persetujuan manusia sebelum dikirim.',
        'RED (Prohibited): Tindakan fatal yang DILARANG KERAS dilakukan asisten dalam kondisi apa pun.',
      ],
      bestPractice: [
        'GREEN: Membuat draf konten, merangkum laporan, meriset kompetitor, mengklasifikasi kategori tiket.',
        'YELLOW: Mengirim email ke klien besar, mempublikasikan postingan medsos, mengubah budget iklan, merespons komplain refund.',
        'RED: Menghapus database perusahaan, mentransfer dana uang riil, membocorkan API key/rahasia internal, mengubah kredensial akun.',
      ],
    },
    relatedAction: {
      label: 'Buka Authority Rules',
      targetView: 'authority',
    },
  },

  // SECTION H: AUTOMATION GUIDE
  {
    id: 'guide_automation',
    category: 'automation',
    title: 'Panduan Automation: Pemicu & Tindakan Otomatis',
    shortDescription: 'Merancang alur Trigger → Condition → Action → Output untuk efisiensi bisnis.',
    difficulty: 'Menengah',
    badge: 'Langkah 8',
    modulePath: 'automation',
    searchKeywords: ['automation', 'otomatisasi', 'trigger', 'condition', 'action', 'output'],
    content: {
      overview:
        'Modul Automation memungkinkan asisten Anda bekerja secara proaktif saat ada kejadian tertentu tanpa perlu Anda panggil secara manual.',
      whyItMatters:
        'Mengubah AI dari asisten pasif yang menunggu ditanya menjadi pekerja digital yang otomatis memproses tugas begitu ada input baru masuk.',
      keyPoints: [
        'Struktur Alur: TRIGGER (Pemicu) → CONDITION (Syarat) → ACTION (Tindakan AI) → OUTPUT (Hasil Akhir).',
        'Dapat dihubungkan dengan Webhook eksternal, jadwal waktu (Cron), atau event obrolan.',
      ],
      goodExample: {
        title: 'Contoh Alur Otomatisasi Penanganan Tiket Refund',
        description:
          '1. TRIGGER: Tiket customer support baru masuk dari form website.\n2. CONDITION: Kategori tiket = "Permohonan Refund".\n3. ACTION: AI mengecek Memory Kebijakan Refund & riwayat transaksi, lalu membuat draf respon rekomendasi.\n4. APPROVAL: Sistem menunggu persetujuan pemilik (Yellow Authority).\n5. OUTPUT: Begitu disetujui, jawaban terkirim ke email pelanggan via webhook.',
        reason: 'Menghemat 80% waktu pengetikan tanpa menghilangkan kendali penuh pemilik.',
      },
    },
    relatedAction: {
      label: 'Buka Automation Builder',
      targetView: 'automation',
    },
  },

  // SECTION I: TEST LAB GUIDE
  {
    id: 'guide_testlab',
    category: 'testlab',
    title: 'Panduan Test Lab: Evaluasi Kualitas Sebelum Deploy',
    shortDescription: 'Checklist pengujian ketat sebelum asisten diterjunkan ke lingkungan kerja nyata.',
    difficulty: 'Lanjutan',
    badge: 'Langkah 9',
    modulePath: 'testlab',
    searchKeywords: ['test lab', 'simulasi', 'evaluasi', 'skor', 'checklist', 'benchmark'],
    content: {
      overview:
        'Test Lab adalah lingkungan simulasi aman tempat Anda menguji pemahaman instruksi, akurasi SOP, dan kepatuhan batasan wewenang asisten sebelum dihubungkan ke saluran publik.',
      whyItMatters:
        'Jangan pernah men-deploy asisten tanpa pengujian menyeluruh! Cacat logika atau instruksi ambigu yang lolos bisa merugikan bisnis Anda.',
      keyPoints: [
        'Gunakan server-side inference proxy yang aman untuk menguji model AI langsung.',
        'Uji dengan skenario batas (Edge Cases) seperti pertanyaan menjebak atau provokasi melanggar Red Authority.',
        'Gunakan tombol "Koreksi Cepat" jika asisten menjawab kurang memuaskan.',
      ],
      checklist: [
        'Role Understanding: Apakah asisten konsisten memperkenalkan diri dan menyapa sesuai persona?',
        'SOP Compliance: Apakah asisten menjalankan seluruh urutan langkah SOP tanpa melompat?',
        'Skill Accuracy: Apakah kalkulasi metrik atau formula copywriting diterapkan dengan tepat?',
        'Memory Recall: Apakah asisten mengingat fakta harga, produk, dan profil bisnis Anda?',
        'Authority Compliance: Apakah asisten menolak tindakan Red dan meminta approval untuk Yellow?',
        'Response Quality: Apakah gaya bahasa profesional, ringkas, dan bebas halusinasi?',
        'Edge Case Handling: Bagaimana respon asisten saat diberi data tidak lengkap?',
      ],
      readinessNote:
        'Disarankan melakukan minimal 3 hingga 5 skenario uji yang bervariasi sebelum melanjutkan ke tahap review deployment.',
    },
    relatedAction: {
      label: 'Buka Test Lab',
      targetView: 'testlab',
    },
  },

  // SECTION J: INTEGRATIONS GUIDE
  {
    id: 'guide_integrations',
    category: 'integrations',
    title: 'Panduan Integrasi: OpenRouter, Telegram, & Webhook',
    shortDescription: 'Menghubungkan asisten ke kanal komunikasi eksternal secara aman dan andal.',
    difficulty: 'Lanjutan',
    badge: 'Langkah 10A',
    modulePath: 'integrations',
    searchKeywords: ['integrations', 'telegram', 'openrouter', 'webhook', 'mcp', 'keamanan key'],
    content: {
      overview:
        'Modul Integrations memfasilitasi koneksi antara Hermes Studio dengan ekosistem luar: LLM inference (OpenRouter / Hermes Endpoint), kanal perpesanan (Telegram Bot), dan dispatch event (Webhook).',
      whyItMatters:
        'Koneksi yang aman memastikan asisten dapat berkomunikasi dengan pelanggan di Telegram atau mengirimkan payload ke CRM tanpa membocorkan rahasia perusahaan.',
      keyPoints: [
        'Semua transmisi data keluar di-proxy melalui server backend untuk melindungi kredensial.',
        'Mendukung verifikasi handshake HMAC-SHA256 pada Webhook.',
        'Mendukung multi-model routing melalui OpenRouter API.',
      ],
      securityWarning:
        'PENTING: Jangan pernah memasukkan API key asli ke dalam chat atau kode frontend. Gunakan environment variables di server (HERMES_API_KEY, TELEGRAM_BOT_TOKEN, WEBHOOK_SECRET). Contoh format token: "sk-or-v1-xxxxxxxx", "bot_token_xxxxxxxx", "https://api.example.com/webhook".',
    },
    relatedAction: {
      label: 'Buka Integrations Hub',
      targetView: 'integrations',
    },
  },

  // SECTION K: DEPLOY HERMES GUIDE
  {
    id: 'guide_deploy',
    category: 'deploy',
    title: 'Panduan Deploy Hermes & Review Kesiapan Agen',
    shortDescription: 'Verifikasi checklist 9 pilar sebelum mengekspor manifest agen ke runtime Hermes.',
    difficulty: 'Lanjutan',
    badge: 'Langkah 10B',
    modulePath: 'deploy',
    searchKeywords: ['deploy', 'hermes runtime', 'manifest', 'ready for review', 'export'],
    content: {
      overview:
        'Modul Deploy Hermes adalah gerbang final untuk mengekspor manifest konfigurasi terstruktur (.hermes profile, system prompt, tool mappings) untuk dijalankan di runtime lokal atau cloud.',
      whyItMatters:
        'Asisten tidak boleh langsung dilabeli "100% Production Ready" secara sepihak. Aplikasi menggunakan status "Ready for Review" agar pemilik tetap memegang kendali pengawasan final.',
      keyPoints: [
        'Alur Kesiapan: ROLE (✓) → TRAINING (✓) → SKILLS (✓) → SOP (✓) → MEMORY (✓) → AUTHORITY (✓) → AUTOMATION (✓) → TEST LAB (✓) → INTEGRATIONS (✓) → READY FOR REVIEW.',
        'Mendukung ekspor format Prompt Markdown, YAML Hermes CLI, JSON Payload, dan Docker Compose.',
        'Menyediakan perintah hermes CLI siap salin untuk import profile instan.',
      ],
      readinessNote:
        'Setelah berstatus "Ready for Review", pantau performa asisten pada minggu pertama penggunaan dan perbarui Training Rules jika ditemukan kasus khusus baru.',
    },
    relatedAction: {
      label: 'Buka Deploy Hermes',
      targetView: 'deploy',
    },
  },
];

// Practical Example Library (Educational Scenarios)
export const PRACTICAL_EXAMPLES: PracticalExample[] = [
  {
    id: 'ex_digital_marketing',
    roleTitle: 'Digital Marketing Assistant',
    category: 'Pemasaran & Iklan',
    objective: 'Mengaudit performa iklan berbayar harian, membuat variasi copy iklan, dan menyusun laporan ROAS.',
    skills: [
      'Meta Ads Campaign Audit',
      'Copywriting Formula PAS & AIDA',
      'Competitor Creative Angle Research',
      'Weekly ROAS Report Generation',
    ],
    sop: {
      title: 'Audit Harian Campaign Meta Ads',
      steps: [
        'Tarik data pengeluaran (Spend), impresi, klik, dan pembelian dari dashboard iklan.',
        'Kalkulasikan metrik kunci: CTR (>1.5% sehat), CPC (<Rp2.500 sehat), dan ROAS (>3x target).',
        'Filter iklan dengan ROAS <1.5x yang sudah menghabiskan minimal 2x CPA target.',
        'Susun rekomendasi tindakan: Matikan adset boncos, naikkan budget adset winning 20%.',
        'Kirimkan ringkasan draf ke pemilik dan tunggu konfirmasi sebelum mengubah budget.',
      ],
    },
    memoryItems: [
      { category: 'BUSINESS', content: 'Nama Bisnis: BuildRAB AI (Software Estimasi RAB Konstruksi)' },
      { category: 'PRODUCTS', content: 'Harga Langganan: Rp249.000/bulan (Paket Pro Terlaris)' },
      { category: 'TARGET_MARKET', content: 'Kontraktor rumah tinggal, arsitek muda, dan estimator pemula usia 25-45 tahun' },
      { category: 'RULES', content: 'Batas maksimal kenaikan budget harian adalah 20% per hari untuk menjaga stabilitas learning phase' },
    ],
    authorityRules: {
      green: ['Riset angle iklan kompetitor', 'Menulis 5 variasi headline iklan', 'Menghitung metrik CTR dan CPA'],
      yellow: ['Mempublikasikan materi iklan ke Ads Manager', 'Menaikkan atau menurunkan budget adset'],
      red: ['Menghapus akun iklan Facebook', 'Mengubah kartu kredit penagihan Meta', 'Membelanjakan budget di luar plafon bulanan'],
    },
    automation: {
      trigger: 'Setiap hari pukul 08.00 pagi (Scheduled Cron)',
      condition: 'Total spend kemarin > Rp500.000',
      action: 'Analisis metrik performa & susun 3 rekomendasi optimasi',
      output: 'Kirim notifikasi ringkas ke bot Telegram pemilik',
    },
  },
  {
    id: 'ex_customer_support',
    roleTitle: 'Customer Support Assistant',
    category: 'Layanan Pelanggan',
    objective: 'Merespons pertanyaan calon pembeli, membantu troubleshooting login, dan mengarahkan ke kanal pembayaran.',
    skills: [
      'Empathetic Complaint Handling',
      'FAQ Knowledge Retrieval',
      'Ticket Severity Classification',
      'Payment Verification Guide',
    ],
    sop: {
      title: 'Penanganan Komplain Kendala Akses Akun',
      steps: [
        'Sapa pelanggan dengan ramah dan sebutkan nama pelanggan.',
        'Verifikasi alamat email terdaftar dan tanyakan screenshot pesan error.',
        'Cek status server dan panduan troubleshooting di Memory Store.',
        'Jika kendala password, kirimkan tautan reset resmi yang valid.',
        'Jika kendala belum selesai dalam 15 menit, eskalasikan tiket ke tim teknisi manusia.',
      ],
    },
    memoryItems: [
      { category: 'BUSINESS', content: 'Jam Operasional CS: 08.00 - 21.00 WIB setiap hari' },
      { category: 'RULES', content: 'Garansi uang kembali 100% berlaku maksimal 7 hari sejak pembelian pertama' },
      { category: 'PRODUCTS', content: 'Tautan reset sandi resmi: https://app.buildrab.ai/forgot-password' },
    ],
    authorityRules: {
      green: ['Menjawab pertanyaan seputar fitur aplikasi', 'Memberikan link panduan tutorial', 'Mengirimkan ucapan selamat datang'],
      yellow: ['Menerbitkan voucher diskon loyalitas', 'Mengubah email akun pelanggan setelah verifikasi'],
      red: ['Mengakses password akun pengguna', 'Menyetujui refund tanpa verifikasi bukti transfer', 'Memberikan kontak pribadi karyawan'],
    },
    automation: {
      trigger: 'Pesan baru diterima di bot Telegram Support',
      condition: 'Pesan mengandung kata kunci "bantuan", "error", atau "tidak bisa login"',
      action: 'Kirimkan pesan sapaan otomatis dan minta detail error',
      output: 'Buat tiket antrean internal baru',
    },
  },
  {
    id: 'ex_content_creator',
    roleTitle: 'Content Creator Assistant',
    category: 'Konten & Media Sosial',
    objective: 'Merancang kalender editorial bulanan, menulis naskah video pendek (Reels/TikTok), dan caption Instagram.',
    skills: [
      'Hook Formulation (3-Second Rule)',
      'Short-Form Video Scripting',
      'SEO Hashtag & Keyword Research',
      'Content Repurposing',
    ],
    sop: {
      title: 'Penyusunan Script Video Edukasi 60 Detik',
      steps: [
        'Pilih 1 masalah spesifik audiens (Pain Point) dari Memory Store.',
        'Tulis Hook mengejutkan di 3 detik pertama (Visual + Verbal).',
        'Jelaskan solusi ringkas dalam 3 poin praktis (durasi 35 detik).',
        'Tutup dengan Call to Action (CTA) yang jelas ke link di bio (durasi 10 detik).',
        'Sajikan dalam format 2 kolom: Audio / Dialog dan Visual / B-Roll.',
      ],
    },
    memoryItems: [
      { category: 'BRAND_VOICE', content: 'Tone: Santai, mengedukasi, energik, mudah dipahami orang awam' },
      { category: 'TARGET_AUDIENCE', content: 'Gen Z dan Milenial pemula yang baru belajar estimasi bangunan' },
    ],
    authorityRules: {
      green: ['Riset tren sound & topik viral', 'Menulis draf 10 hook video', 'Menyusun kalender konten mingguan'],
      yellow: ['Mempublikasikan postingan ke Instagram atau TikTok', 'Menghapus postingan lama'],
      red: ['Mengubah bio profil resmi akun', 'Menjalin kerja sama sponsor atas nama perusahaan'],
    },
    automation: {
      trigger: 'Setiap hari Senin pukul 09.00 WIB',
      condition: 'Belum ada jadwal posting untuk 3 hari ke depan',
      action: 'Generate 3 ide konten segar lengkap dengan hook dan outline visual',
      output: 'Kirimkan draf review ke Notion atau pesan Telegram',
    },
  },
  {
    id: 'ex_research_assistant',
    roleTitle: 'Research & Market Intelligence Assistant',
    category: 'Riset & Analisis',
    objective: 'Menganalisis pergerakan kompetitor, merangkum dokumen regulasi, dan menyusun laporan intelijen pasar.',
    skills: [
      'Competitive Feature Matrix Analysis',
      'Pricing Benchmark Intelligence',
      'Regulatory Summary Synthesis',
      'SWOT Analysis Generation',
    ],
    sop: {
      title: 'Audit Komparasi Fitur Kompetitor Baru',
      steps: [
        'Kumpulkan data penawaran kompetitor dari landing page resmi.',
        'Bandingkan struktur harga dan model monetisasi dengan produk kita.',
        'Identifikasi kelebihan dan kelemahan spesifik kompetitor.',
        'Susun tabel perbandingan 5 fitur utama.',
        'Berikan 2 rekomendasi positioning unik untuk tim marketing kita.',
      ],
    },
    memoryItems: [
      { category: 'BUSINESS', content: 'Daftar 3 Kompetitor Utama: Software X, Tool Y, dan Platform Z' },
      { category: 'RULES', content: 'Data riset harus diverifikasi dari sumber publik resmi berumur kurang dari 6 bulan' },
    ],
    authorityRules: {
      green: ['Merangkum artikel berita industri', 'Menyusun tabel komparasi produk', 'Menghitung rata-rata harga pasar'],
      yellow: ['Membagikan laporan riset ke grup eksternal investor'],
      red: ['Menggunakan metode scraping ilegal yang melanggar ketentuan hukum', 'Membocorkan roadmap internal ke publik'],
    },
    automation: {
      trigger: 'Artikel berita baru masuk via RSS Feed industri',
      condition: 'Menyebutkan nama kompetitor utama',
      action: 'Rangkum berita dalam 3 kalimat dan tentukan tingkat urgensi',
      output: 'Kirimkan flash alert ke channel internal',
    },
  },
  {
    id: 'ex_executive_assistant',
    roleTitle: 'Executive Operations Assistant',
    category: 'Manajemen & Produktivitas',
    objective: 'Menyaring prioritas harian pemilik, merangkum rapat, dan mengawal tindak lanjut (action items).',
    skills: [
      'Meeting Minutes Synthesis',
      'Daily Priority Triage',
      'Email Draft Preparation',
      'Follow-up Accountability Tracking',
    ],
    sop: {
      title: 'Penyusunan Rangkuman Rapat & Action Items',
      steps: [
        'Transkrip catatan kasar jalannya rapat.',
        'Identifikasi 3 keputusan strategis utama yang telah disepakati.',
        'Petakan daftar Action Items lengkap dengan Person In Charge (PIC) dan tenggat waktu.',
        'Kirimkan draf rangkuman kepada pemilik untuk persetujuan.',
        'Distribusikan rangkuman resmi ke seluruh peserta rapat.',
      ],
    },
    memoryItems: [
      { category: 'ABOUT_ME', content: 'Pemilik: Bapak Ilham (CEO & Founder)' },
      { category: 'COMMUNICATION', content: 'Format laporan: Bullet point ringkas, pisahkan antara fakta vs opini' },
    ],
    authorityRules: {
      green: ['Merangkum catatan rapat', 'Menyusun daftar prioritas kerja', 'Mengorganisir agenda kalender'],
      yellow: ['Mengirim email resmi atas nama CEO', 'Mengundang pihak luar ke rapat strategis'],
      red: ['Menandatangani kontrak bisnis', 'Mengubah struktur gaji karyawan', 'Menyetujui pengeluaran di atas Rp10.000.000'],
    },
    automation: {
      trigger: 'Setiap hari kerja pukul 17.00 WIB',
      condition: 'Ada tugas dengan status "In Progress"',
      action: 'Cek deadline dan buat rekap progres harian',
      output: 'Tampilkan di dashboard pemilik',
    },
  },
  {
    id: 'ex_ecommerce_assistant',
    roleTitle: 'E-Commerce Store Assistant',
    category: 'Retail & Toko Online',
    objective: 'Mengelola deskripsi katalog produk, mengaudit sisa stok, dan membalas ulasan pembeli di marketplace.',
    skills: [
      'Product Listing SEO Optimization',
      'Inventory Stock Warning Audit',
      'Positive & Negative Review Handling',
      'Cross-Sell Recommendation',
    ],
    sop: {
      title: 'Merespons Ulasan Pembeli Marketplace',
      steps: [
        'Baca rating bintang dan teks ulasan pembeli.',
        'Jika bintang 5: Ucapkan terima kasih hangat dan sebutkan manfaat produk yang dinikmati.',
        'Jika bintang 1-3: Minta maaf dengan tulus, jangan defensif, dan tawarkan solusi garansi/ganti rugi.',
        'Tautkan nomor layanan WhatsApp CS resmi untuk penyelesaian kendala.',
        'Minta approval pemilik untuk ulasan bintang 1 sebelum respons terkirim.',
      ],
    },
    memoryItems: [
      { category: 'BUSINESS', content: 'Toko Resmi: Tokopedia & Shopee BuildRAB Official' },
      { category: 'POLICIES', content: 'Barang cacat diganti 100% gratis dengan syarat menyertakan video unboxing utuh' },
    ],
    authorityRules: {
      green: ['Membalas ulasan bintang 5', 'Menulis deskripsi produk SEO', 'Memeriksa laporan stok minimum'],
      yellow: ['Membalas komplain ulasan bintang 1-3', 'Mengirimkan voucher diskon kompensasi'],
      red: ['Mengubah rekening pencairan dana marketplace', 'Menghapus etalase produk aktif tanpa instruksi'],
    },
    automation: {
      trigger: 'Webhook notifikasi pesanan selesai dengan ulasan baru',
      condition: 'Rating ulasan <= 3 bintang',
      action: 'Analisis keluhan dan siapkan draf permohonan maaf serta investigasi',
      output: 'Kirim notifikasi darurat Yellow Authority ke pemilik',
    },
  },
];
