import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1 - Logo y descripción */}
          <div>
            <div className="mb-4 -ml-4">
              <Image 
                src="/logo.png" 
                alt="AQUAEQUIPOS" 
                width={200} 
                height={65}
                className="h-auto w-48 object-contain brightness-0 invert"
                style={{ margin: 0, padding: 0 }}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Distribuidor líder en América Latina para la gestión profesional del agua,
              bombas industriales y soluciones de infraestructura para piscinas.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com/aquaExpertos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/aquaequipos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@aquaequipos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 - Servicio al Cliente */}
          <div>
            <h3 className="text-lg font-bold mb-4">SERVICIO AL CLIENTE</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/envios" className="text-gray-400 hover:text-white transition">
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-gray-400 hover:text-white transition">
                  Soporte Técnico
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-gray-400 hover:text-white transition">
                  Programa de Venta al por Mayor
                </Link>
              </li>
              <li>
                <Link href="/garantia-devoluciones" className="text-gray-400 hover:text-white transition">
                  Registro de Garantía
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Nuestra Empresa */}
          <div>
            <h3 className="text-lg font-bold mb-4">NUESTRA EMPRESA</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-white transition">
                  Acerca de AquaEquipos
                </Link>
              </li>
              <li>
                <Link href="/empleos" className="text-gray-400 hover:text-white transition">
                  Empleos
                </Link>
              </li>
              <li>
                <Link href="/sostenibilidad" className="text-gray-400 hover:text-white transition">
                  Sostenibilidad
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition">
                  Noticias y Blog
                </Link>
              </li>
              <li>
                <Link href="/alianzas" className="text-gray-400 hover:text-white transition">
                  Alianzas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Encuéntranos */}
          <div>
            <h3 className="text-lg font-bold mb-4">ENCUÉNTRANOS</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Industrial Park Way,<br/>Suite 400, Miami, FL 33101</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@aquaequipos.com" className="hover:text-white transition">
                  support@aquaequipos.com
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+18001234567" className="hover:text-white transition">
                  +1 (800) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              DISTRIBUIDOR LÍDER EN AMÉRICA LATINA PARA LA GESTIÓN PROFESIONAL DEL AGUA, BOMBAS INDUSTRIALES Y
              SOLUCIONES DE INFRAESTRUCTURA PARA PISCINAS
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 mt-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/politica-privacidad" className="hover:text-white transition">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-white transition">
                Términos de Servicio
              </Link>
              <Link href="/cookies" className="hover:text-white transition">
                Configuración de Cookies
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} AquaEquipos. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
