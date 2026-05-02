'use client'

import { useState } from 'react';
import { api } from '@/lib/api';
import { 
  X, MapPin, Phone, Calendar, Clock, AlertTriangle, 
  CheckCircle2, Loader2, Navigation, Send, User, MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DetalhesAtendimentoModalProps {
  atendimento: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function DetalhesAtendimentoModal({ atendimento, isOpen, onClose, onUpdate }: DetalhesAtendimentoModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !atendimento) return null;

  const updateStatus = async (novoStatus: string) => {
    setLoading(true);
    try {
      await api.patch(`/atendimentos/${atendimento.id_atendimento}`, { status: novoStatus });
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    } finally {
      setLoading(false);
    }
  };

  const endereco = atendimento.cliente?.endereco;
  const enderecoFormatado = endereco 
    ? `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}`
    : 'Endereço não cadastrado';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Ordem de Serviço #{atendimento.id_atendimento}</h3>
              <p className="text-sm text-muted-foreground">{atendimento.tipo} • Aberto em {new Date(atendimento.criado_em).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          
          {/* Título e Descrição */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-foreground leading-tight">{atendimento.titulo}</h4>
            <div className="bg-secondary/50 p-4 rounded-xl border border-border/50 italic text-sm text-muted-foreground">
              "{atendimento.descricao || 'Sem descrição detalhada.'}"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h5 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <User className="h-3 w-3" /> Cliente
              </h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                    {atendimento.cliente?.nome?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{atendimento.cliente?.nome}</p>
                    <p className="text-xs text-muted-foreground">Protocolo: {atendimento.cliente?.protocolo_instalacao || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /> {atendimento.cliente?.telefone}
                </div>
              </div>
            </div>

            {/* Endereço de Atendimento */}
            <div className="space-y-4">
              <h5 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Localização
              </h5>
              <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                <p className="text-sm text-foreground font-medium mb-2">{enderecoFormatado}</p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFormatado)}`, '_blank')}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  <Navigation className="h-3.5 w-3.5" /> Abrir no Google Maps
                </button>
              </div>
            </div>
          </div>

          {/* Timeline / Agendamento */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-medium">
               <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
               Agendado: {atendimento.data_agendamento ? new Date(atendimento.data_agendamento).toLocaleDateString('pt-BR') : 'Hoje'}
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-medium">
               <Clock className="h-3.5 w-3.5 text-muted-foreground" />
               Prioridade: {atendimento.prioridade}
             </div>
          </div>
        </div>

        {/* Footer com Ações de Status */}
        <div className="p-6 bg-secondary/30 border-t border-border flex flex-col sm:flex-row gap-3">
          {atendimento.status === 'PENDENTE' && (
            <>
              <Button 
                onClick={() => updateStatus('EM_EXECUCAO')} 
                disabled={loading}
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 h-12"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                Indo ao Cliente
              </Button>
              <Button 
                variant="outline" 
                onClick={() => updateStatus('EM_EXECUCAO')}
                disabled={loading}
                className="flex-1 h-12"
              >
                <Clock className="h-4 w-4 mr-2" /> Iniciar Agora
              </Button>
            </>
          )}

          {atendimento.status === 'EM_EXECUCAO' && (
            <Button 
              onClick={() => updateStatus('CONCLUIDO')} 
              disabled={loading}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 h-12"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Finalizar Atendimento
            </Button>
          )}

          {atendimento.status === 'CONCLUIDO' && (
            <div className="w-full text-center p-2 bg-emerald-500/10 text-emerald-500 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Atendimento Finalizado com Sucesso
            </div>
          )}

          <Button variant="ghost" onClick={onClose} disabled={loading} className="h-12">
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
