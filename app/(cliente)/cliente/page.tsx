'use client'

import { useState, Suspense } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, Wifi, MessageCircle, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const id_provedor = searchParams.get('provedor') || '1';
      const response = await api.post('/auth/login', {
        email,
        senha: password,
        id_provedor: Number(id_provedor)
      });

      const { access_token, usuario } = response.data;
      
      if (usuario?.perfil !== 'CLIENTE') {
        setError('Esta área é exclusiva para clientes.');
        setLoading(false);
        return;
      }

      localStorage.setItem('@Vello:token', access_token);
      localStorage.setItem('vello_token', access_token);
      localStorage.setItem('vello_user', JSON.stringify(usuario));
      router.push('/portal');
    } catch (err: any) {
      setError('E-mail ou senha incorretos. Verifique seus dados e o provedor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-md mx-auto px-4 z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-3xl shadow-2xl mb-6">
            V
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Área do Cliente</h1>
          <p className="mt-3 text-lg text-muted-foreground font-medium">Acesse sua conta para ver faturas e plano.</p>
        </div>

        <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-10 px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80">Seu E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    className="pl-12 h-12 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground/80">Sua Senha</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-12 h-12 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="h-12 w-full rounded-xl font-bold text-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Entrar na conta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-muted-foreground font-medium">
          Ainda não tem um plano?{' '}
          <Link href="/cliente/cadastro" className="text-primary hover:underline font-bold">
            Assine agora
          </Link>
        </p>

        <div className="mt-10 flex items-center justify-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ClienteLoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
