import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <div className="inline-block bg-blue-600/90 px-4 py-2 rounded-md text-sm font-semibold mb-4">
            PROMOCIÓN DE VERANO
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Aguas cristalinas<br />
            te esperan
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Ahorra hasta un 15% en bombas de piscina de alta eficiencia
            y sistemas de filtración esta temporada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/categorias"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition text-center"
            >
              COMPRAR AHORA
            </Link>
            <a
              href="https://drive.google.com/file/d/1vJRgjk79hH_CLP8wS9f_zbHR4g8l5Htr/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/20 transition text-center"
            >
              VER CATÁLOGO
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
