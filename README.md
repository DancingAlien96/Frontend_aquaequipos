# Frontend AquaEquipos - Next.js

Frontend moderno para AquaEquipos construido con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Características

- **Next.js 15** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Optimización de imágenes** con Next.js Image
- **Server-Side Rendering (SSR)** y Static Site Generation (SSG)
- **Integración con WooCommerce** a través del backend

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── FeaturedProducts.tsx
│   ├── ProductCard.tsx
│   ├── Brands.tsx
│   └── Contact.tsx
├── lib/                   # Utilidades y API clients
│   └── api.ts            # Cliente API
└── types/                 # Tipos TypeScript
    └── index.ts
```

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env.local` basado en `.env.example`:
```bash
cp .env.example .env.local
```

3. Configurar variables de entorno en `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WOOCOMMERCE_URL=https://aquaequipos.com
```

## 🏃 Desarrollo

Iniciar servidor de desarrollo:
```bash
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

Construir para producción:
```bash
npm run build
```

Iniciar servidor de producción:
```bash
npm start
```

## 📦 Próximas Funcionalidades

- [ ] Sistema de carrito de compras
- [ ] Página de productos con filtros
- [ ] Página de detalle de producto
- [ ] Sistema de checkout
- [ ] Autenticación de usuarios
- [ ] Panel de usuario
- [ ] Sistema de búsqueda
- [ ] Integración con pasarelas de pago

## 🔗 API Endpoints del Backend

El frontend consume los siguientes endpoints del backend:

- `GET /api/products` - Lista de productos
- `GET /api/products/:slug` - Detalle de producto
- `GET /api/categories` - Lista de categorías
- `POST /api/orders` - Crear orden

## 📝 Componentes Principales

### Hero
Banner principal con llamada a la acción.

### Features
Sección de características/ventajas (Expertos en Agua, Mejores Precios, etc.).

### FeaturedProducts
Muestra productos destacados desde WooCommerce.

### ProductCard
Tarjeta de producto reutilizable con imagen, precio y acciones.

### Brands
Carrusel/grid de marcas representadas.

### Contact
Sección de contacto con enlaces a redes sociales.

## 🎨 Personalización

Los colores principales se pueden modificar en `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#0066cc',
      secondary: '#00aaff',
    },
  },
}
```

## 📄 Licencia

Privado - AquaEquipos
