'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Settings, Save, Users, Building, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ConfigPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Configurações</h2>
          <p className="text-muted-foreground mt-1 text-lg">Gerencie as preferências e dados do seu provedor.</p>
        </div>
        <Button className="gap-2" onClick={() => alert("As configurações do provedor foram salvas com sucesso!")}>
          <Save className="h-4 w-4" /> Salvar Alterações
        </Button>
      </header>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="empresa" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Building className="h-4 w-4"/> Dados da Empresa
          </TabsTrigger>
          <TabsTrigger value="equipe" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Users className="h-4 w-4"/> Equipe
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="py-2.5 px-6 rounded-lg flex items-center gap-2">
            <Bell className="h-4 w-4"/> Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Provedor</CardTitle>
              <CardDescription>Informações públicas e de faturamento da empresa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Nome Fantasia</label>
                  <Input defaultValue="Vello Networks LTDA" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">CNPJ</label>
                  <Input defaultValue="00.000.000/0001-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">E-mail de Contato</label>
                  <Input defaultValue="contato@vellonetworks.com.br" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Telefone de Suporte</label>
                  <Input defaultValue="(11) 4000-0000" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe">
          <Card>
            <CardHeader>
              <CardTitle>Administradores e Técnicos</CardTitle>
              <CardDescription>Gerencie os acessos ao sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Esta área será preenchida com os usuários do banco de dados.</p>
              <Button variant="outline">Convidar Membro</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Notificação</CardTitle>
              <CardDescription>Configure como seus clientes recebem faturas e alertas de suporte.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configurações de SMTP, WhatsApp API e SMS ficarão aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
