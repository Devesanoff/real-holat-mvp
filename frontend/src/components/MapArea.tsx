import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { Facility } from "../types";
import { X, Camera, Send, FileWarning } from "lucide-react";

// Fix generic markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons for Statuses
const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style='background-color:${color};width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px ${color}'></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const icons = {
  Yashil: createIcon("#10B981"),
  Sariq: createIcon("#F59E0B"),
  Qizil: createIcon("#EF4444"),
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface MapAreaProps {
  userLocation: [number, number] | null;
}

export default function MapArea({ userLocation }: MapAreaProps) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [reportPhoto, setReportPhoto] = useState<string>("");
  const [reportStatus, setReportStatus] = useState<"Zo'r ishlayapti (Bajarildi)" | "Muammo (Bajarilmagan)">("Muammo (Bajarilmagan)");
  const [reportComment, setReportComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFacilities = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/facilities");
      if (res.ok) {
        const data = await res.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error("Failed to fetch facilities", error);
      // Fallback placeholder data if backend not ready
      setFacilities([
        {
          id: "1",
          name: "1-Maktab",
          lat: 41.311081,
          lng: 69.240562,
          status: "Qizil",
          promised_works: ["Hojatxonani ta'mirlash", "Tom yopish ishlari"],
        },
        {
          id: "2",
          name: "15-Maktab",
          lat: 41.315,
          lng: 69.25,
          status: "Sariq",
          promised_works: ["Sport zalini yangilash"],
        },
      ]);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;

    setIsSubmitting(true);
    try {
      const payload = {
        facility_id: selectedFacility.id,
        status: reportStatus,
        comment: reportComment,
        photo_base64: reportPhoto
      };

      const res = await fetch("http://localhost:8080/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Form sent, hide form, refresh data
        setShowForm(false);
        setReportComment("");
        setReportPhoto("");
        fetchFacilities();
      } else {
        alert("Xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Xatolik yuz berdi. Serverga ulanishda muammo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialCenter: [number, number] = userLocation || [41.311081, 69.240562];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      <MapContainer
        center={initialCenter}
        zoom={13}
        className="w-full h-full z-0"
      >
        <ChangeView center={initialCenter} zoom={userLocation ? 16 : 13} />
        {/* Dark Matter Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {facilities.map((fac) => (
          <Marker
            key={fac.id}
            position={[fac.lat, fac.lng]}
            icon={icons[fac.status] || icons.Sariq}
            eventHandlers={{
              click: () => {
                setSelectedFacility(fac);
                setShowForm(false);
              },
            }}
          />
        ))}

        {userLocation && (
          <Marker position={userLocation} zIndexOffset={100} />
        )}
      </MapContainer>

      {/* Floating Panel for School Info / Form */}
      {selectedFacility && (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 w-[90%] max-w-sm md:w-96 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-5 z-[500] animate-slide-in flex flex-col max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => setSelectedFacility(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {!showForm ? (
            <div className="space-y-4">
              <img
                src={"https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400"}
                alt="School"
                className="w-full h-40 object-cover rounded-xl"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-100">{selectedFacility.name}</h3>
                <p className="text-sm text-slate-400">Lat: {selectedFacility.lat.toFixed(4)}, Lng: {selectedFacility.lng.toFixed(4)}</p>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Nimalar va'da qilingan?</h4>
                <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                  {selectedFacility.promised_works && selectedFacility.promised_works.length > 0 ? (
                    selectedFacility.promised_works.map((work, idx) => (
                      <li key={idx}>{work}</li>
                    ))
                  ) : (
                    <li>Ma'lumot yo'q</li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-all"
              >
                <FileWarning size={20} />
                Buni tekshirish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Hisobot yuborish</h3>

              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 block">Rasm yuklash</label>
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all rounded-xl cursor-pointer overflow-hidden group">
                  {reportPhoto ? (
                    <img src={reportPhoto} alt="Upload preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-400">
                      <Camera size={32} />
                      <span className="text-sm mt-2">Rasm tanlash</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 block">Holatni belgilang</label>
                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                >
                  <option value="Zo'r ishlayapti (Bajarildi)">Zo'r ishlayapti (Bajarildi)</option>
                  <option value="Muammo (Bajarilmagan)">Muammo (Bajarilmagan)</option>
                </select>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 block">Izoh</label>
                <textarea
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Izoh qoldiring (masalan: Sovun idishi singan)"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-all"
                >
                  Orqaga
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reportPhoto || !reportComment}
                  className="w-2/3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={18} />
                      Yuborish
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
