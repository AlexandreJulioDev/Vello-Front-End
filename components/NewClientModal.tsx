'use client'

import { useState } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewClientModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '00000-000', // Padrão
    },
    id_provedor: 1, 
    id_plano: 1,    
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        id_provedor: Number(formData.id_provedor),
        id_plano: Number(formData.id_plano),
        senha: formData.cpf.replace(/\D/g, ''), 
      };

      await api.post('/clientes', dataToSend);
      
      onSuccess(); 
      onClose();   
      setFormData({ 
        nome: '', email: '', telefone: '', cpf: '', 
        data_nascimento: '', 
        endereco: { rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '00000-000' },
        id_provedor: 1, id_plano: 1 
      });

      alert("Cliente cadastrado com sucesso!");

    } catch (err: any) {
      alert(`Erro: ${err.response?.data?.message || "Erro ao cadastrar"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Cadastrar Novo Assinante</h3>
              <p className="text-sm text-muted-foreground">Preencha os dados básicos do cliente.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Nome Completo</label>
              <Input 
                required
                placeholder="Ex: João da Silva"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">E-mail (Login)</label>
              <Input 
                type="email" required
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Telefone (WhatsApp)</label>
              <Input 
                required
                placeholder="(00) 90000-0000"
                value={formData.telefone}
                onChange={e => setFormData({...formData, telefone: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">CPF</label>
              <Input 
                required
                placeholder="Apenas números"
                value={formData.cpf}
                onChange={e => setFormData({...formData, cpf: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Data de Nascimento</label>
              <Input 
                type="date" required
                value={formData.data_nascimento}
                onChange={e => setFormData({...formData, data_nascimento: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 py-2">
              <div className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-primary/20"></span>
                Endereço de Instalação
                <span className="flex-1 h-px bg-primary/20"></span>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Rua / Logradouro</label>
                  <Input 
                    required
                    placeholder="Nome da rua"
                    value={formData.endereco.rua}
                    onChange={e => setFormData({...formData, endereco: {...formData.endereco, rua: e.target.value}})}
                  />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Nº</label>
                  <Input 
                    required
                    placeholder="123"
                    value={formData.endereco.numero}
                    onChange={e => setFormData({...formData, endereco: {...formData.endereco, numero: e.target.value}})}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Bairro</label>
                  <Input 
                    required
                    placeholder="Bairro"
                    value={formData.endereco.bairro}
                    onChange={e => setFormData({...formData, endereco: {...formData.endereco, bairro: e.target.value}})}
                  />
                </div>
                <div className="col-span-1.5 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Cidade</label>
                  <Input 
                    required
                    placeholder="Cidade"
                    value={formData.endereco.cidade}
                    onChange={e => setFormData({...formData, endereco: {...formData.endereco, cidade: e.target.value}})}
                  />
                </div>
                <div className="col-span-0.5 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">UF</label>
                  <Input 
                    required maxLength={2}
                    placeholder="SP"
                    value={formData.endereco.estado}
                    onChange={e => setFormData({...formData, endereco: {...formData.endereco, estado: e.target.value.toUpperCase()}})}
                  />
                </div>
              </div>
            </div>
          </div>

          <footer className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? 'Salvando...' : 'Finalizar Cadastro'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
