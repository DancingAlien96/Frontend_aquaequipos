import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { fetchFavorites, removeFavorite } from '../lib/api';

export default function FavoritesList() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { decrementCount } = useFavorites();
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return setFavorites([]);
      setLoading(true);
      try {
        const data = await fetchFavorites(user.uid);
        if (mounted) setFavorites(data);
      } catch (err) {
        console.error(err);
        if (mounted) showToast('❌ Error al cargar favoritos', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user, showToast]);

  async function handleRemove(id: number) {
    if (!user) return;
    try {
      await removeFavorite(user.uid, id);
      setFavorites((s) => s.filter((f) => f.id !== id));
      decrementCount();
      showToast('✓ Eliminado de favoritos', 'success');
    } catch (err) {
      console.error(err);
      showToast('❌ No se pudo eliminar', 'error');
    }
  }

  if (!user) return (
    <div className="p-6">
      <p className="text-center">Debes iniciar sesión para ver tus favoritos. <Link href="/login" className="text-blue-600">Iniciar sesión</Link></p>
    </div>
  );

  if (loading) return <div className="p-6">Cargando...</div>;

  if (favorites.length === 0) return <div className="p-6">No tienes favoritos todavía.</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {favorites.map((f) => (
        <div key={f.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
          {f.thumbnail ? (
            <div className="w-20 h-20 relative">
              <Image src={f.thumbnail} alt={f.title} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded" />
          )}
          <div className="flex-1">
            <h4 className="font-semibold">{f.title}</h4>
            <p className="text-sm text-gray-500">{f.price ? `GTQ ${f.price}` : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/product/${f.product_id}`} className="text-sm text-gray-700">Ver</Link>
            <button onClick={() => handleRemove(f.id)} className="text-sm text-red-600">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
