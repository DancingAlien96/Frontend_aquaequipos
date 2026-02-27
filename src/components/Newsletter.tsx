'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simular envío (aquí integrarías con tu servicio de email)
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block bg-blue-600/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🌊 Newsletter
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ÚNETE A LA COMUNIDAD DE<br />
            <span className="text-blue-400">AQUAEXPERTS</span>
          </h2>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Recibe ofertas exclusivas, guías técnicas y acceso anticipado a nuevos
            lanzamientos de equipos industriales directamente en tu bandeja de entrada.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Introduce tu correo corporativo"
                required
                className="flex-1 px-6 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'Enviando...' : 'SUSCRIBIRSE'}
              </button>
            </div>
            
            {status === 'success' && (
              <p className="mt-4 text-green-400 font-medium">
                ✓ ¡Gracias por suscribirte! Revisa tu correo.
              </p>
            )}
            
            <p className="mt-4 text-xs text-gray-400">
              Al suscribirte, aceptas nuestros{' '}
              <a href="/terminos" className="underline hover:text-white">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="/privacidad" className="underline hover:text-white">
                Política de Privacidad
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
    </section>
  );
}
