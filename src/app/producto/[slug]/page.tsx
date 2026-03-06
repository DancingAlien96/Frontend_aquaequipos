'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Product } from '@/types';

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/products/${encodeURIComponent(slug)}`);
        
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        showToast('❌ Error al cargar el producto', 'error');
        router.push('/categorias');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug, router, showToast]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (isInCart(product.id)) {
      router.push('/carrito');
    } else {
      addItem(product, quantity);
      showToast('✓ Producto agregado al carrito', 'success');
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
          <Link
            href="/categorias"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const displayPrice = product.sale_price || product.price;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/categorias" className="hover:text-blue-600">Productos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].src}
                  alt={product.images[selectedImage].alt || product.name}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-transparent'
                    } hover:border-blue-400 transition`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              {hasDiscount && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl line-through text-gray-400">
                    {formatPrice(product.regular_price)}
                  </span>
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.regular_price)) * 100)}% OFF
                  </span>
                </div>
              )}
              <p className="text-4xl font-bold text-blue-600">
                {formatPrice(displayPrice)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_status === 'instock' ? (
                <span className="inline-flex items-center text-green-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  En stock
                </span>
              ) : (
                <span className="inline-flex items-center text-red-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Agotado
                </span>
              )}
            </div>

            {/* Description */}
            {product.short_description && (
              <div 
                className="mb-6 text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Quantity & Add to Cart */}
            {product.stock_status === 'instock' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-800 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-900 font-bold hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-900 border-x-2 border-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-900 font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      product && isInCart(product.id)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product && isInCart(product.id) ? 'Ver en carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            )}

            {/* Full Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
                <div 
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
