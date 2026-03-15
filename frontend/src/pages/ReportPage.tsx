import { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useInstitutions, useSubmitReport } from '../hooks/useInstitution';
import { ArrowLeft, Camera, Send, CheckCircle, AlertCircle, Zap, Shield } from 'lucide-react';
import { cn } from '../utils/helpers';
import toast from 'react-hot-toast';
import { addReportPoints } from '../store/gamification';
import type { UserProgress, Badge } from '../store/gamification';

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const initialInst = searchParams.get('inst');
  
  const { data: institutions } = useInstitutions();
  const submitMutation = useSubmitReport();

  const [selectedInst, setSelectedInst] = useState(initialInst || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'good' | 'bad' | ''>('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Gamification result state
  const [gameResult, setGameResult] = useState<{
    newPoints: number;
    earned: Badge | null;
    progress: UserProgress;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPhoto(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return toast.error("Muassasa tanlang");
    if (!status) return toast.error("Holatni tanlang");
    if (!comment.trim()) return toast.error("Izoh yozing");

    try {
      await submitMutation.mutateAsync({
        id: Number(selectedInst),
        data: {
          comment,
          status: status === 'good' ? 'good' : 'bad',
          user_name: 'Fuqaro',
          photo: photo || undefined
        }
      });
      
      const result = addReportPoints(!!photo, status === 'bad');
      setGameResult(result);
      
      setIsSuccess(true);
      toast.success("Xabar yuborildi!");
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const resetForm = () => {
    setSelectedInst('');
    setPhoto(null);
    setComment('');
    setStatus('');
    setIsSuccess(false);
    setGameResult(null);
  };

  if (isSuccess && gameResult) {
    const { newPoints, earned, progress } = gameResult;
    
    return (
      <div className="max-w-[520px] mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl text-emerald-700 mb-3">Rahmat!</h1>
        <p className="text-slate-600 mb-8 max-w-[340px]">
          Sizning xabaringiz qabul qilindi va fuqarolar bazasiga qo'shildi.
        </p>

        {/* Gamification Points Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 w-full text-left mb-4">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-blue-900">
              +{newPoints} point
            </div>
            <div className="text-sm font-medium text-blue-700/80 mt-0.5">
              Jami: {progress.points} point
            </div>
          </div>
          {progress.streak > 1 && (
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-blue-100/50 shadow-sm shrink-0">
              <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider leading-none mb-1">Streak</span>
              <span className="text-sm font-bold text-orange-600 leading-none">{progress.streak} kun</span>
            </div>
          )}
        </div>

        {/* New Badge Box */}
        {earned && (
          <div className={cn("border rounded-xl p-4 flex items-center gap-4 w-full text-left mb-4", earned.color, earned.borderColor)}>
            <div className={cn("p-2 rounded-lg bg-white/50 shrink-0", earned.textColor)}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className={cn("text-xs font-bold uppercase tracking-wider mb-1", earned.textColor)}>
                Yangi medal: {earned.name}
              </div>
              <div className="text-sm font-medium text-slate-700">
                Tabriklaymiz! Yangi darajaga chiqdingiz.
              </div>
            </div>
          </div>
        )}
        
        {/* Current Level Line */}
        {!earned && (
          <div className="flex items-center justify-center gap-2 mb-8 text-slate-600 text-sm font-medium">
            <Shield className="w-4 h-4" />
            Daraja: qahramon {/* The prompt says Daraja: [LevelName] - dynamically resolve it */}
            <span className="text-slate-900 font-bold">
              {progress.points >= 1000 ? "Shaffoflik qahramoni" : 
               progress.points >= 400 ? "Shahar inspektori" : 
               progress.points >= 150 ? "Mahalla kuzatuvchisi" : 
               progress.points >= 50 ? "Faol fuqaro" : "Yangi inspektor"}
            </span>
          </div>
        )}
        {earned && <div className="mb-8" />} {/* Spacer if earned box was shown */}

        <button
          onClick={resetForm}
          className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
        >
          Yana xabar yuborish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto px-4 py-8 pb-24">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Bosh sahifaga qaytish
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="font-serif text-2xl text-slate-900">Xabar yuborish</h1>
          <p className="text-slate-500 text-sm mt-1">
            Muassasa holatini fuqarolar bazasiga qo'shing
          </p>
        </div>

        {/* Gamification Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 mb-6">
          <Zap className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-[13px] font-medium text-blue-900 leading-snug">
            <strong className="font-bold">Rasm bilan xabar = +20 point</strong> · Muammo topish = +15 qo'shimcha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Field 1: Muassasa */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Muassasa tanlang</label>
            <select
              value={selectedInst}
              onChange={e => setSelectedInst(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="" disabled>Tanlang...</option>
              {institutions?.map(i => (
                <option key={i.id} value={i.id}>{i.name} — {i.district}</option>
              ))}
            </select>
          </div>

          {/* Field 2: Photo Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Rasm yuklash</label>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative",
                isDragActive ? "border-blue-500 bg-blue-50" :
                photo ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-blue-300 bg-slate-50"
              )}
            >
              <input {...getInputProps()} />
              {photo ? (
                <>
                  <CheckCircle className="w-7 h-7 text-emerald-500 mb-2" />
                  <p className="text-emerald-700 font-medium text-sm">Rasm yuklandi</p>
                  <p className="text-emerald-600/70 text-xs mt-1 truncate max-w-[200px]">{photo.name}</p>
                </>
              ) : (
                <>
                  <Camera className="w-7 h-7 text-slate-400 mb-2" />
                  <p className="text-slate-600 font-medium text-sm">
                    Rasm yuklash uchun bosing yoki tashlang
                  </p>
                  <p className="text-slate-400 text-xs mt-1">JPG, PNG — max 10MB</p>
                </>
              )}
            </div>
          </div>

          {/* Field 3: Comment */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Izoh</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              placeholder="Hozirgi holat haqida yozing..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Field 4: Status */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Holat</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStatus('good')}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden",
                  status === 'good'
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-200 hover:border-emerald-300 bg-white"
                )}
              >
                <CheckCircle className={cn("w-5 h-5", status === 'good' ? "text-emerald-600" : "text-emerald-500")} />
                <span className={cn("text-sm font-medium", status === 'good' ? "text-emerald-700" : "text-emerald-600")}>
                  Bajarildi
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('bad')}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden",
                  status === 'bad'
                    ? "border-red-500 bg-red-50 shadow-sm"
                    : "border-slate-200 hover:border-red-300 bg-white"
                )}
              >
                <AlertCircle className={cn("w-5 h-5", status === 'bad' ? "text-red-600" : "text-red-500")} />
                <span className={cn("text-sm font-medium mb-0", status === 'bad' ? "text-red-700" : "text-red-600")}>
                  Muammo bor
                </span>
                {status === 'bad' && (
                  <span className="text-[10px] font-bold text-red-600/80 animate-in fade-in slide-in-from-bottom-2 absolute bottom-1">
                    +15 bonus point
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {submitMutation.isPending ? "Yuborilmoqda..." : (
              <>
                Xabar yuborish
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
