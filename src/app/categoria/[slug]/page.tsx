import ProductListWithFilters from '@/components/ProductListWithFilters';
import { Product, Category } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

const API_DEFAULT = 'http://localhost:4000';

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_DEFAULT;

  try {
    // Obtener todas las categorías y buscar la que coincida con el slug
    const categoriesRes = await fetch(`${apiUrl}/api/categories?per_page=100`, { cache: 'no-store' });
    const categoriesJson = await categoriesRes.json();
    const foundCategory: Category | undefined = categoriesJson.categories?.find((c: Category) => c.slug === slug);

    if (!foundCategory) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Categoría no encontrada</h1>
            <p className="text-gray-600 mb-8">La categoría que buscas no existe.</p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      );
    }

    // Obtener productos de la categoría - traer todos para filtrado local
    const productsRes = await fetch(
      `${apiUrl}/api/products?category=${foundCategory.id}&per_page=100`,
      { cache: 'no-store' }
    );
    const productsJson = await productsRes.json();

    const products: Product[] = productsJson.products || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header de categoría */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{foundCategory.name}</h1>
            {/* description could be undefined */}
            {('description' in (foundCategory as any)) && (foundCategory as any).description && (
              <p className="text-gray-600 max-w-3xl" dangerouslySetInnerHTML={{ __html: (foundCategory as any).description }}></p>
            )}
            <p className="text-gray-500 mt-4">
              {('count' in (foundCategory as any) ? (foundCategory as any).count : products.length)} {products.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        {/* Productos */}
        <div className="container mx-auto px-4 py-12">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hay productos disponibles en esta categoría.</p>
            </div>
          ) : (
            <ProductListWithFilters 
              initialProducts={products}
              categorySlug={slug}
              categoryId={foundCategory.id}
              totalProducts={products.length}
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Error cargando la categoría</h2>
          <p className="text-gray-600">Intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }
}
