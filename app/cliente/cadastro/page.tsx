'use client'

import { useState } from 'react';
import { User, Mail, Lock, Phone, CreditCard, Calendar, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function CadastroCientePage() {
  const router = useRouter();
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
    // TODO: Integrar com Google OAuth real (necessita Google Cloud Console)
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
      const response = await api.post('/auth/register', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: form.cpf,
        telefone: form.telefone,
        data_nascimento: form.data_nascimento,
      });

      const { access_token, usuario } = response.data;
      localStorage.setItem('@Vello:token', access_token);
      localStorage.setItem('vello_token', access_token);
      localStorage.setItem('vello_user', JSON.stringify(usuario));
      router.push('/portal');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg?.includes('e-mail') || msg?.includes('CPF')) {
        setError('Já existe uma conta com este e-mail ou CPF.');
      } else {
        setError(msg || 'Erro ao criar conta. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden py-12">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="w-full max-w-lg mx-auto px-4 z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-3xl shadow-2xl shadow-primary/30 mb-6">
            V
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Criar sua conta</h1>
          <p className="mt-2 text-muted-foreground font-medium">Cadastre-se para acessar o portal do cliente.</p>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <CardContent className="p-8">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full h-12 flex items-center justify-center gap-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors mb-6"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Cadastrar com Google
            </button>

            {/* Separador */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground font-medium">ou preencha o formulário</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive p-3 flex items-start text-destructive text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Nome completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-muted-foreground" /></div>
                  <Input required className="pl-10 h-11 bg-background/50" placeholder="Seu nome completo" value={form.nome} onChange={e => update('nome', e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-muted-foreground" /></div>
                  <Input type="email" required className="pl-10 h-11 bg-background/50" placeholder="seuemail@exemplo.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>

              {/* CPF e Telefone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">CPF</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CreditCard className="h-4 w-4 text-muted-foreground" /></div>
                    <Input required className="pl-10 h-11 bg-background/50" placeholder="000.000.000-00" value={form.cpf} onChange={e => update('cpf', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Telefone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-muted-foreground" /></div>
                    <Input required className="pl-10 h-11 bg-background/50" placeholder="(11) 99999-9999" value={form.telefone} onChange={e => update('telefone', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Data de nascimento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-4 w-4 text-muted-foreground" /></div>
                  <Input type="date" required className="pl-10 h-11 bg-background/50" value={form.data_nascimento} onChange={e => update('data_nascimento', e.target.value)} />
                </div>
              </div>

              {/* Senhas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-muted-foreground" /></div>
                    <Input type="password" required minLength={6} className="pl-10 h-11 bg-background/50" placeholder="Mín. 6 caracteres" value={form.senha} onChange={e => update('senha', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Confirmar senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-muted-foreground" /></div>
                    <Input type="password" required minLength={6} className="pl-10 h-11 bg-background/50" placeholder="Repita a senha" value={form.confirmarSenha} onChange={e => update('confirmarSenha', e.target.value)} />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold gap-2 mt-2">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><CheckCircle2 className="h-5 w-5" /> Criar minha conta</>}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/cliente" className="text-primary font-semibold hover:underline">Fazer login</Link>
            </p>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center animate-in fade-in duration-1000 delay-300">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
