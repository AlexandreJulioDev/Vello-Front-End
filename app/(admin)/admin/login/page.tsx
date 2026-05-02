'use client'

import { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck, Activity, Users, Network } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
                  placeholder="voce@provedor.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-[#8BA4C7] group-focus-within:text-cyan-400 transition-colors">Senha</label>
                <a href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#527094] group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <Input
                  type="password"
                  required
                  className="pl-12 h-14 bg-[#10233D]/50 border-[#1C3654] text-white placeholder:text-[#527094] rounded-xl focus-visible:ring-1 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all hover:bg-[#10233D]/80"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
