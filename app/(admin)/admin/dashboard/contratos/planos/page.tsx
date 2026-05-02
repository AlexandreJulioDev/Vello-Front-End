'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Loader2, Wifi, Zap, CheckCircle2, Shield, MoreHorizontal, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NovoPlanoModal from '@/components/NovoPlanoModal';

export default function PlanosPage() {
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPlanos = async () => {
    try {
      const response = await api.get('/planos');
      setPlanos(response.data);
    } catch (err) {
      console.warn("Erro ao carregar planos", err);
      // Fallback demo data
      setPlanos([
        { id_plano: 1, nome: "Fibra 200 Mega", velocidade_down: 200, velocidade_up: 100, preco: 79.90, fidelidade_meses: 12, ativo: true },
        { id_plano: 2, nome: "Fibra 500 Mega", velocidade_down: 500, velocidade_up: 250, preco: 99.90, fidelidade_meses: 12, ativo: true },
        { id_plano: 3, nome: "Fibra 1 Giga", velocidade_down: 1000, velocidade_up: 500, preco: 149.90, fidelidade_meses: 12, ativo: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Planos de Internet</h2>
          <p className="text-muted-foreground mt-1 text-lg">Catálogo de planos disponíveis para venda.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => alert("Opções adicionais: Exportar lista, reajuste em massa etc.")}>
            <Settings2 className="h-4 w-4" /> Opções
          </Button>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Plano
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card key={plano.id_plano} className="relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-blue-500"></div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <Wifi className="h-6 w-6" />
                </div>
                <Badge variant={plano.ativo ? "success" : "destructive"}>
                  {plano.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{plano.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-3xl font-black text-foreground">
                  R$ {Number(plano.preco).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-muted-foreground font-medium">/mês</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground font-semibold">{plano.velocidade_down} Mbps</span> Download
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-foreground font-semibold">{plano.velocidade_up} Mbps</span> Upload
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-orange-500" />
                  Fidelidade de <span className="text-foreground font-semibold">{plano.fidelidade_meses} meses</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="w-full">Editar Plano</Button>
                <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NovoPlanoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadPlanos} 
      />
    </div>
  );
}
