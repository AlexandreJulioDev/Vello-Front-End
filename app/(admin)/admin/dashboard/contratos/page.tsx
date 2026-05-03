'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Loader2, Search, Filter, MoreHorizontal, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import NovoContratoModal from '@/components/NovoContratoModal';

export default function ContratosPage() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const loadContratos = async () => {
    try {
      const response = await api.get('/contratos');
      setContratos(response.data);
    } catch (err) {
      console.warn("Erro ao carregar contratos", err);
      setContratos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContratos();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ATIVO': return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Ativo</Badge>;
      case 'SUSPENSO': return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Suspenso</Badge>;
      case 'CANCELADO': return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Cancelado</Badge>;
      default: return <Badge>{status}</Badge>;
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
          <h2 className="text-3xl font-black text-foreground tracking-tight">Contratos</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerencie as assinaturas dos seus clientes.</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/admin/dashboard/contratos/planos">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Gerenciar Planos
            </Button>
          </Link>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <FileText className="h-4 w-4" /> Novo Contrato
          </Button>
        </div>
      </header>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por ID ou Cliente..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtrar
        </Button>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Venc.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {contratos.map((contrato) => (
                <tr key={contrato.id_contrato} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">#{contrato.id_contrato}</td>
                  <td className="px-6 py-4 font-bold text-foreground hover:text-primary cursor-pointer transition-colors">
                    <Link href={`/admin/dashboard/clientes/${contrato.cliente?.id_cliente}`}>
                      {contrato.cliente?.nome}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{contrato.plano?.nome}</div>
                    <div className="text-xs text-muted-foreground">R$ {Number(contrato.plano?.preco).toFixed(2).replace('.', ',')}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Dia {contrato.dia_vencimento}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(contrato.status)}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" size="icon" 
                        className="text-muted-foreground hover:text-primary transition-colors h-8 w-8 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === contrato.id_contrato ? null : contrato.id_contrato);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {openMenu === contrato.id_contrato && (
                      <div className="absolute right-6 top-12 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                        <div className="px-3 py-1.5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest border-b border-border/50 mb-1">
                          Gestão de Contrato
                        </div>
                        <Link href={`/admin/dashboard/clientes/${contrato.cliente?.id_cliente}`}>
                          <button className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left">
                            Ver Cadastro do Cliente
                          </button>
                        </Link>
                        <div className="h-px bg-border/50 my-1"></div>
                        <button 
                          onClick={async () => {
                            try {
                              const novoStatus = contrato.status === 'ATIVO' ? 'SUSPENSO' : 'ATIVO';
                              await api.patch(`/contratos/${contrato.id_contrato}`, { status: novoStatus });
                              loadContratos();
                            } catch (err) { alert("Erro ao mudar status"); }
                          }}
                          className={`w-full flex items-center px-3 py-2 text-sm transition-colors text-left ${contrato.status === 'ATIVO' ? 'text-orange-500 hover:bg-orange-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                        >
                          {contrato.status === 'ATIVO' ? 'Suspender Serviço' : 'Reativar Serviço'}
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm("Deseja realmente cancelar este contrato?")) {
                              try {
                                await api.patch(`/contratos/${contrato.id_contrato}`, { status: 'CANCELADO' });
                                loadContratos();
                              } catch (err) { alert("Erro ao cancelar"); }
                            }
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
                        >
                          Cancelar Assinatura
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <NovoContratoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadContratos} 
      />
    </div>
  );
}
