'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wifi, Zap, Shield, MapPin, Phone, MessageCircle, ChevronRight, CheckCircle2, Users, Globe, Star, ArrowRight, Menu, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [planos, setPlanos] = useState([
    { id: 1, nome: "Fibra 200 Mega", velocidade_down: 200, velocidade_up: 100, preco: 79.90, destaque: false },
    { id: 2, nome: "Fibra 500 Mega", velocidade_down: 500, velocidade_up: 250, preco: 99.90, destaque: true },
    { id: 3, nome: "Fibra 1 Giga", velocidade_down: 1000, velocidade_up: 500, preco: 149.90, destaque: false },
  ]);

  // Tenta carregar planos reais do backend
  useEffect(() => {
    api.get('/planos')
      .then(res => { if (res.data?.length > 0) setPlanos(res.data); })
      .catch(() => {/* usa dados padrão */});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===================== NAVBAR ===================== */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30">
                V
              </div>
              <span className="text-xl font-black tracking-tight">Vello</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Planos</a>
              <a href="#cobertura" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cobertura</a>
              <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
              <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/cliente">
                <Button variant="outline">Área do Cliente</Button>
              </Link>
              <a href="https://wa.me/5511940000000" target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" /> Assine Agora
                </Button>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenu && (
            <div className="md:hidden pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <a href="#planos" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg" onClick={() => setMobileMenu(false)}>Planos</a>
              <a href="#cobertura" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg" onClick={() => setMobileMenu(false)}>Cobertura</a>
              <a href="#sobre" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg" onClick={() => setMobileMenu(false)}>Sobre</a>
              <a href="#contato" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg" onClick={() => setMobileMenu(false)}>Contato</a>
              <div className="flex gap-2 px-4 pt-2">
                <Link href="/cliente" className="flex-1"><Button variant="outline" className="w-full">Área do Cliente</Button></Link>
                <a href="https://wa.me/5511940000000" target="_blank" rel="noopener noreferrer" className="flex-1"><Button className="w-full">Assine</Button></a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Wifi className="h-4 w-4" /> Internet de Fibra Óptica de Verdade
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Internet Ultra Rápida
              <span className="block text-primary">para sua casa</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Navegue, trabalhe e assista sem travamentos. Planos de fibra óptica com velocidades de até <strong className="text-foreground">1 Gbps</strong>, suporte técnico local e os melhores preços da região.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <a href="#planos">
                <Button size="lg" className="h-14 px-8 text-base font-bold gap-2 shadow-xl shadow-primary/20">
                  Ver Planos <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://wa.me/5511940000000" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold gap-2">
                  <MessageCircle className="h-5 w-5" /> Fale pelo WhatsApp
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-muted-foreground animate-in fade-in duration-1000 delay-500">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-5 w-5 text-primary" /> +1.400 clientes
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-5 w-5 text-primary" /> Cobertura local
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Star className="h-5 w-5 text-primary" /> 4.8 no Google
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PLANOS ===================== */}
      <section id="planos" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Escolha seu <span className="text-primary">plano ideal</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Todos os planos incluem Wi-Fi 6, instalação grátis e suporte técnico 24h.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {planos.map((plano, i) => {
              const isDestaque = plano.destaque || i === 1;
              return (
                <Card key={plano.id || i} className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isDestaque ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]' : 'border-border hover:border-primary/30'
                }`}>
                  {isDestaque && (
                    <div className="absolute top-0 inset-x-0 bg-primary text-primary-foreground text-center text-xs font-bold py-1.5 uppercase tracking-wider">
                      ⭐ Mais Popular
                    </div>
                  )}
                  <CardContent className={`p-8 ${isDestaque ? 'pt-12' : ''}`}>
                    <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-4">
                      <Wifi className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">{plano.nome}</h3>
                    
                    <div className="mt-6 mb-6">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-5xl font-black text-foreground ml-1">
                        {Number(plano.preco).toFixed(2).replace('.', ',').split(',')[0]}
                      </span>
                      <span className="text-xl font-bold text-muted-foreground">,{Number(plano.preco).toFixed(2).split('.')[1]}</span>
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span><strong className="text-foreground">{plano.velocidade_down} Mbps</strong> de download</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span><strong className="text-foreground">{plano.velocidade_up} Mbps</strong> de upload</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Instalação gratuita</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Wi-Fi incluso</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Sem fidelidade</span>
                      </div>
                    </div>

                    <a href="https://wa.me/5511940000000" target="_blank" rel="noopener noreferrer">
                      <Button className={`w-full h-12 font-bold text-base gap-2 ${isDestaque ? 'shadow-lg shadow-primary/20' : ''}`} variant={isDestaque ? 'default' : 'outline'}>
                        Assinar <ChevronRight className="h-5 w-5" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== COBERTURA ===================== */}
      <section id="cobertura" className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Cobertura na <span className="text-primary">sua região</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Nossa rede de fibra óptica atende os principais bairros da cidade. Consulte a disponibilidade no seu endereço.
              </p>

              <div className="mt-8 space-y-4">
                {['Centro', 'Bairro Jardim', 'Bairro Norte', 'Vila Industrial', 'Distrito Sul', 'Área Rural Norte'].map((bairro) => (
                  <div key={bairro} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">{bairro}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a href="https://wa.me/5511940000000?text=Olá! Gostaria de verificar se meu endereço tem cobertura." target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2 font-bold">
                    <MessageCircle className="h-5 w-5" /> Consultar meu endereço
                  </Button>
                </a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="aspect-[4/3] bg-secondary rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
                  <p className="text-lg font-bold text-foreground">Mapa de Cobertura</p>
                  <p className="text-sm text-muted-foreground mt-2">Fibra óptica própria em toda a região</p>
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-primary">24</p>
                      <p className="text-xs text-muted-foreground">CTOs ativas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-primary">6</p>
                      <p className="text-xs text-muted-foreground">Bairros</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-primary">128</p>
                      <p className="text-xs text-muted-foreground">Portas livres</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SOBRE ===================== */}
      <section id="sobre" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Por que escolher a <span className="text-primary">Vello</span>?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Somos um provedor local com atendimento humano e dedicado. Nada de robôs ou espera infinita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="text-center p-8 hover:border-primary/30 transition-all hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                  <Zap className="h-7 w-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Velocidade Real</h3>
                <p className="mt-3 text-muted-foreground">Fibra óptica pura até a sua casa. Sem compartilhamento, sem queda. Velocidade garantida 24h.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 hover:border-primary/30 transition-all hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
                  <Users className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Suporte Humano</h3>
                <p className="mt-3 text-muted-foreground">Atendimento real por WhatsApp ou telefone. Nosso técnico chega rápido na sua casa.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 hover:border-primary/30 transition-all hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-5">
                  <Shield className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Sem Fidelidade</h3>
                <p className="mt-3 text-muted-foreground">Cancele quando quiser, sem multa. Confiamos na qualidade do nosso serviço para manter você.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== CONTATO ===================== */}
      <section id="contato" className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Fale <span className="text-primary">conosco</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos prontos para atender você. Escolha o canal que preferir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <a href="https://wa.me/5511940000000" target="_blank" rel="noopener noreferrer">
              <Card className="p-8 text-center hover:border-emerald-500/50 hover:-translate-y-1 transition-all cursor-pointer group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">WhatsApp</h3>
                  <p className="text-primary font-semibold mt-2">(11) 94000-0000</p>
                  <p className="text-sm text-muted-foreground mt-2">Atendimento rápido</p>
                </CardContent>
              </Card>
            </a>

            {/* Telefone */}
            <a href="tel:+551140000000">
              <Card className="p-8 text-center hover:border-blue-500/50 hover:-translate-y-1 transition-all cursor-pointer group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-blue-500/20 transition-colors">
                    <Phone className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Telefone</h3>
                  <p className="text-primary font-semibold mt-2">(11) 4000-0000</p>
                  <p className="text-sm text-muted-foreground mt-2">Seg a Sex • 8h às 18h</p>
                </CardContent>
              </Card>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/vellonetworks" target="_blank" rel="noopener noreferrer">
              <Card className="p-8 text-center hover:border-pink-500/50 hover:-translate-y-1 transition-all cursor-pointer group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-pink-500/20 transition-colors">
                    <Camera className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Instagram</h3>
                  <p className="text-primary font-semibold mt-2">@vellonetworks</p>
                  <p className="text-sm text-muted-foreground mt-2">Novidades e promoções</p>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Endereço */}
          <div className="mt-12 text-center">
            <Card className="inline-block px-8 py-6">
              <CardContent className="p-0 flex items-center gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-foreground">Nosso Escritório</p>
                  <p className="text-sm text-muted-foreground">Rua Principal, 100 — Centro — São Paulo, SP</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Pronto para navegar <span className="text-primary">sem limites</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Assine agora e tenha instalação gratuita em até 48h.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a href="https://wa.me/5511940000000?text=Olá! Quero assinar um plano de internet." target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="h-14 px-10 text-base font-bold gap-2 shadow-xl shadow-primary/20">
                <MessageCircle className="h-5 w-5" /> Assinar pelo WhatsApp
              </Button>
            </a>
            <Link href="/cliente">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-bold gap-2">
                Já sou cliente <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30">
                V
              </div>
              <span className="text-lg font-black tracking-tight">Vello Networks</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://wa.me/5511940000000" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/vellonetworks" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Camera className="h-5 w-5" />
              </a>
              <a href="tel:+551140000000" className="text-muted-foreground hover:text-blue-500 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Vello Networks. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
