'use client'

import { useState } from 'react';
import { User, Mail, Lock, Phone, CreditCard, Calendar, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Suspense } from 'react';

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    telefone: '',
    data_nascimento: '',
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleGoogleRegister = () => {
    alert('Em breve! O cadastro com Google será ativado em uma próxima atualização.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const id_provedor = searchParams.get('provedor') || '1';

      const response = await api.post('/auth/register', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: form.cpf,
        telefone: form.telefone,
        data_nascimento: form.data_nascimento,
        id_provedor: Number(id_provedor),
      });

      const { access_token, usuario } = response.data;
      
      localStorage.setItem('@Vello:token', access_token);
      localStorage.setItem('vello_token', access_token);
      localStorage.setItem('vello_user', JSON.stringify(usuario));

      router.push('/portal');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao realizar o cadastro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden py-12">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="w-full max-w-xl mx-auto px-4 z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-xl shadow-primary/20 mb-6">
            V
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Criar Conta</h1>
          <p className="mt-3 text-lg text-muted-foreground font-medium">Junte-se à revolução da internet ultrarrápida.</p>
        </div>

        <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <CardContent className="pt-8 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-start gap-3 animate-in zoom-in-95 duration-300">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      placeholder="Ex: João Silva" 
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.nome}
                      onChange={e => update('nome', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="email"
                      placeholder="seu@email.com" 
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">CPF</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      placeholder="000.000.000-00" 
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.cpf}
                      onChange={e => update('cpf', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">Telefone</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      placeholder="(11) 99999-9999" 
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.telefone}
                      onChange={e => update('telefone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">Nascimento</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="date"
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.data_nascimento}
                      onChange={e => update('data_nascimento', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.senha}
                      onChange={e => update('senha', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1">Confirmar Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-12 h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-background transition-all"
                      value={form.confirmarSenha}
                      onChange={e => update('confirmarSenha', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="h-12 w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Criar minha conta'}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Ou cadastre-se com</span></div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 w-full rounded-xl border-border/60 hover:bg-secondary/50 font-semibold gap-3"
                  onClick={handleGoogleRegister}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.1-1.93 3.3-4.77 3.3-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <CadastroForm />
    </Suspense>
  );
}
