export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Política de Privacidad</h1>
          <p className="text-gray-700 mt-2">Última actualización: Marzo 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introducción</h2>
            <p className="text-gray-700 leading-relaxed">
              En AQUAEQUIPOS, nos comprometemos a proteger su privacidad y garantizar la seguridad de su información personal. 
              Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando 
              visita nuestro sitio web y realiza compras con nosotros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">1.1 Información Personal</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Recopilamos información personal que usted nos proporciona voluntariamente cuando:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Crea una cuenta en nuestro sitio web</li>
              <li>Realiza una compra</li>
              <li>Se suscribe a nuestro boletín de noticias</li>
              <li>Se comunica con nosotros</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Tipos de Datos Recopilados</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Datos de identificación:</strong> Nombre completo, dirección de correo electrónico</li>
              <li><strong>Datos de contacto:</strong> Número de teléfono, dirección de envío</li>
              <li><strong>Datos de pago:</strong> Información de facturación (procesada de forma segura por TiloPay)</li>
              <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas</li>
              <li><strong>Preferencias:</strong> Productos favoritos, historial de compras</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Autenticación con Firebase</h3>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos Firebase Authentication de Google para gestionar cuentas de usuario. Cuando se registra con Google, 
              recopilamos su nombre, correo electrónico y foto de perfil según lo autorizado por Google.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo Utilizamos su Información</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Procesar pedidos:</strong> Gestionar y completar sus compras</li>
              <li><strong>Comunicación:</strong> Enviar confirmaciones de pedidos, actualizaciones de envío y responder consultas</li>
              <li><strong>Mejorar servicios:</strong> Analizar el uso del sitio para mejorar la experiencia del usuario</li>
              <li><strong>Marketing:</strong> Enviar promociones y ofertas especiales (con su consentimiento)</li>
              <li><strong>Seguridad:</strong> Detectar y prevenir fraudes y actividades ilegales</li>
              <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Base Legal para el Procesamiento</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Procesamos su información personal con base en:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Ejecución de contrato:</strong> Para cumplir con los pedidos que realiza</li>
              <li><strong>Consentimiento:</strong> Para enviar comunicaciones de marketing</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
              <li><strong>Obligación legal:</strong> Para cumplir con requisitos legales y fiscales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartir Información con Terceros</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Podemos compartir su información con terceros en las siguientes circunstancias:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">4.1 Proveedores de Servicios</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Firebase (Google):</strong> Autenticación y gestión de usuarios</li>
              <li><strong>TiloPay:</strong> Procesamiento de pagos</li>
              <li><strong>WooCommerce:</strong> Gestión de productos y catálogo</li>
              <li><strong>Servicios de envío:</strong> Para entregar sus pedidos</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Otros Casos</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cuando sea requerido por ley o autoridades gubernamentales</li>
              <li>Para proteger nuestros derechos legales o propiedad</li>
              <li>En caso de fusión, adquisición o venta de activos (previa notificación)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de la Información</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cifrado SSL/TLS para todas las transmisiones de datos</li>
              <li>Autenticación segura mediante Firebase</li>
              <li>Procesamiento seguro de pagos a través de TiloPay (no almacenamos datos de tarjetas)</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo regular de vulnerabilidades de seguridad</li>
              <li>Copias de seguridad regulares de datos</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. 
              No podemos garantizar la seguridad absoluta de su información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies y Tecnologías Similares</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Mantener su sesión iniciada</li>
              <li>Recordar sus preferencias y artículos en el carrito</li>
              <li>Analizar el tráfico del sitio web</li>
              <li>Personalizar contenido y anuncios</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos 
              en esta política, a menos que la ley exija o permita un período de retención más largo. Los datos de 
              transacciones se conservan según lo requerido por las leyes fiscales y contables de Guatemala.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sus Derechos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Usted tiene los siguientes derechos con respecto a su información personal:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Acceso:</strong> Solicitar una copia de la información que tenemos sobre usted</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de información inexacta o incompleta</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de su información personal</li>
              <li><strong>Restricción:</strong> Solicitar la restricción del procesamiento de su información</li>
              <li><strong>Portabilidad:</strong> Recibir su información en un formato estructurado y legible por máquina</li>
              <li><strong>Objeción:</strong> Oponerse al procesamiento de su información para fines de marketing</li>
              <li><strong>Retirar consentimiento:</strong> Retirar su consentimiento en cualquier momento</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Para ejercer estos derechos, contáctenos a través de los medios indicados al final de esta política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Transferencias Internacionales</h2>
            <p className="text-gray-700 leading-relaxed">
              Algunos de nuestros proveedores de servicios (como Firebase de Google) pueden estar ubicados fuera de Guatemala. 
              Cuando transferimos información internacionalmente, nos aseguramos de que se implementen las salvaguardas apropiadas 
              para proteger su información de acuerdo con esta política de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacidad de Menores</h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestro sitio web no está dirigido a personas menores de 18 años. No recopilamos intencionalmente información 
              personal de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos de inmediato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Enlaces a Sitios de Terceros</h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestro sitio web puede contener enlaces a sitios de terceros. No somos responsables de las prácticas de 
              privacidad de estos sitios. Le recomendamos que lea las políticas de privacidad de cada sitio que visite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Cambios a Esta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cuando lo hagamos, 
              actualizaremos la fecha de "última actualización" en la parte superior de esta página. Le recomendamos que 
              revise periódicamente esta política para estar informado sobre cómo protegemos su información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contacto</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el manejo de su 
              información personal, puede contactarnos:
            </p>
            <ul className="list-none text-gray-700 space-y-2 ml-4">
              <li><strong>Empresa:</strong> AQUAEQUIPOS</li>
              <li><strong>Sitio web:</strong> www.aquaequipos.com</li>
              <li><strong>WhatsApp:</strong> +502 44349387</li>
              <li><strong>Email:</strong> privacidad@aquaequipos.com</li>
            </ul>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              Al utilizar nuestro sitio web, usted reconoce que ha leído, entendido y acepta los términos de esta Política de Privacidad.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
