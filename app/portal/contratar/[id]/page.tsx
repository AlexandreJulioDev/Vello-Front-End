'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, CheckCircle2, Tv, Film, Wifi, CreditCard, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CheckoutPlanoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plano, setPlano] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados do Formulário
  const [vencimento, setVencimento] = useState('10');
  const [pagamento, setPagamento] = useState('PIX');
  const [adicionais, setAdicionais] = useState<string[]>([]);

  const listaAdicionais = [
    { id: 'tv', nome: 'Vello TV (Canais HD)', preco: 29.90, icon: Tv },
    { id: 'filmes', nome: 'Vello Filmes (Streaming)', preco: 19.90, icon: Film },
    { id: 'wifi', nome: 'Wi-Fi 6 Plus (Roteador Extra)', preco: 15.00, icon: Wifi },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/planos');
        const p = res.data.find((item: any) => item.id_plano === Number(id));
        setPlano(p);
      } catch (err) {
        console.error("Erro ao carregar plano:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const toggleAdicional = (id: string) => {
    setAdicionais(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const calcularTotal = () => {
    if (!plano) return 0;
    let total = Number(plano.preco);
    adicionais.forEach(a => {
      const add = listaAdicionais.find(item => item.id === a);
      if (add) total += add.preco;
    });
    return total;
  };

  const finalizarContratacao = async () => {
    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('vello_user') || '{}');
      
      const observacoes = adicionais.length > 0 
        ? `Adicionais escolhidos: ${adicionais.map(a => listaAdicionais.find(i => i.id === a)?.nome).join(', ')}. Forma de pgto: ${pagamento}`
        : `Forma de pgto: ${pagamento}`;

      await api.post('/contratos', {
        id_cliente: user.id,
        id_plano: Number(id),
        data_inicio: new Date().toISOString(),
        dia_vencimento: Number(vencimento),
        status: 'ATIVO',
        observacoes
      });

      alert('Contratação finalizada com sucesso! Bem-vindo à Vello.');
      router.push('/portal/plano');
    } catch (err) {
      console.error("Erro ao finalizar:", err);
      alert('Erro ao finalizar. Verifique os dados ou contate o suporte.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!plano) return <div className="p-8 text-center text-red-500">Plano não encontrado.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>Voltar</Button>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Finalizar Assinatura</h1>
          <p className="text-muted-foreground">Confirme os detalhes e personalize seu plano.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Configurações */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Dia de Vencimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> 1. Dia de Vencimento
              </CardTitle>
              <CardDescription>Escolha a melhor data para o seu pagamento mensal.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {['05', '10', '15', '20'].map(dia => (
                  <button
                    key={dia}
                    onClick={() => setVencimento(dia)}
                    className={`p-4 rounded-xl border-2 transition-all font-bold ${
                      vencimento === dia 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    Dia {dia}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. Turbinar Plano (Adicionais) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" /> 2. Turbinar seu Plano
              </CardTitle>
              <CardDescription>Adicione serviços extras para uma experiência completa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {listaAdicionais.map((item) => {
                const Icon = item.icon;
                const isSelected = adicionais.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAdicional(item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.nome}</p>
                        <p className="text-xs text-muted-foreground">+ R$ {item.preco.toFixed(2).replace('.', ',')}/mês</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* 3. Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> 3. Forma de Pagamento
              </CardTitle>
              <CardDescription>Como você prefere pagar suas faturas?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['PIX', 'Boleto', 'Cartão'].map(metodo => (
                  <button
                    key={metodo}
                    onClick={() => setPagamento(metodo)}
                    className={`p-4 rounded-xl border-2 transition-all font-bold ${
                      pagamento === metodo 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {metodo}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1 italic">
                <ShieldCheck className="h-3 w-3" /> Seus dados estão seguros e criptografados.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Resumo e Checkout */}
        <div className="space-y-6">
          <Card className="sticky top-8 border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <CardTitle>Resumo da Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-foreground">{plano.nome}</p>
                  <p className="text-xs text-muted-foreground">{plano.velocidade_down} Mega Fibra</p>
                </div>
                <p className="font-bold text-foreground">R$ {Number(plano.preco).toFixed(2).replace('.', ',')}</p>
              </div>

              {adicionais.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-dashed border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Adicionais:</p>
                  {adicionais.map(a => {
                    const item = listaAdicionais.find(i => i.id === a);
                    return (
                      <div key={a} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item?.nome}</span>
                        <span className="font-medium text-foreground">R$ {item?.preco.toFixed(2).replace('.', ',')}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t-2 border-border flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total Mensal</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary">R$ {calcularTotal().toFixed(2).replace('.', ',')}</p>
                  <p className="text-[10px] text-muted-foreground">Cobrado todo dia {vencimento}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20" 
                onClick={finalizarContratacao}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Finalizar Assinatura <ArrowRight className="h-5 w-5" /></>}
              </Button>
            </CardFooter>
          </Card>

          <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <p className="text-xs text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Instalação grátis em até 48h!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
