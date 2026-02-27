# 🚀 Frontend AquaEquipos

E-commerce moderno para AquaEquipos construido con Next.js 15, React 19, TypeScript y Tailwind CSS.

## ✨ Características Principales

### 🛍️ E-commerce Completo
- **Catálogo de productos** con WooCommerce integration
- **Carrito de compras** persistente (SQLite + localStorage)
- **Sistema de favoritos** con base de datos
- **Checkout completo** con validación de formularios
- **Integración TiloPay** para pagos en línea
- **Filtros de productos** (precio, disponibilidad, ofertas)

### 🔐 Autenticación
- **Firebase Authentication** (Email/Password y Google)
- **Gestión de sesiones** con React Context
- **Perfil de usuario** editable
- **Recuperación de contraseña**

### 🎨 UI/UX Moderna
- **Diseño dark theme** profesional
- **Responsive design** (móvil, tablet, desktop)
- **Animaciones suaves** y transiciones
- **Optimización de imágenes** con Next.js Image
- **Toast notifications** para feedback

### ⚡ Performance
- **Server-Side Rendering (SSR)** para SEO
- **Client-Side Rendering (CSR)** para interactividad
- **Code splitting** automático
- **Image optimization** automática

## �️ Stack Tecnológico

- **Framework:** Next.js 15.2.3 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4
- **Authentication:** Firebase 10.7
- **State Management:** React Context API
- **Image Optimization:** Next.js Image
- **HTTP Client:** Fetch API

## 📁 Estructura del Proyecto

```
frontend-aquaequipos/
├── public/
│   ├── logo.png
│   └── brands/              # Logos de marcas
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── layout.tsx       # Layout principal con providers
│   │   ├── page.tsx         # Página de inicio
│   │   ├── carrito/         # Página del carrito
│   │   ├── checkout/        # Página de checkout
│   │   ├── favoritos/       # Página de favoritos
│   │   ├── categoria/       # Páginas dinámicas de categorías
│   │   ├── categorias/      # Listado de categorías
│   │   ├── login/           # Login con Firebase
│   │   ├── registro/        # Registro de usuarios
│   │   ├── perfil/          # Perfil de usuario
│   │   └── pago-completado/ # Confirmación de pago
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.tsx       # Navegación principal
│   │   ├── Footer.tsx       # Pie de página
│   │   ├── ProductCard.tsx  # Tarjeta de producto
│   │   ├── ProductFilters.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── ...
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   └── ToastContext.tsx
│   ├── lib/                 # Utilities y API clients
│   │   ├── api.ts          # Funciones para llamadas al backend
│   │   └── firebase.ts     # Configuración de Firebase
│   └── types/              # Tipos TypeScript
│       └── index.ts
├── .env.example            # Variables de entorno de ejemplo
├── next.config.ts          # Configuración de Next.js
├── tailwind.config.ts      # Configuración de Tailwind
└── tsconfig.json           # Configuración de TypeScript
```

## � Instalación y Configuración

### Prerrequisitos

- Node.js 18.x o superior
- npm o yarn
- Backend de AquaEquipos corriendo en puerto 4000
- Cuenta de Firebase configurada

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/DancingAlien96/Frontend_aquaequipos.git
cd Frontend_aquaequipos
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

Crear archivo `.env.local` con las siguientes variables:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### Paso 4: Ejecutar en desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Paso 5: Build para producción

```bash
npm run build
npm start
```

## 📚 Características Implementadas

### 🛒 Sistema de Carrito
- Persistencia en SQLite (usuarios logueados)
- Fallback a localStorage (invitados)
- Migración automática al iniciar sesión
- Sincronización en tiempo real

### ❤️ Sistema de Favoritos  
- Base de datos SQLite
- Contador en tiempo real
- Vista dedicada con grid de productos
- Integración con ProductCard

### 💳 Checkout y Pagos
- Formulario completo de facturación/envío
- Integración con TiloPay (Guatemala)
- Confirmación de órdenes en WooCommerce
- Página de confirmación de pago

### 🔍 Filtros de Productos
- Rango de precio (min/max)
- Estado (en stock, en oferta)
- Ordenamiento (precio, nombre, fecha)
- Paginación

### 👤 Gestión de Usuario
- Registro con email/contraseña
- Login con Google
- Perfil editable
- Recuperación de contraseña

## 🔗 Integración con Backend

El frontend consume el [backend de AquaEquipos](https://github.com/DancingAlien96/backend-aquaequipos):

### Endpoints principales:
- **Productos:** `GET /api/products`, `GET /api/products?category=X`
- **Categorías:** `GET /api/categories`
- **Carrito:** `GET/POST/PUT/DELETE /api/cart`
- **Favoritos:** `GET/POST/DELETE /api/favorites`
- **Órdenes:** `POST /api/orders`
- **TiloPay:** `POST /api/tilopay/create-payment`, `GET /api/tilopay/consult/:orderNumber`

## 📱 Páginas Disponibles

| Ruta | Descripción | Tipo |
|------|-------------|------|
| `/` | Página principal | SSR |
| `/categorias` | Listado de categorías | CSR |
| `/categoria/[slug]` | Productos por categoría | SSR |
| `/carrito` | Carrito de compras | CSR |
| `/checkout` | Proceso de pago | CSR |
| `/favoritos` | Productos favoritos | CSR |
| `/login` | Inicio de sesión | CSR |
| `/registro` | Registro de usuario | CSR |
| `/perfil` | Perfil de usuario | CSR |
| `/pago-completado` | Confirmación de pago | CSR |

## 🎨 Componentes Principales

### Navbar
- Búsqueda de productos
- Iconos de carrito y favoritos con contadores
- Menú de usuario con avatar
- Responsive (móvil y desktop)

### ProductCard
- Imagen optimizada con Next.js Image
- Precio con detección de ofertas
- Botones de favoritos y carrito
- Link al detalle del producto

### ProductFilters
- Filtro por rango de precio
- Ordenamiento múltiple
- Checkbox de estado (stock, ofertas)
- UI colapsable en móvil

### Contexts
- **AuthContext:** Gestión de autenticación con Firebase
- **CartContext:** Estado global del carrito
- **FavoritesContext:** Estado global de favoritos
- **ToastContext:** Notificaciones toast

## 🚀 Scripts Disponibles

```bash
npm run dev      # Desarrollo en http://localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

## 🌐 Despliegue

### Vercel (Recomendado)
```bash
vercel
```

### Docker
```dockerfile
# Próximamente
```

### Variables de entorno requeridas en producción:
- `NEXT_PUBLIC_API_URL` - URL del backend
- Variables de Firebase (todas las NEXT_PUBLIC_FIREBASE_*)

## 📄 Licencia

© 2026 AquaEquipos - Todos los derechos reservados

---

**Desarrollado con ❤️ por el equipo de AquaEquipos**
