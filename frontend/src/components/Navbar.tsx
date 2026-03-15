import { Link, NavLink } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function Navbar() {
  const navItems = [
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Muassasalar', path: '/muassasalar' },
    { name: 'Jonli xarita', path: '/xarita' },
    { name: 'Statistika', path: '/statistika' },
  ];

  return (
    <nav className="bg-[#0F1F3D] sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
            <span className="font-serif text-white text-xl tracking-wide">
              Real <span className="text-blue-400">Holat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/xabar"
            className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Camera className="w-4 h-4" />
            Xabar berish
          </Link>
        </div>
      </div>
    </nav>
  );
}
