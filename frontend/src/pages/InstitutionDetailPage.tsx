import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useInstitution } from '../hooks/useInstitution';
import StatusBadge from '../components/StatusBadge';
import TaskChecklist from '../components/TaskChecklist';
import ReportCard from '../components/ReportCard';
import SectionCard from '../components/SectionCard';
import { School, Building2 } from 'lucide-react';

export default function InstitutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: inst, isLoading } = useInstitution(Number(id));

  if (isLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse flex flex-col gap-6">
      <div className="h-6 bg-slate-200 w-48 rounded" />
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>;
  }

  if (!inst) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-500 font-medium">Muassasa topilmadi</div>;
  }

  const Icon = inst.type === 'school' ? School : Building2;
  const typeLabel = inst.type === 'school' ? 'Maktab' : 'Klinika';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Back Link */}
      <Link to="/muassasalar" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Muassasalar ro'yxatiga qaytish
      </Link>

      {/* Hero Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
        <div className="h-52 bg-gradient-to-br from-[#162647] to-[#1E3055] flex items-center justify-center relative">
          <Icon className="w-16 h-16 text-white/20" />
        </div>
        <div className="p-6">
          <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 mb-4">{inst.name}</h1>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{inst.address}, {inst.district}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4" />
              So'nggi tekshiruv: {inst.lastCheck}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <StatusBadge status={inst.status} />
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
              {typeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <SectionCard title="Va'da qilingan ishlar" className="mb-6">
        <TaskChecklist tasks={inst.tasks} />
      </SectionCard>

      {/* Reports Section */}
      <SectionCard title="Fuqarolar xabarlari" className="mb-6">
        {inst.reports && inst.reports.length > 0 ? (
          <div className="divide-y divide-slate-100 -my-3.5">
            {inst.reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic py-2">Hali xabar yuborilmagan.</p>
        )}
      </SectionCard>

      {/* Bottom CTA */}
      <Link
        to={`/xabar?inst=${inst.id}`}
        className="block w-full bg-blue-700 hover:bg-blue-800 text-white text-center py-4 rounded-xl font-semibold transition-colors mt-8"
      >
        Bajarilganini tekshirish &rarr;
      </Link>
    </div>
  );
}
