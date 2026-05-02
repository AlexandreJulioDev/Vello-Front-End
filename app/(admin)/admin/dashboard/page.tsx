'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Wifi, CreditCard, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.warn("Failed to load stats", error);
        // Fallback data for visual purposes if backend fails
        setStats({ totalClientes: 1432, planosAtivos: 1390, faturamento: 125430.50 });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

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
          <p className="text-muted-foreground mt-1 text-lg">Métricas em tempo real da sua operação.</p>
        </div>
        <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border backdrop-blur-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">Sistema Operante</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faturamento</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.faturamento || 0)}
            </div>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3" /> +4.5% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Atendimentos</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">14</div>
            <p className="text-xs text-orange-500 font-medium mt-2">Chamados em aberto</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Acompanhamento do MRR nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-secondary/20 rounded-xl border border-dashed border-border m-6 mt-0">
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Gráfico de Receita (Em breve)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Atendimentos</CardTitle>
            <CardDescription>Chamados recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Instalação Fibra</p>
                    <p className="text-xs text-muted-foreground">Cliente #{100 + i}</p>
                  </div>
                  <div className="ml-auto text-xs font-medium px-2 py-1 bg-orange-500/10 text-orange-500 rounded-full">
                    Pendente
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
