'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { fetchFavorites } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Product } from '@/types';

export default function FavoritosPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { refreshFavorites } = useFavorites();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFavorites() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchFavorites(user.uid);
        if (mounted) {
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        if (mounted) {
          showToast('Error al cargar favoritos', 'error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFavorites();
    return () => {
      mounted = false;
    };
  }, [user, showToast]);

  const handleFavoriteRemoved = () => {
    // Recargar la lista de favoritos cuando se elimina uno
    if (user) {
      fetchFavorites(user.uid).then((data) => {
        setFavorites(data);
        refreshFavorites();
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Inicia sesión para ver tus favoritos
            </h2>
            <p className="text-gray-400 mb-6">
              Guarda tus productos favoritos para encontrarlos fácilmente más tarde
            </p>
            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
            <p className="text-gray-400 mt-4">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No tienes favoritos todavía
            </h2>
            <p className="text-gray-400 mb-6">
              Explora nuestro catálogo y agrega productos a tus favoritos
            </p>
            <Link
              href="/categorias"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Convertir los favoritos al formato Product
  const products: Product[] = favorites.map((fav) => {
    const product: Product = {
      id: fav.product_id || fav.id,
      name: fav.title || fav.name || '',
      slug: fav.slug || '',
      price: fav.price || '0',
      regular_price: fav.regular_price || fav.price || '0',
      sale_price: fav.sale_price || '',
      on_sale: fav.on_sale || false,
      stock_status: fav.stock_status || 'instock',
      images: fav.thumbnail
        ? [{ src: fav.thumbnail, alt: fav.title || '' }]
        : fav.images || [],
      categories: fav.categories || [],
      short_description: fav.short_description || '',
      description: fav.description || '',
      attributes: fav.attributes || [],
    };
    return product;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mis Favoritos
          </h1>
          <p className="text-gray-400 text-lg">
            {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} guardados
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

