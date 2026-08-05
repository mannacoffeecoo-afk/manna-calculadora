/* MANNA — Interfaz. Solo presentacion y eventos; los calculos viven en motor.js */
(function () {
'use strict';
const D = window.MannaDatos, M = window.MannaMotor;
let d = D.cargar(), R = null;
const $ = s => document.querySelector(s);
const money = n => (n==null||isNaN(n)) ? '—' : '$' + Number(n).toLocaleString('es-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const num = (n,dec=1) => (n==null||isNaN(n)) ? '—' : Number(n).toLocaleString('es-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
const pct = n => (n==null||isNaN(n)) ? '—' : (n*100).toFixed(2) + '%';
const esc = s => String(s??'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const SECS = [['cotizar','Cotizar evento'],['resultado','Resultado y propuesta'],['compras','Compras del evento'],
  ['guardadas','Cotizaciones guardadas'],['menu','Menú y recetas'],['signatures','Signature Drinks'],['insumos','Ingredientes y empaques'],
  ['inventario','Inventario'],['config','Configuración']];
let actual = 'cotizar';

function ir(k){ actual=k;
  document.querySelectorAll('section').forEach(s=>s.classList.remove('on'));
  $('#s-'+k).classList.add('on');
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on', b.dataset.k===k));
  window.scrollTo(0,0); pintar();
}
function calc(){ R = M.cotizar(d); D.sucio = true; D.guardar();
  $('#estadoTop').innerHTML = R.estado==='BLOQUEADA'
    ? '<b style="color:#FFC9C4">● BLOQUEADA — '+R.bloqueos.length+' por corregir</b>'
    : '<b style="color:#B6E8C9">● LISTA PARA ENVIAR</b>';
  return R; }
function set(ruta, val){ const p=ruta.split('.'); let o=d; for(let i=0;i<p.length-1;i++) o=o[p[i]];
  o[p[p.length-1]] = val; calc(); window.mProgramar(); }
window.mSet = (ruta,el,tipo)=>{ let v = el.value;
  if(tipo==='n') v = parseFloat(v)||0; else if(tipo==='p') v = (parseFloat(v)||0)/100;
  else if(tipo==='b') v = el.value==='Si';
  const p=ruta.split('.'); let o=d; for(let i=0;i<p.length-1;i++) o=o[p[i]];
  o[p[p.length-1]]=v; calc();
  if(el.tagName==='SELECT') window.mRender(); else window.mProgramar(); };

/* ---------- 1. COTIZAR ---------- */
function vCotizar(){
  const ev=d.evento, P=d.parametros;
  const cats=[['Cafe','Café'],['Matcha','Matcha'],['Sparkling','Sparkling water'],['Crepes','Crepes']];
  const perfil = cats.map(([c,n])=>{
    const prods=d.productos.filter(p=>p.categoria===c && !p.archivado);
    const suma=prods.reduce((a,p)=>a+(p.pctPerfil||0),0);
    const tot=R.totalesCategoria[c]||0, mal=tot>0 && Math.abs(suma-1)>1e-4;
    return `<div class="card"><h3>${n} — ${tot} unidades</h3>
      ${prods.map(p=>`<div class="fila" style="margin-bottom:8px">
        <div style="flex:1">${esc(p.nombre)}</div>
        <div style="width:110px"><input type="number" step="0.1" value="${((p.pctPerfil||0)*100).toFixed(1)}"
          class="${mal?'pct-mal':''}" oninput="mProd('${p.id}',this)"></div>
        <div style="width:70px;text-align:right;color:var(--suave)">${R.unidades[p.id]||0} u</div></div>`).join('')}
      <div class="suma" style="color:${mal?'var(--rojo)':'var(--verde)'}">
        Suma: ${(suma*100).toFixed(1)}% ${mal?'— ⚠ debe ser exactamente 100%':'✓'}</div></div>`;
  }).join('');
  const GASTOS=[['transporte','Transporte'],['gasolina','Gasolina'],['estacionamiento','Estacionamiento'],
    ['rentaEquipo','Renta de equipo'],['permisos','Permisos'],['gasPropano','Gas / propano'],
    ['entrega','Entrega'],['contingencia','Contingencia'],['otroPersonalizado','Otro gasto personalizado']];
  const tarjetaGastos = ()=>{
    if(!ev.otrosGastos || typeof ev.otrosGastos!=='object') ev.otrosGastos={};
    GASTOS.forEach(([k])=>{ if(typeof ev.otrosGastos[k]!=='number') ev.otrosGastos[k]=Number(ev.otrosGastos[k])||0; });
    const tot=GASTOS.reduce((a,[k])=>a+(ev.otrosGastos[k]||0),0);
    return `<div class="card"><h3>Otros gastos del evento</h3>
      <p class="pista">Un campo vacío cuenta como $0. Escribe el número completo: se aplica al salir del campo o con Enter.</p>
      <div class="grid g3">${GASTOS.map(([k,n])=>`<div><label>${n}</label>
        <input type="number" step="0.01" inputmode="decimal" value="${ev.otrosGastos[k]||0}"
          oninput="mGasto('${k}',this)"></div>`).join('')}
        <div><label>Agua Primo (garrafones)</label>
          <input type="number" step="1" value="${ev.aguaPrimo||0}" oninput="mSet('evento.aguaPrimo',this,'n')"></div>
      </div>
      <div style="margin-top:12px"><label>Nota del gasto personalizado</label>
        <input value="${esc(ev.otroGastoNota||'')}" placeholder="Para qué es ese gasto"
          oninput="mSet('evento.otroGastoNota',this)"></div>
      <p class="pista" style="margin:12px 0 0">El <b>hielo ya no se pone aquí</b>: sale del cálculo de receta con el
        selector “Hielo comprado”. Ponerlo en los dos lados lo cobraría dos veces.</p>
      <div class="fila" style="margin-top:10px"><span class="chip gris">Total otros gastos</span>
        <b>${money(tot)}</b></div></div>`;
  };
  const ET=M.ETAPAS, ETT=M.ETAPAS_TITULO;
  const filaPersona=(p,i,ruta)=>`<tr>
      <td data-t="Persona"><input value="${esc(p.nombre||'')}" placeholder="Nombre" oninput="mLab('${ruta}',${i},'nombre',this,'t')"></td>
      <td data-t="Rol"><input value="${esc(p.rol||'')}" placeholder="Rol" oninput="mLab('${ruta}',${i},'rol',this,'t')"></td>
      <td data-t="$ / hora"><input type="number" step="0.01" inputmode="decimal" value="${p.tarifa??''}" placeholder="vacío"
          oninput="mLab('${ruta}',${i},'tarifa',this,'n')" ${p.sinTarifa?'style="border-color:var(--rojo);background:var(--rojo-bg)"':''}></td>
      ${ET.map(e=>e==='servicio'
        ? `<td data-t="${ETT[e]}"><input type="number" value="${p.horas.servicio||0}" readonly
             style="background:var(--arena);color:var(--suave)" title="Automático: igual a las horas presenciales del evento"></td>`
        : `<td data-t="${ETT[e]}"><input type="number" step="0.25" inputmode="decimal" value="${p.horas[e]||0}"
             oninput="mLabH('${ruta}',${i},'${e}',this)"></td>`).join('')}
      <td data-t="Horas totales" class="num"><b>${p.horasTotales}</b></td>
      <td data-t="Costo" class="num">${money(p.costo)}</td>
      <td data-t="Estado">${p.sinTarifa?'<span class="chip bad">falta tarifa</span>'
        :p.horasTotales>0?'<span class="chip ok">OK</span>':'<span class="chip gris">sin horas</span>'}</td>
      <td data-t="Presente" style="text-align:center"><select style="width:auto" onchange="mPres('${ruta}',${i},this)">
        <option ${p.presenteServicio?'selected':''}>Si</option><option ${!p.presenteServicio?'selected':''}>No</option></select></td>
      <td class="num"><button class="btn sm sec" onclick="mDelPers('${ruta}',${i})" title="Eliminar">✕</button></td></tr>`;
  const bloqueLabor=(lista,ruta,titulo,total,horas,etiqueta)=>`
    <div style="font-weight:600;color:var(--cafe2);margin:${ruta==='duenos'?'22px':'0'} 0 8px">${titulo}</div>
    <div style="overflow-x:auto"><table class="labor"><thead><tr>
      <th>Persona</th><th>Rol</th><th>$ / hora</th>${ET.map(e=>`<th>${ETT[e]}</th>`).join('')}
      <th class="num">Horas totales</th><th class="num">Costo</th><th>Estado</th>
      <th style="text-align:center">Presente en servicio</th><th></th></tr></thead>
      <tbody>${lista.map((p,i)=>filaPersona(p,i,ruta)).join('')}</tbody>
      <tfoot><tr class="tot"><td colspan="10">${etiqueta}</td>
        <td class="num">${horas}</td><td class="num">${money(total)}</td><td colspan="3"></td></tr></tfoot></table></div>
    <button class="btn sm sec" style="margin-top:10px" onclick="mAddPers('${ruta}')">+ Agregar ${ruta==='duenos'?'dueño':'empleado'}</button>`;
  $('#s-cotizar').innerHTML = `
  <h2>Cotizar evento</h2><p class="pista">Llena solo lo necesario. Todo lo demás se calcula solo.</p>
  ${D.avisoMigracion?`<div class="banner warn"><span class="ico">▲</span><div>${esc(D.avisoMigracion)}
    <button class="btn sm sec" style="margin-left:10px" onclick="MannaDatos.avisoMigracion=null;mRender()">Entendido</button></div></div>`:''}
  <div class="fila noimp" style="margin-bottom:14px"><button class="btn sec" onclick="mNuevaCot()">Nueva cotización</button>
    <span class="pista" style="margin:0">Limpia el evento y conserva precios, recetas, personas y tarifas.</span></div>
  ${R.estado==='BLOQUEADA'
    ? `<div class="banner bad"><span class="ico">●</span><div>Hay ${R.bloqueos.length} ${R.bloqueos.length===1?'cosa':'cosas'} por corregir.
        <button class="btn sm sec" style="margin-left:10px" onclick="mIr('resultado')">Ver cómo resolverlo</button></div></div>`
    : `<div class="banner ok"><span class="ico">●</span><div>Sin bloqueos. Precio final ${money(R.precio.precioFinal)}.
        <button class="btn sm sec" style="margin-left:10px" onclick="mIr('resultado')">Ver resultado</button></div></div>`}
  <div class="card"><h3>Datos del evento</h3><div class="grid g3">
    <div><label>Cliente</label><input value="${esc(ev.cliente||'')}" oninput="mSet('evento.cliente',this)"></div>
    <div><label>Fecha</label><input type="date" value="${esc(ev.fecha||'')}" oninput="mSet('evento.fecha',this)"></div>
    <div><label>Lugar</label><input value="${esc(ev.lugar||'')}" oninput="mSet('evento.lugar',this)"></div>
    <div><label>Invitados</label><input type="number" value="${ev.invitados||0}" oninput="mSet('evento.invitados',this,'n')"></div>
    <div><label>Horas presenciales</label><input type="number" step="0.5" value="${ev.horas||0}" oninput="mSet('evento.horas',this,'n')"></div>
    <div><label>Transporte $</label><input type="number" step="0.01" value="${ev.otrosGastos.transporte||0}" oninput="mSet('evento.otrosGastos.transporte',this,'n')"></div>
    <div><label>Aplicar mínimo de evento <span class="ayuda" title="El mínimo es un piso de precio, no un costo.">?</span></label>
      <select onchange="mSet('parametros.aplicarMinimo',this,'b')"><option ${P.aplicarMinimo?'selected':''}>Si</option><option ${!P.aplicarMinimo?'selected':''}>No</option></select></div>
    <div><label>Hielo comprado <span class="ayuda" title="No = se muestra la cantidad pero no se cobra ni bloquea.">?</span></label>
      <select onchange="mSet('parametros.hieloComprado',this,'b')"><option ${P.hieloComprado?'selected':''}>Si</option><option ${!P.hieloComprado?'selected':''}>No</option></select></div>
    <div><label>Margen objetivo %</label><input type="number" step="0.5" value="${((P.margenObjetivo||0)*100).toFixed(1)}" oninput="mSet('parametros.margenObjetivo',this,'p')"></div>
  </div>
  </div></div>
  ${tarjetaGastos()}
  <div class="card"><h3>Consumo promedio por persona</h3><div class="grid g4">
    ${[['cafe','Café'],['matcha','Matcha'],['sparkling','Sparkling water'],['crepes','Crepes']].map(([k,n])=>
      `<div><label>${n} por persona</label><input type="number" step="0.25" value="${ev.porPersona[k]||0}" oninput="mSet('evento.porPersona.${k}',this,'n')">
       <div class="nota" style="font-size:12px;color:var(--suave);margin-top:4px">${R.totalesCategoria[k==='cafe'?'Cafe':k==='matcha'?'Matcha':k==='sparkling'?'Sparkling':'Crepes']||0} unidades</div></div>`).join('')}
  </div></div>
  ${window.mTarjetaSignature?window.mTarjetaSignature():''}
  <h3 style="margin-top:22px">Perfil de productos — cada categoría debe sumar 100%</h3>
  <div class="grid g2">${perfil}</div>
<div class="card"><h3>Mano de obra <span class="chip gris">hoja Labor del Excel</span></h3>
    <p class="pista">Esta tabla es la única fuente de los datos de mano de obra. Las horas de <b>Servicio presencial</b>
      son automáticas e iguales a las horas presenciales del evento (${ev.horas||0} h) para quien esté marcado como presente.</p>
    ${bloqueLabor(R.labor.empleados,'empleados','A.  EMPLEADOS',R.costos.labor,R.labor.horasEmpleados,'TOTAL EMPLEADOS')}
    ${bloqueLabor(R.labor.duenos,'duenos','B.  COMPENSACIÓN DE DUEÑOS <span class="chip gris">sección separada</span>',R.costos.duenos,R.labor.horasDuenos,'TOTAL DUEÑOS')}
    <div class="fila" style="margin-top:16px"><label style="margin:0">Incluir pago de dueños en el costo</label>
      <select style="width:auto" onchange="mSet('parametros.incluirDuenos',this,'b')">
        <option ${P.incluirDuenos?'selected':''}>Si</option><option ${!P.incluirDuenos?'selected':''}>No</option></select>
      <span class="pista" style="margin:0">No = se tratan como distribución de utilidades.</span>
      <span style="margin-left:auto"><span class="chip gris">COSTO TOTAL DE MANO DE OBRA</span>
        <b style="font-size:16px">${money(R.costos.labor + R.costos.duenos)}</b></span></div>
    <div style="margin-top:18px;border-top:1px solid var(--linea);padding-top:12px">
      <div style="font-weight:600;color:var(--cafe2);margin-bottom:8px">C.  VERIFICACIÓN</div>
      <table><tbody>
        <tr><td>Personas con horas asignadas y SIN tarifa</td><td class="num">${R.labor.verificacion.personasSinTarifa}</td></tr>
        <tr><td>Horas de compras + preparación + desmontaje/limpieza</td><td class="num">${R.labor.verificacion.horasLogistica}</td></tr>
        <tr><td>Horas de servicio presencial asignadas</td><td class="num">${R.labor.verificacion.horasServicio}</td></tr>
        <tr><td>Personas en servicio</td><td class="num">${R.labor.verificacion.personasEnServicio}</td></tr>
        <tr><td>Horas presenciales requeridas (duración × personas en servicio)</td><td class="num">${R.labor.verificacion.horasPresencialesRequeridas}</td></tr>
      </tbody></table></div>
  </div>`;
}
window.mProd = (id,el)=>{ const p=d.productos.find(x=>x.id===id); p.pctPerfil=(parseFloat(el.value)||0)/100; calc(); window.mProgramar(); };
window.mLab = (ruta,i,campo,el,t)=>{ d.labor[ruta][i][campo] = t==='n' ? (el.value===''?null:parseFloat(el.value)) : el.value; calc(); window.mProgramar(); };
window.mLabH = (ruta,i,etapa,el)=>{ d.labor[ruta][i].horas[etapa]=parseFloat(el.value)||0; calc(); window.mProgramar(); };
window.mSyrup=(id,el)=>{ d.evento.syrups=d.evento.syrups||{};
  d.evento.syrups[id]=Math.max(0,parseInt(el.value)||0); calc(); window.mProgramar(); };
window.mSyrupInv=(id,el)=>{ d.syrups.inventarioBotellas=d.syrups.inventarioBotellas||{};
  d.syrups.inventarioBotellas[id]=Math.max(0,parseInt(el.value)||0); calc(); window.mProgramar(); };
window.mSyrupCase=(el)=>{ d.syrups.cargarCaseCompleto=el.value==='Si'; calc(); window.mRender(); };
window.mHielo=(k,el)=>{ d.evento.hielo=d.evento.hielo||{coolerGrande:0,reservaColeman:0};
  d.evento.hielo[k]=Math.max(0,parseInt(el.value)||0); calc(); window.mProgramar(); };
window.mGasto=(k,el)=>{
  const v=el.value.trim()===''?0:(parseFloat(el.value)||0);
  if(!d.evento.otrosGastos) d.evento.otrosGastos={};
  d.evento.otrosGastos[k]=v; calc(); window.mProgramar(); };
window.mPres=(ruta,i,el)=>{ d.labor[ruta][i].presenteServicio = el.value==='Si'; calc(); window.mRender(); };
window.mAddPers=(ruta)=>{ d.labor[ruta].push({nombre:(ruta==='duenos'?'Dueño ':'Empleado ')+(d.labor[ruta].length+1),
  rol:'', tarifa:null, presenteServicio:false,
  horas:{consulta:0,compras:0,preparacion:0,montaje:0,servicio:0,limpieza:0,administracion:0}});
  calc(); window.mRender(); };
window.mDelPers=(ruta,i)=>{ const p=d.labor[ruta][i];
  if((p.horasTotales>0||p.tarifa) && !confirm('¿Eliminar a '+(p.nombre||'esta persona')+'?')) return;
  d.labor[ruta].splice(i,1); calc(); window.mRender(); };
window.mIr = ir;
window.PINTAR = {};
PINTAR.cotizar = vCotizar;
window.__ui = { $, money, num, pct, esc, get d(){return d}, get R(){return R}, calc, ir, set,
  reload(){ d = D.d; } };
function pintar(){ calc(); (PINTAR[actual]||(()=>{}))(); }
window.mPintar = pintar;
document.addEventListener('DOMContentLoaded', ()=>{
  $('#tabs').innerHTML = SECS.map(([k,n])=>`<button data-k="${k}" onclick="mIr('${k}')" class="${k===actual?'on':''}">${n}</button>`).join('');
  calc(); ir('cotizar');
});
})();
