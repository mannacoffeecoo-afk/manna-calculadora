/* MANNA — Insumos, inventario y configuracion */
(function(){
'use strict';
const U=window.__ui, M=window.MannaMotor, D=window.MannaDatos;
const {$,money,num,pct,esc}=U; const P=window.PINTAR;
const g=()=>U.d, r=()=>U.R;

/* ---------- 6. INGREDIENTES Y EMPAQUES ---------- */
P.insumos=function(){
  const dd=g(), R=r(), sel=dd.selectores;
  const cons=R.consumos.ingredientes;
  const fil=dd.ingredientes.filter(i=>!i.derivado).map(i=>{
    const f=M.fichaIngrediente(dd,i.id), c=cons[i.id]||0;
    const est = f.faltaDato ? (c>0?'<span class="chip bad">bloquea</span>':'<span class="chip warn">pendiente</span>')
                            : '<span class="chip ok">ok</span>';
    const auto = i.id==='AZUCAR';
    return `<tr><td>${esc(i.nombre)}</td>
      <td><input type="number" step="0.01" value="${f.precioCompra??''}" placeholder="pendiente" ${auto?'readonly':''}
          oninput="mIng('${i.id}','precioCompra',this)"></td>
      <td><input type="number" step="0.001" value="${f.cantPresentacion??''}" placeholder="pendiente" ${auto?'readonly':''}
          oninput="mIng('${i.id}','cantPresentacion',this)"></td>
      <td><input value="${esc(i.unidadPresentacion||'')}" style="min-width:64px" oninput="mIng('${i.id}','unidadPresentacion',this,'t')"></td>
      <td><input type="number" step="0.0001" value="${i.factorBase??''}" oninput="mIng('${i.id}','factorBase',this)"></td>
      <td>${esc(i.unidadBase||'')}</td>
      <td class="num">${f.costoUnitario?('$'+f.costoUnitario.toFixed(6)):'—'}</td>
      <td class="num">${num(c, c<20?2:0)}</td><td>${est}</td></tr>`;}).join('');
  const emp=dd.empaques.map(e=>{
    const f=M.fichaEmpaque(dd,e.id), c=R.consumos.empaques[e.id]||0;
    const est=f.faltaDato?(c>0?'<span class="chip bad">bloquea</span>':'<span class="chip warn">pendiente</span>'):'<span class="chip ok">ok</span>';
    return `<tr><td>${esc(e.nombre)}</td>
      <td><input type="number" step="0.01" value="${e.precioPaquete??''}" placeholder="pendiente" oninput="mEmp('${e.id}','precioPaquete',this)"></td>
      <td><input type="number" value="${e.unidadesPorPaquete??''}" placeholder="pendiente" oninput="mEmp('${e.id}','unidadesPorPaquete',this)"></td>
      <td class="num">${f.costoUnitario?('$'+f.costoUnitario.toFixed(5)):'—'}</td>
      <td class="num">${f.costoUnitario?('$'+(f.costoUnitario*(1+dd.parametros.aumentoInterno)).toFixed(5)):'—'}</td>
      <td class="num">${num(c,0)}</td><td>${est}</td></tr>`;}).join('');
  const sumaPulpa=Object.values(sel.pulpa).reduce((a,o)=>a+(o.pct||0),0);
  const syrups=(dd.ingredientes||[]).filter(i=>i.proveedorSyrup);
  const pv=n=>M.proveedorSyrup(dd,n);
  const hayProv=!!(dd.proveedoresSyrup && pv('WebstaurantStore') && pv('Amazon'));
  const cmp=['WebstaurantStore','Amazon'].map(n=>{const p=pv(n); return p?`<tr>
      <td><b>${esc(n)}</b></td><td class="num">${p.cases}</td><td class="num">${money(p.precioProductos)}</td>
      <td class="num">${money(p.shippingTotal)}</td><td class="num">${money(p.taxCompra)}</td>
      <td class="num">${money(p.totalEntregado)}</td>
      <td class="num"><b>${money(p.costoEntregadoCase)}</b></td><td class="num">${money(p.costoPorLitro)}</td>
      <td class="num">$${p.costoPorMl.toFixed(9)}</td><td class="num">${money(p.costoCaseConAumento)}</td></tr>`:'';}).join('');
  const a=hayProv?pv('Amazon'):null, w=hayProv?pv('WebstaurantStore'):null;
  const ahorroCase=a&&w?a.costoEntregadoCase-w.costoEntregadoCase:0;
  const ahorro3=a&&w?a.costoEntregadoCase*3-w.totalEntregado:0;
  $('#s-insumos').innerHTML=`<h2>Ingredientes y empaques</h2>
  <p class="pista">Esta es la única tabla donde se editan precios. El costo unitario se calcula solo.</p>
  <div class="card"><h3>Selectores de insumo</h3><div class="grid g3">
    <div><label>Tipo de matcha</label><select onchange="mSel('matcha',this)">
      ${Object.keys(sel.matcha.opciones).map(o=>`<option ${sel.matcha.activo===o?'selected':''}>${o}</option>`).join('')}</select></div>
    <div><label>Proveedor de fresas</label><select onchange="mSel('fresa',this)">
      ${Object.keys(sel.fresa.opciones).map(o=>`<option ${sel.fresa.activo===o?'selected':''}>${o}</option>`).join('')}</select></div>
    <div><label>Proveedor de azúcar</label><select onchange="mSel('azucar',this)">
      ${sel.azucar.opciones.map(o=>`<option ${sel.azucar.activo===o.nombre?'selected':''}>${esc(o.nombre)}</option>`).join('')}</select></div>
  </div>
  <h3 style="margin-top:18px">Sabores de pulpa — deben sumar 100%</h3>
  <div class="grid g4">${Object.entries(sel.pulpa).map(([n,o])=>
    `<div><label>${esc(n)}</label><input type="number" step="1" value="${((o.pct||0)*100).toFixed(0)}"
      class="${Math.abs(sumaPulpa-1)>1e-4?'pct-mal':''}" oninput="mPulpa('${n}',this)"></div>`).join('')}</div>
  <div class="suma" style="color:${Math.abs(sumaPulpa-1)>1e-4?'var(--rojo)':'var(--verde)'}">Suma: ${(sumaPulpa*100).toFixed(0)}%</div></div>
  ${!hayProv?'':`<div class="card"><h3>Proveedores de syrup Monin</h3>
    <div style="overflow-x:auto"><table><thead><tr><th>Proveedor</th><th class="num">Cases</th>
      <th class="num">Producto</th><th class="num">Shipping</th><th class="num">Tax compra</th>
      <th class="num">Total entregado</th><th class="num">Costo entregado / case 4 L</th>
      <th class="num">$ / L</th><th class="num">$ / ml</th><th class="num">Case con 25%</th></tr></thead>
      <tbody>${cmp}</tbody></table></div>
    <div class="banner ok" style="margin-top:12px"><span class="ico">●</span><div>
      Ahorro real por case antes del 25%: <b>${money(ahorroCase)}</b> · por tres cases: <b>${money(ahorro3)}</b>
      (<b>${((ahorro3/(a.costoEntregadoCase*3))*100).toFixed(2)}%</b> menos). El 25% interno no cambia cuál conviene.</div></div>
    <p class="pista" style="margin-top:10px">${esc((w&&w.nota)||'')}</p>
    <p class="pista">El shipping y el tax de compra ya están dentro del costo entregado. No se vuelven a sumar en otros gastos,
      transporte, lista de compras ni en el sales tax que se cobra al cliente.</p>
    <h3 style="margin-top:18px">Proveedor por sabor</h3>
    <div class="grid g2">${syrups.map(i=>{const p=pv(i.proveedorSyrup)||{costoEntregadoCase:0,litrosPorCase:0}; const f=M.fichaIngrediente(dd,i.id);
      return `<div><label>${esc(i.nombre)}</label>
        <select onchange="mProvSyr('${i.id}',this)">${['WebstaurantStore','Amazon'].map(n=>
          `<option ${i.proveedorSyrup===n?'selected':''}>${n}</option>`).join('')}</select>
        <div style="font-size:12px;color:var(--suave);margin-top:4px">
          ${money(p.costoEntregadoCase)} / ${p.litrosPorCase} L · ${f.faltaDato?'<span class="chip warn">falta densidad</span>':'$'+f.costoUnitario.toFixed(8)+' / '+esc(i.unidadBase)}</div></div>`;}).join('')}</div>
  </div>`}
  <div class="card"><h3>Ingredientes</h3><div style="overflow-x:auto"><table><thead><tr>
    <th>Ingrediente</th><th>Precio compra</th><th>Cantidad</th><th>Unidad</th><th>Factor a unidad base</th>
    <th>Unidad base</th><th class="num">Costo unitario</th><th class="num">Consumo del evento</th><th>Estado</th>
    </tr></thead><tbody>${fil}</tbody></table></div></div>
  <div class="card"><h3>Empaques</h3><div style="overflow-x:auto"><table><thead><tr>
    <th>Empaque</th><th>Precio paquete</th><th>Unidades por paquete</th><th class="num">Costo unitario</th>
    <th class="num">Con +25%</th><th class="num">Consumo</th><th>Estado</th></tr></thead><tbody>${emp}</tbody></table></div></div>`;
};
window.mIng=(id,campo,el,t)=>{ const i=g().ingredientes.find(x=>x.id===id);
  i[campo]= t==='t' ? el.value : (el.value===''?null:parseFloat(el.value)); U.calc(); window.mProgramar(); };
window.mEmp=(id,campo,el)=>{ const e=g().empaques.find(x=>x.id===id);
  e[campo]= el.value===''?null:parseFloat(el.value); U.calc(); window.mProgramar(); };
window.mProvSyr=(id,el)=>{ g().ingredientes.find(x=>x.id===id).proveedorSyrup=el.value; U.calc(); window.mRender(); };
window.mSel=(k,el)=>{ g().selectores[k].activo=el.value; U.calc(); window.mProgramar(); };
window.mPulpa=(n,el)=>{ g().selectores.pulpa[n].pct=(parseFloat(el.value)||0)/100; U.calc(); window.mProgramar(); };

/* ---------- 7. INVENTARIO ---------- */
let filtroInv='todos';
window.mFiltroInv=f=>{ filtroInv=f; window.mRender(); };
P.inventario=function(){
  const dd=g(), R=r();
  const pasa=c=>({todos:1,ingredientes:c.tipo==='Ingrediente',empaques:c.tipo==='Empaque',
    consumibles:c.tipo==='Consumible',existencias:c.existencias>0,faltantes:c.conColchon>0}[filtroInv]);
  const filas=R.compras.filter(pasa).sort((a,b)=>(b.consumo>0)-(a.consumo>0)||a.nombre.localeCompare(b.nombre)).map(c=>{
    const up=M.unidadPractica(dd,c.id), f=up.factor;
    return `<tr${c.sinUso?' style="opacity:.62"':''}>
      <td>${esc(c.nombre)}${c.soloReferencia?' <span class="chip warn">referencia</span>':''}</td>
      <td><span class="chip gris">${esc(c.tipo)}</span></td>
      <td class="num">${num(c.consumo/f, 2)} ${esc(up.nombre)}</td>
      <td><input type="number" step="0.01" style="min-width:88px" value="${(c.existencias/f).toFixed(2)}"
          oninput="mInvP('${c.id}',this,${f})"><div style="font-size:11px;color:var(--suave)">${esc(up.nombre)}</div></td>
      <td class="num">${num(c.objetivo/f,2)}</td>
      <td class="num">${num(c.conColchon/f,2)}</td>
      <td class="num"><b>${c.paquetes}</b></td>
      <td class="num">${c.faltaDato&&c.consumo>0?'<span class="chip bad">sin precio</span>':money(c.efectivoHoy)}</td>
      <td class="num">${money(c.costoAsignado)}</td>
      <td><select onchange="mInvB('${c.id}',this)"><option ${!c.cargarPaqueteCompleto?'selected':''}>No</option>
        <option ${c.cargarPaqueteCompleto?'selected':''}>Si</option></select></td></tr>`;}).join('');
  const btn=(k,n)=>`<button class="btn sm ${filtroInv===k?'':'sec'}" onclick="mFiltroInv('${k}')">${n}</button>`;
  $('#s-inventario').innerHTML=`<h2>Inventario</h2>
  <p class="pista">Ingresa lo que tienes en bodega, en unidades prácticas. La conversión interna es exacta.</p>
  <div class="banner warn"><span class="ico">▲</span><div><b>Efectivo de compra hoy</b> es lo que sacas de la caja: descuenta lo que ya tienes y suma el colchón.
    <b>Costo asignado al evento</b> es lo que consume el evento, lo tengas en bodega o no. El evento paga lo que consume;
    tener stock te ahorra caja hoy, no le baja el precio al cliente.</div></div>
  <div class="card">
    <div class="fila" style="margin-bottom:14px">
      <label style="margin:0">Colchón de inventario %</label>
      <input type="number" step="1" style="width:100px" value="${((dd.parametros.colchonInventario||0)*100).toFixed(0)}"
        oninput="mSet('parametros.colchonInventario',this,'p')">
      <span class="pista" style="margin:0">Lo que quiero conservar <b>después</b> del evento. Objetivo = consumo × (1 + colchón).</span></div>
    <div class="fila" style="margin-bottom:12px">${btn('todos','Todos')}${btn('ingredientes','Ingredientes')}${btn('empaques','Empaques')}${btn('consumibles','Consumibles')}${btn('existencias','Solo con existencias')}${btn('faltantes','Solo faltantes')}</div>
  <div style="overflow-x:auto"><table><thead><tr><th>Insumo</th><th>Tipo</th><th class="num">Consume el evento</th>
    <th>Existencias actuales</th><th class="num">Objetivo antes del evento</th><th class="num">Faltante</th>
    <th class="num">Paquetes a comprar</th><th class="num">Efectivo hoy</th><th class="num">Costo al evento</th>
    <th>Cargar paquete completo</th></tr></thead><tbody>${filas}</tbody>
    <tr class="tot"><td colspan="7">TOTALES</td><td class="num">${money(R.efectivoCompraHoy)}</td>
      <td class="num">${money(R.costos.baseIngredientes+R.costos.baseEmpaques+R.costos.baseConsumibles)}</td><td></td></tr></table></div>
  <p class="pista" style="margin-top:12px">El inventario no se descuenta solo al guardar una cotización: un evento puede cancelarse.</p></div>`;
};
window.mInvP=(id,el,f)=>{ if(!g().inventario[id]) g().inventario[id]={existencias:0,cargarPaqueteCompleto:false,tipo:'Ingrediente'};
  g().inventario[id].existencias=(parseFloat(el.value)||0)*f; U.calc(); window.mProgramar(); };
window.mInvB=(id,el)=>{ if(!g().inventario[id]) g().inventario[id]={existencias:0,cargarPaqueteCompleto:false,tipo:'Ingrediente'};
  g().inventario[id].cargarPaqueteCompleto=el.value==='Si'; U.calc(); window.mRender(); };

/* ---------- 8. CONFIGURACION ---------- */
P.config=function(){
  const dd=g(), p=dd.parametros;
  const campo=(k,n,tipo,ayuda)=>`<div><label>${n} ${ayuda?`<span class="ayuda" title="${esc(ayuda)}">?</span>`:''}</label>
    ${tipo==='b'?`<select onchange="mSet('parametros.${k}',this,'b')"><option ${p[k]?'selected':''}>Si</option><option ${!p[k]?'selected':''}>No</option></select>`
    :tipo==='s'?`<select onchange="mSet('parametros.${k}',this)">${['Sin redondeo','Proximo $1','Proximo $5'].map(o=>`<option ${p[k]===o?'selected':''}>${o}</option>`).join('')}</select>`
    :`<input type="number" step="${tipo==='p'?0.5:0.01}" value="${tipo==='p'?((p[k]||0)*100).toFixed(1):p[k]}" oninput="mSet('parametros.${k}',this,'${tipo}')">`}</div>`;
  $('#s-config').innerHTML=`<h2>Configuración</h2>
  <div class="card" style="border-left:4px solid var(--amar);border-radius:0 12px 12px 0">
    <h3>Si moviste la carpeta de la app</h3>
    <p class="pista" style="margin-bottom:10px">Tus cotizaciones, inventario y precios editados se guardan en el
      <b>navegador</b>, no en la carpeta. Según el navegador, al abrir la app desde otra ruta esos datos pueden no
      aparecer. No se pierden: siguen en la ubicación anterior.</p>
    <p class="pista" style="margin-bottom:10px"><b>Antes de mudarte:</b> abre la app en la carpeta vieja →
      Configuración → <b>Exportar respaldo</b>. Luego abre la app en la carpeta nueva →
      <b>Importar respaldo</b> → elige el archivo. Listo.</p>
    <div class="fila">
      <button class="btn" onclick="MannaDatos.exportar()">Exportar respaldo (.json)</button>
      <label class="btn" style="margin:0;cursor:pointer">Importar respaldo
        <input type="file" accept=".json" style="display:none" onchange="mImportar(this)"></label>
      <span class="pista" style="margin:0">Cotizaciones guardadas: <b>${MannaDatos.cotizaciones().length}</b></span></div>
  </div>
  <div class="card"><h3>Esta cotización</h3>
    <p class="pista">Estos valores son de <b>este evento</b>. Los de abajo son los predeterminados para cotizaciones nuevas.</p>
    <div class="grid g3">
      <div><label>Aumento de insumos para este evento %</label>
        <input type="number" step="1" min="0" value="${dd.evento.aumentoInsumos==null?'':(dd.evento.aumentoInsumos*100).toFixed(1)}"
          oninput="mSet('evento.aumentoInsumos',this,'p')">
        <div style="font-size:12px;color:var(--suave);margin-top:4px">Porcentaje aplicado al costo consumido de
          ingredientes, empaques y consumibles. Es independiente del margen objetivo. 0% es válido.</div></div>
      <div><label>Aplicar sales tax</label>
        <select onchange="mSet('evento.aplicarSalesTax',this,'b')">
          <option ${dd.evento.aplicarSalesTax!==false?'selected':''}>Si</option>
          <option ${dd.evento.aplicarSalesTax===false?'selected':''}>No</option></select>
        <div style="font-size:12px;color:var(--suave);margin-top:4px">Se suma después del precio final y no forma
          parte del margen.</div></div>
      <div><label>Sales tax %</label>
        <input type="number" step="0.5" min="0" value="${dd.evento.salesTaxPct==null?'':(dd.evento.salesTaxPct*100).toFixed(1)}"
          oninput="mSet('evento.salesTaxPct',this,'p')" ${dd.evento.aplicarSalesTax===false?'disabled':''}></div>
      ${dd.evento.aplicarSalesTax===false?`<div style="grid-column:1/-1"><label>Motivo interno para no aplicar sales tax</label>
        <input value="${esc(dd.evento.motivoSinTax||'')}" oninput="mSet('evento.motivoSinTax',this)"
          placeholder="Solo para tu registro. No se muestra al cliente."></div>`:''}
      <div><label>Tipo de vaso frío de 12 oz</label>
        <select onchange="mSet('evento.vasoFrio12',this)">
          ${(dd.vasosFrios12&&dd.vasosFrios12.opciones||[]).map(o=>
            `<option value="${o.id}" ${dd.evento.vasoFrio12===o.id?'selected':''}>${esc(o.nombre)}</option>`).join('')}</select>
        <div style="font-size:12px;color:var(--suave);margin-top:4px">Solo se cobra un vaso por bebida. La tapa de
          98 mm se suma aparte y no se duplica.</div></div>
    </div>
    ${dd.evento.aplicarSalesTax===false?`<div class="banner warn" style="margin-top:12px"><span class="ico">▲</span><div>
      El sales tax está <b>desactivado</b> en esta cotización. El cliente paga solo el precio final.
      Tú decides si el evento está exento; la calculadora no lo determina.</div></div>`:''}
  </div>
  <div class="card"><h3>Predeterminados para cotizaciones nuevas</h3><div class="grid g3">
    ${campo('margenObjetivo','Margen objetivo %','p','Precio = costos ÷ (1 − margen − comisión).')}
    ${campo('comisionPago','Comisión de pago %','p','Se resta en el divisor para no crear referencia circular.')}
    ${campo('salesTax','Sales tax %','p','Va aparte: no entra al precio neto ni al margen.')}
    ${campo('minimoEvento','Mínimo de evento $','n','Piso de precio, no un costo.')}
    ${campo('aplicarMinimo','Aplicar mínimo de evento','b')}
    ${campo('redondeo','Redondeo del precio final','s')}
    ${campo('aumentoInterno','Aumento interno de insumos %','p','Solo a ingredientes y empaques. NUNCA a labor, transporte, dueños ni impuesto.')}
    ${campo('incluirDuenos','Incluir pago de dueños en el costo','b')}
  </div></div>
  <div class="card"><h3>Producción y compras</h3><div class="grid g3">
    ${campo('merma','Merma de ingredientes %','p','Aumenta el consumo y el costo de ingredientes.')}
    ${campo('reservaEmpaques','Reserva de empaques %','p','Separada de la merma. Solo desechables. Inicial 0%.')}
    ${campo('colchonInventario','Colchón de inventario %','p','Aumenta solo la compra, nunca el costo cotizado.')}
    ${campo('hieloComprado','Hielo comprado para este evento','b')}
  </div></div>
  <div class="card"><h3>Datos y respaldos</h3>
  <p class="pista">Todo se guarda en este navegador. El Excel original nunca se modifica.</p>
  <div class="bloq aviso" style="margin-bottom:14px"><div class="t">▲ Tus datos viven solo en este navegador</div>
    <div class="m">Los datos se guardan en este navegador. Exporta un respaldo regularmente y antes de
      cambiar de dispositivo, borrar datos del navegador o importar otra configuración.</div>
    <div class="m">Cada teléfono, computadora y navegador guarda su propia copia: lo que edites aquí no
      cambia lo que vea otra persona, y lo que ella edite no cambia lo tuyo.</div></div>
  <div class="fila"><button class="btn" onclick="MannaDatos.exportar()">Exportar respaldo (.json)</button>
    <label class="btn sec" style="margin:0;cursor:pointer">Importar respaldo
      <input type="file" accept=".json" style="display:none" onchange="mImportar(this)"></label>
    <button class="btn sec" onclick="mRestaurar()">Restaurar datos originales del Excel</button>
    </div>
    <p class="pista" style="margin:12px 0 0">Versión de la app ${esc(dd.meta.version||'—')} · revisión de datos ${dd.meta.semillaRev||'—'}</p></div>`;
};
window.mImportar=el=>{ const f=el.files[0]; if(!f) return; const rd=new FileReader();
  rd.onload=()=>{ try{ MannaDatos.importar(rd.result); location.reload(); }catch(e){ alert('Archivo no válido.'); } };
  rd.readAsText(f); };
window.mRestaurar=()=>{ if(confirm('¿Restaurar los datos originales migrados del Excel? Se perderán tus cambios.')){
  MannaDatos.restaurarSemilla(); location.reload(); } };
})();
