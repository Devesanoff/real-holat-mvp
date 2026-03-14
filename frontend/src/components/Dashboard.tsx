import { useState, useEffect } from "react";
import type { Facility } from "../types";
import { CheckCircle2, Award, Target, Users } from "lucide-react";

interface DashboardProps {
  facilities: Facility[];
}

export default function Dashboard({ facilities }: DashboardProps) {
  const [reportStats, setReportStats] = useState({ totalChecked: 0, satisfied: 0 });

  useEffect(() => {
    // In a real app we would fetch real stats from the backend
    // For now we derive it from mock logic or fetch a dedicated endpoint.
    fetch("http://localhost:8080/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setReportStats({
          totalChecked: data.total_reports || 0,
          satisfied: data.total_satisfied || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats", err);
        // Fallback calculations for the UI
        setReportStats({
          totalChecked: 15, // Example
          satisfied: 10,
        });
      });
  }, []);

  const totalSchools = facilities.length;
  const greenSchools = facilities.filter(f => f.status === "Yashil").length;
  const progressPercent = totalSchools > 0 ? Math.round((greenSchools / totalSchools) * 100) : 0;

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-100">Ommaviy ko'rinish</h2>
        <p className="text-slate-400">Jamoatchilik nazorati natijalari va statistikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full">
            <Target size={32} />
          </div>
          <h3 className="text-4xl font-black text-slate-100">{reportStats.totalChecked}</h3>
          <p className="text-slate-400 font-medium z-10">Nechta maktab tekshirildi?</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-4xl font-black text-emerald-400">{progressPercent}%</h3>
          <p className="text-slate-400 font-medium">Ishlarning qanchasi yakunlandi?</p>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-full hidden md:block">
            <Users size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Jonli Hisobot</h3>
            <p className="text-slate-400">15 nafar fuqaro tekshirdi, shundan 10 nafari mamnun.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 md:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Award size={24} />
            <h3 className="font-bold text-xl">Siz 1-raqamli inspektorsiz!</h3>
          </div>
          <p className="text-amber-200/80">Faoliyatingiz uchun rahmat. Sizning hissalaringiz maktablarni yaxshilashga yordam bermoqda.</p>
        </div>
      </div>

    </div>
  );
}
