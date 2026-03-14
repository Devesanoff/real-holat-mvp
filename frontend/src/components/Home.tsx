import { MapPin } from "lucide-react";

interface HomeProps {
  setActiveTab: (tab: string) => void;
  requestLocation: () => void;
}

export default function Home({ setActiveTab, requestLocation }: HomeProps) {
  const handleStart = () => {
    requestLocation();
    setActiveTab("map");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
          Jamoatchilik nazorati va maktablar holati.
        </h1>
        <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto">
          Maktabingizdagi muammolarni xabar qiling yoki qilingan ijobiy ishlarni tasdiqlang.
        </p>
      </div>

      <button
        onClick={handleStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-2xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
      >
        <MapPin className="mr-2 h-6 w-6 group-hover:animate-bounce" />
        <span className="text-xl">Muammo haqida xabar berish</span>
      </button>
    </div>
  );
}
