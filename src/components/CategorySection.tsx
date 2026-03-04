'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
}

// Mapeo de categorías a iconos, colores e imágenes de Unsplash
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
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=400&fit=crop'
  },
  'UV': { 
    icon: '☀️', 
    color: 'from-purple-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
  },
  'Bombas para Pozo': { 
    icon: '🔧', 
    color: 'from-gray-600 to-gray-800',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop'
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
};

// Función para obtener estilo por defecto
const getDefaultStyle = (name: string) => {
  const icons = ['💡', '🌊', '🔩', '⚡', '🛠️', '💎', '🌿'];
  const colors = [
    'from-green-400 to-emerald-600',
    'from-indigo-400 to-blue-600',
    'from-pink-400 to-rose-600',
    'from-teal-400 to-cyan-600',
  ];
  const images = [
    'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
  ];
  const index = name.length % icons.length;
  const colorIndex = name.length % colors.length;
  const imageIndex = name.length % images.length;
  return { icon: icons[index], color: colors[colorIndex], image: images[imageIndex] };
};

export default function CategorySection() {
  const [categories, setCategories] = useState<WooCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/categories?per_page=100`);
        const data = await response.json();
        
        // Filtrar categorías principales con productos y ordenar por count
        const mainCategories = (data.categories || [])
          .filter((cat: WooCategory) => 
            cat.parent === 0 && 
            cat.count > 0 && 
            cat.slug !== 'uncategorized' && 
            cat.slug !== 'sin-categoria' && 
            cat.slug !== 'sincategoria'
          )
          .sort((a: WooCategory, b: WooCategory) => b.count - a.count)
          .slice(0, 7); // Mostrar máximo 7 categorías
        
        setCategories(mainCategories);
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            COMPRA POR CATEGORÍA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="mt-4 h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          COMPRA POR CATEGORÍA
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
          {categories.map((category) => {
            const style = categoryStyles[category.name] || getDefaultStyle(category.name);
            
            return (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="group flex flex-col items-center"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src={style.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-30 group-hover:opacity-20 transition-opacity duration-300`}></div>
                </div>
                <span className="mt-4 text-sm md:text-base font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  ({category.count} productos)
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
