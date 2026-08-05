/* MANNA — Motor de calculo de cotizaciones de eventos.
   Replica la logica de MANNA_Calculadora_Eventos_v16.xlsx.
   SIN dependencias del DOM: corre igual en el navegador y en Node. */
(function (raiz) {
  'use strict';
  /* Fuente unica de verdad de la cotizacion actual. Nada de 1.25 escrito a mano. */
  function aumento(d){
    const v = (d.evento && d.evento.aumentoInsumos);
    const n = (v === undefined || v === null || v === '') ? (d.parametros && d.parametros.aumentoInterno) : v;
    return (typeof n === 'number' && isFinite(n) && n >= 0) ? n : null;   // null = invalido -> bloquea
  }
  function factorAumento(d){ const a = aumento(d); return 1 + (a == null ? 0 : a); }
  function taxCfg(d){
    const ev = d.evento || {}, P = d.parametros || {};
    const aplica = (ev.aplicarSalesTax === undefined) ? (P.aplicarSalesTax !== false) : !!ev.aplicarSalesTax;
    const raw = ('salesTaxPct' in ev) ? ev.salesTaxPct : P.salesTax;
    const pct = (typeof raw === 'number' && isFinite(raw) && raw >= 0) ? raw : null;
    return { aplica, pct, motivo: ev.motivoSinTax || '' };
  }
  /* Gramos que contiene la presentacion, segun la densidad registrada.
     Es documentacion y base del futuro modo calculado: NO cambia la unidad de las recetas. */
  function gramosPresentacion(d, id){
    const i=(d.ingredientes||[]).find(x=>x.id===id);
    if(!i || i.densidad==null || i.cantPresentacion==null) return null;
    const u=(i.unidadPresentacion||'').toLowerCase();
    const ml = u==='l' ? i.cantPresentacion*1000
             : /oz/.test(u) ? i.cantPresentacion*29.5735
             : null;
    return ml==null ? null : ml*i.densidad;
  }
  /* Vaso frio de 12 oz seleccionado: solo uno se cobra por bebida */
  function vasoFrio(d){
    const cfg = d.vasosFrios12 || {};
    const ops = (cfg.opciones || []).map(o => o.id);
    const sel = (d.evento && d.evento.vasoFrio12) || ops[0] || 'VASO_FRIO_12';
    return { seleccionado: sel, opciones: ops, estandar: ops[0] || 'VASO_FRIO_12', tapa: cfg.tapa || 'TAPA_FRIA_12' };
  }
  const ETAPAS = ['consulta','compras','preparacion','montaje','servicio','limpieza','administracion'];
  const ETAPAS_TITULO = { consulta:'Consulta y planeacion', compras:'Compras',
    preparacion:'Preparacion de ingredientes', montaje:'Traslado y montaje',
    servicio:'Servicio presencial', limpieza:'Desmontaje y limpieza',
    administracion:'Administracion y seguimiento' };
  const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const techo = (n, m) => m <= 0 ? n : Math.ceil(n / m - 1e-9) * m;
  const vacio = v => v === null || v === undefined || v === '';

  /* ---- mapas de ingredientes "logicos" -> concretos, segun selectores ---- */
  function repartoLogico(d) {
    const s = d.selectores, ev = d.evento, m = {};
    m.LECHE  = Object.entries(ev.mezclaLeche).map(([id,p]) => ({id, peso:p||0}));
    m.MATCHA = Object.entries(s.matcha.opciones).map(([nom,id]) => ({id, peso: s.matcha.activo===nom ?1:0}));
    m.FRESA  = Object.entries(s.fresa.opciones).map(([nom,id]) => ({id, peso: s.fresa.activo===nom ?1:0}));
    m.PULPA  = Object.values(s.pulpa).map(o => ({id:o.id, peso:o.pct||0}));
    return m;
  }
  /* ---- Signature activa del evento ---- */
  function sigActiva(d){
    const ev=d.evento.signature||{};
    if(!ev.ofrecer) return null;
    if(ev.usarCostoManual){
      const cm = (d.signatures && d.signatures.costoManual) || {};
      return { manual:true, nombre: cm.nombre || ev.nombre || 'Signature manual',
               costoUnitario: (cm.costoUnitario != null ? cm.costoUnitario : (ev.costoUnitario || 0)) };
    }
    const r=(d.signatures&&d.signatures.recetas||[]).find(x=>x.id===ev.id);
    return r ? { manual:false, ...r } : null;
  }
  function sigUnidades(d, totalCafe){
    const ev=d.evento.signature||{};
    if(!ev.ofrecer || !sigActiva(d)) return 0;
    const n = ev.modo==='porcentaje' ? Math.round(totalCafe*(ev.pct||0)) : Math.round(ev.cantidad||0);
    return Math.max(0, Math.min(n, totalCafe));           // nunca se suma encima del total de cafes
  }
  /* ---- Cloud: receta CONFIRMADA POR PESO para vasos de 12 oz ----
     16 oz: 35 g de crema + 23 g de syrup = 58 g.  x 0.75  ->  12 oz: 26.25 + 17.25 = 43.5 g.
     Se costean los gramos exactos de crema y syrup; el "cloud" no es una linea aparte.
     La merma se aplica UNA sola vez, despues de sumar todas las bebidas. */
  function cloud(d, unidades){
    const sig=sigActiva(d);
    if(!sig || sig.manual || !unidades) return null;
    const R=(d.signatures&&d.signatures.cloudReceta)||{crema:26.25,syrup:17.25,total:43.5};
    const cPB=R.crema||0, sPB=R.syrup||0, tPB=(R.total!=null?R.total:cPB+sPB);
    const merma=1+(d.parametros.merma||0);
    return { receta:R, gPorBebida:tPB, cremaPorBebida:cPB, syrupPorBebida:sPB,
             preparado: unidades*tPB, crema: unidades*cPB, syrup: unidades*sPB,
             cremaConMerma: unidades*cPB*merma, syrupConMerma: unidades*sPB*merma,
             totalConMerma: unidades*tPB*merma, syrupId: sig.cloudSyrup, bebidas: unidades };
  }
  /* ---- Syrups Monin: MODO MANUAL POR BOTELLAS (temporal, sin densidades) ----
     Se cobran botellas completas asignadas al evento. Sin merma y sin bloqueo por densidad.
     El modo calculado por consumo queda pendiente. */
  function syrups(d){
    const cfg=(d.syrups)||{}, modo=cfg.modo||'manual';
    const porCase=cfg.botellasPorCase||4;
    const pv=proveedorSyrup(d,'WebstaurantStore');
    const costoCase=pv?pv.costoEntregadoCase:0;
    const costoBotella=porCase?costoCase/porCase:0;
    const asign=(d.evento&&d.evento.syrups)||{};
    const inv=cfg.inventarioBotellas||{};
    const lineas=(cfg.sabores||[]).map(s=>{
      const req=Math.max(0,Math.round(asign[s.id]||0));
      const disp=Math.max(0,Math.round(inv[s.id]||0));
      const faltan=Math.max(0,req-disp);
      const cases=faltan>0?Math.ceil(faltan/porCase):0;
      const efectivo=cases*costoCase;
      const base=cfg.cargarCaseCompleto?efectivo:req*costoBotella;
      return { id:s.id, nombre:s.nombre, requeridas:req, disponibles:disp, faltantes:faltan,
               cases, botellasCompradas:cases*porCase, efectivoHoy:efectivo,
               costoBase:base, costoAsignado:base*factorAumento(d),
               sobrantes:Math.max(0, disp+cases*porCase-req) };
    });
    const t=(k)=>lineas.reduce((a,x)=>a+x[k],0);
    return { modo, activo: modo==='manual', costoCase, costoBotella, botellasPorCase:porCase, lineas,
             botellasTotales:t('requeridas'), casesTotales:t('cases'),
             botellasCompradas:t('botellasCompradas'), sobrantes:t('sobrantes'),
             efectivoHoy:t('efectivoHoy'), costoBase:t('costoBase'), costoAsignado:t('costoAsignado'),
             ids:new Set((cfg.sabores||[]).map(x=>x.id)) };
  }
  /* ---- Hielo operativo: bebidas + cooler grande + reserva Coleman ----
     Es perecedero y del evento: se cobran BOLSAS COMPLETAS, no gramos servidos.
     Sin colchon de inventario y sin merma sobre las bolsas operativas. */
  function hielo(d, gramosBebidas){
    const ev=(d.evento&&d.evento.hielo)||{}, f=fichaIngrediente(d,'HIELO');
    const LB=453.592, porBolsa=16;
    const lb = (gramosBebidas||0)/LB;
    const bolsasBebidas = lb>0 ? Math.ceil(lb/porBolsa - 1e-9) : 0;
    const cooler = Math.max(0, Math.round(ev.coolerGrande||0));
    const reserva = Math.max(0, Math.round(ev.reservaColeman||0));
    const total = bolsasBebidas + cooler + reserva;
    const precio = (f && !f.faltaDato) ? (f.precioCompra||0) : 0;
    const comprado = !!d.parametros.hieloComprado;
    return { gramosBebidas: gramosBebidas||0, librasBebidas: lb, librasPorBolsa: porBolsa,
             bolsasBebidas, coolerGrande: cooler, reservaColeman: reserva, bolsasTotales: total,
             precioBolsa: precio, comprado,
             costoBase: comprado ? total*precio : 0,
             costoAsignado: comprado ? total*precio*factorAumento(d) : 0,
             efectivoHoy: comprado ? total*precio : 0,
             faltaPrecio: !!(f && f.faltaDato) };
  }
  /* ---- Custom Design: combinacion entera de paquetes con menor costo ---- */
  function stickers(d){
    const cfg=d.customDesign||{}, ev=(d.evento&&d.evento.customDesign)||{};
    const p100=cfg.pack100??0, p200=cfg.pack200??0, env=cfg.delivery??0, tax=cfg.taxCompra??0;
    const q=ev.activo ? Math.max(0, Math.round(ev.cantidad||0)) : 0;
    if(!q) return { activo:false, cantidad:0, p100:0, p200:0, capacidad:0, sobrante:0,
                    compra:0, costoAsignado:0, delivery:0 };
    const maxB=Math.ceil(q/200)+1; let mejor=null;
    for(let b=0;b<=maxB;b++){
      const falta=Math.max(0,q-b*200), a=Math.ceil(falta/100);
      const cap=a*100+b*200, costo=a*p100+b*p200;
      const cand={a,b,cap,costo,sobrante:cap-q};
      if(!mejor || cand.costo<mejor.costo-1e-9 ||
         (Math.abs(cand.costo-mejor.costo)<1e-9 && cand.sobrante<mejor.sobrante)) mejor=cand;
    }
    const compra = mejor.costo + env + tax;
    return { activo:true, cantidad:q, p100:mejor.a, p200:mejor.b, capacidad:mejor.cap,
             sobrante:mejor.sobrante, delivery:env, taxCompra:tax,
             compra, costoAsignado:compra*factorAumento(d) };
  }

  /* ---- unidades por producto: redondeo acumulado, la suma cierra exacta ---- */
  function unidadesPorProducto(d) {
    const ev = d.evento, inv = ev.invitados || 0;
    const totales = {
      Cafe:      Math.round(inv * (ev.porPersona.cafe      || 0)),
      Matcha:    Math.round(inv * (ev.porPersona.matcha    || 0)),
      Sparkling: Math.round(inv * (ev.porPersona.sparkling || 0)),
      Crepes:    Math.round(inv * (ev.porPersona.crepes    || 0))
    };
    const sigU = sigUnidades(d, totales.Cafe||0);
    const SIG_SLOT = 'P06';                                   // la Signature ocupa el espacio de "Signature drink"
    const acum = {}, out = {};
    const cafeOtros = d.productos.filter(p=>p.categoria==='Cafe' && p.id!==SIG_SLOT);
    const sumaOtros = cafeOtros.reduce((a,p)=>a+(p.pctPerfil||0),0);
    d.productos.forEach(p => {
      const cat = p.categoria; let tot = totales[cat] || 0, pct = p.pctPerfil || 0;
      if (sigU > 0 && cat === 'Cafe') {
        if (p.id === SIG_SLOT) { out[p.id] = sigU; return; }   // cantidad exacta, fuera del prorrateo
        tot = Math.max(0, tot - sigU);                          // el resto se reparte sobre lo que queda
        pct = sumaOtros > 0 ? (p.pctPerfil||0)/sumaOtros : 0;
      }
      const antes = acum[cat] || 0, ahora = antes + pct;
      acum[cat] = ahora;
      out[p.id] = Math.round(tot * ahora) - Math.round(tot * antes);
    });
    return { totales, unidades: out, sumaPct: acum, sigUnidades: sigU, sigSlot: SIG_SLOT,
             sumaCafeOtros: sumaOtros };
  }
  /* ---- mezclas de masa de crepes ---- */
  function masa(d, unidades) {
    const mc = d.masaCrepes;
    const crepes = d.productos.filter(p => p.categoria === 'Crepes')
                              .reduce((a,p) => a + (unidades[p.id]||0), 0);
    const porMezcla = mc.crepesPorMezcla || 6;
    const mezclas = porMezcla > 0 ? Math.ceil(crepes / porMezcla) : 0;
    const cv = mc.conversiones, tot = {};
    for (const [nom, c] of Object.entries(mc.componentes)) {
      let f = 1;
      if (nom === 'Harina') f = cv.gPorTazaHarina;
      else if (nom === 'Azucar') f = cv.gPorCdaAzucar;
      else if (nom === 'Sal') f = cv.gPorCdtaSal;
      tot[nom] = mezclas * (c.porMezcla || 0) * f;
    }
    return { crepes, mezclas, totales: tot };
  }
  /* ---- consumo por insumo concreto (ya con merma / reserva) ---- */
  function consumos(d, unidades, ms) {
    const p = d.parametros, merma = 1 + (p.merma||0), reserva = 1 + (p.reservaEmpaques||0);
    const rep = repartoLogico(d), logico = {};
    const slot = ms.sigSlot || 'P06';
    const haySig = !!(ms.sigU > 0);
    d.productos.forEach(pr => {
      if (haySig && pr.id === slot) return;          // su receta la reemplaza la Signature
      for (const [ing, cant] of Object.entries(pr.receta)) {
        if (vacio(cant)) continue;
        logico[ing] = (logico[ing]||0) + (unidades[pr.id]||0) * cant;
      }
    });
    /* Signature: su receta reemplaza la del slot, y el cloud se descompone */
    const sig = sigActiva(d), sigU = ms.sigU || 0;
    if (sig && !sig.manual && sigU > 0) {
      for (const [ing, cant] of Object.entries(sig.receta||{})) {
        if (vacio(cant)) continue;
        logico[ing] = (logico[ing]||0) + sigU * cant;
      }
      const cl = ms.cloud;
      if (cl) {
        logico['CREMA'] = (logico['CREMA']||0) + cl.crema;
        if (cl.syrupId) logico[cl.syrupId] = (logico[cl.syrupId]||0) + cl.syrup;
      }
    }
    const mapa = d.masaCrepes.mapaIngrediente;
    for (const [nom, ingId] of Object.entries(mapa)) {
      if (!ingId) continue;                       // Agua: se requiere pero no se cuesta
      logico[ingId] = (logico[ingId]||0) + (ms.totales[nom]||0);
    }
    const ing = {};
    for (const [id, cant] of Object.entries(logico)) {
      if (rep[id]) rep[id].forEach(x => { ing[x.id] = (ing[x.id]||0) + cant * x.peso * merma; });
      else ing[id] = (ing[id]||0) + cant * merma;
    }
    const emp = {};
    d.productos.forEach(pr => {
      let lista = (haySig && pr.id === slot)
        ? ((d.signatures && d.signatures.empaques) || {})   // Signature: vaso y tapa frios de 12 oz
        : (pr.empaques || {});
      const VF = vasoFrio(d);
      if (VF.seleccionado !== VF.estandar && lista[VF.estandar]) {   // se sustituye el vaso base; la tapa NO
        lista = Object.assign({}, lista);
        lista[VF.seleccionado] = (lista[VF.seleccionado]||0) + lista[VF.estandar];
        lista[VF.estandar] = 0;
      }
      for (const [e, cant] of Object.entries(lista)) {
        if (!cant) continue;
        emp[e] = (emp[e]||0) + (unidades[pr.id]||0) * cant * reserva;
      }
    });
    return { ingredientes: ing, empaques: emp, aguaMasa: ms.totales['Agua'] || 0 };
  }
  /* ---- precio unitario de un insumo ---- */
  /* ---- costo entregado de un proveedor de syrup (producto + shipping + tax, prorrateado) ---- */
  function proveedorSyrup(d, nombre){
    const p = (d.proveedoresSyrup||{})[nombre];
    if (!p) return null;
    const cases = p.casesPedido || 1;
    const totalEntregado = (p.precioProductos||0) + (p.shippingTotal||0) + (p.taxCompra||0);
    const porCase = totalEntregado / cases;
    const L = p.litrosPorCase || 4;
    return { ...p, nombre, cases, totalEntregado,
             precioPorCase: (p.precioProductos||0)/cases,
             shippingPorCase: (p.shippingTotal||0)/cases,
             taxPorCase: (p.taxCompra||0)/cases,
             costoEntregadoCase: porCase, litrosPorCase: L,
             costoPorLitro: porCase/L, costoPorMl: porCase/(L*1000),
             costoCaseConAumento: porCase*factorAumento(d) };
  }
  function fichaIngrediente(d, id) {
    const i = d.ingredientes.find(x => x.id === id);
    if (!i) return null;
    if (i.derivado) {                       /* LECHE, MATCHA, PULPA, FRESA: promedio ponderado del selector */
      const rep = repartoLogico(d)[id] || [];
      let costo = 0, falta = false, peso = 0;
      rep.forEach(x => { if (!x.peso) return;
        const f = fichaIngrediente(d, x.id); if (!f) return;
        peso += x.peso; costo += x.peso * f.costoUnitario; if (f.faltaDato) falta = true; });
      return { ...i, basePorPaquete: null, costoUnitario: peso > 0 ? costo/peso : 0,
               faltaDato: peso > 0 ? falta : false };
    }
    let precio = i.precioCompra, cant = i.cantPresentacion;
    if (i.proveedorSyrup) {                       /* el proveedor manda el precio y la presentacion */
      const pv = proveedorSyrup(d, i.proveedorSyrup);
      if (pv) { precio = pv.costoEntregadoCase; cant = pv.litrosPorCase; }
    }
    if (id === 'AZUCAR') {                                   // selector de proveedor
      const op = d.selectores.azucar.opciones.find(o => o.nombre === d.selectores.azucar.activo)
              || d.selectores.azucar.opciones[0];
      precio = op.precio; cant = op.cantidad;
    }
    let factor = i.factorBase;
    if (vacio(factor) && !vacio(i.densidad)) {                 // se deriva de la densidad editable
      if (i.unidadPresentacion === 'L') factor = i.densidad * 1000;
      else if (/oz/.test(i.unidadPresentacion||'')) factor = i.densidad * 29.5735;
    }
    const base = (vacio(cant) || vacio(factor)) ? null : cant * factor;
    const falta = vacio(precio) || vacio(cant) || vacio(factor);
    return { ...i, precioCompra: precio, cantPresentacion: cant, factorBase: factor, basePorPaquete: base,
             costoUnitario: (falta || !base) ? 0 : precio / base, faltaDato: falta };
  }
  function fichaEmpaque(d, id) {
    const e = d.empaques.find(x => x.id === id);
    if (!e) return null;
    const falta = vacio(e.precioPaquete) || vacio(e.unidadesPorPaquete) || e.unidadesPorPaquete === 0;
    return { ...e, basePorPaquete: e.unidadesPorPaquete,
             costoUnitario: falta ? 0 : e.precioPaquete / e.unidadesPorPaquete, faltaDato: falta };
  }
  /* ---- compras: faltantes, colchon, paquetes completos ---- */
  function lineaCompra(d, id, consumo, ficha) {
    const inv = d.inventario[id] || { existencias:0, cargarPaqueteCompleto:false };
    const existencias = inv.existencias||0;
    const objetivo = consumo * (1 + (d.parametros.colchonInventario||0));   // lo que quiero tener ANTES del evento
    const faltan = Math.max(0, consumo - existencias);
    const conColchon = Math.max(0, objetivo - existencias);                 // lo que hay que comprar
    const bpp = ficha.basePorPaquete;
    const paquetes = (!bpp || conColchon <= 1e-9) ? 0 : Math.ceil(conColchon / bpp - 1e-9);
    const efectivo = ficha.faltaDato ? 0 : paquetes * (ficha.precioCompra ?? 0);
    return { id, nombre: ficha.nombre, consumo, existencias, objetivo, faltan, conColchon,
             basePorPaquete: bpp, paquetesExactos: bpp ? consumo/bpp : 0, paquetes,
             precioPaquete: ficha.faltaDato ? null : (ficha.precioCompra ?? ficha.precioPaquete),
             efectivoHoy: efectivo, cargarPaqueteCompleto: !!inv.cargarPaqueteCompleto,
             unidadBase: ficha.unidadBase || 'unidades', faltaDato: ficha.faltaDato };
  }
  /* ---- mano de obra ---- */
  function labor(d) {
    const hEvento = d.evento.horas || 0;
    const calc = lista => lista.map(p => {
      const h = Object.assign({}, p.horas);
      if (p.presenteServicio) h.servicio = hEvento;      // reemplaza, nunca acumula
      else if (p.presenteServicio === false) h.servicio = 0;
      const horas = ETAPAS.reduce((a,k) => a + (h[k]||0), 0);
      const sinTarifa = horas > 0 && vacio(p.tarifa);
      return { ...p, horas: h, horasTotales: horas, costo: sinTarifa ? 0 : horas * (p.tarifa||0), sinTarifa };
    });
    const emp = calc(d.labor.empleados||[]), due = calc(d.labor.duenos||[]);
    const todos = emp.concat(due);
    const suma = k => todos.reduce((a,x)=>a+(x.horas[k]||0),0);
    const enServicio = todos.filter(x=>(x.horas.servicio||0)>0).length;
    return { empleados: emp, duenos: due,
             costoEmpleados: emp.reduce((a,x)=>a+x.costo,0),
             costoDuenos:    due.reduce((a,x)=>a+x.costo,0),
             horasEmpleados: emp.reduce((a,x)=>a+x.horasTotales,0),
             horasDuenos:    due.reduce((a,x)=>a+x.horasTotales,0),
             sinTarifa: todos.filter(x=>x.sinTarifa),
             verificacion: {
               personasSinTarifa: todos.filter(x=>x.sinTarifa).length,
               horasLogistica: suma('compras')+suma('preparacion')+suma('limpieza'),
               horasServicio: suma('servicio'),
               personasEnServicio: enServicio,
               horasPresencialesRequeridas: (d.evento.horas||0) * enServicio } };
  }

  function cotizar(d) {
    const P = d.parametros, ev = d.evento;
    const up = unidadesPorProducto(d);
    const ms = masa(d, up.unidades);
    ms.sigU = up.sigUnidades || 0; ms.sigSlot = up.sigSlot;
    ms.cloud = cloud(d, ms.sigU);
    const cs = consumos(d, up.unidades, ms);
    const stk = stickers(d);
    const hi = hielo(d, cs.ingredientes['HIELO'] || 0);
    const sy = syrups(d);
    const lab = labor(d);
    const bloqueos = [], avisos = [], compras = [];
    let baseIng = 0, baseEmp = 0;

    /* el hielo se procesa aunque no haya consumo de bebidas: las bolsas de cooler y
       reserva se cobran igual */
    const idsIngrediente = new Set(Object.keys(cs.ingredientes));
    if (hi.bolsasTotales > 0) idsIngrediente.add('HIELO');
    for (const id of idsIngrediente) {
      const consumo = cs.ingredientes[id] || 0;
      if (consumo <= 1e-9 && id !== 'HIELO') continue;
      if (sy.activo && sy.ids.has(id)) continue;   /* su costo lo lleva el modulo de syrups */
      const f = fichaIngrediente(d, id); if (!f) continue;
      const L = lineaCompra(d, id, consumo, f);
      const esHielo = id === 'HIELO';
      let costo;
      if (esHielo) {                       /* bolsas completas, sin colchon ni merma sobre lo operativo */
        L.paquetes = hi.bolsasTotales; L.conColchon = 0; L.objetivo = consumo;
        L.efectivoHoy = hi.efectivoHoy;
        costo = hi.costoBase;
      } else {
        costo = L.cargarPaqueteCompleto ? L.efectivoHoy : consumo * f.costoUnitario;
      }
      baseIng += costo;
      compras.push({ ...L, tipo: d.inventario[id]?.tipo || 'Ingrediente', costoAsignado: costo,
                     soloReferencia: esHielo && !P.hieloComprado, esHielo });
      if (f.faltaDato && (!esHielo || P.hieloComprado))
        bloqueos.push({ tipo:'BLOQUEO', queFalta:'Falta precio o presentacion', item:f.nombre, itemId:id,
          porque:`Se consumen ${consumo.toLocaleString('es',{maximumFractionDigits:1})} ${f.unidadBase} en este evento.`,
          cantidad:consumo, donde:'ingredientes', queIngresar:'Ingresa precio de compra y presentacion (cantidad + unidad)' });
    }
    for (const [id, consumo] of Object.entries(cs.empaques)) {
      if (consumo <= 1e-9) continue;
      const f = fichaEmpaque(d, id); if (!f) continue;
      const L = lineaCompra(d, id, consumo, { ...f, precioCompra: f.precioPaquete, unidadBase:'unidades' });
      const costo = L.cargarPaqueteCompleto ? L.efectivoHoy : consumo * f.costoUnitario;
      baseEmp += costo;
      compras.push({ ...L, tipo:'Empaque', costoAsignado: costo });
      if (f.faltaDato)
        bloqueos.push({ tipo:'BLOQUEO', queFalta:'Falta precio o presentacion', item:f.nombre, itemId:id,
          porque:`Asignado a un producto ACTIVO. Se necesitan ${Math.round(consumo)} unidades.`,
          cantidad:consumo, donde:'empaques', queIngresar:'Ingresa precio del paquete y unidades por paquete' });
    }
    // filas de inventario para insumos NO usados en esta cotizacion (visibles, sin costo)
    const yaListado = new Set(compras.map(c=>c.id));
    d.ingredientes.filter(i=>!i.derivado && !yaListado.has(i.id) && i.id!=='AGUA_PRIMO').forEach(i=>{
      const f = fichaIngrediente(d,i.id); if(!f) return;
      compras.push({ ...lineaCompra(d,i.id,0,f), tipo: d.inventario[i.id]?.tipo || 'Ingrediente',
                     costoAsignado: 0, sinUso: true });
    });
    d.empaques.filter(e=>!yaListado.has(e.id)).forEach(e=>{
      const f = fichaEmpaque(d,e.id); if(!f) return;
      compras.push({ ...lineaCompra(d,e.id,0,{...f,precioCompra:f.precioPaquete,unidadBase:'unidades'}),
                     tipo:'Empaque', costoAsignado: 0, sinUso: true });
    });
    // consumibles
    const ap = fichaIngrediente(d,'AGUA_PRIMO'), apCant = ev.aguaPrimo || 0;
    const baseCons = ap && apCant ? apCant * ap.costoUnitario : 0;
    if (ap && apCant) compras.push({ ...lineaCompra(d,'AGUA_PRIMO',apCant,ap), tipo:'Consumible', costoAsignado: baseCons });
    // Signature con costo manual (receta todavia no creada)
    const sgA = sigActiva(d);
    const costoSig = (sgA && sgA.manual) ? (up.sigUnidades||0) * (sgA.costoUnitario||0) : 0;

    const subtotal = baseIng + baseEmp + baseCons + costoSig + stk.compra + sy.costoBase;
    const AUM = aumento(d), factor = factorAumento(d);
    const aumentoIns = subtotal * (AUM == null ? 0 : AUM);
    const insumos  = subtotal + aumentoIns;
    const otros    = Object.values(ev.otrosGastos||{}).reduce((a,b)=>a+(b||0),0);
    const costosFijos = insumos + lab.costoEmpleados + otros + (P.incluirDuenos ? lab.costoDuenos : 0);

    const divisor = 1 - (P.margenObjetivo||0) - (P.comisionPago||0);
    const recomendado = divisor > 0 ? costosFijos / divisor : null;
    const piso = P.aplicarMinimo ? Math.max(recomendado, P.minimoEvento||0) : recomendado;
    const paso = P.redondeo === 'Proximo $5' ? 5 : P.redondeo === 'Proximo $1' ? 1 : 0;
    const precioFinal = recomendado === null ? null : (paso ? techo(piso, paso) : piso);
    const comision = precioFinal * (P.comisionPago||0);
    const costoTotal = costosFijos + comision;
    const utilidad = precioFinal - costoTotal;
    const margenReal = precioFinal > 0 ? utilidad / precioFinal : 0;
    const TX = taxCfg(d);
    const tax = (TX.aplica && TX.pct != null) ? precioFinal * TX.pct : 0;

    // ---- validaciones de mezcla ----
    const nom = { Cafe:'Cafe', Matcha:'Matcha', Sparkling:'Sparkling', Crepes:'Crepes' };
    for (const cat of Object.keys(nom)) {
      if ((up.totales[cat]||0) > 0 && Math.abs((up.sumaPct[cat]||0) - 1) > 1e-4)
        bloqueos.push({ tipo:'BLOQUEO', queFalta:'La mezcla no suma 100%', item:nom[cat], itemId:'mezcla-'+cat,
          porque:`La mezcla de ${nom[cat].toLowerCase()} suma ${((up.sumaPct[cat]||0)*100).toFixed(1)}%.`,
          cantidad:up.totales[cat], donde:'cotizar', queIngresar:'Ajusta los porcentajes hasta 100%' });
    }
    const sumaLeche = Object.values(ev.mezclaLeche).reduce((a,b)=>a+(b||0),0);
    const usaLeche = Object.keys(ev.mezclaLeche).some(id => (cs.ingredientes[id]||0) > 0);
    if (usaLeche && Math.abs(sumaLeche-1) > 1e-4)
      bloqueos.push({ tipo:'BLOQUEO', queFalta:'La mezcla no suma 100%', item:'Leche', itemId:'mezcla-leche',
        porque:`La mezcla de leche suma ${(sumaLeche*100).toFixed(1)}%.`, cantidad:0,
        donde:'cotizar', queIngresar:'Ajusta los porcentajes de leche hasta 100%' });
    const usaPulpa = Object.values(d.selectores.pulpa).some(o => (cs.ingredientes[o.id]||0) > 0);
    const sumaPulpa = Object.values(d.selectores.pulpa).reduce((a,o)=>a+(o.pct||0),0);
    if (usaPulpa && Math.abs(sumaPulpa-1) > 1e-4)
      bloqueos.push({ tipo:'BLOQUEO', queFalta:'La mezcla no suma 100%', item:'Sabores de pulpa', itemId:'mezcla-pulpa',
        porque:`El reparto de sabores suma ${(sumaPulpa*100).toFixed(1)}%.`, cantidad:0,
        donde:'ingredientes', queIngresar:'Ajusta los sabores hasta 100%' });
    lab.sinTarifa.forEach(p => bloqueos.push({ tipo:'BLOQUEO', queFalta:'Falta tarifa por hora', item:p.nombre,
      itemId:'labor-'+p.nombre, porque:`Tiene ${p.horasTotales} horas asignadas y no tiene tarifa.`,
      cantidad:p.horasTotales, donde:'cotizar', queIngresar:'Ingresa la tarifa por hora de esa persona' }));
    d.productos.forEach(p => {
      if ((up.unidades[p.id]||0) <= 0) return;
      const faltan = Object.entries(p.receta).filter(([,v]) => vacio(v)).map(([k])=>k);
      if (faltan.length) bloqueos.push({ tipo:'BLOQUEO', queFalta:'Falta cantidad de receta', item:p.nombre,
        itemId:'receta-'+p.id, porque:`Tiene ventas esperadas y la receta esta vacia en: ${faltan.join(', ')}.`,
        cantidad:up.unidades[p.id], donde:'recetas', queIngresar:'Escribe la cantidad (0 si no lleva ese insumo)' });
    });
    /* bloqueos condicionales de la Signature: solo si esta activa y con cantidad > 0 */
    if (sgA && !sgA.manual && (up.sigUnidades||0) > 0) {
      const usa = Object.assign({}, sgA.receta||{});
      if (ms.cloud) { usa['CREMA'] = ms.cloud.crema; if (ms.cloud.syrupId) usa[ms.cloud.syrupId] = ms.cloud.syrup; }
      const LOGICOS = new Set(['LECHE','MATCHA','PULPA','FRESA']);
      Object.entries(usa).forEach(([id,cant]) => {
        if (LOGICOS.has(id)) return;                        // ya los cubre el reparto por selector
        const f = fichaIngrediente(d,id); if (!f) return;
        if (vacio(cant))
          bloqueos.push({ tipo:'BLOQUEO', queFalta:'Falta la cantidad por bebida', item:f.nombre, itemId:id,
            porque:`La Signature "${sgA.nombre}" está activa con ${up.sigUnidades} bebidas y esta receta no tiene cantidad.`,
            cantidad:up.sigUnidades, donde:'signatures', queIngresar:'Escribe los gramos por bebida (0 si no lleva)' });
        else if (f.faltaDato)
          bloqueos.push({ tipo:'BLOQUEO', queFalta:'Falta precio, presentación o densidad', item:f.nombre, itemId:id,
            porque:`Lo usa la Signature "${sgA.nombre}", activa con ${up.sigUnidades} bebidas.`,
            cantidad:cant*(up.sigUnidades||0), donde:'ingredientes',
            queIngresar: f.unidadPresentacion==='L'||f.unidadPresentacion==='oz'
              ? 'Ingresa precio, presentación y la densidad g/ml' : 'Ingresa precio y presentación' });
      });
    }
    if (AUM == null)
      bloqueos.push({ tipo:'BLOQUEO', queFalta:'Aumento de insumos inválido', item:'Aumento de insumos para este evento',
        itemId:'aumento', porque:'Está vacío, es negativo o no es un número. 0% es válido; vacío no.',
        cantidad:0, donde:'config', queIngresar:'Escribe un porcentaje igual o mayor que 0' });
    if (TX.aplica && TX.pct == null)
      bloqueos.push({ tipo:'BLOQUEO', queFalta:'Sales tax inválido', item:'Sales tax %', itemId:'salestax',
        porque:'El sales tax está activado pero el porcentaje está vacío, es negativo o no es un número.',
        cantidad:0, donde:'config', queIngresar:'Escribe el porcentaje o desactiva el sales tax' });
    if (!TX.aplica)
      avisos.push({ tipo:'AVISO', item:'Sales tax desactivado',
        porque:'Esta cotización no incluye sales tax'+(TX.motivo?': '+TX.motivo:'')+'. El cliente paga solo el precio final. '
               +'Tú decides si el evento está exento; la calculadora no lo determina.', donde:'config' });
    const ban = d.ingredientes.find(x=>x.id==='BANANO');
    if ((cs.ingredientes['BANANO']||0) > 0 && ban)
      avisos.push({ tipo:'AVISO', item:'Bananos', porque:`Peso neto ESTIMADO de ${ban.factorBase} g por banana. Confirma con peso real.`, donde:'ingredientes' });
    if (!P.hieloComprado && hi.bolsasTotales > 0)
      avisos.push({ tipo:'AVISO', item:'Hielo',
        porque:'El hielo operativo y de bebidas no está incluido en esta cotización. Se necesitan '
               + hi.bolsasTotales + ' bolsas de 16 lb, pero no se cobran.', donde:'cotizar' });

    /* un mismo insumo no se reporta dos veces: gana el mensaje que nombra la Signature */
    const vistos = new Map();
    bloqueos.forEach(b => {
      const k = b.itemId;
      const previo = vistos.get(k);
      if (!previo) { vistos.set(k, b); return; }
      const esMejor = /Signature/.test(b.porque||'') && !/Signature/.test(previo.porque||'');
      if (esMejor) vistos.set(k, b);
    });
    const bloqueosUnicos = [...vistos.values()];
    bloqueos.length = 0; bloqueosUnicos.forEach(b => bloqueos.push(b));

    const efectivoHoy = compras.reduce((a,c)=>a+(c.efectivoHoy||0),0);
    const rent = rentabilidad({
      subtotalBaseInsumos: subtotal,
      reservaInsumos: aumentoIns,
      labor: lab.costoEmpleados,
      duenos: lab.costoDuenos,
      duenosEnCosto: P.incluirDuenos ? lab.costoDuenos : 0,
      duenosIncluidos: !!P.incluirDuenos,
      otrosGastos: otros,
      costosProtegidos: costosFijos,
      precioFinal, comision,
      salesTax: tax, taxAplica: TX.aplica, taxPct: TX.pct, motivoSinTax: TX.motivo,
      efectivoCompraHoy: efectivoHoy,
      invitados: ev.invitados || 0
    });

    return {
      unidades: up.unidades, totalesCategoria: up.totales, sumaPct: up.sumaPct,
      masa: ms, cloud: ms.cloud, stickers: stk, hielo: hi, syrups: sy, signature: sgA, sigUnidades: up.sigUnidades||0,
      consumos: cs, labor: lab, compras,
      costos: { baseIngredientes: baseIng, baseEmpaques: baseEmp, baseConsumibles: baseCons,
                signature: costoSig, customDesign: stk.costoAsignado, syrups: sy.costoAsignado, subtotal, aumento: aumentoIns, aumentoPct: AUM, insumosAjustados: insumos,
                labor: lab.costoEmpleados, duenos: lab.costoDuenos,
                duenosEnCosto: P.incluirDuenos ? lab.costoDuenos : 0,
                otrosGastos: otros, costosFijos, comision, costoTotal, laborTotal: lab.costoEmpleados + lab.costoDuenos },
      impuesto: TX,
      precio: { divisor, recomendado, minimoAplicado: P.aplicarMinimo && recomendado < (P.minimoEvento||0),
                precioFinal, utilidad, margenReal, margenObjetivo: P.margenObjetivo,
                salesTax: tax, totalCliente: precioFinal + tax,
                precioPorInvitado: ev.invitados ? precioFinal/ev.invitados : 0 },
      rentabilidad: rent,
      bloqueos, avisos,
      estado: bloqueos.length ? 'BLOQUEADA' : 'LISTA PARA ENVIAR',
      efectivoCompraHoy: efectivoHoy
    };
  }

  /* ================== RESUMEN DE RENTABILIDAD DEL EVENTO ==================
     Seccion INTERNA. No aparece en la propuesta del cliente.
     No modifica la formula de precio: solo reordena cifras ya calculadas.

       costo base real       = subtotal base de insumos + labor + otros + duenos(si estan en costo)
       reserva de insumos    = costo asignado de insumos - costo base de insumos
       costos protegidos     = costo base real + reserva          (= costos fijos que fijan el precio)
       comision              = precio final x % de comision
       ganancia por margen   = precio final - costos protegidos - comision
       ganancia potencial    = precio final - costo base real - comision
                             = ganancia por margen + reserva
     El sales tax nunca entra en ingreso, ganancia ni margen.
     El efectivo de compra NO se usa para calcular rentabilidad.                  */
  function rentabilidad(x){
    const n = v => (typeof v === 'number' && isFinite(v)) ? v : 0;
    const precio = (typeof x.precioFinal === 'number' && isFinite(x.precioFinal)) ? x.precioFinal : null;

    const costoBaseReal = n(x.subtotalBaseInsumos) + n(x.labor) + n(x.otrosGastos) + n(x.duenosEnCosto);
    const reservaInsumos = n(x.reservaInsumos);
    const costosProtegidos = costoBaseReal + reservaInsumos;
    const comision = n(x.comision);

    const gananciaPorMargen   = precio === null ? null : precio - costosProtegidos - comision;
    const gananciaPotencial   = precio === null ? null : precio - costoBaseReal - comision;
    const margenRealProtegido = (precio && precio > 0) ? gananciaPorMargen / precio : 0;
    const margenPotencial     = (precio && precio > 0) ? gananciaPotencial / precio : 0;

    /* la identidad debe cerrar exacta; solo se tolera error de coma flotante */
    const descuadre = precio === null ? 0
      : (gananciaPotencial - (gananciaPorMargen + reservaInsumos));

    const inv = Math.max(0, Math.round(n(x.invitados)));
    const tax = n(x.salesTax);

    return {
      ingresoAntesTax: precio,
      costoBaseReal,
      desgloseBase: { insumosBase: n(x.subtotalBaseInsumos), labor: n(x.labor),
                      duenos: n(x.duenosEnCosto), otrosGastos: n(x.otrosGastos) },
      reservaInsumos,
      reservaEtiqueta: 'Reserva de insumos / ganancia potencial adicional',
      reservaExplicacion: 'Esta cantidad protege contra variaciones de precio, desperdicios y compras ' +
        'inesperadas. Si no se utiliza, se convierte en ganancia adicional.',
      costosProtegidos,
      comision,
      gananciaPorMargen, margenRealProtegido,
      gananciaPotencialTotal: gananciaPotencial, margenPotencialEfectivo: margenPotencial,
      potencialExplicacion: 'Esta es la ganancia potencial si el evento utiliza únicamente el costo base ' +
        'estimado y no consume la reserva de insumos.',
      salesTax: tax, taxAplicado: !!x.taxAplica, taxPct: x.taxPct,
      taxEtiqueta: 'Sales tax cobrado — no es ganancia',
      taxNota: x.taxAplica ? '' : 'No aplicado',
      motivoSinTax: x.motivoSinTax || '',
      efectivoCompraHoy: n(x.efectivoCompraHoy),
      efectivoExplicacion: 'Puede ser diferente del costo consumido porque considera paquetes completos, ' +
        'existencias y colchón de inventario.',
      invitados: inv,
      precioPorInvitado: (inv > 0 && precio !== null) ? precio / inv : null,
      totalPorInvitado:  (inv > 0 && precio !== null) ? (precio + tax) / inv : null,
      duenosExcluidos: !x.duenosIncluidos,
      avisoDuenos: x.duenosIncluidos ? '' :
        'El pago de dueños está excluido. La ganancia potencial mostrada no descuenta compensación de dueños.',
      duenosFuera: x.duenosIncluidos ? 0 : n(x.duenos),
      conciliacionOk: Math.abs(descuadre) < 1e-9,
      descuadre
    };
  }
  function unidadPractica(d, id){
    const i = d.ingredientes.find(x=>x.id===id);
    if (!i) return { nombre:'unidades', factor:1, base:'unidades' };   // empaques
    if (/^LECHE_(ENTERA|DESLAC|AVENA|ALMEND)$/.test(id))
      return { nombre:'galones', factor:(i.densidad||1.03)*3785.41, base:i.unidadBase };
    if (id==='BANANO'){ const g=i.factorBase||120, b=i.cantPresentacion||6;
      return { nombre:'bunches', factor:g*b, base:i.unidadBase }; }
    if (id==='HIELO') return { nombre:'lb', factor:453.592, base:i.unidadBase };
    if (/^PULPA_/.test(id)) return { nombre:'envases de 64 oz', factor:1814.4, base:i.unidadBase };
    if (['CAFE','HARINA','FRESA_A','FRESA_B','QUESO','AREQUIPE'].includes(id))
      return { nombre:'lb', factor:453.592, base:i.unidadBase };
    return { nombre:i.unidadBase||'unidades', factor:1, base:i.unidadBase };
  }
  const API = { cotizar, rentabilidad, unidadPractica, ETAPAS_TITULO, proveedorSyrup, hielo, syrups, gramosPresentacion, aumento, factorAumento, taxCfg, vasoFrio, sigActiva, sigUnidades, cloud, stickers, unidadesPorProducto, masa, consumos, labor, fichaIngrediente, fichaEmpaque, ETAPAS, techo };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  raiz.MannaMotor = API;
})(typeof window !== 'undefined' ? window : globalThis);
