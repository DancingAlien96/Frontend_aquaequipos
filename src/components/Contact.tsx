export default function Contact() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Contáctanos
          </h2>
          <p className="text-lg mb-8">
            Expertos en asesoría, venta, instalación y mantenimiento de sistemas de
            purificación de agua para usar en todas las industrias, tecnología avanzada
            por la purificación de agua.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.facebook.com/aquaExpertos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              Facebook
            </a>
            <a
              href="https://www.tiktok.com/@aquaequipos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              TikTok
            </a>
            <a
              href="https://www.instagram.com/aquaequipos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
