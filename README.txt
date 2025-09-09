Registro de Llamadas a Clientes — App estática (HTML/JS)

1) Configurar webhooks
   - Edita el archivo: config.js
   - Reemplaza:
        GUARDAR_LLAMADA:      https://TU_N8N/webhook/guardar-llamada
        FILTROS_BUSQUEDA:     https://TU_N8N/webhook/filtrar-llamadas
        ENVIAR_RECORDATORIO:  https://TU_N8N/webhook/enviar-recordatorio

2) CORS en n8n
   En cada Webhook node, agrega Response Headers (o usa un nodo HTTP Response final):
        Access-Control-Allow-Origin: *
        Access-Control-Allow-Headers: Content-Type
        Access-Control-Allow-Methods: GET,POST,OPTIONS
   Para producción, reemplaza * por tu dominio (ej.: https://tu-dominio.com).

3) Probar local
   - Abre index.html con Live Server (VS Code) o doble clic (algunos navegadores bloquean fetch de archivos locales).
   - O súbelo a un hosting estático: Netlify / Vercel / GitHub Pages / Cloudflare Pages / DonWeb (public_html).

4) Estructura
   index.html  → UI
   styles.css  → estilos
   config.js   → URLs de tus Webhooks
   app.js      → lógica para crear, filtrar y enviar recordatorios

5) Notas de formato
   - La app intenta mapear campos comunes:
        Fecha | Nombre | E-Mail | Teléfono | Cant. Llamadas
     Si tus webhooks devuelven claves distintas, ajusta la función mapResultados() en app.js.

6) Seguridad
   - Esta app llama DIRECTO a tus Webhooks desde el navegador.
   - Si necesitas ocultar secretos o aplicar validaciones extra, usa un proxy (Netlify Functions / Cloudflare Workers) entre el cliente y n8n.

¡Listo! Sube el ZIP al hosting de tu preferencia, actualiza config.js y a funcionar.
