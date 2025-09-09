// 🛠️ Configurá acá tus webhooks de n8n
// Reemplazá las URLs por las de tus Webhook nodes (producción o dev).
window.WEBHOOKS = {
  GUARDAR_LLAMADA: "https://TU_N8N/webhook/guardar-llamada",
  FILTROS_BUSQUEDA: "https://TU_N8N/webhook/filtrar-llamadas",
  ENVIAR_RECORDATORIO: "https://TU_N8N/webhook/enviar-recordatorio"
};

// Opcional: origen permitido (para reportes de CORS)
window.APP_ORIGIN = location.origin;
