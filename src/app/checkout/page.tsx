'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, itemsCount, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'tilopay' | 'cod'>('tilopay');

  const [billingData, setBillingData] = useState({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'GT',
  });

  const [shippingData, setShippingData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'GT',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
    
    if (sameAsShipping) {
      if (name !== 'email' && name !== 'phone') {
        setShippingData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('❌ Debes iniciar sesión para continuar', 'error');
      router.push('/login');
      return;
    }

    if (itemsCount === 0) {
      showToast('❌ Tu carrito está vacío', 'error');
      router.push('/carrito');
      return;
    }

    setProcessing(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // Si es TiloPay, crear orden de pago directamente en TiloPay
      if (paymentMethod === 'tilopay') {
        const frontendUrl = window.location.origin;
        const redirectUrl = `${frontendUrl}/pago-completado`;
        
        const tilopayData = {
          amount: total,
          currency: 'GTQ',
          orderNumber: `ORDER-${Date.now()}`,
          billing: {
            ...billingData,
            phone: billingData.phone || '00000000',
          },
          shipping: sameAsShipping ? {
            first_name: billingData.first_name,
            last_name: billingData.last_name,
            address_1: billingData.address_1,
            address_2: billingData.address_2,
            city: billingData.city,
            state: billingData.state || 'GT',
            postcode: billingData.postcode || '00000',
            country: billingData.country,
            phone: billingData.phone || '00000000',
          } : {
            ...shippingData,
            phone: shippingData.phone || billingData.phone || '00000000',
          },
          redirectUrl: redirectUrl,
          returnData: btoa(JSON.stringify({ 
            userId: user.uid,
            items: items.length,
          })),
        };

        const tilopayResponse = await fetch(`${apiUrl}/api/tilopay/create-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.uid,
          },
          body: JSON.stringify(tilopayData),
        });

        if (!tilopayResponse.ok) {
          const error = await tilopayResponse.json();
          throw new Error(error.error || 'Error al crear el pago en TiloPay');
        }

        const tilopayResult = await tilopayResponse.json();
        
        if (tilopayResult.paymentUrl) {
          showToast('✓ Redirigiendo a TiloPay...', 'success');
          // Guardar datos de la orden en localStorage temporalmente
          localStorage.setItem('pending_order', JSON.stringify({
            orderNumber: tilopayData.orderNumber,
            billing: billingData,
            shipping: sameAsShipping ? billingData : shippingData,
            items: items,
            total: total,
          }));
          // Redirigir a TiloPay
          window.location.href = tilopayResult.paymentUrl;
          return;
        } else {
          throw new Error('No se recibió URL de pago de TiloPay');
        }
      }
      
      // Para COD, crear orden en WooCommerce
      const orderData = {
        billing: billingData,
        shipping: sameAsShipping ? {
          first_name: billingData.first_name,
          last_name: billingData.last_name,
          address_1: billingData.address_1,
          address_2: billingData.address_2,
          city: billingData.city,
          state: billingData.state,
          postcode: billingData.postcode,
          country: billingData.country,
        } : shippingData,
        line_items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        payment_method: 'cod',
        payment_method_title: 'Pago contra entrega',
        set_paid: false,
      };

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al procesar el pedido');
      }

      const result = await response.json();
      
      // Para COD o si no hay payment_url, ir a confirmación
      showToast('✓ ¡Pedido creado exitosamente!', 'success');
      clearCart();
      
      // Redirect to order confirmation
      setTimeout(() => {
        router.push(`/pedido/${result.order.id}`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      showToast(`❌ ${error.message || 'Error al crear el pedido'}`, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Inicia sesión para continuar</h1>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (itemsCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <button
            onClick={() => router.push('/categorias')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing & Shipping Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Información de facturación</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={billingData.first_name}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={billingData.last_name}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={billingData.email}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={billingData.phone}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address_1"
                    value={billingData.address_1}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección 2 (Opcional)
                  </label>
                  <input
                    type="text"
                    name="address_2"
                    value={billingData.address_2}
                    onChange={handleBillingChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={billingData.city}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={billingData.state}
                    onChange={handleBillingChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código postal
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={billingData.postcode}
                    onChange={handleBillingChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Información de envío</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Mismo que facturación</span>
                </label>
              </div>
              
              {!sameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={shippingData.first_name}
                      onChange={handleShippingChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={shippingData.last_name}
                      onChange={handleShippingChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address_1"
                      value={shippingData.address_1}
                      onChange={handleShippingChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección 2 (Opcional)
                    </label>
                    <input
                      type="text"
                      name="address_2"
                      value={shippingData.address_2}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código postal
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={shippingData.postcode}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Método de pago</h2>
              
              <div className="space-y-3">
                {/* TiloPay */}
                <div 
                  className={`border rounded p-4 cursor-pointer transition ${
                    paymentMethod === 'tilopay' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-300'
                  }`}
                  onClick={() => setPaymentMethod('tilopay')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="tilopay"
                      checked={paymentMethod === 'tilopay'}
                      onChange={() => setPaymentMethod('tilopay')}
                      className="w-4 h-4"
                    />
                    <label htmlFor="tilopay" className="font-medium text-gray-800 cursor-pointer flex-1">
                      💳 TiloPay - Tarjeta de crédito/débito
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-7">
                    Pago seguro con tarjeta de crédito o débito
                  </p>
                </div>

                {/* COD */}
                <div 
                  className={`border rounded p-4 cursor-pointer transition ${
                    paymentMethod === 'cod' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-300'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4"
                    />
                    <label htmlFor="cod" className="font-medium text-gray-800 cursor-pointer flex-1">
                      💵 Pago contra entrega (COD)
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-7">
                    Paga cuando recibas tu pedido
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tu pedido</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 pb-3 border-b border-gray-200">
                    <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0].src}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {formatPrice(parseFloat(item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-sm">Calculado posteriormente</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-500">IVA incluido</p>
              </div>

              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 rounded font-semibold transition ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {processing ? 'Procesando...' : 'Realizar pedido'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
