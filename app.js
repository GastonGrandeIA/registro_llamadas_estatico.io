(function(){
  const { WEBHOOKS } = window;

  // --- util ---
  async function sendToWebhook(url, payload) {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload ?? {})
    });
    // Intenta parsear JSON; si no, devuelve texto
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { ok: res.ok, status: res.status, text }; }
  }

  // Mapea formatos de respuesta diversos
  function mapResultados(payload){
    const rows = Array.isArray(payload?.data) ? payload.data :
                 (Array.isArray(payload) ? payload :
                 (Array.isArray(payload?.rows) ? payload.rows : []));
    return rows.map((item, i) => ({
      id: item.id ?? item.row_number ?? i+1,
      fecha: item.Fecha ?? item.fecha ?? item.date ?? "",
      nombreCliente: item.Nombre ?? item.nombreCliente ?? item.nombre ?? "",
      emailCliente: item["E-Mail"] ?? item.emailCliente ?? item.email ?? "",
      telefono: String(item["Teléfono"] ?? item.telefono ?? item.phone ?? ""),
      cantidadLlamadas: item["Cant. Llamadas"] ?? item.cantidadLlamadas ?? item.count ?? 0
    }));
  }

  // --- UI refs ---
  const formNueva = document.getElementById("form-nueva-llamada");
  const formFiltros = document.getElementById("form-filtros");
  const tabla = document.getElementById("tabla-resultados").querySelector("tbody");
  const noResult = document.getElementById("no-result");
  const statusCrear = document.getElementById("status-crear");
  const statusFiltros = document.getElementById("status-filtros");

  function setStatus(el, msg, ok=true){
    el.textContent = msg || "";
    el.style.color = ok ? "#137333" : "#c5221f";
    if(msg){ setTimeout(()=>{ el.textContent=""; }, 4000); }
  }

  // --- acciones ---
  formNueva.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fd = new FormData(formNueva);
    const data = {
      fecha: fd.get("fecha"),
      nombreCliente: fd.get("nombreCliente"),
      emailCliente: fd.get("emailCliente"),
      telefono: fd.get("telefono"),
      cantidadLlamadas: Number(fd.get("cantidadLlamadas") || 0),
      timestamp: new Date().toISOString()
    };
    try {
      const resp = await sendToWebhook(WEBHOOKS.GUARDAR_LLAMADA, data);
      setStatus(statusCrear, "Llamada guardada ✅", true);
      formNueva.reset();
    } catch (err) {
      console.error(err);
      setStatus(statusCrear, "Error al guardar ❌", false);
    }
  });

  formFiltros.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fd = new FormData(formFiltros);
    const filtros = {
      desdeFecha: fd.get("desdeFecha") || undefined,
      hastaFecha: fd.get("hastaFecha") || undefined,
      nombreCliente: (fd.get("nombreCliente") || "").trim() || undefined
    };
    try {
      setStatus(statusFiltros, "Buscando…");
      const resp = await sendToWebhook(WEBHOOKS.FILTROS_BUSQUEDA, filtros);
      const rows = mapResultados(resp);
      renderTabla(rows);
      setStatus(statusFiltros, `Resultados: ${rows.length} ✓`, true);
    } catch (err) {
      console.error(err);
      setStatus(statusFiltros, "Error al buscar ❌", false);
    }
  });

  function renderTabla(rows){
    tabla.innerHTML = "";
    if(!rows || rows.length === 0){
      noResult.style.display = "block";
      return;
    }
    noResult.style.display = "none";
    rows.forEach((r, idx)=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx+1}</td>
        <td>${escapeHtml(r.fecha)}</td>
        <td>${escapeHtml(r.nombreCliente)}</td>
        <td>${escapeHtml(r.emailCliente)}</td>
        <td>${escapeHtml(r.telefono)}</td>
        <td><span class="badge">${Number(r.cantidadLlamadas||0)}</span></td>
        <td><button data-action="recordatorio" data-index="${idx}">Enviar recordatorio</button></td>
      `;
      tabla.appendChild(tr);
    });

    // acciones por fila
    tabla.querySelectorAll("button[data-action='recordatorio']").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        const row = rows[Number(btn.dataset.index)];
        try {
          btn.disabled = true;
          btn.textContent = "Enviando…";
          await sendToWebhook(WEBHOOKS.ENVIAR_RECORDATORIO, {
            nombre: row.nombreCliente,
            email: row.emailCliente,
            telefono: row.telefono,
            cantidadLlamadas: row.cantidadLlamadas
          });
          btn.textContent = "Enviado ✓";
          setTimeout(()=>{ btn.textContent = "Enviar recordatorio"; btn.disabled = false; }, 2000);
        } catch (e){
          console.error(e);
          btn.textContent = "Error";
          setTimeout(()=>{ btn.textContent = "Enviar recordatorio"; btn.disabled = false; }, 2000);
        }
      });
    });
  }

  function escapeHtml(s){
    return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  // Arranque vacío
  renderTabla([]);
})();
