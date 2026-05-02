'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Plus, Wrench, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import NovoChamadoModal from '@/components/NovoChamadoModal';

export default function SuportePage() {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAtendimentos = async () => {
    try {
      const response = await api.get('/atendimentos');
      setAtendimentos(response.data);
    } catch (err) {
      console.warn("Erro ao carregar atendimentos", err);
      // Fallback demo data
      setAtendimentos([
        { id_atendimento: 1, cliente: { id_cliente: 1, nome: "João Silva" }, titulo: "Sem internet na fibra", tipo: "MANUTENCAO", prioridade: "ALTA", status: "PENDENTE", criado_em: "2026-05-01T10:00:00Z" },
        { id_atendimento: 2, cliente: { id_cliente: 4, nome: "Ana Santos" }, titulo: "Instalação Nova", tipo: "INSTALACAO", prioridade: "MEDIA", status: "EM_EXECUCAO", criado_em: "2026-05-01T08:30:00Z" },
        { id_atendimento: 3, cliente: { id_cliente: 2, nome: "Maria Oliveira" }, titulo: "Troca de Senha Wi-Fi", tipo: "SUPORTE", prioridade: "BAIXA", status: "CONCLUIDO", criado_em: "2026-04-30T15:20:00Z" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAtendimentos();
  }, []);

  const getPriorityBadge = (prioridade: string) => {
    switch(prioridade) {
      case 'URGENTE': return <Badge variant="destructive">Urgente</Badge>;
      case 'ALTA': return <Badge variant="warning">Alta</Badge>;
      case 'MEDIA': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Média</Badge>;
      case 'BAIXA': return <Badge variant="outline">Baixa</Badge>;
      default: return <Badge>{prioridade}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDENTE': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'EM_EXECUCAO': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'CONCLUIDO': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default: return <Wrench className="h-5 w-5 text-muted-foreground" />;
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
          <h2 className="text-3xl font-black text-foreground tracking-tight">Suporte Técnico</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerenciamento de chamados e ordens de serviço (OS).</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Chamado
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PENDENTE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-foreground">Pendentes</h3>
            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
              {atendimentos.filter(a => a.status === 'PENDENTE').length}
            </span>
          </div>
          <div className="space-y-4">
            {atendimentos.filter(a => a.status === 'PENDENTE').map(ticket => (
              <Card key={ticket.id_atendimento} className="border-l-4 border-l-orange-500 hover:border-l-orange-500/80 hover:-translate-y-1 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-muted-foreground">#{ticket.id_atendimento}</span>
                    {getPriorityBadge(ticket.prioridade)}
                  </div>
                  <h4 className="font-bold text-foreground text-sm line-clamp-1">{ticket.titulo}</h4>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <Link href={`/admin/dashboard/clientes/${ticket.cliente?.id_cliente}`} className="text-primary hover:underline font-medium">
                      {ticket.cliente?.nome}
                    </Link>
                    <span className="text-muted-foreground">{new Date(ticket.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* EM EXECUÇÃO */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-foreground">Em Execução</h3>
            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
              {atendimentos.filter(a => a.status === 'EM_EXECUCAO').length}
            </span>
          </div>
          <div className="space-y-4">
            {atendimentos.filter(a => a.status === 'EM_EXECUCAO').map(ticket => (
              <Card key={ticket.id_atendimento} className="border-l-4 border-l-blue-500 hover:border-l-blue-500/80 hover:-translate-y-1 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-muted-foreground">#{ticket.id_atendimento}</span>
                    {getPriorityBadge(ticket.prioridade)}
                  </div>
                  <h4 className="font-bold text-foreground text-sm line-clamp-1">{ticket.titulo}</h4>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <Link href={`/admin/dashboard/clientes/${ticket.cliente?.id_cliente}`} className="text-primary hover:underline font-medium">
                      {ticket.cliente?.nome}
                    </Link>
                    <span className="text-muted-foreground">{ticket.tipo}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CONCLUÍDO */}
        <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-foreground">Concluídos (Recentes)</h3>
            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
              {atendimentos.filter(a => a.status === 'CONCLUIDO').length}
            </span>
          </div>
          <div className="space-y-4">
            {atendimentos.filter(a => a.status === 'CONCLUIDO').map(ticket => (
              <Card key={ticket.id_atendimento} className="border-l-4 border-l-emerald-500 hover:border-l-emerald-500/80 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-muted-foreground">#{ticket.id_atendimento}</span>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <h4 className="font-medium text-foreground text-sm line-clamp-1 line-through">{ticket.titulo}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

      <NovoChamadoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadAtendimentos} 
      />
    </div>
  );
}
