# Sistema de Autenticación con Firebase

## 🔐 Características Implementadas

- ✅ Registro de usuarios con email y contraseña
- ✅ Inicio de sesión con email y contraseña
- ✅ Inicio de sesión con Google
- ✅ Recuperación de contraseña
- ✅ Protección de rutas (perfil de usuario)
- ✅ Contexto de autenticación global
- ✅ Navbar con estado de autenticación
- ✅ Página de perfil de usuario

## 📁 Estructura de Archivos

```
src/
├── lib/
│   └── firebase.ts              # Configuración de Firebase
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── components/
│   ├── Navbar.tsx               # Navbar con autenticación
│   └── Footer.tsx               # Footer del sitio
├── app/
│   ├── login/
│   │   └── page.tsx             # Página de inicio de sesión
│   ├── registro/
│   │   └── page.tsx             # Página de registro
│   ├── recuperar-password/
│   │   └── page.tsx             # Página de recuperación
│   └── perfil/
│       └── page.tsx             # Página de perfil (protegida)
```

## 🚀 Uso del Sistema de Autenticación

### En cualquier componente:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MiComponente() {
  const { user, loading, signIn, signUp, logout } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Bienvenido, {user.displayName || user.email}</p>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    );
  }

  return <div>No has iniciado sesión</div>;
}
```

## 🔒 Proteger Rutas

Para proteger una página, usa este patrón:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaginaProtegida() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null;

  return <div>Contenido protegido</div>;
}
```

## 📱 Funciones Disponibles en useAuth()

| Función | Descripción | Parámetros |
|---------|-------------|------------|
| `user` | Usuario actual o null | - |
| `loading` | Estado de carga | - |
| `signIn(email, password)` | Iniciar sesión | email: string, password: string |
| `signUp(email, password, displayName?)` | Registrar usuario | email: string, password: string, displayName?: string |
| `signInWithGoogle()` | Iniciar sesión con Google | - |
| `logout()` | Cerrar sesión | - |
| `resetPassword(email)` | Recuperar contraseña | email: string |

## 🔗 Próximos Pasos

### Sincronización con WooCommerce

Puedes sincronizar los usuarios de Firebase con clientes de WooCommerce:

1. **Al registrarse**: Crear un cliente en WooCommerce
2. **Al hacer un pedido**: Asociar el pedido con el UID de Firebase

Ejemplo de sincronización:

```typescript
// En el backend
import wooCommerce from '../config/woocommerce';

async function syncUserWithWooCommerce(firebaseUser: {
  uid: string;
  email: string;
  displayName: string;
}) {
  // Crear cliente en WooCommerce
  const customer = await wooCommerce.post('customers', {
    email: firebaseUser.email,
    first_name: firebaseUser.displayName.split(' ')[0],
    last_name: firebaseUser.displayName.split(' ').slice(1).join(' '),
    meta_data: [
      {
        key: 'firebase_uid',
        value: firebaseUser.uid
      }
    ]
  });

  return customer.data;
}
```

### Otras Mejoras

- [ ] Verificación de email
- [ ] Actualización de perfil
- [ ] Foto de perfil
- [ ] Eliminar cuenta
- [ ] Historial de pedidos
- [ ] Direcciones guardadas
- [ ] Métodos de pago guardados

## 🛡️ Seguridad

Firebase Authentication maneja:
- Encriptación de contraseñas
- Tokens de sesión seguros
- Protección contra ataques de fuerza bruta
- Validación de emails
- OAuth seguro con Google

## 📝 Notas

- Las credenciales de Firebase en el frontend son **públicas y seguras**
- La seguridad real se maneja en Firebase Security Rules
- Los tokens de autenticación se renuevan automáticamente
- El estado de autenticación persiste entre recargas de página
