import { useState } from 'react';
import { useInstitutions } from '../hooks/useInstitution';
import PageHeader from '../components/PageHeader';
import InstitutionCard from '../components/InstitutionCard';
import EmptyState from '../components/EmptyState';
import { List, School, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function InstitutionsPage() {
  const [filter, setFilter] = useState('all');
  const { data: institutions, isLoading } = useInstitutions(filter);

  const filters = [
    { key: 'all', label: 'Barchasi', icon: List },
    { key: 'school', label: 'Maktablar', icon: School },
    { key: 'clinic', label: 'Klinikalar', icon: Building2 },
    { key: 'good', label: 'Yaxshi holat', icon: CheckCircle2 },
    { key: 'bad', label: 'Muammo bor', icon: AlertCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <PageHeader 
        title="Muassasalar" 
        subtitle={`Toshkent shahri — ${institutions?.length || 0} ta muassasa`} 
      />

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {filters.map(f => {
          const Icon = f.icon;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                isActive 
                  ? "bg-blue-700 text-white border-blue-700" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
              {f.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : institutions && institutions.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions.map(inst => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      ) : (
        <EmptyState 
          Icon={AlertCircle}
          title="Filtr bo'yicha muassasa topilmadi"
        />
      )}
    </div>
  );
}
