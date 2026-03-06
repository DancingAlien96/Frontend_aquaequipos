'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
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

interface SearchSuggestion {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{ src: string; alt: string }>;
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

function SearchBar({ onSearch, isMobile = false }: { onSearch?: (query: string) => void; isMobile?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/products?search=${encodeURIComponent(searchQuery)}&per_page=6`);
        const data = await response.json();
        setSuggestions(data.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    window.location.href = `/producto/${slug}`;
  };

  const formatPrice = (price: string, regularPrice: string, salePrice: string) => {
    if (salePrice && parseFloat(salePrice) < parseFloat(regularPrice)) {
      return (
        <div className="flex flex-col items-end">
          <span className="text-sm line-through text-gray-400">Q{regularPrice}</span>
          <span className="text-base font-bold text-blue-400">Q{salePrice}</span>
        </div>
      );
    }
    return <span className="text-base font-bold text-white">Q{price}</span>;
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isMobile ? "Buscar..." : "¿Qué estás buscando hoy?"}
            className={`w-full rounded-full bg-gray-800 text-white placeholder-gray-300 border border-gray-700 ${
              isMobile ? 'px-4 py-2 pl-4 pr-12' : 'px-4 py-3 pl-4 pr-28'
            } shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          />
          <button 
            type="submit" 
            className={`absolute ${isMobile ? 'right-2' : 'right-2'} top-1/2 transform -translate-y-1/2 ${
              isMobile ? 'text-gray-400 hover:text-white' : 'bg-blue-600 text-white rounded-full px-3 py-2 hover:bg-blue-700'
            } transition-colors`}
          >
            {isLoading ? (
              <svg className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} animate-spin`} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2 font-semibold uppercase tracking-wide">
              Sugerencias de productos
            </div>
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSuggestionClick(product.slug)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-left group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-gray-700 rounded-lg overflow-hidden">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                    {product.name}
                  </h4>
                  <div className="mt-1">
                    {formatPrice(product.price, product.regular_price, product.sale_price)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          {suggestions.length >= 6 && (
            <div className="border-t border-gray-700 p-3">
              <button
                onClick={handleSubmit}
                className="w-full text-center text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Ver todos los resultados para "{searchQuery}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 p-4">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No se encontraron productos</p>
            <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const [allCategories, setAllCategories] = useState<WooCategory[]>([]);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);
  const [showMobileCategoriesMenu, setShowMobileCategoriesMenu] = useState(false);
  const [expandedMobileCategoryId, setExpandedMobileCategoryId] = useState<number | null>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/categories?per_page=100`);
        const data = await response.json();
        setAllCategories(data.categories || []);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(e.target as Node)) {
        setShowCategoriesMenu(false);
        setHoveredCategoryId(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    // Set first category as hovered when menu opens
    if (showCategoriesMenu && allCategories.length > 0 && !hoveredCategoryId) {
      const firstMainCat = allCategories.find(
        (cat) => cat.parent === 0 && cat.count > 0 && 
        cat.slug !== 'uncategorized' && cat.slug !== 'sin-categoria' && cat.slug !== 'sincategoria'
      );
      if (firstMainCat) {
        setHoveredCategoryId(firstMainCat.id);
      }
    }
    // Reset when menu closes
    if (!showCategoriesMenu) {
      setHoveredCategoryId(null);
    }
  }, [showCategoriesMenu, allCategories, hoveredCategoryId]);

  const mainCategories = allCategories
    .filter((cat) => cat.parent === 0 && cat.count > 0 && cat.slug !== 'uncategorized' && cat.slug !== 'sin-categoria' && cat.slug !== 'sincategoria')
    .sort((a, b) => b.count - a.count);

  const getSubcategories = (parentId: number) => {
    return allCategories
      .filter((cat) => cat.parent === parentId && cat.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white">
      {/* Primera sección: Logo, Búsqueda, Carrito y Perfil */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left: logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="AQUAEQUIPOS" width={140} height={36} className="object-contain" />
              </Link>
            </div>

            {/* Center: search (hidden on small and tablet, visible on desktop) */}
            <div className="hidden lg:block lg:flex-1 lg:mx-6">
              <div className="max-w-2xl mx-auto">
                <SearchBar />
              </div>
            </div>

            {/* Right: envío info, carrito y perfil */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Envío a todo el país - solo desktop */}
              <div className="hidden lg:flex items-center gap-2 text-gray-300">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Envío a todo el país</span>
              </div>

              <div className="hidden lg:block w-px h-6 bg-gray-700"></div>

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

      {/* Segunda sección: Tienda y otros links (solo desktop) */}
      <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-2">
            {/* Tienda dropdown button */}
            <div className="relative" ref={categoriesMenuRef}>
              <button
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">Tienda</span>
                <svg className={`w-4 h-4 transition-transform ${showCategoriesMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showCategoriesMenu && mainCategories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-2xl z-50 min-w-[700px] border border-gray-700">
                  <div className="grid grid-cols-2 gap-0">
                    {/* Left column: Main categories */}
                    <div className="space-y-1 p-3 border-r border-gray-700">
                      {mainCategories.map((cat) => {
                        const subcats = getSubcategories(cat.id);
                        return (
                          <div key={cat.id}>
                            <Link
                              href={`/categoria/${cat.slug}`}
                              className={`flex items-center justify-between px-4 py-2.5 rounded-md transition-colors ${
                                hoveredCategoryId === cat.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                              }`}
                              onClick={() => setShowCategoriesMenu(false)}
                              onMouseEnter={() => setHoveredCategoryId(cat.id)}
                            >
                              <span className="text-white font-medium">{cat.name}</span>
                              {subcats.length > 0 && (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </Link>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right column: Subcategories (shows for hovered category) */}
                    <div className="p-3 min-h-[200px]">
                      {hoveredCategoryId ? (
                        <div className="space-y-1">
                          {getSubcategories(hoveredCategoryId).map((subcat) => (
                            <Link
                              key={subcat.id}
                              href={`/categoria/${subcat.slug}`}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                              onClick={() => setShowCategoriesMenu(false)}
                            >
                              {subcat.name}
                            </Link>
                          ))}
                          {getSubcategories(hoveredCategoryId).length === 0 && (
                            <p className="px-4 py-2 text-sm text-gray-500 italic">No hay subcategorías</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                          <p>Pasa el mouse sobre una categoría para ver más opciones</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View all categories link */}
                  <div className="border-t border-gray-700 p-3">
                    <Link
                      href="/categorias"
                      className="block text-center text-sm text-blue-400 hover:text-blue-300 font-medium"
                      onClick={() => setShowCategoriesMenu(false)}
                    >
                      Ver todas las categorías →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Enlaces adicionales */}
            <Link href="/categorias" className="text-sm text-gray-300 hover:text-white transition">
              Categorías
            </Link>
            <Link href="/contacto" className="text-sm text-gray-300 hover:text-white transition">
              Contacto
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet search bar with Tienda button */}
      <div className="lg:hidden border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Mobile/Tablet Tienda button */}
            <button
              onClick={() => setShowMobileCategoriesMenu(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs font-medium">Tienda</span>
            </button>
            <div className="flex-1">
              <SearchBar isMobile />
            </div>
          </div>
          {/* Mensaje de envío - móvil */}
          <div className="flex items-center justify-center gap-2 mt-2 text-gray-300">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium">Envío a todo el país</span>
          </div>
        </div>
      </div>

      {/* Mobile categories drawer */}
      {showMobileCategoriesMenu && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => {
              setShowMobileCategoriesMenu(false);
              setExpandedMobileCategoryId(null);
            }}
          />
          
          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 z-50 lg:hidden overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Categorías</h2>
              <button
                onClick={() => {
                  setShowMobileCategoriesMenu(false);
                  setExpandedMobileCategoryId(null);
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Categories list */}
            <div className="p-3">
              {/* Link to all categories */}
              <Link
                href="/categorias"
                className="block px-4 py-3 mb-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium text-center transition"
                onClick={() => {
                  setShowMobileCategoriesMenu(false);
                  setExpandedMobileCategoryId(null);
                }}
              >
                Ver todas las categorías
              </Link>

              {/* Main categories */}
              <div className="space-y-1 mt-3">
                {mainCategories.map((cat) => {
                  const subcats = getSubcategories(cat.id);
                  const isExpanded = expandedMobileCategoryId === cat.id;

                  return (
                    <div key={cat.id} className="border-b border-gray-800 last:border-0">
                      {/* Main category */}
                      <div className="flex items-center">
                        <Link
                          href={`/categoria/${cat.slug}`}
                          className="flex-1 px-4 py-3 text-white hover:bg-gray-800 rounded-md transition text-sm font-medium"
                          onClick={() => {
                            setShowMobileCategoriesMenu(false);
                            setExpandedMobileCategoryId(null);
                          }}
                        >
                          {cat.name}
                        </Link>
                        {subcats.length > 0 && (
                          <button
                            onClick={() => setExpandedMobileCategoryId(isExpanded ? null : cat.id)}
                            className="p-3 text-gray-400 hover:text-white transition"
                          >
                            <svg 
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Subcategories (collapsible) */}
                      {isExpanded && subcats.length > 0 && (
                        <div className="pl-4 pb-2 space-y-1">
                          {subcats.map((subcat) => (
                            <Link
                              key={subcat.id}
                              href={`/categoria/${subcat.slug}`}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition"
                              onClick={() => {
                                setShowMobileCategoriesMenu(false);
                                setExpandedMobileCategoryId(null);
                              }}
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
