import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, X, MapPin, MessageCircle, Camera, ChevronUp, ChevronDown } from 'lucide-react';
import { useInstitutions } from '../hooks/useInstitution';
import type { Institution } from '../data/institutions';
import StatusBadge from '../components/StatusBadge';

const COLORS: Record<string, string> = {
  good: '#10B981', warning: '#F59E0B', bad: '#EF4444',
};

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Map<number, any>>(new Map());
  const navigate     = useNavigate();

  const [selected, setSelected] = useState<Institution | null>(null);
  const [ready,    setReady]    = useState(false);
  const [locating, setLocating] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const { data: institutions = [] } = useInstitutions();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        if (!mounted || !containerRef.current || mapRef.current) return;
        const map = L.map(containerRef.current, {
          center: [41.2995, 69.2401], zoom: 12, zoomControl: false,
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OSM © CARTO', maxZoom: 19, subdomains: 'abcd',
        }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        map.on('click', () => { setSelected(null); setListOpen(false); });
        mapRef.current = map;
        if (mounted) setReady(true);
      } catch (e) { console.error(e); }
    };
    init();
    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || institutions.length === 0) return;
    import('leaflet').then(mod => {
      const L = mod.default;
      institutions.forEach(inst => {
        if (!inst.lat || !inst.lng || markersRef.current.has(inst.id)) return;
        const c = COLORS[inst.status] ?? '#94A3B8';
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:22px;height:22px;border-radius:50%;background:${c};border:3px solid rgba(255,255,255,0.8);box-shadow:0 0 0 3px ${c}55,0 2px 8px rgba(0,0,0,0.5);cursor:pointer;"></div>`,
          iconSize: [22, 22], iconAnchor: [11, 11],
        });
        const m = L.marker([inst.lat, inst.lng], { icon }).addTo(map);
        m.on('click', (e: any) => {
          e.originalEvent?.stopPropagation();
          setSelected(inst);
          setListOpen(false);
          map.flyTo([inst.lat, inst.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
        });
        m.bindTooltip(inst.name, { direction: 'top', offset: [0, -14] });
        markersRef.current.set(inst.id, m);
      });
    });
  }, [ready, institutions]);

  const flyTo = (inst: Institution) => {
    setSelected(inst);
    setListOpen(false);
    mapRef.current?.flyTo([inst.lat, inst.lng], 15, { duration: 0.6 });
  };

  const locateUser = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        import('leaflet').then(mod => {
          const L = mod.default;
          const map = mapRef.current;
          if (!map) return;
          map.flyTo([coords.latitude, coords.longitude], 14);
          L.circleMarker([coords.latitude, coords.longitude], {
            radius: 9, fillColor: '#3B82F6', color: '#fff', weight: 3, fillOpacity: 1,
          }).addTo(map).bindTooltip('Siz shu yerdasiz', { permanent: true, direction: 'top' });
        });
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const good    = institutions.filter(i => i.status === 'good').length;
  const warning = institutions.filter(i => i.status === 'warning').length;
  const bad     = institutions.filter(i => i.status === 'bad').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)', overflow: 'hidden' }}>

      {/* XARITA */}
      <div style={{ flex: 1, position: 'relative', background: '#0f172a', minHeight: 0 }}>

        {!ready && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', zIndex: 1000 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: '3px solid #1d4ed8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Xarita yuklanmoqda...</p>
            </div>
          </div>
        )}

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

        {/* Legend */}
        {ready && (
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 400, background: 'rgba(2,6,23,0.9)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }}>
            {[{ c: '#10B981', l: 'Yaxshi' }, { c: '#F59E0B', l: 'Tekshirish' }, { c: '#EF4444', l: 'Muammo' }].map(({ c, l }) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#fff', marginBottom: 4 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />{l}
              </div>
            ))}
          </div>
        )}

        {/* Joylashuv tugmasi */}
        {ready && (
          <button onClick={locateUser} disabled={locating}
            style={{ position: 'absolute', bottom: 16, left: 12, zIndex: 400, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Navigation size={13} />
            {locating ? 'Aniqlanmoqda...' : 'Joylashuvim'}
          </button>
        )}

        {/* Muassasalar tugmasi — mobil */}
        {ready && (
          <button onClick={() => { setListOpen(!listOpen); setSelected(null); }}
            style={{ position: 'absolute', bottom: 16, right: 12, zIndex: 400, display: 'flex', alignItems: 'center', gap: 6, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {listOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            Ro'yxat ({institutions.length})
          </button>
        )}

        {/* Popup */}
        {selected && (
          <div style={{ position: 'absolute', top: 12, right: 12, width: 'min(280px, calc(100vw - 24px))', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 500, overflow: 'hidden' }}>
            <div style={{ height: 80, background: 'linear-gradient(135deg,#0f1f3d,#1e3055)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>{selected.type === 'school' ? 'Maktab' : 'Klinika'}</p>
              <button onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={12} />
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 3px' }}>{selected.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
                <MapPin size={10} />{selected.district}
              </div>
              <div style={{ marginBottom: 10 }}>
                <StatusBadge status={selected.status} size="sm" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 10 }}>
                {[
                  { v: selected.reports.length, l: 'Xabarlar' },
                  { v: selected.reports.filter(r => r.status === 'good').length, l: 'Ijobiy' },
                  { v: selected.tasks.filter(t => t.status === 'bad').length, l: 'Muammo' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ background: '#f8fafc', borderRadius: 7, padding: '6px 3px', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{v}</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{l}</p>
                  </div>
                ))}
              </div>
              {selected.reports[0] && (
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
                    <MessageCircle size={10} />Fuqarolar fikri
                  </div>
                  <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>"{selected.reports[0].comment}"</p>
                </div>
              )}
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Va'da qilingan ishlar</p>
                {selected.tasks.slice(0, 3).map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 3 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: t.status === 'done' ? '#10b981' : t.status === 'warn' ? '#f59e0b' : '#ef4444' }} />
                    <span style={{ fontSize: 11, color: '#475569' }}>{t.title}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => navigate(`/muassasalar/${selected.id}`)}
                  style={{ flex: 1, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Batafsil
                </button>
                <button onClick={() => navigate(`/xabar?inst=${selected.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '9px 10px', border: '1px solid #bfdbfe', borderRadius: 8, background: '#fff', color: '#1d4ed8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Camera size={12} />Tekshir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBIL PASTKI PANEL */}
      {listOpen && (
        <div style={{ height: '45vh', background: '#fff', borderTop: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 300, flexShrink: 0 }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Muassasalar</span>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ color: '#10B981', label: 'Yaxshi', count: good }, { color: '#F59E0B', label: 'Tekshir', count: warning }, { color: '#EF4444', label: 'Muammo', count: bad }].map(({ color, label, count }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color, margin: 0 }}>{count}</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {institutions.map(inst => (
              <button key={inst.id} onClick={() => flyTo(inst)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid #f8fafc', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' } as React.CSSProperties}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS[inst.status], flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{inst.name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{inst.district}</p>
                </div>
                <span style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 600, flexShrink: 0 }}>Ko'r →</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
