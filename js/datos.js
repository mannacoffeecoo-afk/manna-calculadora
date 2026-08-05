/* MANNA — Capa de datos: carga, persistencia local, respaldos.
   Los datos editables NUNCA viven dentro del codigo: salen de datos/semilla.js */
(function (raiz) {
  'use strict';
  const CLAVE = 'manna.datos.v1', CLAVE_COT = 'manna.cotizaciones.v1';
  const clon = o => JSON.parse(JSON.stringify(o));
  const esObj = v => v && typeof v === 'object' && !Array.isArray(v);

  /* Copia SOLO lo que falta. Nunca pisa un valor que ya existe (incluido null, que
     en este modelo significa "pendiente"). */
  function agregarFaltantes(dst, src) {
    if (!esObj(dst) || !esObj(src)) return dst;
    for (const k of Object.keys(src)) {
      if (!(k in dst)) dst[k] = clon(src[k]);
      else if (esObj(dst[k]) && esObj(src[k])) agregarFaltantes(dst[k], src[k]);
    }
    return dst;
  }
  /* Colecciones con id: agrega los registros que faltan y, en los existentes,
     solo las propiedades ausentes. */
  function fusionarPorId(dst, src, omitir) {
    if (!Array.isArray(dst) || !Array.isArray(src)) return dst;
    const idx = new Map(dst.map(x => [x && x.id, x]));
    src.forEach(s => {
      const y = idx.get(s.id);
      if (!y) { dst.push(clon(s)); return; }
      for (const k of Object.keys(s)) {
        if (omitir && omitir.includes(k)) continue;
        if (!(k in y)) y[k] = clon(s[k]);
        else if (esObj(y[k]) && esObj(s[k])) agregarFaltantes(y[k], s[k]);
      }
    });
    return dst;
  }
  /* Normalizacion aditiva contra la semilla.
     historico = true  -> ademas NO adopta el selector de proveedor en insumos que ya existian,
                          para que una cotizacion guardada conserve su costo original. */
  function normalizar(d, opciones) {
    const S = raiz.MANNA_SEMILLA, hist = !!(opciones && opciones.historico);
    if (!esObj(d)) return clon(S);
    const nuevos = [];
    /* Se anota que traia ANTES de fusionar, para que una instantanea historica
       no herede funciones nuevas que cambiarian su precio. */
    const teniaHielo = esObj(d.evento) && esObj(d.evento.hielo);
    const teniaSelectorHielo = esObj(d.parametros) && ('hieloComprado' in d.parametros);
    /* Una instantanea solo conserva el costo de syrups si TENIA todo lo necesario para calcularlo.
       Si le faltaba cualquier pieza, el modulo entra en cero y su total no se mueve. */
    const teniaAumento = esObj(d.evento) && ('aumentoInsumos' in d.evento);
    const teniaTax = esObj(d.evento) && ('aplicarSalesTax' in d.evento);
    const teniaVaso = esObj(d.evento) && ('vasoFrio12' in d.evento);
    const teniaSyrups = esObj(d.evento) && esObj(d.evento.syrups)
                        && esObj(d.syrups) && esObj(d.proveedoresSyrup);
    ['parametros','masaCrepes','selectores','unidadesPracticas','inventario',
     'signatures','customDesign','proveedoresSyrup'].forEach(k => {
      if (!(k in d)) { d[k] = clon(S[k]); nuevos.push(k); }
      else agregarFaltantes(d[k], S[k]);
    });
    if (!esObj(d.evento)) d.evento = clon(S.evento);
    ['signature','customDesign','otrosGastos','porPersona','mezclaLeche'].forEach(k => {
      if (!(k in d.evento)) { d.evento[k] = clon(S.evento[k]); nuevos.push('evento.'+k); }
      else agregarFaltantes(d.evento[k], S.evento[k]);
    });
    agregarFaltantes(d.evento, S.evento);
    const omitir = hist ? ['proveedorSyrup'] : null;
    fusionarPorId(d.ingredientes = d.ingredientes || [], S.ingredientes, omitir);
    fusionarPorId(d.empaques     = d.empaques     || [], S.empaques);
    fusionarPorId(d.productos    = d.productos    || [], S.productos, ['pctPerfil','receta','empaques']);
    if (d.signatures && S.signatures)
      fusionarPorId(d.signatures.recetas = d.signatures.recetas || [], S.signatures.recetas, ['activa']);
    ['empleados','duenos'].forEach(gr => {
      d.labor = d.labor || clon(S.labor);
      (d.labor[gr] || []).forEach(p => {
        if (!('presenteServicio' in p)) p.presenteServicio = !!(p.horas && p.horas.servicio > 0);
        if (!esObj(p.horas)) p.horas = {consulta:0,compras:0,preparacion:0,montaje:0,servicio:0,limpieza:0,administracion:0};
      });
    });
    if (hist) {
      /* Historico: lo nuevo entra apagado o en cero. Su total no se mueve. */
      if (!teniaHielo) d.evento.hielo = { coolerGrande: 0, reservaColeman: 0 };
      if (!teniaSelectorHielo) d.parametros.hieloComprado = false;
      if (!teniaSyrups) d.evento.syrups = { JAR_VAINILLA: 0, JAR_CARAMELO: 0, JAR_AVELLANA: 0 };
      /* Historicas: conservan su 25% y su tax original; nunca adoptan el U-Shape */
      if (!teniaAumento) d.evento.aumentoInsumos = (d.parametros && d.parametros.aumentoInterno != null)
                                                   ? d.parametros.aumentoInterno : 0.25;
      if (!teniaTax) { d.evento.aplicarSalesTax = true;
                       d.evento.salesTaxPct = (d.parametros && d.parametros.salesTax != null) ? d.parametros.salesTax : 0.06; }
      if (!teniaVaso) d.evento.vasoFrio12 = 'VASO_FRIO_12';
    }
    d.meta = d.meta || {};
    return { datos: d, nuevos };
  }

  const Datos = {
    d: null,
    cargar() {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) {
        let leido = null;
        try { leido = JSON.parse(guardado); } catch (e) { leido = null; }
        if (leido && typeof leido === 'object') {
          this.d = leido;
          try { this.migrar(); }
          catch (e) {
            /* Pase lo que pase, los datos del usuario NO se descartan */
            console.error('Fallo la migracion:', e);
            try { this.d = normalizar(this.d, { historico: false }).datos; this.guardar(); } catch (e2) {}
            this.avisoMigracion = 'Hubo un problema al actualizar la estructura de tus datos (' + e.message + '). '
              + 'Se completó lo indispensable y TUS DATOS NO SE BORRARON: precios, inventario, mano de obra, '
              + 'configuración y cotizaciones siguen ahí. Si ves algo raro, usa Configuración → Exportar respaldo.';
          }
          return this.d;
        }
        /* JSON ilegible: se guarda una copia intacta antes de arrancar con la semilla */
        try { localStorage.setItem(CLAVE + '.ilegible.' + Date.now(), guardado); } catch (e) {}
        this.avisoMigracion = 'Los datos guardados no se pudieron leer. Se guardó una copia sin tocar en el navegador '
          + 'y la app arrancó con los valores iniciales. Nada se borró.';
      }
      this.d = clon(raiz.MANNA_SEMILLA);
      this.guardar();
      if (!localStorage.getItem(CLAVE + '.respaldo'))
        localStorage.setItem(CLAVE + '.respaldo', JSON.stringify(raiz.MANNA_SEMILLA));
      return this.d;
    },
    guardar() { localStorage.setItem(CLAVE, JSON.stringify(this.d)); },
    /* Migracion segura: corrige SOLO el dato inicial afectado y solo si el usuario no lo edito */
    migrar() {
      let d = this.d; const rev = (d.meta && d.meta.semillaRev) || 1;
      this.avisoMigracion = null;
      if (rev < 2) {
        const p = (d.labor.empleados||[])[1];
        if (p && p.horas && p.horas.montaje === 1.05) {
          p.horas.montaje = 1.5;
          this.avisoMigracion = 'Se corrigió un dato inicial: horas de montaje del Empleado 2 pasaron de 1.05 a 1.5, '
            + 'para que la app coincida con el Excel. Tus demás cambios se conservaron.';
        } else if (p) {
          this.avisoMigracion = 'Nota: el dato inicial de horas de montaje del Empleado 2 cambió a 1.5 en esta versión, '
            + 'pero tú ya lo habías editado, así que respetamos tu valor.';
        }
        (d.labor.empleados||[]).concat(d.labor.duenos||[]).forEach(x=>{
          if (x.presenteServicio === undefined) x.presenteServicio = (x.horas && x.horas.servicio > 0) || false;
        });
        d.meta = d.meta || {}; d.meta.semillaRev = 2; d.meta.version = '2.0';
        this.guardar();
      }
      if (((d.meta && d.meta.semillaRev) || 1) < 3) {
        const og = d.evento.otrosGastos || (d.evento.otrosGastos = {});
        const h = og.hielo;
        delete og.hielo;                                   // el hielo sale del calculo de receta
        if (og.otroPersonalizado === undefined) og.otroPersonalizado = 0;
        if (d.evento.otroGastoNota === undefined) d.evento.otroGastoNota = '';
        if (typeof h === 'number' && h > 0 && Math.abs(h - 59.88) > 0.005) {
          og.otroPersonalizado = h;
          d.evento.otroGastoNota = 'Migrado desde el gasto manual de Hielo';
          this.avisoMigracion = 'El gasto manual de Hielo se eliminó para no cobrarlo dos veces: el hielo ahora sale '
            + 'solo del cálculo de receta. Como tú habías puesto $' + h.toFixed(2) + ', lo moví a "Otro gasto '
            + 'personalizado" para que no pierdas el monto. Revísalo y bórralo si ya no aplica.';
        } else if (typeof h === 'number' && h > 0) {
          this.avisoMigracion = 'Se eliminó el gasto manual de Hielo de $59.88 heredado del Excel. El hielo ahora se '
            + 'calcula solo desde la receta, con el selector "Comprar hielo". Antes se podía cobrar dos veces.';
        }
        d.meta.semillaRev = 3; d.meta.version = '2.2';
        this.guardar();
      }
      /* 3 -> 4: Signature Drinks y Custom Design.  4 -> 5: proveedores de syrup.
         Ambas son aditivas: no tocan nada que ya exista. */
      if (((d.meta && d.meta.semillaRev) || 1) < 5) {
        const antes = (d.meta && d.meta.semillaRev) || 1;
        const r = normalizar(d, { historico: false });
        this.d = d = r.datos;
        if (d.evento.signature) d.evento.signature.ofrecer = !!d.evento.signature.ofrecer;
        if (d.evento.customDesign) d.evento.customDesign.activo = !!d.evento.customDesign.activo;
        d.meta.semillaRev = 5; d.meta.version = '3.1';
        this.guardar();
        if (r.nuevos.length)
          this.avisoMigracion = 'Se actualizaron tus datos de la revisión ' + antes + ' a la 5 sin tocar nada de lo tuyo. '
            + 'Se agregaron las estructuras que faltaban (' + r.nuevos.join(', ') + '), los insumos nuevos de v18/v19 y '
            + 'el selector de proveedor de syrup. Signature Drinks y Custom Design quedan DESACTIVADOS. '
            + 'Tus precios, recetas, inventario, mano de obra, configuración y cotizaciones guardadas se conservaron.';
      }
      /* 5 -> 6: hielo operativo (cooler grande + reserva Coleman) */
      if (((d.meta && d.meta.semillaRev) || 1) < 6) {
        const S = raiz.MANNA_SEMILLA;
        const ev = d.evento = d.evento || {};
        const antes = ev.hielo ? clon(ev.hielo) : null;
        const sem = (S.evento && S.evento.hielo) || { coolerGrande: 3, reservaColeman: 2 };
        if (!esObj(ev.hielo)) ev.hielo = clon(sem);
        else {                                   /* parcial: solo se completa lo que falta */
          if (!('coolerGrande'   in ev.hielo)) ev.hielo.coolerGrande   = sem.coolerGrande;
          if (!('reservaColeman' in ev.hielo)) ev.hielo.reservaColeman = sem.reservaColeman;
        }
        d.parametros = d.parametros || {};
        if (!('hieloComprado' in d.parametros)) d.parametros.hieloComprado = true;
        d.meta.semillaRev = 6; d.meta.version = '3.2';
        this.guardar();
        const puso = !antes || antes.coolerGrande === undefined || antes.reservaColeman === undefined;
        if (puso) {
          const txt = 'Se agregaron ' + ev.hielo.coolerGrande + ' bolsas para el cooler grande y '
            + ev.hielo.reservaColeman + ' bolsas de reserva Coleman. Revisa estas cantidades para el evento actual.'
            + (d.parametros.hieloComprado ? '' : ' Ojo: tienes "Hielo comprado" en No, así que las bolsas se muestran '
              + 'como referencia y NO se están cobrando.');
          this.avisoMigracion = this.avisoMigracion ? (this.avisoMigracion + ' ' + txt) : txt;
        }
      }
      /* 6 -> 7: modulo de syrups en modo manual por botellas */
      if (((d.meta && d.meta.semillaRev) || 1) < 7) {
        const S = raiz.MANNA_SEMILLA;
        if (!esObj(d.syrups)) d.syrups = clon(S.syrups);
        else agregarFaltantes(d.syrups, S.syrups);
        d.evento = d.evento || {};
        if (!esObj(d.evento.syrups)) d.evento.syrups = clon(S.evento.syrups);
        else agregarFaltantes(d.evento.syrups, S.evento.syrups);
        d.meta.semillaRev = 7; d.meta.version = '3.3';
        this.guardar();
        const txt = 'Se activó el modo manual de syrups: 2 botellas de French Vanilla, 2 de Caramel y 2 de Hazelnut '
          + 'para este evento. Ajústalas si hace falta. El modo calculado por consumo sigue pendiente de las densidades.';
        this.avisoMigracion = this.avisoMigracion ? (this.avisoMigracion + ' ' + txt) : txt;
      }
      /* 7 -> 8: cloud por peso (26.25 g crema + 17.25 g syrup = 43.5 g por bebida de 12 oz) */
      if (((d.meta && d.meta.semillaRev) || 1) < 8) {
        const S = raiz.MANNA_SEMILLA;
        d.signatures = d.signatures || clon(S.signatures);
        delete d.signatures.cloudRatio;                       /* proporcion 25:20 retirada */
        d.signatures.cloudReceta = clon(S.signatures.cloudReceta);
        (d.signatures.recetas || []).forEach(r => { delete r.cloudG; });
        d.meta.semillaRev = 8; d.meta.version = '3.4';
        this.guardar();
        const txt = 'Se actualizó la receta del cloud a la confirmada por peso: 26.25 g de heavy whipping + '
          + '17.25 g de syrup = 43.5 g por bebida de 12 oz. Reemplaza los 25 g y la proporción 25:20 anteriores.';
        this.avisoMigracion = this.avisoMigracion ? (this.avisoMigracion + ' ' + txt) : txt;
      }
      /* 8 -> 9: aumento editable, sales tax activable, U-Shape, densidades, panela, canela, crumbles */
      if (((d.meta && d.meta.semillaRev) || 1) < 9) {
        const S = raiz.MANNA_SEMILLA, ev = d.evento = d.evento || {}, P = d.parametros = d.parametros || {};
        if (P.aumentoInterno === undefined) P.aumentoInterno = 0.25;
        if (P.aplicarSalesTax === undefined) P.aplicarSalesTax = true;
        if (P.salesTax === undefined) P.salesTax = 0.06;
        if (ev.aumentoInsumos === undefined) ev.aumentoInsumos = (P.aumentoInterno != null ? P.aumentoInterno : 0.25);
        if (ev.aplicarSalesTax === undefined) ev.aplicarSalesTax = true;
        if (ev.salesTaxPct === undefined) ev.salesTaxPct = (P.salesTax != null ? P.salesTax : 0.06);
        if (ev.motivoSinTax === undefined) ev.motivoSinTax = '';
        if (!esObj(d.vasosFrios12)) d.vasosFrios12 = clon(S.vasosFrios12);
        if (ev.vasoFrio12 === undefined) ev.vasoFrio12 = 'VASO_FRIO_12';   /* nunca adopta U-Shape solo */
        fusionarPorId(d.empaques = d.empaques || [], S.empaques);          /* agrega U-Shape al catalogo */
        fusionarPorId(d.ingredientes = d.ingredientes || [], S.ingredientes);
        d.meta.semillaRev = 9; d.meta.version = '3.5';
        this.guardar();
        const txt = 'Se agregaron: aumento de insumos editable por evento (25%), sales tax activable (Si, 6%), '
          + 'el vaso U-Shape de 12 oz al catalogo sin seleccionarlo, y las densidades, panela, canela y '
          + 'pistachio crumbles confirmados. Tus precios, recetas, inventario y tarifas se conservaron.';
        this.avisoMigracion = this.avisoMigracion ? (this.avisoMigracion + ' ' + txt) : txt;
      }
      /* 9 -> 10: Resumen de rentabilidad del evento (seccion interna, solo lectura)
         No cambia ningun costo, receta, tarifa ni parametro de precio: solo agrega el
         interruptor de visualizacion. Las cotizaciones historicas NO se recalculan. */
      if (((d.meta && d.meta.semillaRev) || 1) < 10) {
        const P = d.parametros = d.parametros || {};
        if (P.mostrarRentabilidad === undefined) P.mostrarRentabilidad = true;
        d.meta.semillaRev = 10; d.meta.version = '3.6';
        this.guardar();
        const txt = 'Se agrego el "Resumen de rentabilidad del evento" en la pestana Resultado. '
          + 'Es una seccion interna: no aparece en la propuesta PDF del cliente. No cambia precios, '
          + 'recetas, costos, margen ni el aumento de insumos, y no recalcula tus cotizaciones guardadas.';
        this.avisoMigracion = this.avisoMigracion ? (this.avisoMigracion + ' ' + txt) : txt;
      }
      return this.avisoMigracion;
    },
    /* Nueva cotizacion limpia: borra solo lo del evento anterior */
    nuevaCotizacion() {
      const d = this.d, S = raiz.MANNA_SEMILLA;
      d.evento = { cliente:'', fecha:'', lugar:'', notas:'', invitados:0, horas:0, millas:0,
        porPersona:{cafe:0,matcha:0,sparkling:0,crepes:0},
        mezclaLeche: clon(d.evento.mezclaLeche), aguaPrimo:0,
        otrosGastos: Object.fromEntries(Object.keys(d.evento.otrosGastos||{}).map(k=>[k,0])),
        otroGastoNota: '',
        signature:{activo:false,nombre:'',cantidad:0,costoUnitario:0,nota:''},
        hielo:{coolerGrande:3,reservaColeman:2},
        aumentoInsumos: (d.parametros.aumentoInterno != null ? d.parametros.aumentoInterno : 0.25),
        aplicarSalesTax: (d.parametros.aplicarSalesTax !== false),
        salesTaxPct: (d.parametros.salesTax != null ? d.parametros.salesTax : 0.06),
        motivoSinTax: '', vasoFrio12: 'VASO_FRIO_12',
        syrups:{JAR_VAINILLA:2,JAR_CARAMELO:2,JAR_AVELLANA:2},
        vigenciaDias: 15, notasFinales:'' };
      d.evento.hielo = { coolerGrande: 3, reservaColeman: 2 };
      d.parametros.hieloComprado = true;   // recomendado: protege el precio
      ['empleados','duenos'].forEach(gr => (d.labor[gr]||[]).forEach(p => {
        Object.keys(p.horas).forEach(k => p.horas[k] = 0);       // conserva persona, rol y tarifa
        p.presenteServicio = false;
      }));
      d.productos.forEach(p => { const o = S.productos.find(q=>q.id===p.id); if (o) p.pctPerfil = o.pctPerfil; });
      this.cotizacionAbierta = null; this.sucio = false;
      this.guardar();
      return d;
    },
    sucio: false, cotizacionAbierta: null, avisoMigracion: null,
    normalizar,
    siguienteNumero() {
      const n = this.cotizaciones().reduce((a,c)=>Math.max(a, c.numero||0), 0);
      return n + 1;
    },
    restaurarSemilla() { this.d = clon(raiz.MANNA_SEMILLA); this.guardar(); return this.d; },
    exportar() {
      const blob = new Blob([JSON.stringify({ datos: this.d, cotizaciones: this.cotizaciones() }, null, 1)],
                            { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `manna-respaldo-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
    },
    importar(txt) {
      const o = JSON.parse(txt);
      if (o.datos) { this.d = normalizar(o.datos, { historico: false }).datos; this.migrar(); this.guardar(); }
      if (o.cotizaciones) localStorage.setItem(CLAVE_COT, JSON.stringify(o.cotizaciones));
      return true;
    },
    cotizaciones() { try { return JSON.parse(localStorage.getItem(CLAVE_COT)) || []; } catch (e) { return []; } },
    /* Congela una copia completa de datos y resultados: no cambia si luego editas precios */
    guardarCotizacion(nombre, resultado) {
      const lista = this.cotizaciones();
      const existente = this.cotizacionAbierta ? lista.findIndex(c=>c.id===this.cotizacionAbierta) : -1;
      const numero = existente >= 0 ? lista[existente].numero : this.siguienteNumero();
      const id = existente >= 0 ? lista[existente].id : 'C' + Date.now();
      const reg = { id, numero, nombre, guardadaEn: new Date().toISOString(),
        cliente: this.d.evento.cliente || '', fechaEvento: this.d.evento.fecha || '',
        estado: resultado.bloqueos.length ? 'BLOQUEADA' : 'LISTA PARA ENVIAR',
        instantanea: clon(this.d),
        resumen: { estado: resultado.estado, precioFinal: resultado.precio.precioFinal,
                   salesTax: resultado.precio.salesTax, total: resultado.precio.totalCliente,
                   margen: resultado.precio.margenReal, utilidad: resultado.precio.utilidad,
                   invitados: this.d.evento.invitados,
                   totales: clon(resultado.totalesCategoria) } };
      if (existente >= 0) lista[existente] = reg; else lista.unshift(reg);
      localStorage.setItem(CLAVE_COT, JSON.stringify(lista.slice(0, 300)));
      this.cotizacionAbierta = id; this.sucio = false;
      return reg;
    },
    borrarCotizacion(id) {
      localStorage.setItem(CLAVE_COT, JSON.stringify(this.cotizaciones().filter(c => c.id !== id)));
    },
    aplicarCotizacion(c) {
      /* historico = true: solo se agrega estructura faltante; los costos originales no cambian */
      if (c.instantanea) this.d = normalizar(clon(c.instantanea), { historico: true }).datos;
      this.cotizacionAbierta = c.id; this.sucio = false;
      this.guardar();
    }
  };
  raiz.MannaDatos = Datos;
})(typeof window !== 'undefined' ? window : globalThis);
