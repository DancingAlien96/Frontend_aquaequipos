'use client';

export default function Newsletter() {
  const categories = [
    { name: 'Filtración de Agua', image: '/filtraciondeagua.jpg', color: 'from-blue-400 to-cyan-600' },
    { name: 'Electricidad Industrial', image: '/electricidadindustrial.jpg', color: 'from-yellow-500 to-orange-600' },
    { name: 'Bombas de Agua', image: '/bombasdeagua.jpg', color: 'from-blue-600 to-blue-800' },
    { name: 'Calentadores', image: '/calentadores.jpg', color: 'from-red-400 to-orange-500' },
    { name: 'Tubería', image: '/tuberia.jpg', color: 'from-teal-500 to-cyan-700' },
    { name: 'Herramientas Eléctricas', image: '/herramientaselectricas.jpg', color: 'from-amber-500 to-yellow-600' },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            EXPERTOS EN SOLUCIONES<br />
            <span className="text-blue-400">INDUSTRIALES</span>
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Encontrá todo lo que necesitás para tus proyectos industriales con la mejor calidad y garantía
          </p>
        </div>

        {/* Carrusel de imágenes */}
        <div className="relative mt-8">
          <div className="flex gap-6 animate-scroll">
            {/* Primera serie de imágenes */}
            {categories.map((category, index) => (
              <div
                key={`cat-1-${index}`}
                className="flex-shrink-0 w-80 h-64 relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
              </div>
            ))}
            {/* Segunda serie de imágenes para loop continuo */}
            {categories.map((category, index) => (
              <div
                key={`cat-2-${index}`}
                className="flex-shrink-0 w-80 h-64 relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
