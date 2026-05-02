'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Search, Filter, MoreHorizontal, CheckCircle2, AlertTriangle, XCircle, Clock, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function FinanceiroPage() {
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaturas() {
      try {
        const response = await api.get('/faturas');
        setFaturas(response.data);
      } catch (err) {
        console.warn("Erro ao carregar faturas", err);
        // Fallback demo data
        setFaturas([
          { id_fatura: 501, cliente: { id_cliente: 1, nome: "João Silva" }, valor: 99.90, data_vencimento: "2026-05-10", status: "PENDENTE", mes_referencia: "05/2026" },
          { id_fatura: 502, cliente: { id_cliente: 2, nome: "Maria Oliveira" }, valor: 79.90, data_vencimento: "2026-04-15", status: "PAGO", mes_referencia: "04/2026", data_pagamento: "2026-04-14", metodo_pagamento: "PIX" },
          { id_fatura: 503, cliente: { id_cliente: 3, nome: "Carlos Souza" }, valor: 149.90, data_vencimento: "2026-04-05", status: "ATRASADO", mes_referencia: "04/2026" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadFaturas();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PAGO': return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Pago</Badge>;
      case 'PENDENTE': return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case 'ATRASADO': return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Atrasado</Badge>;
      case 'CANCELADO': return <Badge variant="outline" className="gap-1"><XCircle className="h-3 w-3" /> Cancelado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

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
          <h2 className="text-3xl font-black text-foreground tracking-tight">Financeiro</h2>
          <p className="text-muted-foreground mt-1 text-lg">Controle de faturamentos, boletos e recebimentos.</p>
        </div>
        
        <div className="flex gap-3">
          <Button className="gap-2">
            <DollarSign className="h-4 w-4" /> Gerar Fatura
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">A Receber (Este Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">R$ 15.420,00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-500">R$ 42.100,50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-destructive">R$ 3.250,00</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por ID, Cliente ou Referência..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtrar
        </Button>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Fatura</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {faturas.map((fatura) => (
                <tr key={fatura.id_fatura} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{fatura.mes_referencia}</div>
                    <div className="text-xs text-muted-foreground font-mono">#{fatura.id_fatura}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground hover:text-primary cursor-pointer transition-colors">
                    <Link href={`/admin/dashboard/clientes/${fatura.cliente?.id_cliente}`}>
                      {fatura.cliente?.nome}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    R$ {Number(fatura.valor).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(fatura.status)}
                    {fatura.metodo_pagamento && (
                      <span className="block text-[10px] text-muted-foreground mt-1 font-semibold uppercase">{fatura.metodo_pagamento}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
