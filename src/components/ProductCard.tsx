'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import ProductModal from './ProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { addFavorite, fetchFavorites, removeFavorite } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(parseFloat(price));
  };
  const { user } = useAuth();
  const { showToast } = useToast();
  const { incrementCount, decrementCount } = useFavorites();
  const { addItem, isInCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const router = useRouter();

  // check if favorited on mount when user is present
  React.useEffect(() => {
    let mounted = true;
    async function checkFav() {
      if (!user) {
        setIsFavorited(false);
        setFavoriteId(null);
        return;
      }
      try {
        const favs = await fetchFavorites(user.uid);
        const found = favs.find((f: any) => String(f.product_id) === String(product.id));
        if (mounted && found) {
          setIsFavorited(true);
          setFavoriteId(found.id);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }
    checkFav();
    return () => { mounted = false; };
  }, [user, product.id]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
        <div className="relative h-64 bg-gray-100">
          {product.images?.[0] && (
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              fill
              className="object-contain p-4"
            />
          )}
          {product.on_sale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded">
              ¡Oferta!
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.on_sale && product.regular_price && (
              <span className="text-gray-500 line-through text-sm font-medium">
                {formatPrice(product.regular_price)}
              </span>
            )}
            <span className="text-blue-600 font-bold text-lg">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1 font-medium">IVA Incluido</p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={async () => {
                    if (!user) return router.push('/login');
                    if (processing) return;
                    
                    try {
                      setProcessing(true);
                      
                      if (isFavorited && favoriteId) {
                        // Remove from favorites
                        await removeFavorite(user.uid, favoriteId);
                        setIsFavorited(false);
                        setFavoriteId(null);
                        decrementCount();
                        showToast('✓ Eliminado de favoritos', 'success');
                      } else {
                        // Add to favorites
                        const payload = {
                          product_id: String(product.id),
                          title: product.name,
                          thumbnail: product.images?.[0]?.src || '',
                          price: Number(product.price) || Number(product.regular_price) || 0,
                        };
                        const res = await addFavorite(user.uid, payload);
                        if (res && res.id) {
                          setIsFavorited(true);
                          setFavoriteId(res.id);
                          incrementCount();
                          showToast('✓ Agregado a favoritos', 'success');
                        } else {
                          showToast('❌ Error al guardar favorito', 'error');
                        }
                      }
                    } catch (err) {
                      console.error(err);
                      showToast('❌ Error al procesar favorito', 'error');
                    } finally {
                      setProcessing(false);
                    }
                  }}
                  className={`p-2 rounded-full transition-all ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  aria-label={isFavorited ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                  disabled={processing}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isFavorited ? 'text-rose-500 fill-current' : 'text-gray-500'}`} viewBox="0 0 20 20" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-7.829a4 4 0 010-5.656z" />
                  </svg>
                </button>
              ) : (
                <Link href="/login" className="p-2 rounded-full hover:bg-gray-100 text-sm text-gray-700">Iniciar sesión</Link>
              )}
              <button
                onClick={() => setOpen(true)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-gray-900 font-medium"
              >
                Ver
              </button>
            </div>
            <button
              onClick={async () => {
                try {
                  await addItem(product, 1);
                  showToast('✓ Agregado al carrito', 'success');
                } catch (error) {
                  console.error('Error adding to cart:', error);
                  showToast('❌ Error al agregar al carrito', 'error');
                }
              }}
              className={`w-full py-2 rounded transition ${
                isInCart(product.id)
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isInCart(product.id) ? '✓ En el carrito' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <ProductModal slug={product.slug} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
