// 🛠️ Configurá acá tus webhooks de n8n
// Reemplazá las URLs por las de tus Webhook nodes (producción o dev).
window.WEBHOOKS = {
  GUARDAR_LLAMADA: "https://gaston-n8n.app.n8n.cloud/webhook/crear-clientes",
  FILTROS_BUSQUEDA: "https://gaston-n8n.app.n8n.cloud/webhook/buscar-clientes",
  ENVIAR_RECORDATORIO: "https://gaston-n8n.app.n8n.cloud/webhook/envio_recordatorio"
};

// Opcional: origen permitido (para reportes de CORS)
window.APP_ORIGIN = location.origin;
