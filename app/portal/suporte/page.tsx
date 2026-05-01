'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Plus, Clock, CheckCircle2, AlertCircle, Wrench, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PortalSuportePage() {
  const [chamados, setChamados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', tipo: 'SUPORTE', prioridade: 'MEDIA' });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/atendimentos');
        setChamados(res.data);
      } catch {
        setChamados([
          { id_atendimento: 12, titulo: "Instalação Inicial", status: "CONCLUIDO", tipo: "INSTALACAO", criado_em: "2025-06-01T10:00:00Z" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/atendimentos', formData);
      alert('Chamado aberto com sucesso! Nossa equipe irá analisar em breve.');
    } catch {
      alert('Chamado registrado (Modo demonstração).');
    } finally {
      setSending(false);
      setShowForm(false);
      setFormData({ titulo: '', descricao: '', tipo: 'SUPORTE', prioridade: 'MEDIA' });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Suporte Técnico</h1>
          <p className="text-muted-foreground text-lg mt-1">Seus chamados e solicitações de atendimento.</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Novo Chamado
        </Button>
      </div>

      {/* Formulário de Novo Chamado */}
      {showForm && (
        <Card className="border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Abrir Chamado</CardTitle>
            <CardDescription>Descreva seu problema e nossa equipe irá resolver.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Assunto</label>
                <Input required placeholder="Ex: Internet caiu, Velocidade lenta..." value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Tipo</label>
                  <select className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="SUPORTE">Problema Técnico</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="CANCELAMENTO">Cancelamento</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Urgência</label>
                  <select className="w-full p-2.5 h-10 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" value={formData.prioridade} onChange={e => setFormData({...formData, prioridade: e.target.value})}>
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Normal</option>
                    <option value="ALTA">Urgente (Sem internet)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Descrição</label>
                <textarea required placeholder="Conte-nos o que está acontecendo..." className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none min-h-[100px] text-sm resize-none" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" disabled={sending} className="gap-2">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? 'Enviando...' : 'Enviar Chamado'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Chamados */}
      {chamados.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-bold text-foreground text-lg">Nenhum chamado aberto!</h3>
            <p className="text-muted-foreground mt-1">Caso tenha algum problema, clique em "Novo Chamado" acima.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chamados.map((c) => (
            <Card key={c.id_atendimento} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {c.status === 'CONCLUIDO' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> :
                     c.status === 'PENDENTE' ? <AlertCircle className="h-5 w-5 text-orange-500" /> :
                     <Clock className="h-5 w-5 text-blue-500" />}
                    <div>
                      <h3 className="font-bold text-foreground">{c.titulo}</h3>
                      <p className="text-xs text-muted-foreground">#{c.id_atendimento} • {c.tipo} • {new Date(c.criado_em).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <Badge variant={c.status === 'CONCLUIDO' ? 'success' : c.status === 'PENDENTE' ? 'warning' : 'outline'}>
                    {c.status === 'CONCLUIDO' ? 'Resolvido' : c.status === 'PENDENTE' ? 'Aguardando' : 'Em andamento'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
