'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, FileText, Settings, Wifi, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
    { name: 'Contratos', href: '/dashboard/contratos', icon: FileText },
    { name: 'Rede', href: '/dashboard/rede', icon: Wifi },
    { name: 'Suporte', href: '/dashboard/suporte', icon: HelpCircle },
    { name: 'Configurações', href: '/dashboard/config', icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vello_token');
      localStorage.removeItem('@Vello:token');
      localStorage.removeItem('vello_user');
      router.push('/login');
    }
  };

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30">
            V
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Vello</h1>
        </div>
      </div>
      
      <div className="px-6 pb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Menu Principal</p>
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <button className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>
                  <item.icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} /> 
                  {item.name}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <div className="bg-secondary/50 p-4 rounded-xl mb-4 border border-border/50">
          <p className="text-sm font-medium text-foreground">Provedor Ativo</p>
          <p className="text-xs text-muted-foreground mt-1">Vello Networks LTDA</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
        >
          <LogOut className="h-4 w-4" /> Sair da conta
        </button>
      </div>
    </aside>
  );
}
