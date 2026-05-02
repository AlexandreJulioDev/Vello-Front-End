'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, Users, Building, Bell, Plus, X, Loader2, ShieldCheck, Wrench, HeadphonesIcon, Eye, EyeOff, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';

type Funcionario = {
  id_funcionario: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
  criado_em: string;
};

const perfilLabels: Record<string, { label: string; color: string; icon: any }> = {
  ADMIN:   { label: 'Administrador', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: ShieldCheck },
  TECNICO: { label: 'Técnico',       color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',     icon: Wrench },
  SUPORTE: { label: 'Suporte',       color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',     icon: HeadphonesIcon },
};

export default function ConfigPage() {
  // ─── Equipe ───────────────────────────────────────────────
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '', email: '', senha: '', perfil: 'TECNICO',
  });

  async function carregarEquipe() {
    setLoadingEquipe(true);
    try {
      const res = await api.get('/funcionarios');
      setFuncionarios(res.data);
    } catch {
      // Sem dados ainda
    } finally {
      setLoadingEquipe(false);
    }
  }

  useEffect(() => { carregarEquipe(); }, []);

  async function handleCadastrarFuncionario(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      await api.post('/funcionarios', { ...novoFuncionario, id_provedor: 1 });
      setFormSuccess(`Funcionário "${novoFuncionario.nome}" cadastrado com sucesso!`);
      setNovoFuncionario({ nome: '', email: '', senha: '', perfil: 'TECNICO' });
      carregarEquipe();
      setTimeout(() => { setShowModal(false); setFormSuccess(''); }, 2000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao cadastrar funcionário.');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Configurações</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerencie as preferências e dados do seu provedor.</p>
        </div>
        <Button className="gap-2" onClick={() => alert('Configurações do provedor salvas!')}>
          <Save className="h-4 w-4" /> Salvar Alterações
        </Button>
      </header>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="empresa" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Building className="h-4 w-4"/> Dados da Empresa
          </TabsTrigger>
          <TabsTrigger value="equipe" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Users className="h-4 w-4"/> Equipe
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Bell className="h-4 w-4"/> Notificações
          </TabsTrigger>
        </TabsList>

        {/* ─── ABA EMPRESA ─── */}
        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Provedor</CardTitle>
              <CardDescription>Informações públicas e de faturamento da empresa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-semibold">Nome Fantasia</label><Input defaultValue="Vello Networks LTDA" /></div>
                <div className="space-y-2"><label className="text-sm font-semibold">CNPJ</label><Input defaultValue="00.000.000/0001-00" /></div>
                <div className="space-y-2"><label className="text-sm font-semibold">E-mail de Contato</label><Input defaultValue="contato@vellonetworks.com.br" /></div>
                <div className="space-y-2"><label className="text-sm font-semibold">Telefone de Suporte</label><Input defaultValue="(11) 4000-0000" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ABA EQUIPE ─── */}
        <TabsContent value="equipe">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Equipe de Acesso</CardTitle>
                <CardDescription>Gerencie administradores, técnicos e agentes de suporte.</CardDescription>
              </div>
              <Button onClick={() => { setShowModal(true); setFormError(''); setFormSuccess(''); }} className="gap-2">
                <Plus className="h-4 w-4" /> Novo Funcionário
              </Button>
            </CardHeader>
            <CardContent>
              {loadingEquipe ? (
                <div className="flex items-center justify-center py-10 gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" /> Carregando equipe...
                </div>
              ) : funcionarios.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-semibold text-foreground">Nenhum funcionário cadastrado</p>
                  <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Funcionário" para adicionar alguém à equipe.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {funcionarios.map((f) => {
                    const cfg = perfilLabels[f.perfil] || perfilLabels['SUPORTE'];
                    const Icon = cfg.icon;
                    return (
                      <div key={f.id_funcionario} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-secondary/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {f.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{f.nome}</p>
                          <p className="text-sm text-muted-foreground truncate">{f.email}</p>
                        </div>
                        <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>
                          <Icon className="h-3 w-3" /> {cfg.label}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${f.ativo ? 'bg-green-500' : 'bg-red-500'}`} title={f.ativo ? 'Ativo' : 'Inativo'} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ABA NOTIFICAÇÕES ─── */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Notificação</CardTitle>
              <CardDescription>Configure como seus clientes recebem faturas e alertas de suporte.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configurações de SMTP, WhatsApp API e SMS ficarão aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── MODAL CADASTRO FUNCIONÁRIO ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">Novo Funcionário</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Preencha os dados de acesso ao sistema.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarFuncionario} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {formError}
                </div>
              )}
              {formSuccess && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-xl">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> {formSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nome Completo</label>
                <Input
                  required
                  placeholder="Ex: João Silva"
                  value={novoFuncionario.nome}
                  onChange={e => setNovoFuncionario(p => ({ ...p, nome: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">E-mail de Acesso</label>
                <Input
                  type="email"
                  required
                  placeholder="joao@empresa.com.br"
                  value={novoFuncionario.email}
                  onChange={e => setNovoFuncionario(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Senha de Acesso</label>
                <div className="relative">
                  <Input
                    type={showSenha ? 'text' : 'password'}
                    required
                    placeholder="Senha provisória"
                    value={novoFuncionario.senha}
                    onChange={e => setNovoFuncionario(p => ({ ...p, senha: e.target.value }))}
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowSenha(s => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                    {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nível de Acesso</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ADMIN', 'TECNICO', 'SUPORTE'] as const).map(p => {
                    const cfg = perfilLabels[p];
                    const Icon = cfg.icon;
                    const selected = novoFuncionario.perfil === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNovoFuncionario(prev => ({ ...prev, perfil: p }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${selected ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                      >
                        <Icon className="h-5 w-5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading} className="flex-1 gap-2">
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Cadastrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
