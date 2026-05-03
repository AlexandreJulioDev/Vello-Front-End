'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, FileText, Settings, Wifi, HelpCircle, ShieldCheck, Wrench, HeadphonesIcon, DollarSign, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

// ─── Definição de permissões por perfil ──────────────────────
// DONO / GERENTE (Administrador)  → acesso total
// TECNICO_EXTERNO                 → Dashboard, Clientes, Contratos, Rede, Suporte
// SUPORTE_INTERNO                 → Dashboard, Clientes, Contratos, Suporte
// CLIENTE                         → bloqueado (redirecionado)

const PERFIS_ADMIN = ['DONO', 'GERENTE'];
const PERFIS_FUNC  = ['TECNICO_EXTERNO', 'SUPORTE_INTERNO'];

type MenuItem = {
  name: string;
  href: string;
  icon: any;
  roles: string[]; // quais perfis podem ver
};

const ALL_MENU: MenuItem[] = [
  { name: 'Dashboard',     href: '/admin/dashboard',            icon: LayoutDashboard, roles: [...PERFIS_ADMIN, ...PERFIS_FUNC] },
  { name: 'Clientes',      href: '/admin/dashboard/clientes',   icon: Users,           roles: [...PERFIS_ADMIN, ...PERFIS_FUNC] },
  { name: 'Contratos',     href: '/admin/dashboard/contratos',  icon: FileText,        roles: [...PERFIS_ADMIN, ...PERFIS_FUNC] },
  { name: 'Financeiro',    href: '/admin/dashboard/financeiro', icon: DollarSign,      roles: PERFIS_ADMIN },
  { name: 'Rede',          href: '/admin/dashboard/rede',       icon: Wifi,            roles: [...PERFIS_ADMIN, 'TECNICO_EXTERNO'] },
  { name: 'Suporte',       href: '/admin/dashboard/suporte',    icon: HelpCircle,      roles: [...PERFIS_ADMIN, ...PERFIS_FUNC] },
  { name: 'Meu Perfil',    href: '/admin/dashboard/perfil',     icon: User,            roles: [...PERFIS_ADMIN, ...PERFIS_FUNC] },
  { name: 'Configurações', href: '/admin/dashboard/config',     icon: Settings,        roles: PERFIS_ADMIN },
];

const perfilBadge: Record<string, { label: string; icon: any; color: string }> = {
  DONO:            { label: 'Dono',            icon: ShieldCheck,      color: 'text-purple-400' },
  GERENTE:         { label: 'Gerente',          icon: ShieldCheck,      color: 'text-orange-400' },
  TECNICO_EXTERNO: { label: 'Técnico Externo',  icon: Wrench,           color: 'text-blue-400'   },
  SUPORTE_INTERNO: { label: 'Suporte Interno',  icon: HeadphonesIcon,   color: 'text-cyan-400'   },
};

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [usuario, setUsuario] = useState<{ nome: string; email: string; perfil: string; foto_url?: string } | null>(null);
  const [nomeProvedor, setNomeProvedor] = useState<string>('Carregando...');

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const raw = localStorage.getItem('vello_user');
        if (raw) {
          const user = JSON.parse(raw);
          setUsuario(user);

          const prov = localStorage.getItem('vello_provider_name');
          if (prov) {
            setNomeProvedor(prov);
          } else if (user.id_provedor) {
            // Se não tem no cache, busca na API
            const response = await api.get(`/provedores/${user.id_provedor}`);
            if (response.data?.nome_fantasia) {
              const name = response.data.nome_fantasia;
              setNomeProvedor(name);
              localStorage.setItem('vello_provider_name', name);
            }
          }
        }
      } catch { /* ignorar */ }
    };

    refreshUser();
    window.addEventListener('storage', refreshUser);
    // Custom event for same-window updates
    window.addEventListener('userProfileUpdated', refreshUser);

    return () => {
      window.removeEventListener('storage', refreshUser);
      window.removeEventListener('userProfileUpdated', refreshUser);
    };
  }, []);

  const perfil     = usuario?.perfil ?? '';
  const menuItems  = ALL_MENU.filter(item => item.roles.includes(perfil));
  const badge      = perfilBadge[perfil];
  const BadgeIcon  = badge?.icon;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vello_token');
      localStorage.removeItem('@Vello:token');
      localStorage.removeItem('vello_user');
      router.push('/admin/login');
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${api.defaults.baseURL}${url}`;
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

      {/* Info do usuário logado */}
      {usuario && (
        <div className="px-6 pb-4">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden shadow-sm border border-primary/10">
              {usuario.foto_url ? (
                <img 
                  src={getImageUrl(usuario.foto_url)!} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                usuario.nome?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{usuario.nome}</p>
              {badge && (
                <span className={`flex items-center gap-1 text-xs font-medium ${badge.color}`}>
                  {BadgeIcon && <BadgeIcon className="h-3 w-3" />} {badge.label}
                </span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              title="Sair da conta"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="px-6 pb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu Principal</p>
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
          <p className="text-xs text-muted-foreground mt-1">{nomeProvedor}</p>
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
