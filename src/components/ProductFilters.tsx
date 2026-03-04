'use client';

import { useState } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  totalProducts: number;
}

export interface FilterValues {
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'date-desc';
  onSale: boolean;
  inStock: boolean;
}

export default function ProductFilters({ onFilterChange, totalProducts }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'date-desc',
    onSale: false,
    inStock: false,
  });

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'date-desc',
      onSale: false,
      inStock: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.minPrice > 0 || filters.maxPrice < 10000 || filters.onSale || filters.inStock || filters.sortBy !== 'date-desc';

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          <span className="text-sm text-gray-700 font-medium">({totalProducts} productos)</span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ordenar por
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium bg-white"
            >
              <option value="date-desc" className="text-gray-900">Más recientes</option>
              <option value="price-asc" className="text-gray-900">Precio: Menor a mayor</option>
              <option value="price-desc" className="text-gray-900">Precio: Mayor a menor</option>
              <option value="name-asc" className="text-gray-900">Nombre: A-Z</option>
              <option value="name-desc" className="text-gray-900">Nombre: Z-A</option>
            </select>
          </div>

          {/* Rango de precio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Precio
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              />
              <span className="text-gray-700 font-medium">-</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                placeholder="10000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Filtros de estado */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Estado
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800 font-medium">En oferta</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800 font-medium">En stock</span>
            </label>
          </div>

          {/* Rango visual */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Rango de precio
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-700">
                <span className="font-medium">Q0</span>
                <span className="font-semibold text-gray-900">Q{filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
