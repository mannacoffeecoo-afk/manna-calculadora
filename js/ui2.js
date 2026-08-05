/* MANNA — Vistas restantes */
(function(){
'use strict';
const U=window.__ui, M=window.MannaMotor, D=window.MannaDatos;
const {$,money,num,pct,esc}=U; const P=window.PINTAR;
const g=()=>U.d, r=()=>U.R;

/* ---------- 2. RESULTADO ---------- */
P.resultado=function(){
  const R=r(), pr=R.precio, c=R.costos;
  const bloq = R.bloqueos.map(b=>`<div class="bloq"><div class="t">● ${esc(b.queFalta)} — ${esc(b.item)}</div>
      <div class="m"><b>Por qué bloquea:</b> ${esc(b.porque)}</div>
      <div class="m"><b>Qué debo ingresar:</b> ${esc(b.queIngresar)}</div>
      <button class="btn sm" style="margin-top:8px" onclick="mIr('${b.donde==='cotizar'?'cotizar':b.donde==='recetas'?'menu':b.donde==='empaques'?'insumos':'insumos'}')">Ir a corregirlo</button>
    </div>`).join('');
  const av = R.avisos.map(a=>`<div class="bloq aviso"><div class="t">▲ ${esc(a.item)}</div><div class="m">${esc(a.porque)}</div></div>`).join('');
  $('#s-resultado').innerHTML=`
  <h2>Resultado y propuesta</h2>
  ${R.estado==='BLOQUEADA'
    ?`<div class="banner bad"><span class="ico">●</span><div>BLOQUEADA — falta información. ${R.bloqueos.length} ${R.bloqueos.length===1?'cosa':'cosas'} por corregir abajo.</div></div>`
    :`<div class="banner ok"><span class="ico">●</span><div>LISTA PARA ENVIAR — sin bloqueos.</div></div>`}
  <div class="grid g3" style="margin-bottom:16px">
    <div class="kpi big ${R.estado==='BLOQUEADA'?'bad':'ok'}"><div class="et">Total a cobrar al cliente</div>
      <div class="val">${money(pr.totalCliente)}</div><div class="nota">precio ${money(pr.precioFinal)} + tax ${money(pr.salesTax)}</div></div>
    <div class="kpi"><div class="et">Ganancia proyectada</div><div class="val">${money(pr.utilidad)}</div>
      <div class="nota">${money(pr.precioPorInvitado)} por invitado</div></div>
    <div class="kpi"><div class="et">Margen real</div><div class="val">${pct(pr.margenReal)}</div>
      <div class="nota">objetivo ${pct(pr.margenObjetivo)}</div></div>
  </div>
  <div class="card"><h3>Precio</h3><table>
    <tr><td>Precio recomendado</td><td class="num">${money(pr.recomendado)}</td></tr>
    <tr><td>Mínimo de evento aplicado</td><td class="num">${pr.minimoAplicado?'Sí — '+money(g().parametros.minimoEvento):'No'}</td></tr>
    <tr><td>Precio final antes de impuesto <span class="chip gris">redondeado al próximo $5</span></td><td class="num"><b>${money(pr.precioFinal)}</b></td></tr>
    <tr><td>Sales tax (${pct(g().parametros.salesTax)})</td><td class="num">${money(pr.salesTax)}</td></tr>
    <tr class="tot"><td>TOTAL A COBRAR</td><td class="num">${money(pr.totalCliente)}</td></tr></table></div>
  <div class="card"><h3>Desglose del costo</h3><table>
    <tr><td>Ingredientes</td><td class="num">${money(c.baseIngredientes)}</td></tr>
    <tr><td>Empaques</td><td class="num">${money(c.baseEmpaques)}</td></tr>
    <tr><td>Consumibles (Agua Primo)</td><td class="num">${money(c.baseConsumibles)}</td></tr>
    ${c.signature?`<tr><td>Signature manual</td><td class="num">${money(c.signature)}</td></tr>`:''}
    <tr><td>Aumento interno ${pct(g().parametros.aumentoInterno)} <span class="chip gris">solo insumos</span></td><td class="num">${money(c.aumento)}</td></tr>
    <tr><td>Mano de obra</td><td class="num">${money(c.labor)}</td></tr>
    <tr><td>Pago de dueños ${c.duenosEnCosto?'':'<span class="chip warn">excluido</span>'}</td><td class="num">${money(c.duenos)}</td></tr>
    <tr><td>Transporte y otros gastos</td><td class="num">${money(c.otrosGastos)}</td></tr>
    <tr><td>Comisión de pago</td><td class="num">${money(c.comision)}</td></tr>
    <tr class="tot"><td>COSTO TOTAL DEL EVENTO</td><td class="num">${money(c.costoTotal)}</td></tr></table>
    <details class="tec"><summary>Ver el cálculo completo</summary><table style="margin-top:10px">
      <tr><td>Subtotal base de insumos</td><td class="num">${money(c.subtotal)}</td></tr>
      <tr><td>Costo ajustado de insumos</td><td class="num">${money(c.insumosAjustados)}</td></tr>
      <tr><td>Costos fijos del evento</td><td class="num">${money(c.costosFijos)}</td></tr>
      <tr><td>Divisor (1 − margen − comisión)</td><td class="num">${pr.divisor.toFixed(4)}</td></tr>
      <tr><td>Precio = costos fijos ÷ divisor</td><td class="num">${money(pr.recomendado)}</td></tr>
      <tr><td>Mezclas de masa de crepes</td><td class="num">${R.masa.mezclas} (${R.masa.crepes} crepes)</td></tr></table></details></div>
  ${P.rentabilidad(R)}
  ${bloq?`<h3 style="margin-top:22px">Cómo resolver los bloqueos</h3>${bloq}`:''}
  ${av?`<h3 style="margin-top:22px">Advertencias (no impiden cotizar)</h3>${av}`:''}
  <div class="card noimp"><h3>Acciones</h3>
    <div class="fila" style="margin-bottom:10px">
      <input id="nomCot" placeholder="Nombre de la cotización" style="max-width:300px"
        value="${esc(g().evento.cliente||'Sin cliente')} — ${esc(g().evento.fecha||'sin fecha')}">
      <input id="vigCot" type="number" style="max-width:150px" value="${g().evento.vigenciaDias??15}" title="Vigencia en días">
      <span class="pista" style="margin:0">días de vigencia</span></div>
    <div class="fila">
      <button class="btn" onclick="mGuardarCot(false)">Guardar cotización</button>
      <button class="btn" onclick="mGuardarCot(true)">Guardar y crear nueva</button>
      <button class="btn sec" onclick="mIr('propuesta')">Ver propuesta para el cliente</button>
      <button class="btn sec" onclick="mIr('compras')">Ver compras</button></div>
    ${R.estado==='BLOQUEADA'?`<p class="pista" style="margin:12px 0 0;color:var(--rojo)">
      Con bloqueos solo se puede guardar como <b>borrador</b>. El PDF final se habilita cuando la cotización quede LISTA PARA ENVIAR.</p>`:''}
  </div>`;
};
/* ---------- RESUMEN DE RENTABILIDAD DEL EVENTO (solo interno) ----------
   Va dentro de una tarjeta .noimp para que NUNCA salga en la propuesta PDF. */
P.rentabilidad=function(R){
  const t=R&&R.rentabilidad; if(!t) return '';
  const m=v=>(v===null||v===undefined)?'—':money(v);
  const pp=v=>(v===null||v===undefined)?'—':pct(v);
  const inv=t.invitados>0;
  return `
  <div class="card noimp interno" style="margin-top:22px">
    <h3>Resumen de rentabilidad del evento <span class="chip warn">interno — no se muestra al cliente</span></h3>
    ${t.duenosExcluidos?`<div class="bloq aviso" style="margin-bottom:12px"><div class="t">▲ Pago de dueños excluido</div>
      <div class="m">${esc(t.avisoDuenos)}</div></div>`:''}
    ${t.conciliacionOk?'':`<div class="bloq"><div class="t">● La conciliación no cierra</div>
      <div class="m">Diferencia de ${m(t.descuadre)} entre ganancia potencial y (ganancia por margen + reserva).</div></div>`}
    <div class="grid g3 rent">
      <div class="kpi"><div class="et">Ganancia por margen</div><div class="val">${m(t.gananciaPorMargen)}</div>
        <div class="nota">margen real protegido ${pp(t.margenRealProtegido)}</div></div>
      <div class="kpi"><div class="et">Reserva de insumos</div><div class="val">${m(t.reservaInsumos)}</div>
        <div class="nota">ganancia potencial adicional</div></div>
      <div class="kpi ok"><div class="et">Ganancia potencial total</div><div class="val">${m(t.gananciaPotencialTotal)}</div>
        <div class="nota">margen potencial efectivo ${pp(t.margenPotencialEfectivo)}</div></div>
    </div>
    <p class="pista" style="margin:10px 0 0">${esc(t.reservaExplicacion)}</p>
    <details class="tec"><summary>Ver desglose de rentabilidad</summary>
      <table style="margin-top:10px">
        <tr><td>Ingreso antes de sales tax</td><td class="num"><b>${m(t.ingresoAntesTax)}</b></td></tr>
        <tr><td>Costo base real del evento</td><td class="num">${m(t.costoBaseReal)}</td></tr>
        <tr class="sub"><td style="padding-left:22px">Insumos a costo base (sin aumento)</td><td class="num">${m(t.desgloseBase.insumosBase)}</td></tr>
        <tr class="sub"><td style="padding-left:22px">Mano de obra</td><td class="num">${m(t.desgloseBase.labor)}</td></tr>
        <tr class="sub"><td style="padding-left:22px">Dueños ${t.duenosExcluidos?'<span class="chip warn">excluidos</span>':''}</td><td class="num">${m(t.desgloseBase.duenos)}</td></tr>
        <tr class="sub"><td style="padding-left:22px">Transporte, gasolina y otros gastos</td><td class="num">${m(t.desgloseBase.otrosGastos)}</td></tr>
        <tr><td>${esc(t.reservaEtiqueta)}</td><td class="num">${m(t.reservaInsumos)}</td></tr>
        <tr class="tot"><td>Costos protegidos (los que fijan el precio)</td><td class="num">${m(t.costosProtegidos)}</td></tr>
        <tr><td>Comisión estimada</td><td class="num">${m(t.comision)}</td></tr>
        <tr><td><b>Ganancia por margen</b> = precio − costos protegidos − comisión</td><td class="num"><b>${m(t.gananciaPorMargen)}</b></td></tr>
        <tr><td>Margen real protegido</td><td class="num">${pp(t.margenRealProtegido)}</td></tr>
        <tr><td><b>Ganancia potencial total</b> = precio − costo base real − comisión</td><td class="num"><b>${m(t.gananciaPotencialTotal)}</b></td></tr>
        <tr><td>Margen potencial efectivo</td><td class="num">${pp(t.margenPotencialEfectivo)}</td></tr>
        <tr><td>${esc(t.taxEtiqueta)}</td><td class="num">${t.taxAplicado?m(t.salesTax):m(0)+' <span class="chip gris">No aplicado</span>'}</td></tr>
        <tr><td>Efectivo necesario para comprar hoy</td><td class="num">${m(t.efectivoCompraHoy)}</td></tr>
        <tr><td>Precio antes de tax por invitado</td><td class="num">${inv?m(t.precioPorInvitado):'Pendiente'}</td></tr>
        <tr><td>Total a pagar por invitado${t.taxAplicado?' (con tax)':''}</td><td class="num">${inv?m(t.totalPorInvitado):'Pendiente'}</td></tr>
      </table>
      <p class="pista" style="margin-top:10px">${esc(t.potencialExplicacion)}</p>
      <p class="pista" style="margin-top:6px"><b>Efectivo de compra:</b> ${esc(t.efectivoExplicacion)}
        No se usa para calcular la rentabilidad del evento.</p>
      ${!t.taxAplicado&&t.motivoSinTax?`<p class="pista" style="margin-top:6px"><b>Motivo interno para no aplicar tax:</b> ${esc(t.motivoSinTax)}</p>`:''}
    </details>
  </div>`;
};

window.mGuardarCot=(nueva)=>{
  const v=parseInt($('#vigCot').value); if(!isNaN(v)) g().evento.vigenciaDias=v;
  const reg=D.guardarCotizacion($('#nomCot').value||'Sin nombre', r());
  if(nueva){ D.nuevaCotizacion(); U.calc(); alert('Cotización #'+reg.numero+' guardada. Nuevo evento en blanco.'); U.ir('cotizar'); }
  else { alert('Cotización #'+reg.numero+' guardada'+(reg.estado==='BLOQUEADA'?' como BORRADOR.':'.')); U.ir('guardadas'); }
};
window.mNuevaCot=()=>{
  if(D.sucio || D.cotizacionAbierta===null){
    const q=prompt('Tienes cambios sin guardar. Escribe:\n  G = guardar como borrador y crear nueva\n  D = descartar y crear nueva\n  (vacío = cancelar)','');
    if(!q) return;
    if(q.toUpperCase()==='G'){ D.guardarCotizacion((g().evento.cliente||'Borrador')+' — '+(g().evento.fecha||''), r()); }
    else if(q.toUpperCase()!=='D') return;
  }
  D.nuevaCotizacion(); U.calc(); U.ir('cotizar');
};

/* ---------- propuesta para el cliente: UN SOLO TOTAL ---------- */
P.propuesta=function(){
  const R=r(), ev=g().environment||g().evento, t=R.totalesCategoria;
  const num_=D.cotizacionAbierta ? (D.cotizaciones().find(c=>c.id===D.cotizacionAbierta)||{}).numero : D.siguienteNumero();
  const vig=ev.vigenciaDias??15;
  const bloqueada=R.estado==='BLOQUEADA';
  $('#s-propuesta').innerHTML=`
  ${bloqueada?`<div class="banner bad noimp"><span class="ico">●</span><div>Esta cotización está BLOQUEADA.
    Solo se puede guardar como borrador. Corrige lo que falta para habilitar el PDF final.
    <button class="btn sm sec" style="margin-left:10px" onclick="mIr('resultado')">Ver qué falta</button></div></div>`:''}
  <div class="card imprimir">
    <div style="text-align:center;border-bottom:3px solid var(--cafe);padding-bottom:16px;margin-bottom:22px">
      <div style="font-size:26px;font-weight:700;letter-spacing:1px;color:var(--cafe)">MANNA</div>
      <div style="font-size:13px;letter-spacing:3px;color:var(--cafe2)">COFFEE &amp; CREPES CO.</div>
      <div style="margin-top:10px;font-size:12px;color:var(--suave)">PROPUESTA / COTIZACIÓN N.º ${num_}</div>
    </div>
    <table style="margin-bottom:20px">
      <tr><td>Cliente</td><td class="num"><b>${esc(ev.cliente||'')}</b></td></tr>
      <tr><td>Fecha del evento</td><td class="num">${esc(ev.fecha||'')}</td></tr>
      ${ev.lugar?`<tr><td>Lugar</td><td class="num">${esc(ev.lugar)}</td></tr>`:''}
      <tr><td>Horas de servicio</td><td class="num">${ev.horas}</td></tr></table>
    <h3>Qué incluye</h3><table style="margin-bottom:16px">
      ${t.Cafe?`<tr><td colspan="2">Servicio ilimitado de bebidas de café durante las horas contratadas.</td></tr>`:''}
      ${t.Matcha?`<tr><td colspan="2">Matcha incluido dentro del menú contratado.</td></tr>`:''}
      ${t.Sparkling?`<tr><td colspan="2">Sparkling waters incluidas dentro del menú contratado.</td></tr>`:''}
      ${t.Crepes?`<tr><td colspan="2">Crepes hechos al momento durante el servicio.</td></tr>`:''}
      ${(R.syrups&&R.syrups.botellasTotales>0)?`<tr><td colspan="2">Selección de syrups incluida dentro del menú contratado.</td></tr>`:''}
      <tr><td colspan="2">Incluye montaje, servicio, desmontaje y limpieza.</td></tr></table>
    <p style="font-size:13.5px;color:var(--suave);margin:0 0 22px;font-style:italic">
      Servicio ilimitado durante ${ev.horas||0} horas para hasta ${ev.invitados||0} invitados,
      dentro del menú contratado y sujeto a la capacidad normal de servicio.</p>
    <div style="background:var(--arena);border-radius:14px;padding:26px;text-align:center;margin-bottom:20px">
      <div style="font-size:13px;color:var(--cafe2);letter-spacing:.6px">TOTAL ESTIMADO A PAGAR</div>
      <div style="font-size:44px;font-weight:700;color:var(--cafe);letter-spacing:-1px;margin:6px 0">${money(R.precio.totalCliente)}</div>
      <div style="font-size:12px;color:var(--suave)">Total con impuestos aplicables incluidos</div>
    </div>
    ${ev.notas?`<h3>Notas</h3><p style="font-size:14px">${esc(ev.notas)}</p>`:''}
    <h3>Condiciones</h3>
    <p style="font-size:13.5px;color:var(--suave)">Esta propuesta tiene una vigencia de ${vig} días a partir de su emisión.</p>
    ${ev.notasFinales?`<p style="font-size:13.5px">${esc(ev.notasFinales)}</p>`:''}
    <div style="margin-top:26px;border-top:1px solid var(--linea);padding-top:14px;min-height:70px">
      <div style="font-size:12px;color:var(--suave)">Notas finales / condiciones adicionales</div></div>
  </div>
  <div class="card noimp"><h3>Notas finales para el cliente</h3>
    <textarea rows="3" oninput="mSet('evento.notasFinales',this)">${esc(ev.notasFinales||'')}</textarea></div>
  <div class="fila noimp">
    <button class="btn" ${bloqueada?'disabled style="opacity:.45;cursor:not-allowed"':''}
      onclick="${bloqueada?'':'window.print()'}">Descargar propuesta para cliente (PDF)</button>
    <button class="btn sec" onclick="mIr('recibo')">Ver recibo interno (con sales tax)</button>
    <button class="btn sec" onclick="mIr('resultado')">Volver</button></div>`;
};
/* recibo interno: aqui el sales tax SI va como linea separada */
P.recibo=function(){
  const R=r(), ev=g().evento;
  const num_=D.cotizacionAbierta ? (D.cotizaciones().find(c=>c.id===D.cotizacionAbierta)||{}).numero : D.siguienteNumero();
  $('#s-recibo').innerHTML=`<div class="card imprimir">
    <h2 style="margin:0 0 4px">Recibo interno — uso administrativo</h2>
    <p class="pista">Documento interno para contabilidad y cumplimiento. No se envía al cliente.</p>
    <table><tr><td>Cotización N.º</td><td class="num">${num_}</td></tr>
      <tr><td>Cliente</td><td class="num">${esc(ev.cliente||'')}</td></tr>
      <tr><td>Fecha del evento</td><td class="num">${esc(ev.fecha||'')}</td></tr>
      <tr><td>Precio del evento (antes de impuesto)</td><td class="num">${money(R.precio.precioFinal)}</td></tr>
      <tr><td>Sales tax (${pct(g().parametros.salesTax)})</td><td class="num">${money(R.precio.salesTax)}</td></tr>
      <tr class="tot"><td>TOTAL COBRADO</td><td class="num">${money(R.precio.totalCliente)}</td></tr></table></div>
  <div class="fila noimp"><button class="btn" onclick="window.print()">Imprimir recibo</button>
    <button class="btn sec" onclick="mIr('propuesta')">Volver a la propuesta</button></div>`;
};

/* ---------- 3. COMPRAS ---------- */
P.compras=function(){
  const R=r(), dd=g(), up=dd.unidadesPracticas;
  const banano=dd.ingredientes.find(x=>x.id==='BANANO'), bunch=(banano?.cantPresentacion)||6, gBan=(banano?.factorBase)||120;
  const practica=(id,cant)=>{
    const u=up[id]; if(!u) return null;
    if(id.startsWith('LECHE_')&&u[0]==='galones'){ const ing=dd.ingredientes.find(x=>x.id===id);
      return [cant/((ing.densidad||1.03)*3785.41),'galones']; }
    if(id==='BANANO') return [cant/(gBan*bunch),'bunches'];
    return [cant/u[1],u[0]];
  };
  const colch=dd.parametros.colchonInventario||0, merma=dd.parametros.merma||0;
  const H=R.hielo;
  const filaHielo=(()=>{
    if(!H || (H.bolsasTotales===0 && H.gramosBebidas===0)) return '';
    const lineaBase=H.comprado?money(H.efectivoHoy):'<span class="chip warn">$0.00</span>';
    const lineaCosto=H.comprado?money(H.costoAsignado):'<span class="chip warn">$0.00</span>';
    return `<tr style="background:#FBF8F4">
      <td><b>Hielo</b><div style="font-size:11px;color:var(--suave)">Bolsa de 16 lb · ${money(H.precioBolsa)} por bolsa</div></td>
      <td class="num">${num(H.librasBebidas,2)} lb<div style="font-size:11px;color:var(--suave)">${num(H.gramosBebidas,0)} g de recetas</div></td>
      <td class="num">${num(H.librasBebidas/H.librasPorBolsa,3)}<div style="font-size:11px;color:var(--suave)">${H.bolsasBebidas} bolsas bebidas</div></td>
      <td class="num"><span class="chip gris">no aplica</span></td>
      <td class="num">${H.bolsasTotales}<div style="font-size:11px;color:var(--suave)">${H.bolsasBebidas} bebidas + ${H.coolerGrande} cooler + ${H.reservaColeman} reserva</div></td>
      <td class="num"><span class="chip gris">no se almacena</span></td>
      <td class="num"><b style="font-size:15px">${H.bolsasTotales}</b></td>
      <td class="num">${lineaBase}</td>
      <td class="num">${lineaCosto}${H.comprado?'':'<div style="font-size:11px;color:var(--amar)">No incluido en la cotización</div>'}</td></tr>`;
  })();
  const filas=filaHielo+R.compras.filter(c=>c.consumo>0 && !c.esHielo).map(c=>{
    const p=practica(c.id,c.consumo), bpp=c.basePorPaquete||0;
    const exactos=bpp?c.consumo/bpp:0, objetivoPq=bpp?c.objetivo/bpp:0, existPq=bpp?c.existencias/bpp:0;
    return `<tr><td>${esc(c.nombre)}</td>
      <td class="num">${num(c.consumo, c.consumo<20?2:0)} ${esc(c.unidadBase)}<div style="font-size:11px;color:var(--suave)">${p?num(p[0],2)+' '+p[1]:''}</div></td>
      <td class="num">${bpp?num(exactos,3):'—'}</td>
      <td class="num">${(colch*100).toFixed(0)}%</td>
      <td class="num">${bpp?num(objetivoPq,3):'—'}</td>
      <td class="num">${bpp?num(existPq,2):'—'}<div style="font-size:11px;color:var(--suave)">${num(c.existencias,0)} ${esc(c.unidadBase)}</div></td>
      <td class="num"><b style="font-size:15px">${c.paquetes}</b></td>
      <td class="num">${c.faltaDato?'<span class="chip bad">sin precio</span>':money(c.efectivoHoy)}</td>
      <td class="num">${money(c.costoAsignado)}</td></tr>`;}).join('');
  const bananas=(R.consumos.ingredientes['BANANO']||0)/gBan;
  $('#s-compras').innerHTML=`
  <h2>Compras del evento</h2><p class="pista">A: lo que necesita el evento, en unidades fáciles. B: lo que debo comprar hoy, ya descontando inventario.</p>
  <div class="grid g4" style="margin-bottom:16px">
    <div class="kpi"><div class="et">Efectivo de compra hoy</div><div class="val">${money(R.efectivoCompraHoy)}</div></div>
    <div class="kpi"><div class="et">Costo asignado al evento</div><div class="val">${money(R.costos.baseIngredientes+R.costos.baseEmpaques+R.costos.baseConsumibles)}</div>
      <div class="nota">solo lo que consume</div></div>
    <div class="kpi"><div class="et">Mezclas de masa</div><div class="val">${R.masa.mezclas}</div><div class="nota">${R.masa.crepes} crepes</div></div>
    <div class="kpi"><div class="et">Bananas estimadas</div><div class="val">${num(bananas,0)}</div>
      <div class="nota">${num(bananas/bunch,1)} bunches · ${gBan} g/banana estimado</div></div>
  </div>
  <div class="card"><h3>A + B — cantidad del evento y compra sugerida</h3>
  <div style="overflow-x:auto"><table><thead><tr>
    <th>Insumo</th><th class="num">Consumo requerido del evento</th><th class="num">Paquetes exactos del evento</th>
    <th class="num">Colchón aplicado</th><th class="num">Cantidad objetivo con colchón</th>
    <th class="num">Existencias disponibles</th><th class="num">Paquetes completos a comprar</th>
    <th class="num">Efectivo de compra hoy</th><th class="num">Costo asignado al evento</th></tr></thead>
    <tbody>${filas}</tbody>
    <tr class="tot"><td colspan="7">TOTAL</td><td class="num">${money(R.efectivoCompraHoy)}</td>
      <td class="num">${money(R.costos.baseIngredientes+R.costos.baseEmpaques+R.costos.baseConsumibles)}</td></tr></table></div>
  <div class="banner warn" style="margin-top:14px"><span class="ico">▲</span><div>
    <b>El colchón se aplica a la cantidad consumida antes de redondear a paquetes completos.</b>
    Por ejemplo, 7 paquetes exactos × 1.15 = 8.05; por seguridad se compran 9 paquetes completos.</div></div>
  <p class="pista" style="margin-top:12px"><b>“Paquetes completos a comprar” ya incluye</b> el colchón,
    el descuento de tus existencias y el redondeo hacia arriba. No hay que sumarle nada más.</p>
  <div class="grid g2" style="margin-top:12px">
    <div style="background:var(--arena);border-radius:10px;padding:12px">
      <b>Merma de ingredientes — ${(merma*100).toFixed(0)}%</b>
      <div style="font-size:13px;color:var(--suave);margin-top:4px">Producto que se pierde al preparar: derrames,
        leche cortada, el primer crepe. Ya está dentro del <b>consumo requerido</b> y sí se le cobra al cliente.</div></div>
    <div style="background:var(--arena);border-radius:10px;padding:12px">
      <b>Colchón de inventario — ${(colch*100).toFixed(0)}%</b>
      <div style="font-size:13px;color:var(--suave);margin-top:4px">Reserva que quieres conservar después del evento.
        Solo afecta <b>cuánto compras hoy</b>. Nunca entra al costo del evento ni al precio del cliente.</div></div>
  </div>
  <p class="pista" style="margin-top:10px">Son reglas separadas y no se duplican: la merma infla el consumo,
    el colchón infla la compra. El evento paga solo lo que consume.</p></div>
  ${(()=>{const c=R.cloud; if(!c) return '';
    const fi=M.fichaIngrediente(g(),'CREMA'), fs=M.fichaIngrediente(g(),c.syrupId);
    const nom=id=>{const x=g().ingredientes.find(y=>y.id===id); return x?x.nombre:id;};
    const env=(f,gr)=>f&&!f.faltaDato&&f.basePorPaquete?Math.ceil(gr/f.basePorPaquete-1e-9)+' envases':'<span class="chip warn">falta densidad</span>';
    return `<div class="card"><h3>Cloud del evento — crema y syrup</h3>
      <table>
        <tr><td>Heavy whipping cream requerido</td><td class="num">${num(c.crema,2)} g</td></tr>
        <tr><td>Heavy whipping con ${pct(g().parametros.merma)} de merma</td><td class="num"><b>${num(c.cremaConMerma,2)} g</b></td></tr>
        <tr><td>Envases a comprar</td><td class="num">${env(fi,c.cremaConMerma)}</td></tr>
        <tr><td>${esc(nom(c.syrupId))} requerido</td><td class="num">${num(c.syrup,2)} g</td></tr>
        <tr><td>Syrup con ${pct(g().parametros.merma)} de merma</td><td class="num"><b>${num(c.syrupConMerma,2)} g</b></td></tr>
        <tr><td>Botellas / cases a comprar</td><td class="num">${env(fs,c.syrupConMerma)}</td></tr>
      </table>
      <p class="pista" style="margin-top:10px">Se costean los gramos exactos de crema y syrup. No hay una línea
        “cloud” adicional. Las botellas squeeze no se calculan todavía.</p></div>`;})()}
  ${(()=>{const y=R.syrups; if(!y||!y.activo) return '';
    return `<div class="card"><h3>Syrups Monin <span class="chip warn">modo manual por botellas</span></h3>
      <p class="pista" style="margin:0 0 12px">Se cobran <b>botellas completas</b> asignadas al evento, sin merma
        y sin densidad. El modo calculado por consumo queda <b>pendiente</b> hasta medir las densidades;
        sus campos siguen guardados.</p>
      <div style="overflow-x:auto"><table><thead><tr><th>Syrup</th>
        <th class="num">Botellas requeridas</th><th class="num">Botellas disponibles</th>
        <th class="num">Botellas faltantes</th><th class="num">Cases completos a comprar</th>
        <th class="num">Efectivo de compra</th><th class="num">Costo asignado con 25%</th></tr></thead><tbody>
        ${y.lineas.map(l=>`<tr><td><b>${esc(l.nombre)}</b>
          <div style="font-size:11px;color:var(--suave)">botella de 1 L · ${money(y.costoBotella)} por botella</div></td>
          <td class="num"><input type="number" step="1" style="width:80px;text-align:right" value="${l.requeridas}"
            oninput="mSyrup('${l.id}',this)"></td>
          <td class="num"><input type="number" step="1" style="width:80px;text-align:right" value="${l.disponibles}"
            oninput="mSyrupInv('${l.id}',this)"></td>
          <td class="num">${l.faltantes}</td>
          <td class="num"><b>${l.cases}</b><div style="font-size:11px;color:var(--suave)">${l.botellasCompradas} botellas</div></td>
          <td class="num">${money(l.efectivoHoy)}</td>
          <td class="num">${money(l.costoAsignado)}</td></tr>`).join('')}
      </tbody>
      <tr class="tot"><td>TOTAL — ${y.botellasTotales} botellas para llevar</td>
        <td class="num">${y.botellasTotales}</td><td class="num">—</td><td class="num">—</td>
        <td class="num">${y.casesTotales}</td><td class="num">${money(y.efectivoHoy)}</td>
        <td class="num">${money(y.costoAsignado)}</td></tr></table></div>
      <p class="pista" style="margin-top:12px">El evento paga las <b>${y.botellasTotales} botellas asignadas</b>
        (${money(y.costoBase)} + 25% = ${money(y.costoAsignado)}), no los ${y.casesTotales} cases completos.
        Sobran <b>${y.sobrantes} botellas</b> que quedan como inventario tuyo.</p>
      <div class="fila" style="margin-top:10px"><label style="margin:0">Cargar cases completos al evento</label>
        <select style="width:auto" onchange="mSyrupCase(this)">
          <option ${!g().syrups.cargarCaseCompleto?'selected':''}>No</option>
          <option ${g().syrups.cargarCaseCompleto?'selected':''}>Si</option></select>
        <span class="pista" style="margin:0">Solo para compras especiales que no vas a reutilizar.</span></div>
      </div>`;})()}
  ${(()=>{const h=R.hielo; if(!h) return '';
    return `<div class="card"><h3>Hielo del evento <span class="chip gris">detalle del cálculo</span></h3>
      <p class="pista" style="margin:0 0 12px">Este bloque explica de dónde salen las bolsas de la fila
        <b>Hielo</b> de la tabla de arriba. No agrega ningún costo: el hielo se suma una sola vez.</p>
      ${!h.comprado?`<div class="banner bad" style="margin-bottom:14px"><span class="ico">●</span><div>
        <b>El hielo operativo y de bebidas no está incluido en esta cotización.</b>
        Las cantidades de abajo son solo referencia: efectivo $0 y costo asignado $0.</div></div>`:''}
      <table>
        <tr><td>Hielo de recetas</td><td class="num">${num(h.gramosBebidas,0)} g</td></tr>
        <tr><td>Hielo de recetas en libras</td><td class="num">${num(h.librasBebidas,2)} lb</td></tr>
        <tr><td>Bolsas de 16 lb para bebidas <span class="chip gris">redondeo hacia arriba</span></td>
            <td class="num"><b>${h.bolsasBebidas}</b></td></tr>
        <tr><td>Bolsas para cooler grande</td><td class="num">
          <input type="number" step="1" style="width:90px;text-align:right" value="${h.coolerGrande}"
            oninput="mHielo('coolerGrande',this)"></td></tr>
        <tr><td>Bolsas de reserva Coleman</td><td class="num">
          <input type="number" step="1" style="width:90px;text-align:right" value="${h.reservaColeman}"
            oninput="mHielo('reservaColeman',this)"></td></tr>
        <tr class="tot"><td>Total de bolsas a comprar</td><td class="num">${h.bolsasTotales}</td></tr>
        <tr><td>Costo base (${h.bolsasTotales} × ${money(h.precioBolsa)})</td><td class="num">${money(h.costoBase)}</td></tr>
        <tr class="tot"><td>Costo asignado con ${pct(g().parametros.aumentoInterno)}</td>
            <td class="num">${money(h.costoAsignado)}</td></tr>
      </table>
      <div class="fila" style="margin-top:12px"><label style="margin:0">Hielo comprado para este evento</label>
        <select style="width:auto" onchange="mSet('parametros.hieloComprado',this,'b')">
          <option ${h.comprado?'selected':''}>Si</option><option ${!h.comprado?'selected':''}>No</option></select></div>
      <div class="banner warn" style="margin-top:12px"><span class="ico">▲</span><div>
        El número de bolsas es una <b>planificación</b>. Verifica con termómetro que leche, batter y demás alimentos
        refrigerados permanezcan a <b>41 °F o menos</b> durante transporte y servicio.</div></div>
      <p class="pista" style="margin-top:10px">El hielo es perecedero y específico del evento: se cobran las bolsas
        completas que se llevan, no los gramos servidos. No se le aplica el colchón de inventario del
        ${pct(g().parametros.colchonInventario)} ni la merma sobre las bolsas de cooler y reserva.</p></div>`;})()}
  ${R.consumos.aguaMasa?`<div class="banner warn"><span class="ico">▲</span><div>Agua para la masa: <b>${num(R.consumos.aguaMasa,0)} oz</b>. Llévala, pero no se cobra ni es Agua Primo.</div></div>`:''}`;
};

/* ---------- 4. GUARDADAS ---------- */
P.guardadas=function(){
  const lista=D.cotizaciones();
  $('#s-guardadas').innerHTML=`<h2>Cotizaciones guardadas</h2>
  <div class="fila" style="margin-bottom:14px"><button class="btn" onclick="mNuevaCot()">Crear nueva cotización</button>
    <span class="pista" style="margin:0">Guarda copia congelada: cambiar precios después no altera lo ya guardado.</span></div>
  ${lista.length?`<div class="card"><div style="overflow-x:auto"><table><thead><tr><th>N.º</th><th>Nombre</th><th>Cliente</th>
    <th>Guardada</th><th>Estado</th><th class="num">Precio</th><th class="num">Sales tax</th><th class="num">Total</th>
    <th class="num">Margen</th><th></th></tr></thead><tbody>
    ${lista.map(c=>`<tr${D.cotizacionAbierta===c.id?' style="background:#FBF8F4"':''}>
      <td><b>${c.numero||'—'}</b></td><td>${esc(c.nombre)}</td><td>${esc(c.cliente||'')}</td>
      <td>${new Date(c.guardadaEn).toLocaleString('es')}</td>
      <td><span class="chip ${c.estado==='BLOQUEADA'?'bad':'ok'}">${c.estado==='BLOQUEADA'?'BORRADOR':'LISTA'}</span></td>
      <td class="num">${money(c.resumen.precioFinal)}</td><td class="num">${money(c.resumen.salesTax)}</td>
      <td class="num"><b>${money(c.resumen.total)}</b></td><td class="num">${pct(c.resumen.margen)}</td>
      <td class="num" style="white-space:nowrap"><button class="btn sm sec" onclick="mCargarCot('${c.id}')">Abrir</button>
        <button class="btn sm sec" onclick="mDupCot('${c.id}')">Duplicar</button>
        <button class="btn sm sec" onclick="mDelCot('${c.id}')">Borrar</button></td></tr>`).join('')}
    </tbody></table></div></div>`:'<div class="card"><p class="pista">Todavía no has guardado ninguna cotización.</p></div>'}`;
};
window.mCargarCot=id=>{ const c=D.cotizaciones().find(x=>x.id===id);
  if(c){ D.aplicarCotizacion(c); U.reload(); U.ir('resultado'); } };
window.mDupCot=id=>{ const c=D.cotizaciones().find(x=>x.id===id);
  if(c){ D.aplicarCotizacion(c); D.cotizacionAbierta=null; U.reload(); U.calc();
         D.guardarCotizacion(c.nombre+' (copia)',U.R); U.ir('guardadas'); } };
window.mDelCot=id=>{ const c=D.cotizaciones().find(x=>x.id===id);
  if(confirm('¿Borrar la cotización N.º '+(c?c.numero:'')+' de '+(c?c.cliente||'sin cliente':'')+'? Esta acción no se puede deshacer.')){
    D.borrarCotizacion(id); if(D.cotizacionAbierta===id) D.cotizacionAbierta=null; U.ir('guardadas'); } };

/* ---------- 5. MENU Y RECETAS ---------- */
P.menu=function(){
  const dd=g(), R=r();
  const cols=Object.keys(dd.productos[0].receta);
  const tabla=cat=>`<div class="card"><h3>${cat}</h3><div style="overflow-x:auto"><table><thead><tr><th>Producto</th>
    ${cols.map(c=>`<th class="num">${c}</th>`).join('')}</tr></thead><tbody>
    ${dd.productos.filter(p=>p.categoria===cat).map(p=>`<tr><td>${esc(p.nombre)}${p.archivado?' <span class="chip gris">archivado</span>':''}</td>
      ${cols.map(c=>`<td><input type="number" step="0.01" style="min-width:70px" value="${p.receta[c]??''}" placeholder="vacío"
        oninput="mRec('${p.id}','${c}',this)"></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  const ms=dd.masaCrepes;
  $('#s-menu').innerHTML=`<h2>Menú y recetas</h2>
  <p class="pista">Cantidades por unidad de producto, en la unidad base de cada insumo. Vacío = pendiente (bloquea si el producto está activo).</p>
  <div class="card"><h3>Masa de crepes — ${R.masa.mezclas} mezclas para ${R.masa.crepes} crepes</h3>
    <div class="grid g4" style="margin-bottom:14px">
      <div><label>Crepes por mezcla</label><input type="number" value="${ms.crepesPorMezcla}" oninput="mMasaP('crepesPorMezcla',this)"></div>
      <div><label>Harina: g por taza</label><input type="number" step="0.1" value="${ms.conversiones.gPorTazaHarina}" oninput="mMasaC('gPorTazaHarina',this)"></div>
      <div><label>Azúcar: g por cucharada</label><input type="number" step="0.1" value="${ms.conversiones.gPorCdaAzucar}" oninput="mMasaC('gPorCdaAzucar',this)"></div>
      <div><label>Sal: g por cucharadita</label><input type="number" step="0.1" value="${ms.conversiones.gPorCdtaSal}" oninput="mMasaC('gPorCdtaSal',this)"></div></div>
    <table><thead><tr><th>Componente</th><th class="num">Por mezcla</th><th>Unidad</th><th class="num">Total del evento</th></tr></thead><tbody>
    ${Object.entries(ms.componentes).map(([n,c])=>`<tr><td>${n}${n==='Agua'?' <span class="chip warn">no se cobra</span>':''}</td>
      <td><input type="number" step="0.01" value="${c.porMezcla}" oninput="mMasaX('${n}',this)"></td>
      <td>${esc(c.unidadReceta)}</td><td class="num">${num(R.masa.totales[n],1)} ${esc(c.unidadBase)}</td></tr>`).join('')}
    </tbody></table>
    <p class="pista" style="margin-top:10px">Las mezclas se planifican SIN merma. Los ingredientes se compran CON merma.</p></div>
  ${['Cafe','Matcha','Sparkling','Crepes'].map(tabla).join('')}`;
};
window.mRec=(pid,ing,el)=>{ const p=g().productos.find(x=>x.id===pid);
  p.receta[ing] = el.value===''?null:(parseFloat(el.value)||0); U.calc(); window.mProgramar(); };
window.mMasaP=(k,el)=>{ g().masaCrepes[k]=parseFloat(el.value)||0; U.calc(); window.mProgramar(); };
window.mMasaC=(k,el)=>{ g().masaCrepes.conversiones[k]=parseFloat(el.value)||0; U.calc(); window.mProgramar(); };
window.mMasaX=(n,el)=>{ g().masaCrepes.componentes[n].porMezcla=parseFloat(el.value)||0; U.calc(); window.mProgramar(); };
})();
