import { Building2, Map, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-slate-800 border-t md:border-t-0 md:border-b border-slate-700 z-[1000] p-4 flex justify-around md:justify-center md:gap-8 items-center h-16 shadow-lg">
      <h1 className="hidden md:block text-slate-200 font-bold text-xl absolute left-6">
        Real Holat
      </h1>

      <button
        onClick={() => setActiveTab("home")}
        className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${
          activeTab === "home" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Building2 size={24} />
        <span className="text-xs md:text-sm font-medium">Bosh Sahifa</span>
      </button>

      <button
        onClick={() => setActiveTab("map")}
        className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${
          activeTab === "map" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Map size={24} />
        <span className="text-xs md:text-sm font-medium">Jonli Xarita</span>
      </button>

      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${
          activeTab === "dashboard" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <LayoutDashboard size={24} />
        <span className="text-xs md:text-sm font-medium">Ommaviy ko'rinish</span>
      </button>
    </nav>
  );
}
