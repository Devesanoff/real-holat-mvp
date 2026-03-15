import { Link } from 'react-router-dom';
import { Camera, MapPin, ClipboardCheck, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F1F3D] to-[#1E3055] py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Shaffoflikni ta'minlash platformasi
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
            Real <span className="text-blue-400">Holat</span>
          </h1>
          
          <p className="text-white/55 text-lg max-w-[400px] mb-10">
            Davlat maktab va klinikalarni ta'mirlaydi. Ammo bu ishlar haqiqatan
            bajarildimi? Tekshirish sizning qo'lingizda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/xabar"
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              <Camera className="w-5 h-5" />
              Muammo haqida xabar berish
            </Link>
            <Link
              to="/xarita"
              className="flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 hover:border-white/40 px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              <MapPin className="w-5 h-5" />
              Xaritani ko'rish
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Bar */}
      <section className="bg-[#0F1F3D] border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10 py-6">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-serif text-3xl md:text-4xl text-blue-400">247</span>
              <span className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mt-1">Tekshirilgan muassasalar</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-serif text-3xl md:text-4xl text-blue-400">1 842</span>
              <span className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mt-1">Fuqarolar xabarlari</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-serif text-3xl md:text-4xl text-blue-400">78%</span>
              <span className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mt-1">Bajarilgan va'dalar</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-4 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-3">Qanday ishlaydi?</h2>
            <p className="text-slate-500 font-medium">To'rt oddiy qadam</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Muassasani toping</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Xaritada yoki ro'yxatdan yaqiningizda maktab yoki klinikani tanlang
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 hover:border-amber-200 hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Va'dalarni ko'ring</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Hukumat qanday ta'mirlash ishlarini bajarishga va'da berganini bilib oling
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Rasm yuboring</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Haqiqiy holat rasmi va izoh bilan xabar yuboring
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 hover:border-red-200 hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Natijalarni kuzating</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Ochiq statistika orqali barcha ma'lumotlar jamoatchilikka ochiq
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50 py-10 px-4 border-t border-slate-200">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <p className="text-slate-700 font-medium">
            Siz ham fuqaro inspektori bo'ling — yaqiningizda maktab yoki klinikani tekshiring.
          </p>
          <Link
            to="/muassasalar"
            className="flex-shrink-0 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Muassasalarni ko'rish
          </Link>
        </div>
      </section>
    </div>
  );
}
