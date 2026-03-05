'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
  description: string;
  image?: { src: string };
}

// Mapeo de categorías a iconos, colores e imágenes (mismo que CategorySection)
const categoryStyles: Record<string, { icon: string; color: string; image: string }> = {
  'Filtración de Agua': { 
    icon: '💧', 
    color: 'from-blue-400 to-cyan-600',
    image: '/filtraciondeagua.jpg'
  },
  'Electricidad Industrial': { 
    icon: '⚡', 
    color: 'from-yellow-500 to-orange-600',
    image: '/electricidadindustrial.jpg'
  },
  'Bombas de Agua': { 
    icon: '⚙️', 
    color: 'from-blue-600 to-blue-800',
    image: '/bombasdeagua.jpg'
  },
  'Equipamiento de Piscina': { 
    icon: '🏊', 
    color: 'from-cyan-400 to-blue-500',
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop'
  },
  'UV': { 
    icon: '☀️', 
    color: 'from-purple-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
  },
  'Bombas para Pozo': { 
    icon: '🔧', 
    color: 'from-gray-600 to-gray-800',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop'
  },
  'Calentadores': { 
    icon: '🔥', 
    color: 'from-red-400 to-orange-500',
    image: '/calentadores.jpg'
  },
  'Tubería': { 
    icon: '🔩', 
    color: 'from-teal-500 to-cyan-700',
    image: '/tuberia.jpg'
  },
  'Herramientas Eléctricas': { 
    icon: '🔌', 
    color: 'from-amber-500 to-yellow-600',
    image: '/herramientaselectricas.jpg'
  },
  'Suavizadores': { 
    icon: '💎', 
    color: 'from-teal-400 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop'
  },
  'Flip-On': { 
    icon: '⚡', 
    color: 'from-indigo-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop'
  },
  'Accesorios de Limpieza': { 
    icon: '🧹', 
    color: 'from-green-400 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&h=400&fit=crop'
  },
};

const getDefaultStyle = (name: string) => {
  const icons = ['📦', '🛠️', '🌊', '⚙️', '💡', '🔩', '🌿', '🏗️'];
  const colors = [
    'from-green-400 to-emerald-600',
    'from-indigo-400 to-blue-600',
    'from-pink-400 to-rose-600',
    'from-teal-400 to-cyan-600',
  ];
  const images = [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&h=400&fit=crop',
  ];
  const index = name.length % icons.length;
  const colorIndex = name.length % colors.length;
  const imageIndex = name.length % images.length;
  return { icon: icons[index], color: colors[colorIndex], image: images[imageIndex] };
};

export default function CategoriasPage() {
  const [categories, setCategories] = useState<WooCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/categories?per_page=100`);
        const data = await response.json();
        
        // Ordenar por count descendente
        const sortedCategories = (data.categories || [])
          .filter((cat: WooCategory) => 
            cat.count > 0 && 
            cat.slug !== 'uncategorized' && 
            cat.slug !== 'sin-categoria' && 
            cat.slug !== 'sincategoria'
          )
          .sort((a: WooCategory, b: WooCategory) => b.count - a.count);
        
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Separar categorías principales y subcategorías
  const mainCategories = categories.filter(cat => cat.parent === 0);
  const subCategories = categories.filter(cat => cat.parent !== 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Todas las Categorías</h1>
          <p className="text-gray-600">Explora nuestro catálogo completo de productos</p>
        </div>
      </div>

      {/* Categorías Principales */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Categorías Principales</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {mainCategories.map((category) => {
            const style = categoryStyles[category.name] || getDefaultStyle(category.name);
            
            return (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={style.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-30 group-hover:opacity-20 transition-opacity duration-300`}></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.count} {category.count === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Subcategorías */}
        {subCategories.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Todas las Subcategorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map((category) => {
                const parentCategory = categories.find(cat => cat.id === category.parent);
                
                return (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.slug}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      {parentCategory && (
                        <p className="text-sm text-gray-500">
                          En {parentCategory.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {category.count} {category.count === 1 ? 'producto' : 'productos'}
                      </p>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
