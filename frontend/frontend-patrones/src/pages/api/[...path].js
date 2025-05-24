
import { createProxyMiddleware } from 'http-proxy-middleware';

// Configuración para API routes
export const config = {
  api: {
    // Desactivar bodyParser para permitir proxy de datos binarios
    bodyParser: false,
    // Aumentar el límite de tamaño de respuesta
    responseLimit: false,
    // Desactivar caché de rutas de API
    externalResolver: true,
  },
};

// Middleware de proxy con opciones optimizadas
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:9090',
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  // Configuraciones para evitar errores ECONNRESET
  ws: false, // Deshabilitar WebSockets
  proxyTimeout: 60000, // 60 segundos de timeout
  timeout: 60000, // 60 segundos de timeout
  // Manejar errores de proxy
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ 
      message: 'Error al conectar con el backend', 
      details: err.message 
    }));
  },
  // Nivel de log para debugging
  logLevel: 'debug',
});

// Exportar el handler para la API route
export default function handler(req, res) {
  // No aplicar proxy a los OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Aplicar el proxy a todas las demás solicitudes
  return apiProxy(req, res);
}