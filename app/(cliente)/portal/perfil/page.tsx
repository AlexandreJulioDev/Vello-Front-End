'use client'

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PortalPerfilPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vello_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Meus Dados</h1>
        <p className="text-muted-foreground text-lg mt-1">Informações da sua conta.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Nome Completo</p>
                <p className="text-sm text-muted-foreground">{user?.nome || 'Não informado'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">E-mail</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'Não informado'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-5 bg-secondary/50 rounded-2xl border border-border/50">
            <p className="text-sm text-muted-foreground">
              Para atualizar seus dados pessoais (nome, e-mail, telefone ou endereço), entre em contato com o suporte do seu provedor pelo telefone <span className="text-foreground font-semibold">(11) 4000-0000</span> ou abra um chamado na aba <span className="text-primary font-semibold">Suporte</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
