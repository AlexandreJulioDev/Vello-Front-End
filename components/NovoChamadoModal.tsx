'use client'

import { useState, useEffect } from 'react';
import { X, Loader2, Wrench } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovoChamadoModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    equipamento_desc: '',
    id_cliente: '',
    prioridade: 'MEDIA',
    tipo: 'SUPORTE',
  });

  useEffect(() => {
    async function loadClientes() {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (err) {
        console.warn("Falha ao carregar clientes", err);
      }
    }
    if (isOpen) loadClientes();
  }, [isOpen]);

  const selectedClient = clientes.find(c => String(c.id_cliente) === String(formData.id_cliente));

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        id_cliente: Number(formData.id_cliente),
        id_provedor: 1, 
      };

      await api.post('/atendimentos', dataToSend);
      
      onSuccess(); 
      onClose();   
      alert("Chamado aberto com sucesso!");
    } catch (err: any) {
      alert(`Erro ao abrir chamado: ${err.response?.data?.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Novo Chamado</h3>
              <p className="text-sm text-muted-foreground">Abra uma Ordem de Serviço (OS) para o cliente.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Cliente (Nome / CPF)</label>
            <select 
              required
              className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
              value={formData.id_cliente}
              onChange={e => setFormData({...formData, id_cliente: e.target.value})}
            >
              <option value="">Selecione o cliente que precisa de suporte...</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nome} - {c.cpf}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Endereço de Instalação</p>
              <p className="text-sm text-foreground leading-relaxed">
                {selectedClient.endereco ? 
                  `${selectedClient.endereco.rua}, ${selectedClient.endereco.numero} - ${selectedClient.endereco.bairro} (${selectedClient.endereco.cidade})` :
                  'Endereço não cadastrado'}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Assunto (Título)</label>
            <Input 
              required placeholder="Ex: Rompimento de fibra óptica na rua"
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Tipo de Atendimento</label>
              <select 
                className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value})}
              >
                <option value="SUPORTE">Suporte Técnico</option>
                <option value="INSTALACAO">Nova Instalação</option>
                <option value="MANUTENCAO">Manutenção Preventiva</option>
                <option value="RETIRADA">Retirada de Equipamento</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Prioridade</label>
              <select 
                className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                value={formData.prioridade}
                onChange={e => setFormData({...formData, prioridade: e.target.value})}
              >
                <option value="BAIXA">Baixa (Pode esperar)</option>
                <option value="MEDIA">Média (Padrão)</option>
                <option value="ALTA">Alta (Urgência)</option>
                <option value="URGENTE">Urgente (Sem internet)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              Equipamento Utilizado
              <span className="text-[10px] font-normal text-muted-foreground uppercase">(Opcional)</span>
            </label>
            <Input 
              placeholder="Ex: Modem Nokia G-140W-H / Roteador Intelbras"
              value={formData.equipamento_desc}
              onChange={e => setFormData({...formData, equipamento_desc: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Descrição do Problema / Relato Técnico</label>
            <textarea 
              required placeholder="Descreva os detalhes do chamado, testes já realizados com o cliente..."
              className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none min-h-[100px] text-sm resize-none"
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
            ></textarea>
          </div>

          <footer className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? 'Salvando...' : 'Abrir OS'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
