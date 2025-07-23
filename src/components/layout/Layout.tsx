import { ReactNode } from 'react';
import Navigation from './Navigation';
import heroBg from '@/assets/hero_bg.png';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div
    className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${heroBg})` }}
  >
    <Navigation />
    <main>{children}</main>
  </div>
);

export default Layout;