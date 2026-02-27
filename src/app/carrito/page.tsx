'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const { items, itemsCount, total, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      showToast('✓ Producto eliminado del carrito', 'info');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
    showToast('✓ Producto eliminado del carrito', 'info');
  };

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart();
      showToast('✓ Carrito vaciado', 'info');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      showToast('❌ Debes iniciar sesión para continuar', 'error');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (itemsCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Carrito de compras</h1>
        <button
          onClick={handleClearCart}
          className="text-red-500 hover:text-red-600 text-sm font-medium transition"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                {item.product.images?.[0] && (
                  <Image
                    src={item.product.images[0].src}
                    alt={item.product.images[0].alt || item.product.name}
                    fill
                    className="object-contain p-2"
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {item.product.name}
                </h3>
                <p className="text-blue-600 font-bold text-lg mb-2">
                  {formatPrice(parseFloat(item.product.price))}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right flex-shrink-0">
                <p className="text-gray-500 text-sm mb-1">Subtotal</p>
                <p className="font-bold text-gray-800 text-lg">
                  {formatPrice(parseFloat(item.product.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'producto' : 'productos'})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-sm">Calculado al finalizar</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-gray-500">IVA incluido</p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition mb-3"
            >
              Proceder al checkout
            </button>

            <Link
              href="/categorias"
              className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium transition"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
