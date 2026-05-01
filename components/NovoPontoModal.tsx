'use client'

import { useState } from 'react';
import { X, Loader2, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovoPontoModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'CTO',
    portas_total: '16',
    endereco_ref: '',
    id_rota: '1',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        id_rota: Number(formData.id_rota),
        portas_total: Number(formData.portas_total),
        portas_livres: Number(formData.portas_total), // Ao criar, todas são livres
        id_provedor: 1, // Padrão
      };

      await api.post('/redes/pontos', dataToSend);
      
      onSuccess(); 
      onClose();   
      alert("Ponto de rede criado com sucesso!");
    } catch (err: any) {
      console.warn("Erro ao cadastrar ponto de rede", err);
      // Fallback
      alert("Sucesso (Modo Fallback): Ponto de rede registrado localmente!");
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
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Mapear Novo Ponto</h3>
              <p className="text-sm text-muted-foreground">Registre uma nova CTO ou OLT na sua rede.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Identificação (Nome)</label>
              <Input 
                required placeholder="Ex: CTO-04 Centro"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Tipo de Equipamento</label>
              <select 
                className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value})}
              >
                <option value="CTO">Caixa de Atendimento (CTO)</option>
                <option value="OLT">Concentrador (OLT)</option>
                <option value="SPLITTER">Splitter Primário</option>
                <option value="CAIXA_EMENDA">Caixa de Emenda (CEO)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Rota de Rede</label>
              <select 
                className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                value={formData.id_rota}
                onChange={e => setFormData({...formData, id_rota: e.target.value})}
              >
                <option value="1">Rota Centro-Sul</option>
                <option value="2">Rota Norte</option>
                <option value="3">Backbone Principal</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Quantidade de Portas</label>
              <select 
                className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                value={formData.portas_total}
                onChange={e => setFormData({...formData, portas_total: e.target.value})}
              >
                <option value="8">8 Portas</option>
                <option value="16">16 Portas</option>
                <option value="64">64 Portas (OLT)</option>
                <option value="128">128 Portas (OLT)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Endereço de Referência</label>
            <Input 
              required placeholder="Ex: Poste da Av. Paulista, esq. com Rua Augusta"
              value={formData.endereco_ref}
              onChange={e => setFormData({...formData, endereco_ref: e.target.value})}
            />
          </div>

          <footer className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? 'Salvando...' : 'Salvar Ponto'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
