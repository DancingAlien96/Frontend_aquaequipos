"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface Props {
  slug: string;
  onClose: () => void;
}

const API_DEFAULT = 'http://localhost:4000';

export default function ProductModal({ slug, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_DEFAULT;
        const res = await fetch(`${apiUrl}/api/products/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Error fetching product');
        const data = await res.json();
        if (mounted) setProduct(data);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError('No se pudo cargar el producto.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    // close on Escape
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);

    return () => { mounted = false; window.removeEventListener('keydown', onKey); };
  }, [slug]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate max-w-[80%]">{product?.name || 'Producto'}</h3>
          <button onClick={onClose} aria-label="Cerrar" className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        <div className="p-4 overflow-auto max-h-[calc(90vh-64px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex items-start justify-center">
              <div className="w-full max-w-md h-64 md:h-72 bg-gray-100 relative rounded">
                {loading ? (
                  <div className="flex items-center justify-center h-full">Cargando imagen...</div>
                ) : product?.images?.[0] ? (
                  <Image src={product.images[0].src} alt={product.images[0].alt || product.name} fill className="object-contain p-4" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">Sin imagen</div>
                )}
              </div>
            </div>

            <div className="min-h-[200px]">
              {loading ? (
                <p>Cargando...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : product ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-600">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(parseFloat(product.price || '0'))}</span>
                      {product.on_sale && product.regular_price && (
                        <span className="text-gray-400 line-through">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(parseFloat(product.regular_price || '0'))}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.stock_status === 'instock' ? 'En stock' : 'Agotado'}</p>
                  </div>

                  <div className="prose max-w-none text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: product.description || product.short_description || '' }} />

                  <div className="mt-6 flex gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Añadir al carrito</button>
                    <button onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
                  </div>
                </>
              ) : (
                <p>No se encontró el producto.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
