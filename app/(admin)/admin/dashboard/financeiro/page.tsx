'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, Search, Filter, MoreHorizontal, CheckCircle2, AlertTriangle, XCircle, Clock, CreditCard, DollarSign, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function FinanceiroPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const loadFaturas = async () => {
    try {
      const response = await api.get('/faturas');
      setFaturas(response.data);
    } catch (err) {
      console.warn("Erro ao carregar faturas", err);
      setFaturas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autorizado) loadFaturas();
  }, [autorizado]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PAGO': return <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Pago</Badge>;
      case 'PENDENTE': return <Badge variant="warning" className="bg-orange-500/10 text-orange-500 border-none px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider gap-1.5"><Clock className="h-3.5 w-3.5" /> Pendente</Badge>;
      case 'ATRASADO': return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-none px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Atrasado</Badge>;
      default: return <Badge className="rounded-full">{status}</Badge>;
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            Financeiro
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">Controle de faturamentos, boletos e recebimentos.</p>
        </div>
        
        <div className="flex gap-3">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <DollarSign className="h-4 w-4" /> Gerar Fatura
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card/50 border-border/40 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="h-16 w-16" />
          </div>
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">A Receber (Este Mês)</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-muted-foreground">R$</span>
              <span className="text-4xl font-black text-foreground tracking-tighter">15.420,00</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
              24 faturas pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-emerald-500/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 text-emerald-500/80">Recebido</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-emerald-500">R$</span>
              <span className="text-4xl font-black text-emerald-500 tracking-tighter">42.100,50</span>
            </div>
            <p className="text-[10px] text-emerald-600/70 mt-4 flex items-center gap-1.5 font-medium uppercase tracking-wider">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-red-500/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
            <AlertTriangle className="h-16 w-16" />
          </div>
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 text-red-500/80">Inadimplência</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-red-500">R$</span>
              <span className="text-4xl font-black text-red-500 tracking-tighter">3.250,00</span>
            </div>
            <p className="text-[10px] text-red-600/70 mt-4 flex items-center gap-1.5 font-medium uppercase tracking-wider">
              8 faturas em atraso
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por ID, Cliente ou Referência..."
            className="pl-9 h-10 bg-card/50 border-border/40 focus:bg-card transition-all"
          />
        </div>
        <Button variant="outline" className="gap-2 h-10 border-border/40 bg-card/50">
          <Filter className="h-4 w-4" /> Filtrar
        </Button>
      </div>

      <Card className="overflow-hidden border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/30 border-b border-border text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Fatura</th>
                <th className="px-6 py-5">Cliente</th>
                <th className="px-6 py-5">Valor</th>
                <th className="px-6 py-5">Vencimento</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card/20">
              {faturas.map((fatura) => (
                <tr key={fatura.id_fatura} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-foreground text-sm uppercase">{fatura.mes_referencia}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5 tracking-wider">#{fatura.id_fatura}</div>
                  </td>
                  <td className="px-6 py-5">
                    <Link 
                      href={`/admin/dashboard/clientes/${fatura.cliente?.id_cliente}`}
                      className="font-black text-foreground hover:text-primary transition-colors block text-sm"
                    >
                      {fatura.cliente?.nome}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-foreground">
                      <span className="text-[10px] mr-1 opacity-50">R$</span>
                      {Number(fatura.valor).toFixed(2).replace('.', ',')}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(fatura.status)}
                    {fatura.metodo_pagamento && (
                      <div className="flex items-center gap-1.5 mt-2 opacity-60">
                        <CreditCard className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{fatura.metodo_pagamento}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" size="icon" 
                        className="text-muted-foreground hover:text-primary transition-colors h-8 w-8 rounded-lg group-hover:bg-primary/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === fatura.id_fatura ? null : fatura.id_fatura);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {openMenu === fatura.id_fatura && (
                      <div className="absolute right-6 top-12 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100 text-left overflow-hidden">
                        <div className="px-4 py-2 text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest border-b border-border/50 mb-1 flex items-center justify-between">
                          Opções de Fatura
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        </div>
                        <button className="w-full flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left gap-3">
                          <FileText className="h-4 w-4" /> Ver Boleto / PDF
                        </button>
                        <button className="w-full flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left gap-3">
                          <CheckCircle2 className="h-4 w-4" /> Dar Baixa Manual
                        </button>
                        <div className="h-px bg-border/50 my-1"></div>
                        <button 
                          className="w-full flex items-center px-4 py-2.5 text-sm text-emerald-500 hover:bg-emerald-500/10 transition-colors text-left gap-3 font-medium"
                          onClick={() => {
                            const msg = `Olá ${fatura.cliente?.nome}, sua fatura de ${fatura.mes_referencia} está disponível. Valor: R$ ${fatura.valor}. Link: https://vello.com.br/fatura/${fatura.id_fatura}`;
                            window.open(`https://wa.me/55${fatura.cliente?.telefone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                        >
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.63 1.435h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp Cobrança
                        </button>
                        <button className="w-full flex items-center px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left gap-3">
                          <XCircle className="h-4 w-4" /> Cancelar Fatura
                        </button>
                      </div>
                    )}
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
