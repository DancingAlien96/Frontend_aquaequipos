'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          </div>

          {/* Información del usuario */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {user.displayName || 'Sin nombre'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                {user.emailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                    No verificado
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de registro
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('es-GT')
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Último acceso
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('es-GT')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Editar Perfil
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Sección de pedidos (próximamente) */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Pedidos</h2>
            <p className="text-gray-500">Aún no tienes pedidos realizados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
