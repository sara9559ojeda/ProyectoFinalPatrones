import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Análisis de Tráfico Vehicular | Plataforma Profesional',
  description: 'Plataforma empresarial de análisis y visualización de patrones de tráfico vehicular en tiempo real. Monitoreo avanzado con estructuras de datos optimizadas y análisis predictivo.',
  keywords: 'tráfico, análisis, monitoreo, vehículos, dashboard, profesional, tiempo real, estructuras de datos, análisis predictivo',
  authors: [{ name: 'Equipo de Desarrollo' }],
  creator: 'Sistema de Análisis de Tráfico',
  publisher: 'Plataforma de Monitoreo Vehicular',
  robots: 'index, follow',
  openGraph: {
    title: 'Sistema de Análisis de Tráfico Vehicular',
    description: 'Plataforma profesional de monitoreo de tráfico en tiempo real',
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#334155',
  colorScheme: 'light'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen">
          <NavBar />
          
          <main className="transition-all duration-500 ease-in-out">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Footer mejorado con tema oscuro pastel */}
          <footer className="footer-dark py-16 mt-24">
            <div className="container mx-auto px-6">
              {/* Logo y descripción principal */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6 animate-fade-in">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center mr-6 shadow-xl animate-float">
                    <span className="text-white text-2xl">🚦</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">
                    Sistema de Análisis de Tráfico
                  </h3>
                </div>
                <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
                  Plataforma profesional de monitoreo y análisis de tráfico vehicular en tiempo real.
                  Optimizado para el análisis de patrones y la toma de decisiones basada en datos.
                </p>
              </div>

              {/* Secciones del footer */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Tecnologías */}
                <div className="animate-slide-in-left">
                  <h4 className="font-semibold text-slate-200 mb-6 text-lg">Tecnologías</h4>
                  <ul className="space-y-3 text-slate-400">
                    <li className="flex items-center group hover:text-slate-300 transition-colors duration-300">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                      <span>Next.js 15</span>
                    </li>
                    <li className="flex items-center group hover:text-slate-300 transition-colors duration-300">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                      <span>Spring Boot 3.4</span>
                    </li>
                    <li className="flex items-center group hover:text-slate-300 transition-colors duration-300">
                      <div className="w-3 h-3 bg-violet-500 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                      <span>TypeScript</span>
                    </li>
                    <li className="flex items-center group hover:text-slate-300 transition-colors duration-300">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                      <span>TailwindCSS</span>
                    </li>
                  </ul>
                </div>

                {/* Características */}
                <div className="animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
                  <h4 className="font-semibold text-slate-200 mb-6 text-lg">Características</h4>
                  <ul className="space-y-3 text-slate-400">
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">🔄</span>
                      <span>Monitoreo en Tiempo Real</span>
                    </li>
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">📊</span>
                      <span>Análisis Predictivo</span>
                    </li>
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">🛣️</span>
                      <span>Gestión de Carriles</span>
                    </li>
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">⚡</span>
                      <span>Detección de Velocidad</span>
                    </li>
                  </ul>
                </div>

                {/* Estructuras de Datos */}
                <div className="animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
                  <h4 className="font-semibold text-slate-200 mb-6 text-lg">Estructuras de Datos</h4>
                  <ul className="space-y-3 text-slate-400">
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">📋</span>
                      <span>Arrays Optimizados</span>
                    </li>
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">📚</span>
                      <span>Pilas (Stack)</span>
                    </li>
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">📄</span>
                      <span>Colas (Queue)</span>
                    </li>
                    <li className="flex items-center hover:text-slate-300 transition-colors duration-300">
                      <span className="mr-3 text-lg">🌳</span>
                      <span>Árboles de Decisión</span>
                    </li>
                  </ul>
                </div>

                {/* Estado del Sistema */}
                <div className="animate-slide-in-right">
                  <h4 className="font-semibold text-slate-200 mb-6 text-lg">Estado del Sistema</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-lg"></div>
                      <span className="text-slate-300 font-medium">Sistema Operativo</span>
                    </div>
                    <div className="bg-slate-600/50 p-4 rounded-xl backdrop-blur-sm border border-slate-600">
                      <p className="text-xs text-slate-400 mb-1">Última actualización</p>
                      <p className="text-sm font-medium text-slate-300">
                        {new Date().toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div className="bg-slate-600/50 p-4 rounded-xl backdrop-blur-sm border border-slate-600">
                      <p className="text-xs text-slate-400 mb-1">Versión del Sistema</p>
                      <p className="text-sm font-medium text-slate-300">v2.0.0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-slate-600 pt-8">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
                  {/* Copyright */}
                  <div className="text-center lg:text-left">
                    <p className="text-slate-300 text-lg font-medium">
                      © {new Date().getFullYear()} Sistema de Análisis de Tráfico. Todos los derechos reservados.
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Plataforma desarrollada con tecnologías modernas para análisis profesional
                    </p>
                  </div>

                  {/* Enlaces rápidos */}
                  <div className="flex items-center space-x-8">
                    <a 
                      href="/test-api" 
                      className="text-slate-300 hover:text-white transition-colors duration-300 text-lg font-medium hover:underline"
                    >
                      Diagnóstico del Sistema
                    </a>
                    <div className="w-px h-6 bg-slate-500"></div>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400">Versión</span>
                      <span className="text-lg font-mono bg-slate-600 px-3 py-1 rounded-lg text-slate-200 border border-slate-500">
                        v2.0.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores técnicos */}
              <div className="mt-8 pt-8 border-t border-slate-600">
                <div className="flex flex-wrap justify-center items-center gap-8">
                  <div className="flex items-center group">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Frontend: Operativo</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">API: REST/HTTP</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Base de Datos: MySQL</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Detección: Python/YOLO</span>
                  </div>
                </div>
              </div>

              {/* Línea final */}
              <div className="mt-8 pt-6 border-t border-slate-600 text-center">
                <p className="text-slate-500 text-sm">
                  Desarrollado con ❤️ para el análisis inteligente del tráfico vehicular
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}