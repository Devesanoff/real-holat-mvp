import type { Institution } from '../data/institutions';
import { Link } from 'react-router-dom';
import { School, Building2, MapPin, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Props {
  institution: Institution;
}

export default function InstitutionCard({ institution }: Props) {
  const Icon = institution.type === 'school' ? School : Building2;
  const typeLabel = institution.type === 'school' ? 'Maktab' : 'Klinika';

  return (
    <Link
      to={`/muassasalar/${institution.id}`}
      className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full"
    >
      <div className="h-36 bg-gradient-to-br from-[#162647] to-[#1E3055] relative flex items-center justify-center">
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 opacity-80" />
          {typeLabel}
        </div>
        <Icon className="w-10 h-10 text-white/20" />
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-semibold text-[15px] group-hover:text-blue-700 transition-colors">
          {institution.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <MapPin className="w-[11px] h-[11px]" />
          {institution.district}
        </p>
        
        <div className="mt-3 mt-auto">
          <StatusBadge status={institution.status} size="sm" />
        </div>
      </div>

      <div className="px-3.5 py-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {institution.lastCheck}
        </div>
        <span className="text-[12px] font-semibold text-blue-600">
          Batafsil ko'rish &rarr;
        </span>
      </div>
    </Link>
  );
}
