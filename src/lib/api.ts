const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

  const url = `${API_URL}/api/products${queryParams.toString() ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    next: { revalidate: 300 }, // Revalidar cada 5 minutos
  });

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  return response.json();
}

export async function fetchProduct(slug: string) {
  const response = await fetch(`${API_URL}/api/products/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el producto');
  }

  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/categories`, {
    next: { revalidate: 3600 }, // Revalidar cada hora
  });

  if (!response.ok) {
    throw new Error('Error al obtener categorías');
  }

  return response.json();
}

// Favorites API
export async function fetchFavorites(userId: string) {
  const response = await fetch(`${API_URL}/api/favorites`, {
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to fetch favorites:', error);
    throw new Error('Error al obtener favoritos');
  }
  return response.json();
}

export async function addFavorite(userId: string, payload: { product_id: string; title?: string; thumbnail?: string; price?: number }) {
  const response = await fetch(`${API_URL}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to add favorite:', response.status, error);
    throw new Error(`Error al agregar favorito: ${response.status}`);
  }
  return response.json();
}

export async function removeFavorite(userId: string, id: number | string) {
  const response = await fetch(`${API_URL}/api/favorites/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) throw new Error('Error al eliminar favorito');
  return response.json();
}

// Cart API
export async function fetchCart(userId: string) {
  const response = await fetch(`${API_URL}/api/cart`, {
    headers: { 'x-user-id': userId },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to fetch cart:', error);
    throw new Error('Error al obtener carrito');
  }
  return response.json();
}

export async function addToCart(userId: string, payload: { product_id: number; quantity: number; product_data?: any }) {
  const response = await fetch(`${API_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to add to cart:', response.status, error);
    throw new Error(`Error al agregar al carrito: ${response.status}`);
  }
  return response.json();
}

export async function updateCartItem(userId: string, itemId: number, quantity: number) {
  const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) throw new Error('Error al actualizar carrito');
  return response.json();
}

export async function removeFromCart(userId: string, itemId: number) {
  const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) throw new Error('Error al eliminar del carrito');
  return response.json();
}

export async function clearCart(userId: string) {
  const response = await fetch(`${API_URL}/api/cart`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) throw new Error('Error al vaciar carrito');
  return response.json();
}
