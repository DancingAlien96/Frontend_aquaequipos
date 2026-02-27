'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect, useRef } from 'react';

interface Category {
  name: string;
  href: string;
  highlight?: boolean;
}

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
}

function AvatarMenu({ user, onLogout }: { user: any; onLogout: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user?.photoURL ? (
          <Image src={user.photoURL} alt={user.displayName || 'Usuario'} width={40} height={40} className="rounded-full" />
        ) : (
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li>
              <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</Link>
            </li>
            <li>
              <Link href="/favoritos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Favoritos</Link>
            </li>
            <li>
              <Link href="/pedidos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pedidos</Link>
            </li>
            <li>
              <button onClick={() => onLogout()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Cerrar sesión</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const { itemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    { name: 'DEPARTAMENTOS', href: '/categorias' }
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/categories?per_page=100`);
        const data = await response.json();

        const mainCategories = (data.categories || [])
          .filter((cat: WooCategory) => cat.parent === 0 && cat.count > 0)
          .sort((a: WooCategory, b: WooCategory) => b.count - a.count)
          .slice(0, 5)
          .map((cat: WooCategory) => ({
            name: cat.name.toUpperCase(),
            href: `/categoria/${cat.slug}`
          }));

        setCategories([
          { name: 'DEPARTAMENTOS', href: '/categorias' },
          ...mainCategories,
          { name: 'OFERTAS ESPECIALES', href: '/ofertas', highlight: true }
        ]);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    }

    loadCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left: logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                
                <Image src="/logo.png" alt="AQUAEQUIPOS" width={140} height={36} className="object-contain" />
              </Link>
            </div>

            {/* Center: search (hidden on small) */}
            <div className="hidden sm:block sm:flex-1 sm:mx-6">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿Qué estás buscando hoy?"
                    className="w-full rounded-full bg-gray-800 text-white placeholder-gray-300 border border-gray-700 px-4 py-3 pl-4 pr-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full px-3 py-2 hover:bg-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: actions (visible on mobile and desktop) */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/favoritos" className="relative text-white hover:text-blue-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">{favoritesCount}</span>
                )}
              </Link>

              <Link href="/carrito" className="relative text-white hover:text-blue-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">{itemsCount}</span>
                )}
              </Link>

              <div className="hidden sm:block w-px h-6 bg-gray-700"></div>

              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium hidden sm:inline">Mi Perfil</span>
                    <AvatarMenu user={user} onLogout={handleLogout} />
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center space-x-3 text-white hover:text-blue-300">
                    <span className="text-sm font-medium hidden sm:inline">Iniciar sesión</span>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 px-4 py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}
