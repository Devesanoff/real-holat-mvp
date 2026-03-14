import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import MapArea from './components/MapArea'
import Dashboard from './components/Dashboard'

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Joylashuvni aniqlashda xatolik yuz berdi. Iltimos, ruxsat bering.");
        }
      );
    } else {
      alert("Sizning brauzeringiz joylashuvni aniqlashni qo'llab-quvvatlamaydi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      
      {/* Content Area */}
      <main className={activeTab === 'map' ? 'pb-0' : 'pb-16 md:pb-0 pt-0 md:pt-16'}>
        {activeTab === 'home' && (
          <Home setActiveTab={setActiveTab} requestLocation={requestLocation} />
        )}
        
        {activeTab === 'map' && (
          <MapArea userLocation={userLocation} />
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard facilities={[]} />
        )}
      </main>

      {/* Navigation Layer */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  )
}

export default App
