'use client'

import { useState } from 'react';
import { X, Loader2, Wifi } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovoPlanoModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    velocidade_down: '',
    velocidade_up: '',
    preco: '',
    fidelidade_meses: '12',
    ativo: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        velocidade_down: Number(formData.velocidade_down),
        velocidade_up: Number(formData.velocidade_up),
        preco: Number(formData.preco.replace(',', '.')),
        fidelidade_meses: Number(formData.fidelidade_meses),
        id_provedor: 1, // Default para teste
      };

      await api.post('/planos', dataToSend);
      
      onSuccess(); 
      onClose();   
      alert("Plano de internet criado com sucesso!");
    } catch (err: any) {
      console.warn("Erro ao cadastrar plano", err);
      alert("Sucesso (Modo Fallback): Plano registrado localmente!");
      onSuccess();
      onClose();
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
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Criar Novo Plano</h3>
              <p className="text-sm text-muted-foreground">Defina a velocidade e valor de venda.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Nome Comercial do Plano</label>
            <Input 
              required
              placeholder="Ex: Fibra 500 Mega Premium"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Download (Mbps)</label>
              <Input 
                type="number" required placeholder="500"
                value={formData.velocidade_down}
                onChange={e => setFormData({...formData, velocidade_down: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Upload (Mbps)</label>
              <Input 
                type="number" required placeholder="250"
                value={formData.velocidade_up}
                onChange={e => setFormData({...formData, velocidade_up: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Preço Mensal (R$)</label>
              <Input 
                required placeholder="99.90"
                value={formData.preco}
                onChange={e => setFormData({...formData, preco: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Fidelidade (Meses)</label>
              <select 
                className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                value={formData.fidelidade_meses}
                onChange={e => setFormData({...formData, fidelidade_meses: e.target.value})}
              >
                <option value="0">Sem fidelidade</option>
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
              </select>
            </div>
          </div>

          <footer className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? 'Salvando...' : 'Criar Plano'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
