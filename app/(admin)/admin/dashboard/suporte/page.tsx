'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Plus, Wrench, AlertCircle, Clock, CheckCircle2, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import NovoChamadoModal from '@/components/NovoChamadoModal';
import DetalhesAtendimentoModal from '@/components/DetalhesAtendimentoModal';

export default function SuportePage() {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSelecionado, setTicketSelecionado] = useState<any>(null);
  const [isDetalheOpen, setIsDetalheOpen] = useState(false);

  const loadAtendimentos = async () => {
    try {
      const response = await api.get('/atendimentos');
      setAtendimentos(response.data);
    } catch (err) {
      console.warn("Erro ao carregar atendimentos", err);
      setAtendimentos([]);
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
      case 'MEDIA': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Média</Badge>;
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

  const abrirDetalhes = (ticket: any) => {
    setTicketSelecionado(ticket);
    setIsDetalheOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-sm font-medium animate-pulse">Buscando chamados...</p>
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
        
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Chamado
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUNA: PENDENTE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="font-bold text-foreground">Pendentes</h3>
            </div>
            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
              {atendimentos.filter(a => a.status === 'PENDENTE').length}
            </span>
          </div>
          <div className="space-y-4 min-h-[100px]">
            {atendimentos.filter(a => a.status === 'PENDENTE').map(ticket => (
              <Card 
                key={ticket.id_atendimento} 
                onClick={() => abrirDetalhes(ticket)}
                className="border-l-4 border-l-orange-500 hover:border-l-orange-400 group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-black text-muted-foreground/50 tracking-widest uppercase">OS #{ticket.id_atendimento}</span>
                    {getPriorityBadge(ticket.prioridade)}
                  </div>
                  <h4 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{ticket.titulo}</h4>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" /> <span className="font-medium text-foreground">{ticket.cliente?.nome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> 
                      <span className="truncate">
                        {ticket.cliente?.endereco ? 
                          `${ticket.cliente.endereco.rua || ''}, ${ticket.cliente.endereco.numero || ''} - ${ticket.cliente.endereco.bairro || ''}` : 
                          'Sem endereço'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {atendimentos.filter(a => a.status === 'PENDENTE').length === 0 && (
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground text-sm italic">
                Nenhum chamado pendente.
              </div>
            )}
          </div>
        </section>

        {/* COLUNA: EM EXECUÇÃO */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-bold text-foreground">Em Execução</h3>
            </div>
            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
              {atendimentos.filter(a => a.status === 'EM_EXECUCAO').length}
            </span>
          </div>
          <div className="space-y-4">
            {atendimentos.filter(a => a.status === 'EM_EXECUCAO').map(ticket => (
              <Card 
                key={ticket.id_atendimento} 
                onClick={() => abrirDetalhes(ticket)}
                className="border-l-4 border-l-blue-500 bg-blue-500/5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-black text-blue-500/50 tracking-widest uppercase">OS #{ticket.id_atendimento}</span>
                    <Badge className="bg-blue-500 text-white animate-pulse border-none">Ativo</Badge>
                  </div>
                  <h4 className="font-bold text-foreground leading-snug">{ticket.titulo}</h4>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                       {ticket.cliente?.nome}
                    </div>
                    <span className="text-[10px] font-black uppercase text-blue-500">{ticket.tipo}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* COLUNA: CONCLUÍDO */}
        <section className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-foreground text-muted-foreground">Concluídos</h3>
            </div>
            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
              {atendimentos.filter(a => a.status === 'CONCLUIDO').length}
            </span>
          </div>
          <div className="space-y-4">
            {atendimentos.filter(a => a.status === 'CONCLUIDO').slice(0, 5).map(ticket => (
              <Card 
                key={ticket.id_atendimento} 
                onClick={() => abrirDetalhes(ticket)}
                className="border-l-4 border-l-emerald-500 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-80"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-muted-foreground">#{ticket.id_atendimento}</span>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <h4 className="font-medium text-foreground text-sm line-clamp-1 line-through mt-2">{ticket.titulo}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <NovoChamadoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadAtendimentos} 
      />

      <DetalhesAtendimentoModal
        atendimento={ticketSelecionado}
        isOpen={isDetalheOpen}
        onClose={() => setIsDetalheOpen(false)}
        onUpdate={loadAtendimentos}
      />
    </div>
  );
}
