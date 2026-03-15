import { NavLink } from 'react-router-dom';
import { Home, Building2, Map, BarChart3 } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function MobileNav() {
  const tabs = [
    { name: 'Asosiy', path: '/', icon: Home },
    { name: 'Muassasalar', path: '/muassasalar', icon: Building2 },
    { name: 'Xarita', path: '/xarita', icon: Map },
    { name: 'Statistika', path: '/statistika', icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-full h-full gap-1',
                  isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
