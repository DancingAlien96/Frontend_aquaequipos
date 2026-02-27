const projects = [
  {
    title: 'VILLA MODERNA, MIAMI',
    quote: 'La eficiencia de las bombas industriales de AquaEquipos superó nuestras expectativas. ¡Agua cristalina nivel el año!',
    author: 'Familia Rodríguez',
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=1000',
    video: true,
  },
  {
    title: 'CENTRO ACUÁTICO OLÍMPICO',
    quote: 'Un soporte técnico excepcional durante toda la instalación del sistema de filtrado. Expertos de verdad.',
    author: 'Ing. Carlos Méndez',
    image: 'https://images.unsplash.com/photo-1519420573924-65fcd45245f8?q=80&w=1000',
    video: true,
  },
  {
    title: 'RESIDENCIAL LAS PALMAS',
    quote: 'El sistema de riego solar ha reducido nuestros costos operativos en un 40%. Una inversión inteligente.',
    author: 'Administradora Lucía Sanz',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000',
    video: true,
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            NUESTROS PROYECTOS Y RESEÑAS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre cómo transformamos espacios con nuestras soluciones integrales de agua
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image/Video Container */}
              <div className="relative h-64 overflow-hidden bg-gray-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Play Button */}
                {project.video && (
                  <button className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-xl">
                      <svg
                        className="w-8 h-8 text-blue-600 group-hover:text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>
                <blockquote className="relative">
                  <svg
                    className="absolute -top-2 -left-2 w-8 h-8 text-blue-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 italic pl-6 mb-4">
                    {project.quote}
                  </p>
                  <p className="text-sm font-semibold text-blue-600 pl-6">
                    — {project.author}
                  </p>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
