'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Wifi, CreditCard, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const raw = localStorage.getItem('vello_user');
        if (raw) {
          const user = JSON.parse(raw);
          setPerfil(user.perfil);
        }

        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.warn("Failed to load stats", error);
        setStats({ totalClientes: 0, planosAtivos: 0, faturamento: 0, atendimentos: 0, instalacoes: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const isAdmin = perfil === 'DONO' || perfil === 'GERENTE';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="font-medium animate-pulse">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground mt-1 text-lg">
            {isAdmin ? 'Métricas gerenciais da sua operação.' : 'Acompanhamento de atendimentos e chamados.'}
          </p>
        </div>
        <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border backdrop-blur-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">Sistema Operante</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Clientes (Todos vêem) */}
        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Clientes</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{stats?.totalClientes || 0}</div>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3" /> +12% este mês
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Planos Ativos (Todos vêem) */}
        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Planos Ativos</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Wifi className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{stats?.planosAtivos || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Clientes conectados</p>
          </CardContent>
        </Card>

        {/* Card 3: DINÂMICO (Faturamento para Admin / Instalações para Técnico) */}
        {isAdmin ? (
          <Card className="relative overflow-hidden group border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faturamento</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <CreditCard className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(stats?.faturamento) || 0)}
              </div>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-3 w-3" /> +4.5%
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Instalações</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground">{String(stats?.instalacoes || 0).padStart(2, '0')}</div>
              <p className="text-xs text-blue-500 font-medium mt-2">Agendadas para hoje</p>
            </CardContent>
          </Card>
        )}

        {/* Card 4: Atendimentos/Manutenções (Destaque para Técnico) */}
        <Card className={`relative overflow-hidden group ${!isAdmin ? 'border-orange-500/30 bg-orange-500/5' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {isAdmin ? 'Atendimentos' : 'Manutenções'}
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{stats?.atendimentos || 0}</div>
            <p className="text-xs text-orange-500 font-medium mt-2">
              {isAdmin ? 'Chamados em aberto' : 'Chamados na sua fila'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área Principal Dinâmica */}
        {isAdmin ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Acompanhamento do MRR nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-between gap-2 px-8 pb-10 pt-6">
              {stats?.revenueHistory?.map((data: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div 
                    className="w-full max-w-[40px] bg-primary/20 rounded-t-lg group-hover:bg-primary transition-all duration-500 relative"
                    style={{ height: `${(data.value / (stats.faturamento || 1)) * 100}%`, minHeight: '10%' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-border">
                      R$ {Number(data.value).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{data.month}</span>
                </div>
              ))}
              {!stats?.revenueHistory && (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm italic">Dados de faturamento indisponíveis</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sua Agenda Técnica</CardTitle>
                <CardDescription>Ordens de serviço e instalações prioritárias</CardDescription>
              </div>
              <Link href="/admin/dashboard/suporte">
                <Button variant="outline" size="sm">Ver tudo</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border">
                  {stats?.recentTickets?.filter((t: any) => t.status !== 'CONCLUIDO').length > 0 ? (
                    stats.recentTickets.filter((t: any) => t.status !== 'CONCLUIDO').map((item: any) => (
                      <Link key={item.id_atendimento} href="/admin/dashboard/suporte">
                        <div className="p-4 hover:bg-secondary/30 transition-colors flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                              {new Date(item.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{item.cliente?.nome}</p>
                              <p className="text-xs text-muted-foreground">{item.titulo}</p>
                            </div>
                          </div>
                          <div className="text-xs font-mono text-muted-foreground group-hover:text-primary">OS #{item.id_atendimento}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-20 text-center">
                      <Wrench className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
                      <p className="text-sm text-muted-foreground">Sua agenda está livre para hoje!</p>
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        )}

        {/* Sidebar do Dashboard (Chamados Recentes) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Suporte Recente</CardTitle>
              <CardDescription>Últimas interações</CardDescription>
            </div>
            <Link href="/admin/dashboard/suporte">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">Ver todos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentTickets?.length > 0 ? (
                stats.recentTickets.map((ticket: any) => (
                  <Link key={ticket.id_atendimento} href="/admin/dashboard/suporte">
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group mb-2">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{ticket.titulo}</p>
                        <p className="text-xs text-muted-foreground truncate">{ticket.cliente?.nome}</p>
                      </div>
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        ticket.status === 'PENDENTE' ? 'bg-orange-500/10 text-orange-500' : 
                        ticket.status === 'EM_EXECUCAO' ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {ticket.status}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <Activity className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">Nenhum chamado recente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
