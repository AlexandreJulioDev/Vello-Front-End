'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Wifi, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PortalPlanoPage() {
  const [contrato, setContrato] = useState<any>(null);
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [contratosRes, planosRes] = await Promise.all([
          api.get('/contratos'),
          api.get('/planos'),
        ]);
        setContrato(contratosRes.data?.[0]);
        setPlanos(planosRes.data);
      } catch (err) {
        console.warn("Portal Plano: erro ao carregar", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Meu Plano</h1>
        <p className="text-muted-foreground text-lg mt-1">
          {contrato ? 'Detalhes do seu contrato e plano de internet.' : 'Você ainda não possui um plano. Escolha um abaixo para começar!'}
        </p>
      </div>

      {contrato ? (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-purple-500"></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Wifi className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{contrato.plano?.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Contrato #{contrato.id_contrato}</p>
                </div>
              </div>
              <Badge variant="success" className="text-sm px-4 py-1.5">
                <CheckCircle2 className="h-4 w-4 mr-1" /> {contrato.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              <div className="p-5 bg-secondary/50 rounded-2xl text-center">
                <Zap className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Download</p>
                <p className="text-3xl font-black text-foreground mt-1">{contrato.plano?.velocidade_down}</p>
                <p className="text-sm font-medium text-muted-foreground">Mbps</p>
              </div>
              <div className="p-5 bg-secondary/50 rounded-2xl text-center">
                <Zap className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload</p>
                <p className="text-3xl font-black text-foreground mt-1">{contrato.plano?.velocidade_up}</p>
                <p className="text-sm font-medium text-muted-foreground">Mbps</p>
              </div>
              <div className="p-5 bg-secondary/50 rounded-2xl text-center">
                <Shield className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Fidelidade</p>
                <p className="text-3xl font-black text-foreground mt-1">{contrato.plano?.fidelidade_meses}</p>
                <p className="text-sm font-medium text-muted-foreground">meses</p>
              </div>
              <div className="p-5 bg-primary/5 rounded-2xl text-center border border-primary/20">
                <p className="text-sm text-muted-foreground">Mensalidade</p>
                <p className="text-3xl font-black text-primary mt-2">
                  R$ {Number(contrato.plano?.preco).toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm font-medium text-muted-foreground">/mês</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="text-sm">
                <span className="text-muted-foreground">Data de Início:</span>
                <span className="text-foreground font-semibold ml-2">{new Date(contrato.data_inicio).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Dia de Vencimento:</span>
                <span className="text-foreground font-semibold ml-2">Todo dia {contrato.dia_vencimento}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planos.map((plano) => (
            <Card key={plano.id_plano} className="relative overflow-hidden group hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle>{plano.nome}</CardTitle>
                <p className="text-2xl font-black text-primary">R$ {Number(plano.preco).toFixed(2).replace('.', ',')}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 text-foreground">
                    <Zap className="h-4 w-4 text-primary" /> {plano.velocidade_down} Mega Download
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap className="h-4 w-4" /> {plano.velocidade_up} Mega Upload
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> {plano.fidelidade_meses} meses fidelidade
                  </p>
                </div>
                <Button 
                  className="w-full mt-6" 
                  onClick={() => window.open(`https://wa.me/5511940000000?text=Olá! Acabei de me cadastrar e quero contratar o plano ${plano.nome}`, '_blank')}
                >
                  Contratar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

