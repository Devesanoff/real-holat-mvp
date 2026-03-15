
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, X, MapPin, MessageCircle, Camera } from 'lucide-react';
import { useInstitutions } from '../hooks/useInstitution';
import type { Institution } from '../data/institutions';
import StatusBadge from '../components/StatusBadge';

const COLORS: Record<string, string> = {
  good: '#10B981',
  warning: '#F59E0B',
  bad: '#EF4444',
};

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Map<number, any>>(new Map());
  const navigate     = useNavigate();

  const [selected, setSelected] = useState<Institution | null>(null);
  const [ready,    setReady]    = useState(false);
  const [locating, setLocating] = useState(false);

  const { data: institutions = [] } = useInstitutions();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (!mounted || !containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
          center: [41.2995, 69.2401],
          zoom: 12,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OSM © CARTO',
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        map.on('click', () => setSelected(null));
        mapRef.current = map;
        if (mounted) setReady(true);
      } catch (e) {
        console.error('Leaflet init error:', e);
      }
    };

    init();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || institutions.length === 0) return;

    import('leaflet').then((mod) => {
      const L = mod.default;
      institutions.forEach(inst => {
        if (!inst.lat || !inst.lng || markersRef.current.has(inst.id)) return;
        const c = COLORS[inst.status] ?? '#94A3B8';
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:22px;height:22px;border-radius:50%;background:${c};border:3px solid rgba(255,255,255,0.8);box-shadow:0 0 0 3px ${c}55,0 2px 8px rgba(0,0,0,0.5);cursor:pointer;"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const m = L.marker([inst.lat, inst.lng], { icon }).addTo(map);
        m.on('click', (e: any) => {
          e.originalEvent?.stopPropagation();
          setSelected(inst);
          map.flyTo([inst.lat, inst.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
        });
        m.bindTooltip(inst.name, { direction: 'top', offset: [0, -14] });
        markersRef.current.set(inst.id, m);
      });
    });
  }, [ready, institutions]);

  const flyTo = (inst: Institution) => {
    setSelected(inst);
    mapRef.current?.flyTo([inst.lat, inst.lng], 15, { duration: 0.6 });
  };

  const locateUser = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        import('leaflet').then((mod) => {
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

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 58px)', overflow: 'hidden' }}>

      {/* XARITA */}
      <div style={{ flex: 1, position: 'relative', background: '#0f172a' }}>

        {!ready && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', zIndex: 1000 }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ width: 32, height: 32, border: '3px solid #1d4ed8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Xarita yuklanmoqda...</p>
            </div>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

        {ready && (
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 400, background: 'rgba(2,6,23,0.9)', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }}>
            {[{ c: '#10B981', l: 'Yaxshi holat' }, { c: '#F59E0B', l: 'Tekshirish kerak' }, { c: '#EF4444', l: 'Muammo mavjud' }].map(({ c, l }) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#fff', marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />{l}
              </div>
            ))}
          </div>
        )}

        {ready && (
          <button onClick={locateUser} disabled={locating}
            style={{ position: 'absolute', bottom: 20, left: 16, zIndex: 400, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Navigation size={13} strokeWidth={2} />
            {locating ? 'Aniqlanmoqda...' : 'Joylashuvim'}
          </button>
        )}

        {selected && (
          <div style={{ position: 'absolute', top: 16, right: 292, width: 280, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 500, overflow: 'hidden' }}>
            <div style={{ height: 100, background: 'linear-gradient(135deg,#0f1f3d,#1e3055)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <button onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} />
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{selected.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
                <MapPin size={10} />{selected.district}
              </div>
              <div style={{ marginBottom: 10 }}>
                <StatusBadge status={selected.status} size="sm" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                {[
                  { v: selected.reports.length, l: 'Xabarlar' },
                  { v: selected.reports.filter(r => r.status === 'good').length, l: 'Ijobiy' },
                  { v: selected.tasks.filter(t => t.status === 'bad').length, l: 'Muammo' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ background: '#f8fafc', borderRadius: 8, padding: '7px 4px', textAlign: 'center' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{v}</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{l}</p>
                  </div>
                ))}
              </div>
              {selected.reports[0] && (
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>
                    <MessageCircle size={11} />Fuqarolar fikri
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>"{selected.reports[0].comment}"</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: '4px 0 0' }}>— {selected.reports[0].userName}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/muassasalar/${selected.id}`)}
                  style={{ flex: 1, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Batafsil ko'rish
                </button>
                <button onClick={() => navigate(`/xabar?inst=${selected.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 10px', border: '1px solid #bfdbfe', borderRadius: 8, background: '#fff', color: '#1d4ed8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Camera size={12} />Tekshir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* O'NG PANEL */}
      <div style={{ width: 280, background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Muassasalar</span>
          <span style={{ fontSize: 12, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 20 }}>{institutions.length} ta</span>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
          {[
            { color: '#10B981', label: 'Yaxshi',  count: institutions.filter(i => i.status === 'good').length },
            { color: '#F59E0B', label: 'Tekshir', count: institutions.filter(i => i.status === 'warning').length },
            { color: '#EF4444', label: 'Muammo',  count: institutions.filter(i => i.status === 'bad').length },
          ].map(({ color, label, count }) => (
            <div key={label} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color, margin: 0 }}>{count}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {institutions.map(inst => (
            <button key={inst.id} onClick={() => flyTo(inst)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f8fafc', background: selected?.id === inst.id ? '#eff6ff' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' } as React.CSSProperties}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[inst.status], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inst.name}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inst.district}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
