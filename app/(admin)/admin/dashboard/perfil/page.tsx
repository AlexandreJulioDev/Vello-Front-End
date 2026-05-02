'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  User, Phone, Mail, Shield, Camera, 
  Loader2, CheckCircle2, AlertCircle, Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    foto_url: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('vello_user');
    if (raw) {
      const userData = JSON.parse(raw);
      setUser(userData);
      setFormData({
        nome: userData.nome || '',
        telefone: userData.telefone || '',
        foto_url: userData.foto_url || ''
      });
    }
    setLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await api.patch('/auth/perfil', formData);
      
      // Atualiza o localStorage
      const newUser = { ...user, ...response.data };
      localStorage.setItem('vello_user', JSON.stringify(newUser));
      setUser(newUser);

      // Dispara evento para atualizar a Sidebar em tempo real
      window.dispatchEvent(new Event('userProfileUpdated'));

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
      // Feedback visual e reload suave se necessário
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = user?.perfil === 'DONO' || user?.perfil === 'GERENTE';

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground mt-1">Gerencie suas informações e como os clientes veem você.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Avatar e Status */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-primary/10">
            <CardContent className="p-0">
              <div className="h-32 bg-gradient-to-br from-primary to-indigo-600" />
              <div className="px-6 pb-6 text-center -mt-12">
                <div className="relative inline-block group">
                  <div className="w-24 h-24 rounded-2xl border-4 border-card bg-secondary flex items-center justify-center overflow-hidden shadow-xl">
                    {formData.foto_url ? (
                      <img src={formData.foto_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="text-white h-6 w-6" />
                  </div>
                </div>
                
                <h3 className="mt-4 text-xl font-bold text-foreground">{user?.nome}</h3>
                <div className="mt-2 flex justify-center">
                   <Badge variant="secondary" className="gap-1.5 py-1 px-3">
                      <Shield className="h-3 w-3 text-primary" />
                      {user?.perfil?.replace('_', ' ')}
                   </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-none">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Privacidade</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Por questões de segurança, a alteração de <strong>e-mail</strong> e <strong>senha</strong> deve ser solicitada ao administrador do provedor.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Estes dados são usados para identificação no sistema e para os clientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                
                {message && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground ml-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="pl-10 h-11"
                        placeholder="Ex: Carlos Técnico"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground ml-1">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="pl-10 h-11"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">E-mail (Somente Leitura)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      value={user?.email}
                      disabled
                      className="pl-10 h-11 bg-secondary/50 border-dashed cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">URL da Foto de Perfil</label>
                  <Input 
                    value={formData.foto_url}
                    onChange={(e) => setFormData({...formData, foto_url: e.target.value})}
                    className="h-11"
                    placeholder="https://exemplo.com/suafoto.jpg"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Dica: Use um link de imagem do Google Drive, Dropbox ou similar.</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="gap-2 h-12 px-8 font-bold shadow-lg shadow-primary/20"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
