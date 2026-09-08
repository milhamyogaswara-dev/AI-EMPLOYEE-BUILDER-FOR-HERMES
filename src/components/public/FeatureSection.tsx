import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Sparkles, 
  FileSpreadsheet, 
  Database, 
  ShieldAlert, 
  Clock, 
  FlaskConical, 
  Network, 
  Send 
} from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      title: 'My Assistants',
      desc: 'Kelola AI Employee yang Anda bangun.',
      icon: Users,
      badge: 'CORE WORKSPACE',
    },
    {
      title: 'Training Center',
      desc: 'Ajarkan behavior, rules, dan cara kerja.',
      icon: GraduationCap,
      badge: 'BEHAVIOR MATRIX',
    },
    {
      title: 'Skills',
      desc: 'Tambahkan kemampuan spesifik.',
      icon: Sparkles,
      badge: 'CAPABILITIES',
    },
    {
      title: 'SOP Builder',
      desc: 'Susun langkah kerja yang konsisten.',
      icon: FileSpreadsheet,
      badge: 'WORKFLOW ENGINE',
    },
    {
      title: 'Memory Store',
      desc: 'Berikan konteks penting yang perlu diingat.',
      icon: Database,
      badge: 'KNOWLEDGE VAULT',
    },
    {
      title: 'Authority Rules',
      desc: 'Tentukan apa yang boleh, perlu approval, dan tidak boleh dilakukan.',
      icon: ShieldAlert,
      badge: 'SAFETY GATE',
    },
    {
      title: 'Automation',
      desc: 'Susun workflow untuk pekerjaan berulang.',
      icon: Clock,
      badge: 'CRON & ROUTINES',
    },
    {
      title: 'Test Lab',
      desc: 'Uji assistant sebelum digunakan lebih jauh.',
      icon: FlaskConical,
      badge: 'QUALITY BENCHMARK',
    },
    {
      title: 'Integrations',
      desc: 'Hubungkan AI dengan tools dan layanan eksternal.',
      icon: Network,
      badge: 'API & WEBHOOK',
    },
    {
      title: 'Deploy Hermes',
      desc: 'Siapkan konfigurasi untuk penggunaan Hermes.',
      icon: Send,
      badge: 'PRODUCTION READY',
    },
  ];

  return (
    <section className="py-20 bg-[#070707] border-t border-white/5 relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            Fitur Lengkap Aplikasi
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Modul Utama untuk Membangun AI Employee
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Setiap modul dirancang saling terhubung untuk menghasilkan AI agent yang patuh terhadap SOP dan aman dioperasikan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF5F1F]/40 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[9px] font-mono font-bold text-[#FF5F1F] uppercase tracking-wider mb-1.5">
                    {feat.badge}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
