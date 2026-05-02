'use client'

import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vello_token');
    const user = localStorage.getItem('vello_user');

    if (!token || !user) {
      router.replace('/admin/login');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 animate-bounce">
          <span className="text-primary-foreground font-black text-2xl">V</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-medium animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          Validando acesso...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 inset-x-0 h-64 bg-primary/5 rounded-b-[100px] blur-3xl -z-10 pointer-events-none" />
        <div className="p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
