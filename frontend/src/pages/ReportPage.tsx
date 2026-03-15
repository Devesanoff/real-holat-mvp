import { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Camera, CheckCircle, AlertCircle, Send, ArrowLeft, Shield, Zap, Loader, MapPin, AlertTriangle } from 'lucide-react';
import { useInstitutions, useSubmitReport } from '../hooks/useInstitution';
import { addReportPoints, getCurrentLevel } from '../store/gamification';
import type { Institution } from '../data/institutions';

type ReportMode = 'verify' | 'street';
type StatusType = 'good' | 'bad' | null;

const STREET_CATEGORIES = [
  "Buzilgan yo'l",
  "Yorilgan suv quvuri",
  "Ishlamayotgan chiroq",
  "Buzilgan ko'prik",
  "Axlat muammosi",
  "Buzilgan mebel/jihozlar",
  "Boshqa muammo",
];

interface SuccessData {
  newPoints: number;
  earnedBadge: { name: string; color: string; textColor: string } | null;
  totalPoints: number;
  levelName: string;
  streak: number;
}

export default function ReportPage() {
  const [params] = useSearchParams();
  const preselected = params.get('inst');

  const [mode, setMode]           = useState<ReportMode>('verify');
  const [instId, setInstId]       = useState(preselected ?? '');
  const [taskIndex, setTaskIndex] = useState<number | null>(null);
  const [status, setStatus]       = useState<StatusType>(null);
  const [category, setCategory]   = useState('');
  const [address, setAddress]     = useState('');
  const [locating, setLocating]   = useState(false);
  const [comment, setComment]     = useState('');
  const [userName, setUserName]   = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [success, setSuccess]     = useState<SuccessData | null>(null);

  const { data: institutions = [] } = useInstitutions();
  const submitMutation = useSubmitReport();
  const selectedInst: Institution | undefined = institutions.find(i => i.id === Number(instId));

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setPhotoFile(files[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolokatsiya qo'llab-quvvatlanmaydi"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        setAddress(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        toast.success('Joylashuv aniqlandi!');
      },
      () => { setLocating(false); toast.error("Joylashuvni aniqlab bo'lmadi"); },
      { timeout: 8000 }
    );
  };

  const submit = async () => {
    if (mode === 'verify') {
      if (!instId)            { toast.error('Muassasa tanlang'); return; }
      if (taskIndex === null) { toast.error('Vazifani tanlang'); return; }
      if (!status)            { toast.error('Holat tanlang'); return; }
    } else {
      if (!category)          { toast.error('Muammo turini tanlang'); return; }
      if (!comment.trim())    { toast.error('Izoh yozing'); return; }
    }

    const taskLabel = selectedInst?.tasks[taskIndex!]?.title ?? '';
    const commentText = mode === 'street'
      ? `[${category}]${address ? ' ' + address : ''} — ${comment}`
      : taskLabel
        ? `[${taskLabel}] ${comment}`
        : comment;

    try {
      await submitMutation.mutateAsync({
        id: mode === 'verify' ? Number(instId) : 1,
        data: {
          comment: commentText.trim() || category,
          status: status === 'good' ? 'good' : 'bad',
          user_name: userName.trim() || 'Anonim fuqaro',
          photo: photoFile ?? undefined,
        }
      });

      const { newPoints, earned, progress } = addReportPoints(!!photoFile, status === 'bad' || mode === 'street');
      const level = getCurrentLevel(progress.points);
      setSuccess({
        newPoints,
        earnedBadge: earned ? { name: earned.name, color: earned.color, textColor: earned.textColor } : null,
        totalPoints: progress.points,
        levelName: level.name,
        streak: progress.streak,
      });
    } catch {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  };

  const reset = () => {
    setSuccess(null); setStatus(null); setComment('');
    setPhotoFile(null); setUserName(''); setTaskIndex(null);
    setCategory(''); setAddress('');
  };

  if (success) return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} strokeWidth={2} className="text-emerald-600" />
        </div>
        <h2 className="font-['DM_Serif_Display'] text-[22px] text-emerald-700 mb-2">Rahmat!</h2>
        <p className="text-sm text-slate-600 mb-5">
          Xabaringiz qabul qilindi va barcha fuqarolar ko'rishi uchun ochiq chiqdi.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap size={16} className="text-blue-600" />
            <span className="text-base font-bold text-blue-700">+{success.newPoints} point</span>
          </div>
          <p className="text-xs text-blue-600">
            Jami: {success.totalPoints} point
            {success.streak > 1 ? ` · ${success.streak} kun ketma-ket` : ''}
          </p>
        </div>
        {success.earnedBadge && (
          <div className={`border rounded-xl p-3 mb-4 ${success.earnedBadge.color}`}>
            <div className="flex items-center justify-center gap-2">
              <Shield size={16} className={success.earnedBadge.textColor} />
              <span className={`text-sm font-bold ${success.earnedBadge.textColor}`}>
                Yangi medal: {success.earnedBadge.name}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-5">
          <Shield size={14} className="text-slate-400" />
          Daraja: <span className="font-semibold">{success.levelName}</span>
        </div>
        <button onClick={reset}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors">
          Yana xabar yuborish
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <Link to="/muassasalar"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 mb-5 transition-colors">
        <ArrowLeft size={14} /> Orqaga
      </Link>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setMode('verify')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
            mode === 'verify' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
          }`}>
          <CheckCircle size={15} />
          Muassasa tekshirish
        </button>
        <button onClick={() => setMode('street')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
            mode === 'street' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-600'
          }`}>
          <AlertTriangle size={15} />
          Ko'cha muammosi
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="font-['DM_Serif_Display'] text-[18px] mb-1">
          {mode === 'verify' ? 'Muassasa tekshirish' : "Ko'cha muammosi"}
        </h1>
        <p className="text-xs text-slate-500 mb-3">
          {mode === 'verify' ? "Va'da qilingan ishlarni tekshiring" : "Ko'chada ko'rgan muammoni xabar bering"}
        </p>
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-4">
          <Zap size={12} />
          Rasm bilan = +20 point · Muammo topish = +15 qo'shimcha
        </div>

        {mode === 'verify' && (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Muassasa</label>
              <select value={instId} onChange={e => { setInstId(e.target.value); setTaskIndex(null); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
                <option value="">— Muassasa tanlang —</option>
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name} — {i.district}</option>
                ))}
              </select>
            </div>

            {selectedInst && selectedInst.tasks.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Qaysi vazifani tekshiryapsiz?
                </label>
                <div className="flex flex-col gap-2">
                  {selectedInst.tasks.map((task, i) => (
                    <button key={i} onClick={() => setTaskIndex(i)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        taskIndex === i ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                      }`}>
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        task.status === 'done' ? 'bg-emerald-500'
                        : task.status === 'warn' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-slate-700 flex-1">{task.title}</span>
                      {taskIndex === i && <CheckCircle size={15} className="text-blue-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'street' && (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Muammo turi</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
                <option value="">— Muammo turini tanlang —</option>
                {STREET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Joylashuv</label>
              <div className="flex gap-2">
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Manzil yoki koordinatalar"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={detectLocation} disabled={locating}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-60 hover:bg-blue-800 flex-shrink-0">
                  <MapPin size={13} className={locating ? 'animate-pulse' : ''} />
                  {locating ? '...' : 'Aniqla'}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Rasm yuklash <span className="text-blue-600 font-normal">(+10 bonus)</span>
          </label>
          <div {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-blue-500 bg-blue-50'
              : photoFile  ? 'border-emerald-400 bg-emerald-50'
              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}>
            <input {...getInputProps()} />
            {photoFile ? (
              <>
                <CheckCircle size={24} className="text-emerald-500 mx-auto mb-1.5" />
                <p className="text-sm text-emerald-600 font-semibold">{photoFile.name}</p>
              </>
            ) : (
              <>
                <Camera size={24} className="text-slate-400 mx-auto mb-1.5" />
                <p className="text-sm text-slate-600">Rasm yuklash uchun bosing</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG — max 10MB</p>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Izoh</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder={mode === 'verify'
              ? "Masalan: Sovun dispenseri bo'sh, to'ldirilmagan..."
              : 'Muammo haqida batafsil yozing...'}
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Ismingiz <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
          </label>
          <input type="text" value={userName} onChange={e => setUserName(e.target.value)}
            placeholder="Masalan: Zarina Yusupova"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
        </div>

        {mode === 'verify' && (
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Holat</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setStatus('good')}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                  status === 'good' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                }`}>
                <CheckCircle size={22} className={status === 'good' ? 'text-emerald-600' : 'text-slate-400'} />
                <span className={`text-[13px] font-bold ${status === 'good' ? 'text-emerald-700' : 'text-slate-600'}`}>
                  Bajarildi
                </span>
              </button>
              <button onClick={() => setStatus('bad')}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                  status === 'bad' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'
                }`}>
                <AlertCircle size={22} className={status === 'bad' ? 'text-red-600' : 'text-slate-400'} />
                <span className={`text-[13px] font-bold ${status === 'bad' ? 'text-red-700' : 'text-slate-600'}`}>
                  Muammo bor
                </span>
                {status === 'bad' && <span className="text-[10px] text-red-500">+15 bonus</span>}
              </button>
            </div>
          </div>
        )}

        <button onClick={submit} disabled={submitMutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-sm transition-colors">
          {submitMutation.isPending
            ? <><Loader size={14} className="animate-spin" /> Yuborilmoqda...</>
            : <><Send size={14} /> Xabar yuborish</>
          }
        </button>
      </div>
    </div>
  );
}
