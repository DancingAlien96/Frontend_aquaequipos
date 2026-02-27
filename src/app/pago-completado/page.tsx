'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function PagoCompletadoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const processPayment = async () => {
      // Parámetros de TiloPay
      const code = searchParams.get('code');
      const description = searchParams.get('description');
      const tilopayOrder = searchParams.get('order');
      const tilopayTransaction = searchParams.get('tilopay-transaction');
      const returnData = searchParams.get('returnData');

      // Si no hay code, probablemente es una llegada directa
      if (!code) {
        setStatus('error');
        setMessage('No se recibió respuesta de pago');
        return;
      }

      // code = 1 significa aprobado
      if (code === '1') {
        try {
          // Obtener datos de la orden pendiente
          const pendingOrderStr = localStorage.getItem('pending_order');
          
          if (!pendingOrderStr) {
            setStatus('success');
            setOrderId(tilopayOrder || '');
            setMessage('Pago procesado exitosamente');
            // Limpiar carrito de todas formas
            await clearCart();
            return;
          }

          const pendingOrder = JSON.parse(pendingOrderStr);

          // Crear orden en WooCommerce ahora que el pago fue exitoso
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          const orderData = {
            billing: pendingOrder.billing,
            shipping: pendingOrder.shipping,
            line_items: pendingOrder.items.map((item: any) => ({
              product_id: item.product.id,
              quantity: item.quantity,
            })),
            payment_method: 'tilopay',
            payment_method_title: 'TiloPay',
            set_paid: true,
            transaction_id: tilopayTransaction || tilopayOrder,
          };

          const response = await fetch(`${apiUrl}/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user?.uid || 'guest',
            },
            body: JSON.stringify(orderData),
          });

          if (response.ok) {
            const result = await response.json();
            setOrderId(result.order.id);
            // Limpiar localStorage
            localStorage.removeItem('pending_order');
            // Limpiar carrito
            await clearCart();
          }

          setStatus('success');
          setMessage(description || 'Pago exitoso');
        } catch (error) {
          console.error('Error creating order:', error);
          setStatus('success'); // Mostrar éxito aunque WooCommerce falle
          setMessage('Pago procesado. Contacta a soporte para confirmar tu orden.');
        }
      } else {
        // Pago rechazado
        setStatus('error');
        setMessage(description || 'Pago rechazado');
      }
    };

    processPayment();
  }, [searchParams, user, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando pago...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago no completado</h1>
          <p className="text-gray-600 mb-6">
            Hubo un problema al procesar tu pago. No se realizó ningún cargo.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
            >
              Intentar nuevamente
            </button>
            <Link
              href="/carrito"
              className="block w-full border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded transition"
            >
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Número de orden</p>
            <p className="text-xl font-bold text-gray-800">#{orderId}</p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6">
          Recibirás un correo electrónico con los detalles de tu pedido.
        </p>

        <div className="space-y-3">
          {orderId && (
            <Link
              href={`/pedido/${orderId}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
            >
              Ver detalles del pedido
            </Link>
          )}
          <Link
            href="/categorias"
            className="block w-full border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded transition"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
