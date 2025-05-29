"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const pathname = usePathname();

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setApiStatus('loading');
        const response = await fetch('http://localhost:8080/api/detections/analysis/summary', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: '',
      description: 'Panel Principal'
    },
    {
      href: '/lanes',
      label: 'Carriles',
      icon: '',
      description: 'Estado de Vías'
    },
    {
      href: '/test-api',
      label: 'Diagnóstico',
      icon: '',
      description: 'Sistema'
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-slate-400/90 backdrop-blur-md shadow-xl border-b border-slate-300/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <span className="text-white text-xl font-bold">🚦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Sistema de Análisis de Tráfico
              </h1>
              {/* Estado de conexión */}
              <div className="flex items-center mt-1">
                {apiStatus === 'loading' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-blue-100 font-medium">Verificando...</span>
                  </div>
                )}
                {apiStatus === 'online' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-xs text-emerald-100 font-medium">online</span>
                  </div>
                )}
                {apiStatus === 'offline' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-xs text-red-200 font-medium">Desconectado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menú desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative px-4 py-3 rounded-xl transition-all duration-300 font-medium
                  ${isActive(item.href) 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg transform scale-105' 
                    : 'text-slate-100 hover:text-white hover:bg-slate-500/40'
                  }
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-lg transform group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-xs opacity-75">{item.description}</span>
                </div>
                
                {/* Efecto hover suave */}
                {!isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl bg-slate-500/50 text-slate-100 hover:text-white hover:bg-slate-500/70 transition-all duration-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-slate-500/70 backdrop-blur-sm rounded-xl p-4 space-y-2 shadow-xl border border-slate-400/50">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-300 font-medium
                  ${isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-100 hover:text-white hover:bg-slate-500/50'
                  }
                `}
                style={{
                  animationDelay: `${index * 30}ms`,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-10px)'
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}