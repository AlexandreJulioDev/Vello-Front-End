'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Wifi, CreditCard, HelpCircle, AlertTriangle, CheckCircle2, Clock, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PortalHomePage() {
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vello_user');
    if (stored) setUser(JSON.parse(stored));

    async function loadDados() {
      try {
        // Tenta puxar contratos e faturas do cliente logado
        const [contratosRes, faturasRes] = await Promise.all([
          api.get('/contratos'),
          api.get('/faturas'),
        ]);
        setDados({
          contratos: contratosRes.data,
          faturas: faturasRes.data,
        });
      } catch (err) {
        console.warn("Portal: usando dados de demonstração", err);
        setDados({
          contratos: [
            { id_contrato: 101, plano: { nome: "Fibra 500 Mega Premium", velocidade_down: 500, velocidade_up: 250, preco: 99.90 }, status: "ATIVO", data_inicio: "2025-06-01" }
          ],
          faturas: [
            { id_fatura: 1, mes_referencia: "05/2026", valor: 99.90, status: "PENDENTE", data_vencimento: "2026-05-10" },
            { id_fatura: 2, mes_referencia: "04/2026", valor: 99.90, status: "PAGO", data_vencimento: "2026-04-10" },
            { id_fatura: 3, mes_referencia: "03/2026", valor: 99.90, status: "PAGO", data_vencimento: "2026-03-10" },
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadDados();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const contrato = dados?.contratos?.[0];
  const proximaFatura = dados?.faturas?.find((f: any) => f.status === 'PENDENTE');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Saudação */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Olá, {user?.nome?.split(' ')[0] || 'Cliente'}! 👋
        </h1>
        <p className="text-muted-foreground text-lg mt-1">Bem-vindo ao seu portal. Aqui você gerencia tudo sobre sua internet.</p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card do Plano Atual */}
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-blue-500"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Wifi className="h-6 w-6" />
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>
            <CardTitle className="mt-3">Seu Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-2xl font-black text-foreground">{contrato?.plano?.nome || 'Fibra 500 Mega'}</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>⬇️ Download: <span className="text-foreground font-semibold">{contrato?.plano?.velocidade_down || 500} Mbps</span></p>
              <p>⬆️ Upload: <span className="text-foreground font-semibold">{contrato?.plano?.velocidade_up || 250} Mbps</span></p>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-3xl font-black text-foreground">
                R$ {Number(contrato?.plano?.preco || 99.90).toFixed(2).replace('.', ',')}
              </span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>
          </CardContent>
        </Card>

        {/* Card da Próxima Fatura */}
        <Card className="relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${proximaFatura ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-green-500'}`}></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${proximaFatura ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <CreditCard className="h-6 w-6" />
              </div>
              {proximaFatura ? (
                <Badge variant="warning">Pendente</Badge>
              ) : (
                <Badge variant="success">Em dia</Badge>
              )}
            </div>
            <CardTitle className="mt-3">Próxima Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            {proximaFatura ? (
              <>
                <p className="text-sm text-muted-foreground">Referente a {proximaFatura.mes_referencia}</p>
                <p className="text-3xl font-black text-foreground mt-2">
                  R$ {Number(proximaFatura.valor).toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Vencimento: {new Date(proximaFatura.data_vencimento).toLocaleDateString('pt-BR')}
                </p>
                <Link href="/portal/faturas">
                  <Button className="w-full mt-4 gap-2">
                    Pagar Agora <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
                <p className="font-semibold text-foreground">Tudo em dia!</p>
                <p className="text-sm text-muted-foreground mt-1">Nenhuma fatura pendente.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Suporte */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <CardHeader className="pb-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500 w-fit">
              <HelpCircle className="h-6 w-6" />
            </div>
            <CardTitle className="mt-3">Precisa de ajuda?</CardTitle>
            <CardDescription>Abra um chamado e nosso técnico irá atender você.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/portal/suporte">
              <Button variant="outline" className="w-full gap-2">
                Abrir Chamado <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="mt-4 p-3 bg-secondary/50 rounded-xl">
              <p className="text-xs text-muted-foreground">📞 Suporte direto:</p>
              <p className="text-sm font-bold text-foreground mt-1">(11) 4000-0000</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Faturas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>Últimos pagamentos e boletos em aberto.</CardDescription>
          </div>
          <Link href="/portal/faturas">
            <Button variant="outline" size="sm" className="gap-1">Ver todas <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dados?.faturas?.slice(0, 5).map((fatura: any) => (
              <div key={fatura.id_fatura} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  {fatura.status === 'PAGO' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : fatura.status === 'PENDENTE' ? (
                    <Clock className="h-5 w-5 text-orange-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground text-sm">Fatura {fatura.mes_referencia}</p>
                    <p className="text-xs text-muted-foreground">
                      Venc: {new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-foreground">R$ {Number(fatura.valor).toFixed(2).replace('.', ',')}</span>
                  <Badge variant={fatura.status === 'PAGO' ? 'success' : fatura.status === 'PENDENTE' ? 'warning' : 'destructive'}>
                    {fatura.status === 'PAGO' ? 'Pago' : fatura.status === 'PENDENTE' ? 'Pendente' : 'Atrasado'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
