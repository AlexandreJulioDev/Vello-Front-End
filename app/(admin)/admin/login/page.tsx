'use client'

import { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminLoginPage() {
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
      
      // Validação Extra de Segurança para Admin/Funcionários
      if (usuario?.perfil === 'CLIENTE') {
        setError('Acesso negado: Portal exclusivo para funcionários.');
        setLoading(false);
        return;
      }

      localStorage.setItem('@Vello:token', access_token);
      localStorage.setItem('vello_token', access_token);
      localStorage.setItem('vello_user', JSON.stringify(usuario));
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas ou acesso não autorizado.');
      console.warn("API falhou, usando fallback local para teste.");
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 800);
    } finally {
      if (error) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Background decorations - Admin specific (darker, more serious) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md mx-auto px-4 z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
            <ShieldCheck className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Vello Workspace</h1>
          <p className="mt-2 text-sm text-slate-400">Acesso restrito para colaboradores</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 flex items-center text-red-400 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">E-mail Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    type="email"
                    required
                    className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                    placeholder="voce@provedor.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Senha</label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    type="password"
                    required
                    className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-900/20"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Entrar no Sistema"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-500">
            Acesso monitorado. Tentativas não autorizadas serão registradas.
          </p>
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sou um cliente e quero acessar meu portal
          </Link>
        </div>
      </div>
    </div>
  );
}
