'use client'

import { useRouter } from 'next/navigation';
import { LogOut, User, CreditCard, HelpCircle, Wifi, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vello_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const menuItems = [
    { name: 'Início', href: '/portal', icon: Home },
    { name: 'Meu Plano', href: '/portal/plano', icon: Wifi },
    { name: 'Faturas', href: '/portal/faturas', icon: CreditCard },
    { name: 'Suporte', href: '/portal/suporte', icon: HelpCircle },
    { name: 'Meus Dados', href: '/portal/perfil', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('vello_token');
    localStorage.removeItem('@Vello:token');
    localStorage.removeItem('vello_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30">
                V
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">Vello</span>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Portal do Cliente</span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}>
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user?.nome || 'Cliente'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-border">
          <div className="flex overflow-x-auto px-4 gap-1 py-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}>
                    <item.icon className="h-3.5 w-3.5" />
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
