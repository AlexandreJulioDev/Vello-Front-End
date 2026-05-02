'use client'

import { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck, Activity, Users, Network, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        id_provedor: 1 
      });

      const { access_token, usuario } = response.data;
      
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
      setError(err.response?.data?.message || 'Credenciais inválidas ou acesso não autorizado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060D18] font-sans">
      {/* LADO ESQUERDO: Branding Artístico (Oculto em telas pequenas) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-[#132A46]">
        {/* Fundo com Gradiente Elegante usando as cores da PHNET */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1930] via-[#060D18] to-[#040910] z-0" />
        
        {/* Efeitos de "Luzes" de Fibra Óptica usando Ciano e Laranja */}
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
        
        {/* Grid Pattern para um ar tecnológico */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00BFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Topo: Logo ou Identidade */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Vello Workspace</h2>
            <p className="text-xs text-cyan-400/80 uppercase tracking-widest font-semibold">Enterprise Edition</p>
          </div>
        </div>

        {/* Centro: Mensagem de Impacto para o Provedor */}
        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            O centro de controle da sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">rede de alta velocidade</span>.
          </h1>
          <p className="text-[#8BA4C7] text-lg leading-relaxed mb-10">
            Gerencie contratos, atenda seus clientes com excelência e monitore a infraestrutura de fibra óptica em tempo real, tudo em um único lugar.
          </p>

          {/* Cards de Métricas (Efeito Glassmorphism) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#10233D]/40 backdrop-blur-md border border-[#1C3654] p-4 rounded-2xl">
              <Network className="h-6 w-6 text-orange-400 mb-3" />
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-xs text-[#8BA4C7] font-medium">Uptime da Rede</div>
            </div>
            <div className="bg-[#10233D]/40 backdrop-blur-md border border-[#1C3654] p-4 rounded-2xl">
              <Activity className="h-6 w-6 text-cyan-400 mb-3" />
              <div className="text-2xl font-bold text-white">Gestão Ágil</div>
              <div className="text-xs text-[#8BA4C7] font-medium">Suporte e Faturamento</div>
            </div>
          </div>
        </div>

        {/* Rodapé do lado esquerdo */}
        <div className="relative z-10">
          <p className="text-xs text-[#527094]">
            © {new Date().getFullYear()} Vello Technologies. Sistema Multi-Tenant.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Formulário de Login Limpo e Elegante */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Glow sutil atrás do formulário no mobile */}
        <div className="lg:hidden absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#0A1930] to-[#040910] -z-10" />
        <div className="lg:hidden absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] -z-10" />

        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Vello Workspace</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-[#8BA4C7]">Insira suas credenciais corporativas.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 flex items-center text-red-400 text-sm rounded-xl animate-in fade-in zoom-in-95 duration-300">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-[#8BA4C7] ml-1 group-focus-within:text-cyan-400 transition-colors">E-mail Corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#527094] group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <Input
                  type="email"
                  required
                  className="pl-12 h-14 bg-[#10233D]/50 border-[#1C3654] text-white placeholder:text-[#527094] rounded-xl focus-visible:ring-1 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all hover:bg-[#10233D]/80"
                  style={{ WebkitBoxShadow: '0 0 0px 1000px #10233D inset', WebkitTextFillColor: 'white' }}
                  placeholder="voce@provedor.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-[#8BA4C7] group-focus-within:text-cyan-400 transition-colors">Senha</label>
                <button type="button" onClick={() => alert('Função de recuperação de senha em desenvolvimento.')} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#527094] group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-12 pr-12 h-14 bg-[#10233D]/50 border-[#1C3654] text-white placeholder:text-[#527094] rounded-xl focus-visible:ring-1 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all hover:bg-[#10233D]/80"
                  style={{ WebkitBoxShadow: '0 0 0px 1000px #10233D inset', WebkitTextFillColor: 'white' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#527094] hover:text-cyan-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base rounded-xl shadow-[0_0_20px_rgba(0,191,255,0.2)] hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Acessar Sistema"}
            </Button>
          </form>

          <div className="mt-8 flex items-center">
            <div className="flex-grow border-t border-[#1C3654]"></div>
            <span className="flex-shrink-0 mx-4 text-[#527094] text-xs font-medium">OU</span>
            <div className="flex-grow border-t border-[#1C3654]"></div>
          </div>

          <Button
            type="button"
            onClick={() => alert('Integração com Google Workspace será configurada em breve.')}
            className="w-full h-14 mt-6 bg-[#10233D]/50 hover:bg-[#10233D] border border-[#1C3654] text-white font-medium text-base rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Entrar com Google
          </Button>
          
          <div className="mt-12 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#527094] hover:text-cyan-400 transition-colors">
              <Users className="h-4 w-4" /> Sou cliente e quero acessar o portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
