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
    endereco: '',
    id_provedor: 1, // Padrão para o seu teste
    id_plano: 1,    // Padrão para o seu teste
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
        senha: formData.cpf.replace(/\D/g, ''), // Default password is the CPF
      };

      await api.post('/clientes', dataToSend);
      
      onSuccess(); 
      onClose();   
      setFormData({ 
        nome: '', email: '', telefone: '', cpf: '', 
        data_nascimento: '', endereco: '', id_provedor: 1, id_plano: 1 
      });

      alert("Cliente cadastrado com sucesso! Ele já pode usar o CPF ou E-mail para acessar.");

    } catch (err: any) {
      const apiError = err.response?.data?.message;
      const errorMessage = Array.isArray(apiError) 
        ? apiError.join(' | ') 
        : "Erro ao cadastrar. Verifique se CPF ou E-mail já existem.";

      alert(`Erro de Validação: ${errorMessage}`);
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

        <form onSubmit={handleSubmit} className="p-6">
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

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Endereço de Instalação</label>
              <Input 
                required
                placeholder="Rua, número, bairro e cidade"
                value={formData.endereco}
                onChange={e => setFormData({...formData, endereco: e.target.value})}
              />
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
