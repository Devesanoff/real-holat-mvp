import { usePlatformStats } from '../hooks/useInstitution';
import PageHeader from '../components/PageHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import SectionCard from '../components/SectionCard';
import UserBadgeCard from '../components/UserBadgeCard';
import { cn } from '../utils/helpers';

const barData = [
  { name: 'Yunusobod', uv: 85, color: '#059669' },
  { name: 'Chilonzor', uv: 72, color: '#059669' },
  { name: "M. Ulug'bek", uv: 60, color: '#D97706' },
  { name: 'Sergeli', uv: 45, color: '#D97706' },
  { name: 'Olmazor', uv: 30, color: '#DC2626' },
];

const pieData = [
  { name: 'Yaxshi', value: 78, color: '#059669' },
  { name: 'Tekshirish', value: 14, color: '#D97706' },
  { name: 'Muammo', value: 8, color: '#DC2626' },
];

export default function StatsPage() {
  const { data: stats } = usePlatformStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24">
      <PageHeader 
        title="Statistika" 
        subtitle="Platforma bo'yicha umumiy holat va tahlil"
      />

      <div className="mb-6">
        <UserBadgeCard />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-sm text-slate-500 font-medium mb-1">Tekshirilgan muassasalar</div>
          <div className="font-serif text-3xl text-slate-900">{stats?.total_checked || 247}</div>
          <div className="text-xs text-blue-600 mt-2 font-medium">+12 bu hafta</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-sm text-emerald-700 font-medium mb-1">Ijobiy baholar</div>
          <div className="font-serif text-3xl text-emerald-600">193</div>
          <div className="text-xs text-emerald-600/70 mt-2 font-medium">78% muvaffaqiyatli</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-sm text-red-700 font-medium mb-1">Muammolar soni</div>
          <div className="font-serif text-3xl text-red-600">{stats?.issues_count || 54}</div>
          <div className="text-xs text-red-600/70 mt-2 font-medium">22% muammoli</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-sm text-slate-500 font-medium mb-1">Fuqarolar xabarlari</div>
          <div className="font-serif text-3xl text-slate-900">{stats?.total_reports || 1842}</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">jami yuborilgan</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <SectionCard title="Tumanlar bo'yicha bajarilish" Icon={BarChart3}>
          <div className="h-64 mt-4 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  formatter={(value: any) => [`${value}%`, 'Bajarilish darajasi']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="uv" radius={[0, 4, 4, 0]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Donut Chart */}
        <SectionCard title="Holatlar taqsimoti" Icon={TrendingUp}>
          <div className="h-64 mt-4 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, '']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  iconSize={10}
                  formatter={(value, entry: any) => (
                    <span className="text-slate-700 text-sm font-medium ml-1">
                      {value} <span className="font-bold ml-1">{entry.payload.value}%</span>
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Inner center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[120px]">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Jami</span>
              <span className="font-serif text-2xl text-slate-800 -mt-1">100%</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Activity Feed */}
      <SectionCard title="So'nggi faollik" Icon={Activity}>
        <div className="flex flex-col gap-2 mt-2">
          {[
            { text: "45-maktab (Yunusobod) — Hojatxona ta'mirlandi", time: "2 daqiqa oldin", color: "bg-emerald-500" },
            { text: "3-klinika (Sergeli) — Tibbiy asboblar yo'q", time: "15 daqiqa oldin", color: "bg-red-500" },
            { text: "12-maktab (Chilonzor) — Partalar yetkazilmagan", time: "1 soat oldin", color: "bg-amber-500" },
            { text: "7-klinika (Yunusobod) — Sovun dispenserlari o'rnatildi", time: "2 soat oldin", color: "bg-emerald-500" },
            { text: "31-maktab (Olmazor) — Yangi partalar qo'yildi", time: "3 soat oldin", color: "bg-emerald-500" }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg px-3.5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className={cn("w-2 h-2 rounded-full shrink-0", item.color)} />
                <span className="text-[13px] text-slate-700 font-medium truncate pr-4">{item.text}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap shrink-0">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
