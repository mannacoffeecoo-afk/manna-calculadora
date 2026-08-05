/* MANNA — Signature Drinks y Custom Design */
(function(){
'use strict';
const U=window.__ui, M=window.MannaMotor, D=window.MannaDatos;
const {$,money,num,pct,esc}=U; const P=window.PINTAR;
const g=()=>U.d, r=()=>U.R;
const g5=n=>Number(n).toLocaleString('es-US',{minimumFractionDigits:4,maximumFractionDigits:4});

P.signatures=function(){
  const dd=g(), R=r();
  const lib=dd.signatures;
  if(!lib || !Array.isArray(lib.recetas) || !lib.cloudReceta){
    $('#s-signatures').innerHTML=`<h2>Signature Drinks</h2>
      <div class="banner warn"><span class="ico">▲</span><div>Tus datos guardados son de una versión anterior y
        todavía no tienen la biblioteca de Signatures. Ve a <b>Configuración → Importar respaldo</b>, o recarga la
        página para que se complete sola. Ningún dato tuyo se perdió.</div></div>`;
    return;
  }
  const CR=lib.cloudReceta;
  const ings=dd.ingredientes.filter(i=>!i.derivado);
  const costoDe=(sig)=>{
    let base=0, pend=[];
    const usa=Object.assign({},sig.receta);
    usa['CREMA']=(usa['CREMA']||0)+CR.crema;
    if(sig.cloudSyrup) usa[sig.cloudSyrup]=(usa[sig.cloudSyrup]||0)+CR.syrup;
    for(const [id,c] of Object.entries(usa)){
      if(c===null||c===undefined){ pend.push(id); continue; }
      const f=M.fichaIngrediente(dd,id); if(!f) continue;
      if(f.faltaDato && c>0){ pend.push(id); continue; }
      base+=c*f.costoUnitario;
    }
    for(const [e,c] of Object.entries(lib.empaques||{})){
      const f=M.fichaEmpaque(dd,e); if(f&&!f.faltaDato) base+=c*f.costoUnitario;
    }
    return {base, conAumento:base*(1+dd.parametros.aumentoInterno), pend};
  };
  const tarjeta=(sig,i)=>{
    const c=costoDe(sig);
    const cr=CR.crema, sy=CR.syrup;
    const filas=Object.entries(sig.receta).map(([id,cant])=>{
      const ing=ings.find(x=>x.id===id)||{nombre:id,unidadBase:'g'};
      return `<tr><td>${esc(ing.nombre)}</td>
        <td><input type="number" step="0.0001" inputmode="decimal" value="${cant??''}" placeholder="pendiente"
          oninput="mSigRec(${i},'${id}',this)"></td><td>${esc(ing.unidadBase||'g')}</td></tr>`;}).join('');
    return `<div class="card">
      <div class="fila" style="margin-bottom:10px">
        <input value="${esc(sig.nombre)}" style="flex:1;font-weight:600" oninput="mSigNom(${i},this)">
        <select style="width:auto" onchange="mSigAct(${i},this)">
          <option ${sig.activa?'selected':''}>Activa</option><option ${!sig.activa?'selected':''}>Inactiva</option></select>
        <button class="btn sm sec" onclick="mSigDel(${i})">✕</button></div>
      <div class="grid g3" style="margin-bottom:12px">
        <div class="kpi"><div class="et">Costo directo</div><div class="val" style="font-size:20px">${c.pend.length?'—':money(c.base)}</div>
          <div class="nota">antes del ${pct(dd.parametros.aumentoInterno)}</div></div>
        <div class="kpi"><div class="et">Con aumento interno</div><div class="val" style="font-size:20px">${c.pend.length?'—':money(c.conAumento)}</div>
          <div class="nota">por bebida</div></div>
        <div class="kpi ${c.pend.length?'bad':'ok'}"><div class="et">Estado</div>
          <div class="val" style="font-size:16px">${c.pend.length?c.pend.length+' pendiente'+(c.pend.length>1?'s':''):'Completa'}</div>
          <div class="nota">${c.pend.length?esc(c.pend.join(', ')):'lista para usar'}</div></div></div>
      <table><thead><tr><th>Ingrediente</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>${filas}</tbody></table>
      <div style="background:var(--arena);border-radius:10px;padding:12px;margin-top:12px">
        <b>Cloud para vasos de 12 oz — receta confirmada por peso</b>
        <div class="grid g4" style="margin-top:8px">
          <div><label>Heavy whipping por bebida</label><input value="${CR.crema} g" readonly></div>
          <div><label>Syrup por bebida</label><input value="${CR.syrup} g" readonly></div>
          <div><label>Cloud terminado por bebida</label><input value="${CR.total} g" readonly></div>
          <div><label>Syrup del cloud</label><select onchange="mSigSyr(${i},this)">
            ${ings.filter(x=>/SYRUP|SAUCE/.test(x.id)).map(x=>`<option value="${x.id}" ${sig.cloudSyrup===x.id?'selected':''}>${esc(x.nombre)}</option>`).join('')}</select></div></div>
        <p class="pista" style="margin:8px 0 0">Base de 16 oz: ${CR.base16oz.crema} g de crema + ${CR.base16oz.syrup} g de syrup
          = ${CR.base16oz.total} g. Para 12 oz se aplica ${(CR.factor12oz*100).toFixed(0)}%. El aire cambia el volumen, no el peso que se costea.
          El cloud no se compra ni se cobra aparte: se costean sus gramos de crema y syrup.</p></div>
      ${sig.nota?`<p class="pista" style="margin:10px 0 0">${esc(sig.nota)}</p>`:''}</div>`;
  };
  const cl=R.cloud;
  $('#s-signatures').innerHTML=`<h2>Signature Drinks</h2>
  <p class="pista">Biblioteca de recetas de 12 oz. Ninguna se activa sola. Para usar una en un evento ve a <b>Cotizar evento</b>.</p>
  ${cl?`<div class="card"><h3>Cloud para vasos de 12 oz — receta confirmada por peso</h3>
    <table style="margin-bottom:12px">
      <tr><td>Heavy whipping por bebida</td><td class="num"><b>${cl.cremaPorBebida} g</b></td></tr>
      <tr><td>Syrup por bebida</td><td class="num"><b>${cl.syrupPorBebida} g</b></td></tr>
      <tr><td>Cloud terminado por bebida</td><td class="num"><b>${cl.gPorBebida} g</b></td></tr>
      <tr><td>Cantidad de bebidas</td><td class="num"><b>${cl.bebidas}</b></td></tr>
      <tr class="tot"><td>Cloud total</td><td class="num">${num(cl.preparado,2)} g</td></tr>
      <tr><td>Heavy whipping total</td><td class="num">${num(cl.crema,2)} g</td></tr>
      <tr><td>Syrup total</td><td class="num">${num(cl.syrup,2)} g</td></tr>
      <tr class="tot"><td>Con ${pct(g().parametros.merma)} de merma — heavy whipping</td><td class="num">${num(cl.cremaConMerma,2)} g</td></tr>
      <tr class="tot"><td>Con ${pct(g().parametros.merma)} de merma — syrup</td><td class="num">${num(cl.syrupConMerma,2)} g</td></tr>
      <tr><td>Equivalente total con merma</td><td class="num">${num(cl.totalConMerma,2)} g</td></tr></table>
    <p class="pista">La merma se aplica <b>una sola vez</b>, después de sumar todas las bebidas. Las botellas squeeze
      todavía no se calculan: falta la medición real de capacidad.</p></div>`:''}
  ${lib.recetas.map(tarjeta).join('')}
  <button class="btn sec" onclick="mSigNueva()">+ Crear Signature</button>
  <div class="card" style="margin-top:16px"><h3>Costo manual — Signature sin receta</h3>
    <p class="pista">Para una Signature que todavía no tiene receta cargada. Se usa desde Cotizar evento.</p>
    <div class="grid g3">
      <div><label>Nombre</label><input value="${esc(lib.costoManual.nombre||'')}" oninput="mSigMan('nombre',this,'t')"></div>
      <div><label>Costo directo por bebida $</label><input type="number" step="0.01" value="${lib.costoManual.costoUnitario||0}" oninput="mSigMan('costoUnitario',this,'n')"></div>
      <div><label>Nota</label><input value="${esc(lib.costoManual.nota||'')}" oninput="mSigMan('nota',this,'t')"></div></div></div>`;
};
window.mSigRec=(i,id,el)=>{ g().signatures.recetas[i].receta[id]= el.value===''?null:(parseFloat(el.value)||0); U.calc(); window.mProgramar(); };
window.mSigNom=(i,el)=>{ g().signatures.recetas[i].nombre=el.value; U.calc(); window.mProgramar(); };
window.mSigAct=(i,el)=>{ g().signatures.recetas[i].activa=el.value==='Activa'; U.calc(); window.mRender(); };
window.mSigSyr=(i,el)=>{ g().signatures.recetas[i].cloudSyrup=el.value; U.calc(); window.mRender(); };
window.mSigMan=(k,el,t)=>{ g().signatures.costoManual[k]= t==='n'?(parseFloat(el.value)||0):el.value; U.calc(); window.mProgramar(); };
window.mSigDel=i=>{ if(confirm('¿Eliminar "'+g().signatures.recetas[i].nombre+'"?')){ g().signatures.recetas.splice(i,1); U.calc(); window.mRender(); } };
window.mSigNueva=()=>{ g().signatures.recetas.push({id:'SIG_'+Date.now(),nombre:'Nueva Signature',activa:false,
  cloudSyrup:'SYRUP_VAINILLA',receta:{HIELO:110,CAFE:18,LECHE:145},nota:''});
  U.calc(); window.mRender(); };

/* ---- bloque para Cotizar evento ---- */
window.mTarjetaSignature=function(){
  const dd=g(), R=r();
  const lib=dd.signatures, cfg=dd.customDesign;
  if(!lib || !Array.isArray(lib.recetas) || !cfg)
    return `<div class="card"><h3>Signature y Custom Design</h3>
      <div class="banner warn" style="margin:0"><span class="ico">▲</span><div>Estas funciones se activan cuando
        se completen tus datos guardados. Recarga la página o usa Configuración → Importar respaldo.
        Nada de lo tuyo se perdió y puedes seguir cotizando normalmente.</div></div></div>`;
  const ev=dd.evento.signature||{}, k=R.stickers||{activo:false};
  const cd=dd.evento.customDesign||{};
  return `<div class="card"><h3>Signature del evento</h3>
    <div class="grid g4">
      <div><label>¿Ofrecer Signature?</label><select onchange="mSet('evento.signature.ofrecer',this,'b')">
        <option ${!ev.ofrecer?'selected':''}>No</option><option ${ev.ofrecer?'selected':''}>Si</option></select></div>
      <div><label>Cuál</label><select onchange="mSigPick(this)" ${!ev.ofrecer?'disabled':''}>
        ${lib.recetas.map(s=>`<option value="${s.id}" ${ev.id===s.id&&!ev.usarCostoManual?'selected':''}>${esc(s.nombre)}</option>`).join('')}
        <option value="__manual" ${ev.usarCostoManual?'selected':''}>Costo manual — ${esc((lib.costoManual||{}).nombre||'sin receta')}</option></select></div>
      <div><label>Cómo se define</label><select onchange="mSet('evento.signature.modo',this)" ${!ev.ofrecer?'disabled':''}>
        <option value="cantidad" ${ev.modo==='cantidad'?'selected':''}>Cantidad exacta</option>
        <option value="porcentaje" ${ev.modo==='porcentaje'?'selected':''}>% de los cafés</option></select></div>
      <div><label>${ev.modo==='porcentaje'?'% de los cafés':'Cantidad'}</label>
        ${ev.modo==='porcentaje'
          ? `<input type="number" step="1" value="${((ev.pct||0)*100).toFixed(0)}" oninput="mSet('evento.signature.pct',this,'p')" ${!ev.ofrecer?'disabled':''}>`
          : `<input type="number" step="1" value="${ev.cantidad||0}" oninput="mSet('evento.signature.cantidad',this,'n')" ${!ev.ofrecer?'disabled':''}>`}</div>
    </div>
    <div class="fila" style="margin-top:12px"><span class="chip ${R.sigUnidades?'ok':'gris'}">Bebidas Signature: <b>${R.sigUnidades}</b></span>
      <span class="pista" style="margin:0">Salen del total de ${R.totalesCategoria.Cafe} cafés, no se suman encima.</span></div>
    ${R.cloud?`<p class="pista" style="margin:10px 0 0">Cloud a preparar: <b>${num(R.cloud.preparado,1)} g</b>
      (${g5(R.cloud.crema)} g de crema + ${g5(R.cloud.syrup)} g de syrup, sin merma).</p>`:''}
  </div>
  <div class="card"><h3>Custom Design — sticker personalizado</h3>
    <p class="pista">Add-on general. No se vincula a ningún producto. Los stickers son personalizados: se cobran completos al evento y no entran al inventario reutilizable.</p>
    <div class="grid g3">
      <div><label>Activar</label><select onchange="mSet('evento.customDesign.activo',this,'b')">
        <option ${!cd.activo?'selected':''}>No</option><option ${cd.activo?'selected':''}>Si</option></select></div>
      <div><label>Cantidad de stickers</label><input type="number" step="1" value="${cd.cantidad||0}" oninput="mSet('evento.customDesign.cantidad',this,'n')" ${!cd.activo?'disabled':''}></div>
      <div><label>Uso o nota</label><input value="${esc(cd.nota||'')}" oninput="mSet('evento.customDesign.nota',this)"></div>
    </div>
    ${k.activo?`<table style="margin-top:12px">
      <tr><td>Paquetes recomendados</td><td class="num"><b>${k.p100} × 100 + ${k.p200} × 200</b></td></tr>
      <tr><td>Capacidad comprada</td><td class="num">${k.capacidad}</td></tr>
      <tr><td>Sobrantes</td><td class="num">${k.sobrante}</td></tr>
      <tr><td>Delivery (una vez por pedido)</td><td class="num">${money(k.delivery)}</td></tr>
      <tr><td>Efectivo de compra</td><td class="num">${money(k.compra)}</td></tr>
      <tr class="tot"><td>Costo asignado al evento (con ${pct(dd.parametros.aumentoInterno)})</td><td class="num">${money(k.costoAsignado)}</td></tr>
    </table>`:''}
    <details class="tec"><summary>Precios de los paquetes</summary><div class="grid g4" style="margin-top:10px">
      <div><label>Paquete de 100 $</label><input type="number" step="0.01" value="${cfg.pack100}" oninput="mCD('pack100',this)"></div>
      <div><label>Paquete de 200 $</label><input type="number" step="0.01" value="${cfg.pack200}" oninput="mCD('pack200',this)"></div>
      <div><label>Delivery por pedido $</label><input type="number" step="0.01" value="${cfg.delivery}" oninput="mCD('delivery',this)"></div>
      <div><label>Sales tax de compra $</label><input type="number" step="0.01" value="${cfg.taxCompra}" oninput="mCD('taxCompra',this)"></div>
    </div></details></div>`;
};
window.mSigPick=el=>{ const v=el.value;
  if(v==='__manual'){ g().evento.signature.usarCostoManual=true; }
  else { g().evento.signature.usarCostoManual=false; g().evento.signature.id=v; }
  U.calc(); window.mRender(); };
window.mCD=(k,el)=>{ g().customDesign[k]=parseFloat(el.value)||0; U.calc(); window.mProgramar(); };
})();
