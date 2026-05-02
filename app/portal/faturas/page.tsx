'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, CheckCircle2, Clock, AlertTriangle, Copy, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PortalFaturasPage() {
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/faturas');
        setFaturas(res.data);
      } catch {
        setFaturas([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const copiarPix = (codigo: string) => {
    navigator.clipboard.writeText(codigo || 'PIX_DEMO_CODE');
    alert('Código PIX copiado! Cole no app do seu banco.');
  };

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Minhas Faturas</h1>
        <p className="text-muted-foreground text-lg mt-1">Acompanhe seus boletos e pagamentos.</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardContent className="p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Pendentes</p>
            <p className="text-3xl font-black text-orange-500 mt-1">{faturas.filter(f => f.status === 'PENDENTE').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <CardContent className="p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Atrasadas</p>
            <p className="text-3xl font-black text-destructive mt-1">{faturas.filter(f => f.status === 'ATRASADO').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardContent className="p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Pagas</p>
            <p className="text-3xl font-black text-emerald-500 mt-1">{faturas.filter(f => f.status === 'PAGO').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Faturas */}
      <div className="space-y-4">
        {faturas.map((fatura) => (
          <Card key={fatura.id_fatura} className={`overflow-hidden ${fatura.status === 'PENDENTE' ? 'border-orange-500/30' : fatura.status === 'ATRASADO' ? 'border-destructive/30' : ''}`}>
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {fatura.status === 'PAGO' ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> :
                   fatura.status === 'PENDENTE' ? <Clock className="h-6 w-6 text-orange-500" /> :
                   <AlertTriangle className="h-6 w-6 text-destructive" />}
                  <div>
                    <h3 className="font-bold text-foreground">Fatura {fatura.mes_referencia}</h3>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}
                      {fatura.data_pagamento && ` • Pago em: ${new Date(fatura.data_pagamento).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-foreground">R$ {Number(fatura.valor).toFixed(2).replace('.', ',')}</span>
                  <Badge variant={fatura.status === 'PAGO' ? 'success' : fatura.status === 'PENDENTE' ? 'warning' : 'destructive'}>
                    {fatura.status === 'PAGO' ? 'Pago' : fatura.status === 'PENDENTE' ? 'Pendente' : 'Atrasado'}
                  </Badge>
                </div>
              </div>
              
              {/* Ações para faturas pendentes */}
              {(fatura.status === 'PENDENTE' || fatura.status === 'ATRASADO') && (
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                  <Button className="gap-2" onClick={() => copiarPix(fatura.pix_copia_cola)}>
                    <Copy className="h-4 w-4" /> Copiar PIX
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <CreditCard className="h-4 w-4" /> Ver Boleto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
