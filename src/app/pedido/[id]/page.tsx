'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface OrderDetails {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    price: number;
    image?: {
      src: string;
    };
  }>;
  payment_method_title: string;
}

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
          headers: {
            'x-user-id': user.uid,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar el pedido');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, router]);

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-800' },
      'on-hold': { label: 'En espera', color: 'bg-gray-100 text-gray-800' },
      completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Reembolsado', color: 'bg-purple-100 text-purple-800' },
      failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
    };

    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Pedido no encontrado'}
          </h1>
          <Link
            href="/categorias"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusLabel(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Gracias por tu pedido!</h1>
        <p className="text-gray-600">Tu pedido ha sido registrado exitosamente</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
            <p className="text-2xl font-bold text-gray-800">#{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Fecha</p>
            <p className="text-gray-800">{formatDate(order.date_created)}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Estado</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Productos</h2>
          <div className="space-y-4">
            {order.line_items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                  {item.image && (
                    <Image
                      src={item.image.src}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain p-2"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  <p className="text-blue-600 font-bold mt-1">{formatPrice(item.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">IVA incluido</p>
        </div>
      </div>

      {/* Billing & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Información de facturación</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">
              {order.billing.first_name} {order.billing.last_name}
            </p>
            <p>{order.billing.address_1}</p>
            {order.billing.address_2 && <p>{order.billing.address_2}</p>}
            <p>
              {order.billing.city}, {order.billing.state} {order.billing.postcode}
            </p>
            <p className="pt-2">{order.billing.email}</p>
            <p>{order.billing.phone}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Información de envío</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">
              {order.shipping.first_name} {order.shipping.last_name}
            </p>
            <p>{order.shipping.address_1}</p>
            {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
            <p>
              {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Método de pago</h2>
        <p className="text-gray-600">{order.payment_method_title}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link
          href="/categorias"
          className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
