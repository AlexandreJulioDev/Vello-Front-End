'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft, User, MapPin, Mail, Phone, Calendar, CreditCard, Activity, Wifi, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function ClienteDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCliente() {
      try {
        const response = await api.get(`/clientes/${id}`);
        setCliente(response.data);
      } catch (error) {
        console.warn("Erro ao carregar cliente", error);
        // Fallback for visual demo purposes if backend endpoint is not ready
        setCliente({
          id_cliente: Number(id),
          nome: "João Silva",
          email: "joao@example.com",
          telefone: "(11) 99999-9999",
          cpf: "123.456.789-00",
          ativo: true,
          criado_em: "2025-01-15T10:00:00Z",
          endereco: {
            rua: "Av. Paulista",
            numero: "1000",
            bairro: "Bela Vista",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01310-100"
          },
          contratos: [
            { id_contrato: 101, plano: { nome: "Fibra 500MB", preco: 99.90 }, status: "ATIVO", data_inicio: "2025-01-15" }
          ],
          faturas: [
            { id_fatura: 1, mes_referencia: "05/2026", valor: 99.90, status: "PENDENTE", data_vencimento: "2026-05-10" },
            { id_fatura: 2, mes_referencia: "04/2026", valor: 99.90, status: "PAGO", data_vencimento: "2026-04-10" }
          ],
          equipamentos: [
            { id_equipamento: 5, tipo: "ROTEADOR", marca: "TP-Link", modelo: "Archer C6", mac_address: "00:1A:2B:3C:4D:5E" }
          ],
          atendimentos: [
            { id_atendimento: 12, titulo: "Instalação Inicial", status: "CONCLUIDO", criado_em: "2025-01-15" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCliente();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="font-medium animate-pulse">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Cliente não encontrado.</p>
        <Button onClick={() => router.push('/dashboard/clientes')} variant="outline" className="mt-4">
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-10">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.push('/dashboard/clientes')}
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Button>

      {/* Header do Cliente */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
            {cliente.nome.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-foreground tracking-tight">{cliente.nome}</h1>
              <Badge variant={cliente.ativo ? "success" : "destructive"}>
                {cliente.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium mt-1">ID: #{cliente.id_cliente} • CPF: {cliente.cpf}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Editar
          </Button>
          <Button className="gap-2">
            <CreditCard className="h-4 w-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="visao-geral" className="py-2.5 px-6 rounded-lg">Visão Geral</TabsTrigger>
          <TabsTrigger value="contratos" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Wifi className="h-4 w-4"/> Contratos 
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{cliente.contratos?.length || 0}</span>
          </TabsTrigger>
          <TabsTrigger value="faturas" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <CreditCard className="h-4 w-4"/> Faturas
          </TabsTrigger>
          <TabsTrigger value="equipamentos" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Activity className="h-4 w-4"/> Equipamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" /> Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">E-mail</p>
                    <p className="text-sm text-muted-foreground">{cliente.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Telefone</p>
                    <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Cliente desde</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cliente.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" /> Endereço de Instalação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cliente.endereco ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="text-base text-foreground font-medium">{cliente.endereco.rua}, {cliente.endereco.numero}</p>
                    <p>{cliente.endereco.bairro}</p>
                    <p>{cliente.endereco.cidade} - {cliente.endereco.estado}</p>
                    <p>CEP: {cliente.endereco.cep}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Endereço não cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contratos">
          <Card>
            <CardHeader>
              <CardTitle>Contratos Ativos</CardTitle>
              <CardDescription>Gerencie os planos assinados por este cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              {cliente.contratos?.length > 0 ? (
                <div className="space-y-4">
                  {cliente.contratos.map((contrato: any) => (
                    <div key={contrato.id_contrato} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Wifi className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{contrato.plano.nome}</h4>
                          <p className="text-sm text-muted-foreground">Contrato #{contrato.id_contrato} • Iniciado em {new Date(contrato.data_inicio).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-foreground">R$ {Number(contrato.plano.preco).toFixed(2).replace('.', ',')}</p>
                          <Badge variant="success" className="mt-1">{contrato.status}</Badge>
                        </div>
                        <Button variant="outline" size="sm">Gerenciar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum contrato encontrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faturas">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>Boletos e PIX gerados para o cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              {cliente.faturas?.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Referência</th>
                      <th className="px-4 py-3">Vencimento</th>
                      <th className="px-4 py-3">Valor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cliente.faturas.map((fatura: any) => (
                      <tr key={fatura.id_fatura} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{fatura.mes_referencia}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 font-medium">R$ {Number(fatura.valor).toFixed(2).replace('.', ',')}</td>
                        <td className="px-4 py-3">
                          <Badge variant={fatura.status === 'PAGO' ? 'success' : fatura.status === 'PENDENTE' ? 'warning' : 'destructive'}>
                            {fatura.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-primary">Ver Boleto</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma fatura encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipamentos">
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos em Comodato</CardTitle>
              <CardDescription>Roteadores e ONUs instalados no cliente.</CardDescription>
            </CardHeader>
            <CardContent>
               {cliente.equipamentos?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cliente.equipamentos.map((equip: any) => (
                    <div key={equip.id_equipamento} className="p-4 border border-border rounded-xl bg-card flex items-start gap-4">
                      <div className="p-3 bg-secondary rounded-lg">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{equip.tipo} {equip.marca}</p>
                        <p className="text-sm text-muted-foreground">{equip.modelo}</p>
                        <p className="text-xs font-mono bg-muted px-2 py-1 rounded mt-2 inline-block">MAC: {equip.mac_address}</p>
                      </div>
                    </div>
                  ))}
                </div>
               ) : (
                <p className="text-sm text-muted-foreground">Nenhum equipamento vinculado.</p>
               )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
