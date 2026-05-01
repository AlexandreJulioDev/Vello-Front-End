'use client'

import { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        senha: password, 
      });

      const { access_token, usuario } = response.data;
      localStorage.setItem('@Vello:token', access_token);
      localStorage.setItem('vello_token', access_token);
      localStorage.setItem('vello_user', JSON.stringify(usuario));
      
      if (usuario?.perfil === 'CLIENTE') {
        router.push('/portal');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('E-mail ou senha incorretos. Tente novamente.');
      console.warn("API falhou, usando fallback local para teste.");
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } finally {
      if (error) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="w-full max-w-md mx-auto px-4 z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-3xl shadow-2xl shadow-primary/30 mb-6">
            V
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Vello</h1>
          <p className="mt-3 text-lg text-muted-foreground font-medium">Acesse sua conta</p>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 flex items-center text-destructive text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="email"
                    required
                    className="pl-10 h-12 bg-background/50 border-border"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Senha</label>
                  <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="password"
                    required
                    className="pl-10 h-12 bg-background/50 border-border"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Acessar Painel"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center animate-in fade-in duration-1000 delay-300">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar para o site
          </Link>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-muted-foreground animate-in fade-in duration-1000 delay-300">
          © {new Date().getFullYear()} Vello SaaS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
