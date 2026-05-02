'use client'

import { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, Wifi, MessageCircle, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ClienteLoginPage() {
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
      
      // Só permite login de clientes nesta tela
      if (usuario?.perfil !== 'CLIENTE') {
        setError('Esta área é exclusiva para clientes. Se você é administrador, acesse pelo painel administrativo.');
        setLoading(false);
        return;
      }

      localStorage.setItem('@Vello:token', access_token);
      localStorage.setItem('vello_token', access_token);
      localStorage.setItem('vello_user', JSON.stringify(usuario));
      router.push('/portal');
    } catch (err: any) {
      setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
      setLoading(false);
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
          <h1 className="text-4xl font-black text-foreground tracking-tight">Área do Cliente</h1>
          <p className="mt-3 text-lg text-muted-foreground font-medium">Acesse sua conta para ver faturas, plano e suporte.</p>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <CardContent className="p-8">
            {/* Google Login */}
            <button
              type="button"
              onClick={() => alert('Em breve! O login com Google será ativado em uma próxima atualização.')}
              className="w-full h-12 flex items-center justify-center gap-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground font-medium">ou entre com e-mail</span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 flex items-start text-destructive text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">E-mail cadastrado</label>
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
                className="w-full h-12 text-base font-bold gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Wifi className="h-5 w-5" /> Entrar</>}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/cliente/cadastro" className="text-primary font-semibold hover:underline">Criar conta grátis</Link>
            </p>
          </CardContent>
        </Card>

        {/* Contato com Atendente */}
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <Card className="border-border/50 bg-card/40 backdrop-blur-lg">
            <CardContent className="p-5">
              <p className="text-center text-sm font-semibold text-foreground mb-3">Precisa de ajuda? Fale conosco</p>
              <div className="flex gap-3">
                <a href="https://wa.me/5511940000000?text=Olá! Preciso de ajuda para acessar minha conta." target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </button>
                </a>
                <a href="tel:+551140000000" className="flex-1">
                  <button className="w-full h-11 flex items-center justify-center gap-2 border border-border hover:bg-secondary text-foreground rounded-xl text-sm font-semibold transition-colors">
                    <Phone className="h-4 w-4" /> Ligar Agora
                  </button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center animate-in fade-in duration-1000 delay-300">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar para o site
          </Link>
        </div>
      </div>

      {/* Rodapé com informações da empresa */}
      <footer className="mt-auto border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30">
              V
            </div>
            <span className="text-lg font-black tracking-tight text-foreground">Vello Networks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left text-sm text-muted-foreground">
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Endereço</p>
              <p>Rua Principal, 100 — Centro</p>
              <p>São Paulo — SP</p>
              <p>CEP: 01001-000</p>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Contato</p>
              <p>📞 (11) 4000-0000</p>
              <p>📱 (11) 94000-0000</p>
              <p>✉️ contato@vellonetworks.com.br</p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>CNPJ: 00.000.000/0001-00</p>
            <p>© {new Date().getFullYear()} Vello Networks LTDA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
