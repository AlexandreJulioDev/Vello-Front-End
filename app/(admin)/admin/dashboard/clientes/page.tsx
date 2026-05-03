'use client'

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Users, Search, Plus, Loader2, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react';
import NewClientModal from '@/components/NewClientModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Cliente {
  id_cliente: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  contratos?: {
    plano: {
      nome: string;
    }
  }[];
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const fetchClientes = useCallback(async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      console.warn("Erro ao carregar a lista de clientes:", err);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="font-medium animate-pulse">Buscando base de clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Clientes</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerencie a base de usuários do seu provedor.</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </header>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 bg-card border-border h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filteredClientes.length > 0 ? filteredClientes.map((cliente) => (
                <tr key={cliente.id_cliente} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {cliente.nome.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{cliente.nome}</div>
                        <div className="text-xs text-muted-foreground font-medium">ID: #{cliente.id_cliente}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-muted-foreground text-sm mb-1">
                      <Mail className="h-3.5 w-3.5 mr-2" /> {cliente.email}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Phone className="h-3.5 w-3.5 mr-2" /> {cliente.telefone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-2 shrink-0" /> 
                      <span className="truncate">
                        {cliente.endereco ? (
                          `${cliente.endereco.rua || ''}, ${cliente.endereco.numero || ''} - ${cliente.endereco.cidade || ''}/${cliente.endereco.estado || ''}`
                        ) : 'Não informado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      cliente.ativo ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" size="icon" 
                        className="text-muted-foreground hover:text-primary transition-colors h-8 w-8 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === cliente.id_cliente ? null : cliente.id_cliente);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {openMenu === cliente.id_cliente && (
                      <div className="absolute right-6 top-12 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                        <div className="px-3 py-1.5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest border-b border-border/50 mb-1">
                          Ações do Cliente
                        </div>
                        <button 
                          onClick={() => window.location.href = `/admin/dashboard/clientes/${cliente.id_cliente}`}
                          className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left"
                        >
                          Ver Perfil Completo
                        </button>
                        <button 
                          onClick={() => { setIsModalOpen(true); }}
                          className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left"
                        >
                          Abrir Chamado (OS)
                        </button>
                        <div className="h-px bg-border/50 my-1"></div>
                        <button 
                          onClick={async () => {
                            try {
                              await api.patch(`/clientes/${cliente.id_cliente}`, { ativo: !cliente.ativo });
                              fetchClientes();
                            } catch (err) { alert("Erro ao mudar status"); }
                          }}
                          className={`w-full flex items-center px-3 py-2 text-sm transition-colors text-left ${cliente.ativo ? 'text-orange-500 hover:bg-orange-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                        >
                          {cliente.ativo ? 'Inativar Cliente' : 'Reativar Cliente'}
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm("Tem certeza que deseja excluir este cliente?")) {
                              try {
                                await api.delete(`/clientes/${cliente.id_cliente}`);
                                fetchClientes();
                              } catch (err) { alert("Erro ao excluir"); }
                            }
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
                        >
                          Excluir Assinante
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium text-foreground">Nenhum cliente encontrado</p>
                      <p className="text-sm">Ajuste sua busca ou cadastre um novo usuário.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClientes} 
      />
    </div>
  );
}
