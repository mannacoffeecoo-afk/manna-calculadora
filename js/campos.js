/* MANNA — Edicion de campos numericos sin perder el foco.
   Regla: al teclear NO se redibuja. Se redibuja al salir del campo, con Enter,
   o tras una pausa corta. Selectores y botones si actualizan al instante. */
(function(){
'use strict';
let t=null, pendiente=false;
const PAUSA=700;

function foco(){
  const a=document.activeElement;
  if(!a || !/^(INPUT|TEXTAREA)$/.test(a.tagName)) return null;
  const sec=a.closest('section'); if(!sec) return null;
  const campos=[...sec.querySelectorAll('input,textarea')];
  return { sec:sec.id, i:campos.indexOf(a),
           ini:a.selectionStart, fin:a.selectionEnd, val:a.value };
}
function restaurar(f){
  if(!f) return;
  const sec=document.getElementById(f.sec); if(!sec) return;
  const campos=[...sec.querySelectorAll('input,textarea')];
  const el=campos[f.i]; if(!el) return;
  el.focus();
  try{ if(el.type!=='number' && f.ini!=null) el.setSelectionRange(f.ini,f.fin); }catch(e){}
}
/* Redibuja conservando el foco y el cursor */
function detalles(){ return [...document.querySelectorAll('details')].map(x=>x.open); }
function restaurarDetalles(abiertos){
  const ds=[...document.querySelectorAll('details')];
  abiertos.forEach((ab,i)=>{ if(ds[i]) ds[i].open=ab; });
}
function render(){
  pendiente=false; clearTimeout(t); t=null;
  const f=foco(), ab=detalles();
  try { window.mPintar(); }
  catch(err){ console.error(err); window.mError('No se pudo actualizar la pantalla: '+err.message); return; }
  restaurarDetalles(ab);
  restaurar(f);
}
/* Programa el redibujo tras una pausa (no interrumpe la escritura) */
function programar(){
  pendiente=true; clearTimeout(t);
  t=setTimeout(render, PAUSA);
}
window.mRender = render;
window.mProgramar = programar;
window.mHayPendiente = ()=>pendiente;

/* Salir del campo o Enter -> aplica de inmediato */
document.addEventListener('focusout', e=>{
  if(/^(INPUT|TEXTAREA)$/.test(e.target.tagName) && pendiente) render();
}, true);
document.addEventListener('keydown', e=>{
  if(e.key==='Enter' && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)){ e.preventDefault(); render(); }
}, true);

/* La app nunca debe morir en silencio */
window.mError=msg=>{
  let b=document.getElementById('mErr');
  if(!b){ b=document.createElement('div'); b.id='mErr'; b.className='banner bad';
    b.style.cssText='position:sticky;top:0;z-index:99;margin:0';
    document.querySelector('main').prepend(b); }
  b.innerHTML='<span class="ico">●</span><div>'+msg+
    ' <button class="btn sm sec" style="margin-left:10px" onclick="this.closest(\'#mErr\').remove()">Cerrar</button></div>';
};
/* Aviso informativo, independiente del error rojo */
window.mAviso=msg=>{
  let b=document.getElementById('mAvi');
  if(!b){ b=document.createElement('div'); b.id='mAvi'; b.className='banner warn';
    b.style.cssText='margin:0 0 14px'; document.querySelector('main').prepend(b); }
  b.innerHTML='<span class="ico">▲</span><div>'+msg+
    ' <button class="btn sm sec" style="margin-left:10px" onclick="this.closest(\'#mAvi\').remove()">Entendido</button></div>';
};
window.addEventListener('error', e=>{ window.mError('Ocurrió un error: '+e.message+'. Tus datos están guardados.'); });
})();
/* Aviso de mudanza: si la ruta cambio y no hay datos guardados, lo decimos claro */
(function(){
  try{
    const K='manna.rutaConocida', aqui=location.href.replace(/[^/]*$/,'');
    const previa=localStorage.getItem(K);
    const hayDatos=!!localStorage.getItem('manna.datos.v1');
    if(previa && previa!==aqui && !hayDatos){
      window.addEventListener('DOMContentLoaded',()=>window.mAviso(
        '<b>Abriste la app desde otra carpeta.</b> Este navegador no encuentra los datos guardados en la ubicación '+
        'anterior. No se perdieron. Para traerlos: abre la app en la carpeta vieja, ve a Configuración y pulsa '+
        '<b>Exportar respaldo</b>; luego vuelve aquí y usa <b>Importar respaldo</b>. '+
        'Mientras tanto puedes cotizar normalmente con los datos iniciales.'));
    }
    localStorage.setItem(K,aqui);
  }catch(e){}
})();
