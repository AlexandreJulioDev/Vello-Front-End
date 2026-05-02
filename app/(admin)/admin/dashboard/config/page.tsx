'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, Users, Building, Bell, Plus, X, Loader2, ShieldCheck, Wrench, HeadphonesIcon, Eye, EyeOff, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';

const PERFIS_ADMIN = ['DONO', 'GERENTE'];

// ─── Tipos que espelham o schema Prisma ───────────────────────
type Funcionario = {
  id_funcionario: number;
  nome: string;
  email: string;
  perfil: 'TECNICO_EXTERNO' | 'SUPORTE_INTERNO';
  ativo: boolean;
  criado_em: string;
};

type Administrador = {
  id_adm: number;
  nome: string;
  email: string;
  perfil: 'DONO' | 'GERENTE';
  ativo: boolean;
  criado_em: string;
};

// Perfis Funcionario: TECNICO_EXTERNO | SUPORTE_INTERNO
const perfilFuncLabels = {
  TECNICO_EXTERNO: { label: 'Técnico Externo', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',   icon: Wrench },
  SUPORTE_INTERNO: { label: 'Suporte Interno', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',   icon: HeadphonesIcon },
} as const;

// Perfis Administrador: DONO | GERENTE
const perfilAdmLabels = {
  DONO:    { label: 'Dono / Proprietário', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: ShieldCheck },
  GERENTE: { label: 'Gerente',             color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: ShieldCheck },
} as const;

type TipoModal = 'funcionario' | 'admin' | null;

export default function ConfigPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [admins, setAdmins]             = useState<Administrador[]>([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);

  const [showModal, setShowModal]   = useState<TipoModal>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showSenha, setShowSenha]   = useState(false);

  const [novoFunc, setNovoFunc] = useState({ nome: '', email: '', senha: '', perfil: 'TECNICO_EXTERNO' });
  const [novoAdm,  setNovoAdm]  = useState({ nome: '', email: '', senha: '', perfil: 'GERENTE' });

  async function carregarEquipe() {
    setLoadingEquipe(true);
    try {
      const [resFunc, resAdm] = await Promise.allSettled([
        api.get('/funcionarios'),
        api.get('/administradores'),
      ]);
      if (resFunc.status === 'fulfilled') setFuncionarios(resFunc.value.data);
      if (resAdm.status  === 'fulfilled') setAdmins(resAdm.value.data);
    } finally {
      setLoadingEquipe(false);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vello_user');
      const user = raw ? JSON.parse(raw) : null;
      if (!user || !PERFIS_ADMIN.includes(user.perfil)) {
        // Redireciona sem acesso
        router.replace('/admin/dashboard');
        setAutorizado(false);
        return;
      }
      setAutorizado(true);
      carregarEquipe();
    } catch {
      router.replace('/admin/dashboard');
    }
  }, []);

  // Aguardando verificação de permissão
  if (autorizado === null) return null;

  // Tela de acesso negado (renderiza brevemente antes do redirect)
  if (autorizado === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Acesso Negado</h2>
        <p className="text-muted-foreground max-w-sm">Você não tem permissão para acessar as Configurações. Esta área é exclusiva para Administradores.</p>
      </div>
    );
  }

  function abrirModal(tipo: TipoModal) {
    setShowModal(tipo);
    setFormError('');
    setFormSuccess('');
    setShowSenha(false);
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    const payload = showModal === 'funcionario'
      ? { ...novoFunc, id_provedor: 1 }
      : { ...novoAdm,  id_provedor: 1 };

    const endpoint = showModal === 'funcionario' ? '/funcionarios' : '/administradores';
    const nomePessoa = showModal === 'funcionario' ? novoFunc.nome : novoAdm.nome;

    try {
      await api.post(endpoint, payload);
      setFormSuccess(`"${nomePessoa}" cadastrado com sucesso!`);
      setNovoFunc({ nome: '', email: '', senha: '', perfil: 'TECNICO_EXTERNO' });
      setNovoAdm({  nome: '', email: '', senha: '', perfil: 'GERENTE' });
      carregarEquipe();
      setTimeout(() => { setShowModal(null); setFormSuccess(''); }, 2000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao cadastrar. Verifique os dados.');
    } finally {
      setFormLoading(false);
    }
  }

  // ─── Card de membro da equipe ─────────────────────────────
  function MembroCard({ nome, email, perfil, ativo, labels }: {
    nome: string; email: string; perfil: string; ativo: boolean;
    labels: Record<string, { label: string; color: string; icon: any }>;
  }) {
    const cfg  = (labels as any)[perfil] || Object.values(labels)[0];
    const Icon = cfg.icon;
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-secondary/30 transition-colors">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
          {nome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{nome}</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
        </div>
        <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>
          <Icon className="h-3 w-3" /> {cfg.label}
        </span>
        <span className={`w-2 h-2 rounded-full shrink-0 ${ativo ? 'bg-green-500' : 'bg-red-500'}`} title={ativo ? 'Ativo' : 'Inativo'} />
      </div>
    );
  }

  // ─── Modal genérico ────────────────────────────────────────
  const isFuncionario = showModal === 'funcionario';
  const form     = isFuncionario ? novoFunc : novoAdm;
  const setForm  = isFuncionario ? setNovoFunc : setNovoAdm;
  const perfisDisponiveis = isFuncionario ? perfilFuncLabels : perfilAdmLabels;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Configurações</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerencie as preferências e dados do seu provedor.</p>
        </div>
        <Button className="gap-2" onClick={() => alert('Configurações salvas!')}>
          <Save className="h-4 w-4" /> Salvar Alterações
        </Button>
      </header>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="empresa"      className="py-2.5 px-6 rounded-lg flex items-center gap-2"><Building className="h-4 w-4"/> Dados da Empresa</TabsTrigger>
          <TabsTrigger value="equipe"       className="py-2.5 px-6 rounded-lg flex items-center gap-2"><Users className="h-4 w-4"/> Equipe</TabsTrigger>
          <TabsTrigger value="notificacoes" className="py-2.5 px-6 rounded-lg flex items-center gap-2"><Bell className="h-4 w-4"/> Notificações</TabsTrigger>
        </TabsList>

        {/* ─── ABA EMPRESA ─── */}
        <TabsContent value="empresa">
          <Card>
            <CardHeader><CardTitle>Perfil do Provedor</CardTitle><CardDescription>Informações públicas e de faturamento da empresa.</CardDescription></CardHeader>
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
        <TabsContent value="equipe" className="space-y-6">

          {/* Administradores */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Administradores</CardTitle>
                <CardDescription>Donos e gerentes com acesso total ao sistema.</CardDescription>
              </div>
              <Button onClick={() => abrirModal('admin')} variant="outline" className="gap-2 border-purple-500/40 text-purple-400 hover:bg-purple-500/10">
                <Plus className="h-4 w-4" /> Novo Admin
              </Button>
            </CardHeader>
            <CardContent>
              {loadingEquipe ? (
                <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Carregando...</div>
              ) : admins.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                  <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum administrador além do titular.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {admins.map(a => <MembroCard key={a.id_adm} nome={a.nome} email={a.email} perfil={a.perfil} ativo={a.ativo} labels={perfilAdmLabels} />)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Funcionários */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Técnicos e Suporte</CardTitle>
                <CardDescription>Técnicos externos e agentes de suporte interno.</CardDescription>
              </div>
              <Button onClick={() => abrirModal('funcionario')} className="gap-2">
                <Plus className="h-4 w-4" /> Novo Funcionário
              </Button>
            </CardHeader>
            <CardContent>
              {loadingEquipe ? (
                <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Carregando...</div>
              ) : funcionarios.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-semibold text-foreground">Nenhum funcionário cadastrado</p>
                  <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Funcionário" para começar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {funcionarios.map(f => <MembroCard key={f.id_funcionario} nome={f.nome} email={f.email} perfil={f.perfil} ativo={f.ativo} labels={perfilFuncLabels} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ABA NOTIFICAÇÕES ─── */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader><CardTitle>Canais de Notificação</CardTitle><CardDescription>Configure como seus clientes recebem faturas e alertas.</CardDescription></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Configurações de SMTP, WhatsApp API e SMS ficarão aqui.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── MODAL CADASTRO ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">{isFuncionario ? 'Novo Funcionário' : 'Novo Administrador'}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Preencha os dados de acesso ao sistema.</p>
              </div>
              <button onClick={() => setShowModal(null)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCadastrar} className="p-6 space-y-4">
              {formError   && <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl"><AlertCircle className="h-4 w-4 shrink-0" /> {formError}</div>}
              {formSuccess && <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-xl"><CheckCircle2 className="h-4 w-4 shrink-0" /> {formSuccess}</div>}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nome Completo</label>
                <Input required placeholder="Ex: João Silva" value={form.nome} onChange={e => setForm((p: any) => ({ ...p, nome: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">E-mail de Acesso</label>
                <Input type="email" required placeholder="joao@empresa.com.br" value={form.email} onChange={e => setForm((p: any) => ({ ...p, email: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Senha de Acesso</label>
                <div className="relative">
                  <Input type={showSenha ? 'text' : 'password'} required placeholder="Senha provisória" value={form.senha} onChange={e => setForm((p: any) => ({ ...p, senha: e.target.value }))} className="pr-10" />
                  <button type="button" onClick={() => setShowSenha(s => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                    {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nível de Acesso</label>
                <div className={`grid gap-2 ${Object.keys(perfisDisponiveis).length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {(Object.entries(perfisDisponiveis) as any[]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const selected = form.perfil === key;
                    return (
                      <button key={key} type="button" onClick={() => setForm((p: any) => ({ ...p, perfil: key }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${selected ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                        <Icon className="h-5 w-5" /> {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(null)}>Cancelar</Button>
                <Button type="submit" disabled={formLoading} className="flex-1 gap-2">
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Cadastrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
