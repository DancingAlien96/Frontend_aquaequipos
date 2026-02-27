# Security Notes

## Firebase Configuration

Las credenciales de Firebase en este proyecto son **seguras para estar en el frontend** porque:

1. **Firebase está diseñado para esto**: Firebase está hecho para aplicaciones frontend y las credenciales son seguras en el cliente.

2. **Protección mediante reglas**: La seguridad real se controla mediante Firebase Security Rules, no ocultando las credenciales.

3. **API Key es pública**: El API Key de Firebase es una clave pública que identifica tu proyecto, no es una clave secreta.

4. **Domain restrictions**: Firebase permite restringir qué dominios pueden usar estas credenciales desde la consola.

## Credenciales Movidas a Variables de Entorno

Por buenas prácticas y para evitar alertas de seguridad en GitHub, hemos movido las credenciales a variables de entorno en `.env.local`.

### Para configurar localmente:

1. Copiar `.env.example` a `.env.local`
2. Reemplazar los valores con las credenciales reales de Firebase Console
3. El archivo `.env.local` está en `.gitignore` y no se subirá a GitHub

## Importante

- ✅ `.env.example` - Se sube a GitHub (sin credenciales reales)
- ❌ `.env.local` - NO se sube a GitHub (contiene credenciales)
- ❌ `.env` - NO se sube a GitHub (está en .gitignore)

## Referencias

- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)
- [Is it safe to expose Firebase apiKey?](https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public)
