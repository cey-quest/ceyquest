import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Trophy, 
  Brain, 
  BookOpen, 
  FileQuestion, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ceyquestLogo from '@/assets/ceyquest-logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/ceynovx', label: 'CeynovX', icon: Brain },
    { href: '/subjects', label: 'Subjects', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: FileQuestion },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-fit mx-auto mt-4 bg-black/40 backdrop-blur-md shadow-lg z-50 rounded-full px-4 py-2">
      <div className="flex justify-center items-center gap-4">
        <a href="/" className="flex items-center gap-2">
          <img src={ceyquestLogo} alt="CeyQuest Logo" className="h-10 w-auto" />
        </a>
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={
                  `nav-shutter flex items-center justify-center h-[50px] w-fit px-6 rounded-full font-semibold transition-all duration-200 shadow-md
                  text-white
                  ${isActive ? 'bg-gradient-to-r from-[#a259ff] to-[#6a1b9a]' : 'bg-white/10'}`
                }
                style={{ minWidth: 'fit-content' }}
              >
                <span className="nav-shutter-content flex items-center">
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;