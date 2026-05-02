'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, Plus, Wifi, Box, MapPin, Server, Activity, CheckCircle2, AlertTriangle, XCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NovoPontoModal from '@/components/NovoPontoModal';

export default function RedePage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [pontos, setPontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vello_user');
      const user = raw ? JSON.parse(raw) : null;
      const PERFIS_AUTORIZADOS = ['DONO', 'GERENTE', 'TECNICO_EXTERNO'];

      if (!user || !PERFIS_AUTORIZADOS.includes(user.perfil)) {
        router.replace('/admin/dashboard');
        setAutorizado(false);
        return;
      }
      setAutorizado(true);
    } catch {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const loadRede = async () => {
    try {
      const response = await api.get('/redes/pontos');
      setPontos(response.data);
    } catch (err) {
      console.warn("Erro ao carregar rede", err);
      // Fallback demo data
      setPontos([
        { id_ponto: 1, nome: "CTO-01 (Centro)", tipo: "CTO", portas_total: 16, portas_livres: 4, status: "OPERANTE", endereco_ref: "Rua Principal, Poste 12", rota: { nome_rota: "Rota Centro-Sul" } },
        { id_ponto: 2, nome: "OLT-01 (NOC)", tipo: "OLT", portas_total: 64, portas_livres: 12, status: "OPERANTE", endereco_ref: "Datacenter Principal", rota: { nome_rota: "Backbone Core" } },
        { id_ponto: 3, nome: "CTO-02 (Bairro X)", tipo: "CTO", portas_total: 8, portas_livres: 0, status: "MANUTENCAO", endereco_ref: "Rua das Flores, Poste 45", rota: { nome_rota: "Rota Norte" } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRede();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'OPERANTE': return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Operante</Badge>;
      case 'MANUTENCAO': return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Manutenção</Badge>;
      case 'QUEDA_TOTAL': return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Queda Total</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'OLT': return <Server className="h-6 w-6 text-indigo-500" />;
      case 'CTO': return <Box className="h-6 w-6 text-emerald-500" />;
      default: return <Wifi className="h-6 w-6 text-primary" />;
    }
  };

  if (autorizado === null || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </div>
    );
  }

  if (autorizado === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Acesso Negado</h2>
        <p className="text-muted-foreground max-w-sm">Esta área é exclusiva para Administradores e Técnicos.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Infraestrutura de Rede</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerencie OLTs, CTOs, rotas e portas disponíveis.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => alert("A integração com Google Maps / Leaflet será adicionada em breve!")}>
            <MapPin className="h-4 w-4" /> Ver Mapa
          </Button>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Ponto
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Server className="h-8 w-8 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">OLTs Ativas</p>
                <p className="text-3xl font-black text-foreground">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Box className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">CTOs Mapeadas</p>
                <p className="text-3xl font-black text-foreground">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">Portas Livres</p>
                <p className="text-3xl font-black text-foreground">128</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-4">Pontos de Rede (Inventário)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pontos.map((ponto) => (
          <Card key={ponto.id_ponto} className="relative overflow-hidden group hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-lg bg-secondary">
                  {getTipoIcon(ponto.tipo)}
                </div>
                {getStatusBadge(ponto.status)}
              </div>
              <CardTitle className="text-lg">{ponto.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Rota associada:</span>
                  <span className="font-medium text-foreground">{ponto.rota?.nome_rota}</span>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-1 text-sm">
                    <span className="text-muted-foreground">Ocupação de Portas:</span>
                    <span className="font-bold text-foreground">
                      {ponto.portas_total - ponto.portas_livres} / {ponto.portas_total}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${ponto.portas_livres === 0 ? 'bg-destructive' : ponto.portas_livres <= 2 ? 'bg-warning' : 'bg-emerald-500'}`} 
                      style={{ width: `${((ponto.portas_total - ponto.portas_livres) / ponto.portas_total) * 100}%` }}
                    ></div>
                  </div>
                  {ponto.portas_livres === 0 && <p className="text-xs text-destructive mt-1 font-medium">Caixa lotada (Sem viabilidade)</p>}
                </div>

                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">Gerenciar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NovoPontoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadRede} 
      />
    </div>
  );
}
