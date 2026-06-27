// Imperative Leaflet map — ported verbatim from the standalone build.
export default function initRutaVelero() {
  const L = window.L;
// ===== Datos: name, flag, [lat,lng], nm(dato), est?, region, via[], rest(d), recalada?, info =====
const WP = [
  ["Tracys Landing","🇺🇸",[38.72,-76.55], null,0,"us",[], 0,0,"Herrington Harbour, base de salida en la Bahía de Chesapeake."],
  ["Norfolk","🇺🇸",[36.85,-76.29], 180,0,"us",[[37.95,-76.18],[37.05,-76.02]], 3,0,"Milla 0 del ICW; último gran puerto para pertrechar antes del océano."],
  ["Beaufort","🇺🇸",[34.72,-76.66], 205,0,"us",[[36.10,-75.30],[35.20,-75.35]], 1,0,"Beaufort Docks; salto offshore rodeando el Cabo Hatteras."],
  ["Charleston","🇺🇸",[32.78,-79.93], 210,0,"us",[[33.75,-77.75],[33.00,-78.95]], 3,0,"Charleston City Marina (the MegaDock); parada histórica y abrigada."],
  ["St. Augustine","🇺🇸",[29.90,-81.31], 190,0,"us",[[31.40,-80.30],[30.50,-81.00]], 2,0,"Municipal Marina; ciudad más antigua de EEUU, buen refugio."],
  ["West Palm Beach","🇺🇸",[26.71,-80.05], 220,0,"us",[[28.40,-80.45],[27.30,-80.05]], 7,1,"Lake Worth; punto de salto a Bahamas. Cruce del Gulf Stream."],
  ["Bimini","🇧🇸",[25.73,-79.30], 55,0,"bah",[[26.15,-79.70]], 2,0,"Primera entrada a Bahamas; despacho de aduana tras cruzar la corriente."],
  ["Nassau","🇧🇸",[25.06,-77.34], 90,0,"bah",[[25.55,-78.45]], 7,1,"Nassau Harbour; reabastecimiento completo de víveres y combustible."],
  ["Georgetown (Exumas)","🇧🇸",[23.51,-75.76], 165,0,"bah",[[24.55,-76.75],[23.90,-76.15]], 7,1,"Elizabeth Harbour; gran fondeadero cruisero, agua y comunidad."],
  ["Long Island","🇧🇸",[23.18,-75.10], 230,0,"bah",[[23.35,-75.40]], 1,0,"Thompson Bay; fondeo tranquilo antes del salto al sudeste."],
  ["Mayaguana","🇧🇸",[22.37,-73.01], 220,0,"bah",[[22.85,-74.05]], 1,0,"Abraham's Bay; última escala bahamesa, espera de ventana de viento."],
  ["Providenciales","🇹🇨",[21.77,-72.27], 52,1,"bah",[[22.10,-72.65]], 3,0,"Sapodilla Bay; despacho de Turks & Caicos."],
  ["Grand Turk","🇹🇨",[21.47,-71.14], 130,0,"bah",[[21.62,-71.62]], 1,0,"Fondeo abierto; salto al Paso de los Vientos hacia La Española."],
  ["Luperón","🇩🇴",[19.90,-70.96], 95,1,"anti",[[20.75,-71.00]], 7,1,"Bahía cerrada: 'agujero de huracán' clásico y aduana de Rep. Dominicana."],
  ["Samaná","🇩🇴",[19.21,-69.34], 135,0,"anti",[[19.60,-70.25],[19.32,-69.55]], 3,0,"Bahía de Samaná; salida hacia el exigente Paso de la Mona."],
  ["Boquerón","🇵🇷",[18.03,-67.18], 135,1,"anti",[[18.75,-68.35],[18.25,-67.55]], 5,1,"Bahía abrigada; entrada a Puerto Rico y despacho de EEUU."],
  ["Ponce","🇵🇷",[17.98,-66.61], 90,0,"anti",[[17.88,-66.95]], 2,0,"Ponce Yacht Club; costa sur protegida de PR."],
  ["Fajardo","🇵🇷",[18.33,-65.63], 70,0,"anti",[[17.93,-65.78],[18.18,-65.58]], 3,0,"Puerto del Rey, la mayor marina del Caribe; salto a las Vírgenes."],
  ["St. Thomas","🇻🇮",[18.34,-64.93], 42,1,"anti",[[18.35,-65.28]], 3,0,"Charlotte Amalie (USVI); gran centro náutico y de servicios."],
  ["St. Croix","🇻🇮",[17.73,-64.78], 40,0,"anti",[[18.02,-64.82]], 1,0,"Christiansted; salto al este hacia las Antillas Menores."],
  ["St. Martin","🇸🇽",[18.07,-63.08], 95,1,"menor",[[17.85,-63.85]], 7,1,"Simpson Bay Lagoon; hub de reparaciones y compras libres de impuestos."],
  ["Guadalupe","🇬🇵",[16.24,-61.53], 90,0,"menor",[[17.00,-62.15],[16.65,-61.70]], 3,0,"Pointe-à-Pitre / Marina Bas-du-Fort."],
  ["Martinica","🇲🇶",[14.60,-61.07], 110,0,"menor",[[15.40,-61.25]], 7,1,"Le Marin, la mayor marina de las Antillas francesas."],
  ["Santa Lucía","🇱🇨",[13.91,-60.98], 25,0,"menor",[[14.25,-60.98]], 3,0,"Rodney Bay Marina; servicios completos, fin de la ARC."],
  ["San Vicente","🇻🇨",[13.16,-61.23], 55,0,"menor",[[13.52,-61.12]], 2,0,"Blue Lagoon; Bequia y los Granadinos a un salto."],
  ["Granada","🇬🇩",[12.05,-61.75], 40,0,"menor",[[12.60,-61.50]], 7,1,"Prickly Bay / Port Louis; refugio clásico de temporada de huracanes (~12°N)."],
  ["Chaguaramas","🇹🇹",[10.68,-61.64], 80,1,"guay",[[11.35,-61.72]], 10,1,"Hub de varadero y reparación de Trinidad, bajo el cinturón de huracanes."],
  ["Georgetown","🇬🇾",[6.80,-58.16], 240,0,"guay",[[9.90,-60.10],[8.20,-58.90]], 3,0,"Río Demerara; fondeo fluvial, trámites con agente local."],
  ["Paramaribo","🇸🇷",[5.82,-55.17], 420,0,"guay",[[6.95,-57.05],[6.30,-55.95]], 3,0,"Río Suriname / Domburg; entrada coordinada con la marea."],
  ["Cayenne","🇬🇫",[4.94,-52.30], 210,0,"guay",[[5.90,-54.00],[5.40,-53.00]], 3,0,"Dégrad des Cannes; Islas de la Salvación (Île Royale) cerca."],
  ["Belém","🇧🇷",[-1.46,-48.50], 320,0,"br",[[3.60,-50.80],[1.40,-49.10],[-0.30,-48.30]], 4,0,"Entrada por el río; Marina Belém, puerta de la Amazonia."],
  ["Fortaleza","🇧🇷",[-3.72,-38.54], 430,0,"br",[[-1.00,-45.00],[-1.70,-41.30],[-2.85,-39.40]], 7,1,"Marina Park; gran parada del nordeste tras el tramo más largo."],
  ["Natal","🇧🇷",[-5.79,-35.21], 370,0,"br",[[-4.40,-37.10],[-4.85,-35.45]], 3,0,"Iate Clube do Natal; esquina nordeste de Brasil."],
  ["Recife","🇧🇷",[-8.05,-34.88], 160,0,"br",[[-6.90,-34.78]], 4,0,"Cabanga Iate Clube; ciudad histórica."],
  ["Salvador","🇧🇷",[-12.97,-38.51], 420,0,"br",[[-9.50,-35.10],[-11.50,-37.10]], 7,1,"Bahía de Todos os Santos; Terminal Náutico."],
  ["Abrolhos","🇧🇷",[-17.96,-38.70], 560,0,"br",[[-14.40,-38.75],[-16.50,-38.60]], 2,0,"Parque Marino de Abrolhos; fondeo y ballenas jorobadas (jul–nov)."],
  ["Vitória","🇧🇷",[-20.32,-40.34], 260,0,"br",[[-19.00,-39.40],[-20.05,-40.00]], 4,0,"Iate Clube do Espírito Santo."],
  ["Búzios","🇧🇷",[-22.75,-41.88], 260,0,"br",[[-21.50,-40.70],[-22.45,-41.40]], 3,0,"Fondeo en bahías; balneario clásico."],
  ["Ilha Grande","🇧🇷",[-23.14,-44.23], 90,0,"br",[[-23.05,-43.10]], 4,1,"Vila do Abraão; bahías protegidas, antesala de Angra."],
  ["Angra dos Reis","🇧🇷",[-23.01,-44.32], 35,0,"br",[[-23.12,-44.27]], 0,0,"Destino final: bahía con 365 islas. Llegada prevista septiembre 2027."],
];

const REGIONS = {
  us:   {label:"EEUU costa este",  color:"#1a73e8", months:"Nov 2026",        water:"12–25 °C", note:"Salida tras el fin de la temporada (30 nov); aprovechá los frentes fríos del otoño.", warn:false},
  bah:  {label:"Bahamas · Turks",  color:"#12b5cb", months:"Dic 2026 – Ene 2027", water:"24–26 °C", note:"Camino espinoso (thorny path): avanzá en las ventanas que abren los frentes. Fuera de temporada de huracanes.", warn:false},
  anti: {label:"Antillas Mayores", color:"#1e8e3e", months:"Feb 2027",        water:"26 °C",    note:"Luperón (RD) es el 'agujero de huracán' clásico si hay que esperar mal tiempo.", warn:false},
  menor:{label:"Antillas Menores", color:"#f9ab00", months:"Mar – Abr 2027",  water:"27 °C",    note:"Los mejores meses del Caribe. ⚠ Hay que bajar al sur de ~12°N antes del 1 de junio.", warn:true},
  guay: {label:"Trinidad · Guayanas",color:"#a142f4",months:"May – Jul 2027", water:"28 °C",    note:"Trinidad/Granada quedan bajo el cinturón: refugio para la temporada. Tramo contra alisios y corriente.", warn:false},
  br:   {label:"Brasil",           color:"#c026d3", months:"Ago – Sep 2027",  water:"23–29 °C", note:"Atlántico Sur prácticamente sin huracanes (solo Catarina, 2004). Tramo seguro todo el año.", warn:false},
};
const RORDER = ["us","bah","anti","menor","guay","br"];

let speed = 5.5, includeRest = false;
const N = WP.length;

// ===== Geometría =====
function hav(a,b){const R=3440.065,r=Math.PI/180;const dLa=(b[0]-a[0])*r,dLo=(b[1]-a[1])*r,la1=a[0]*r,la2=b[0]*r;
  const x=Math.sin(dLa/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
function legPts(i){return [WP[i-1][2], ...WP[i][6], WP[i][2]];}
function geomLen(i){const p=legPts(i);let s=0;for(let k=1;k<p.length;k++)s+=hav(p[k-1],p[k]);return s;}

// nm base (dato del usuario) + geometría inicial para medir el "impacto" del arrastre
const givenNm=[null], geom0=[null], legNm=[null], moved=[null];
for(let i=1;i<N;i++){givenNm[i]=WP[i][3];geom0[i]=geomLen(i);legNm[i]=WP[i][3];moved[i]=false;}

// ===== Mapa =====
const map = L.map('map',{zoomControl:true,minZoom:3}).setView([12,-58],4);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
  attribution:'© OpenStreetMap © CARTO',subdomains:'abcd',maxZoom:19}).addTo(map);
const bounds=L.latLngBounds(WP.map(w=>w[2]));bounds.extend([41.5,-74]);bounds.extend([-38,-60]);
map.fitBounds(bounds,{padding:[40,40]});

// Casing blanco (look Google) + segmentos coloreados + línea de hover
let casing=L.polyline(fullPath(),{color:'#fff',weight:7,opacity:.95,lineJoin:'round',lineCap:'round'}).addTo(map);
function fullPath(){const fp=[WP[0][2]];for(let i=1;i<N;i++)legPts(i).slice(1).forEach(p=>fp.push(p));return fp;}

const segs=[null],hits=[null];
for(let i=1;i<N;i++){
  segs[i]=L.polyline(legPts(i),{color:REGIONS[WP[i][5]].color,weight:3.4,opacity:1,lineJoin:'round',lineCap:'round'}).addTo(map);
  hits[i]=L.polyline(legPts(i),{color:'#000',weight:16,opacity:0}).addTo(map);
  (j=>{hits[j].on('mouseover',()=>{segs[j].setStyle({weight:6});showLeg(j);});
       hits[j].on('mouseout',()=>segs[j].setStyle({weight:3.4}));
       hits[j].on('click',()=>showLeg(j));})(i);
}

// ===== Marcadores arrastrables =====
const markers=[];
WP.forEach((w,i)=>{
  const end=i===0||i===N-1, sz=end?15:11, c=REGIONS[w[5]].color;
  const icon=L.divIcon({className:'',html:`<div class="wpdot ${end?'big':''}" style="width:${sz}px;height:${sz}px;background:${c}"></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});
  const m=L.marker(w[2],{icon,draggable:true,autoPan:false}).addTo(map);
  m.bindTooltip(`${w[1]} ${w[0]}`,{className:'wp',direction:'top',offset:[0,-8]});
  m.on('click',()=>{openPort(i);if(i>0)showLeg(i);});
  m.on('mouseover',()=>{if(i>0)showLeg(i);});
  m.on('drag',e=>onDrag(i,e.target.getLatLng()));
  m.on('dragend',e=>{onDrag(i,e.target.getLatLng());showLeg(Math.max(1,i));});
  markers.push(m);
});

function redrawLeg(i){if(i<1||i>=N)return;const p=legPts(i);segs[i].setLatLngs(p);hits[i].setLatLngs(p);}
function onDrag(i,latlng){
  WP[i][2]=[latlng.lat,latlng.lng];
  [i,i+1].forEach(j=>{ if(j>=1&&j<N){
    const delta=geomLen(j)-geom0[j];        // impacto a escala real del mapa
    legNm[j]=Math.max(1,Math.round(givenNm[j]+delta));
    moved[j]=Math.abs(legNm[j]-givenNm[j])>=1;
    redrawLeg(j);
  }});
  if(i===0||i===N-1) casing.setLatLngs(fullPath()); else casing.setLatLngs(fullPath());
  buildCumulative(); renderAll();
}

// ===== Cálculos / KPIs =====
let cum=[0];
function buildCumulative(){cum=[0];let s=0;for(let i=1;i<N;i++){s+=legNm[i];cum.push(s);}}
buildCumulative();
const D=v=>v.toLocaleString('es-AR');
function totalNm(){return cum[N-1];}
function totalRest(){let s=0;for(let i=0;i<N;i++)s+=WP[i][8]?WP[i][7]:0;return s;}
function fmtT(h){const d=Math.floor(h/24),hh=Math.round(h-d*24);return d<=0?hh+" h":d+" d "+hh+" h";}
function dShort(h){const d=h/24;return d<1?Math.round(h)+" h":d.toFixed(1).replace('.',',')+" d";}

function renderTotals(){
  document.getElementById('totNm').innerHTML=D(totalNm())+' <small>nm</small>';
  const sail=totalNm()/speed/24;
  document.getElementById('totSail').innerHTML=sail.toFixed(0)+' <small>días</small>';
  const rest=totalRest();
  document.getElementById('restVal').textContent=(includeRest?'+'+rest:'+'+rest+' d posibles');
  document.getElementById('restVal').textContent='+'+rest+' d';
  const total=sail+(includeRest?rest:0);
  document.getElementById('arrival').innerHTML= includeRest
    ? `Puerta a puerta: <b>${Math.round(total)} días</b> (${sail.toFixed(0)} navegando + ${rest} en puerto). Objetivo: <b>Brasil, sept 2027</b>.`
    : `Objetivo: llegar a <b>Brasil en septiembre 2027</b>. Activá los días en puerto para el total real.`;
}
function renderRegions(){
  document.getElementById('rspeed').textContent='a '+String(speed).replace('.',',')+' kn';
  const cont=document.getElementById('rrows');cont.innerHTML='';
  RORDER.forEach(rk=>{
    let nm=0;for(let i=1;i<N;i++)if(WP[i][5]===rk)nm+=legNm[i];
    const r=REGIONS[rk],days=nm/speed/24;
    const el=document.createElement('button');el.className='rrow';
    el.innerHTML=`<div class="top"><span class="swcol" style="background:${r.color}"></span>
        <span class="nm">${r.label}</span>
        <span class="fig">${D(nm)} <small>nm</small> · ${dShort(days*24)}</span></div>
      <div class="meta">${r.months} · <span class="w">${r.water}</span><br>
        <span class="${r.warn?'warn':''}">${r.note}</span></div>`;
    el.onmouseenter=()=>highlightRegion(rk,true);
    el.onmouseleave=()=>highlightRegion(rk,false);
    el.onclick=()=>zoomRegion(rk);
    cont.appendChild(el);
  });
  const totalDays=totalNm()/speed/24, rest=totalRest();
  document.getElementById('rfoot').innerHTML=
    `Total <b>${D(totalNm())} nm</b> · ${totalDays.toFixed(0)} días navegando${includeRest?` + ${rest} en puerto = <b>${Math.round(totalDays+rest)} d</b>`:''}.
     <br>Ventana segura del Caribe: <b>nov–may</b>. Al sur de ~12°N (Granada/Trinidad) podés esperar la temporada de huracanes.`;
}
function renderAll(){renderTotals();renderRegions();}

function highlightRegion(rk,on){for(let i=1;i<N;i++)if(WP[i][5]===rk)segs[i].setStyle({weight:on?6:3.4});}
function zoomRegion(rk){const pts=[];WP.forEach(w=>{if(w[5]===rk)pts.push(w[2]);});if(pts.length)map.fitBounds(L.latLngBounds(pts),{padding:[60,60]});}

// ===== Leg readout =====
function showLeg(i){
  if(i<1)i=1;const a=WP[i-1],b=WP[i],nm=legNm[i],h=nm/speed,r=REGIONS[b[5]];
  const tags=(b[4]?'<span class="est">aprox</span>':'')+(moved[i]?` <span class="delta">↻ ${legNm[i]>givenNm[i]?'+':''}${legNm[i]-givenNm[i]} nm</span>`:'');
  document.getElementById('legbox').innerHTML=
    `<div class="lname">${a[1]} ${a[0]} <span class="arrow">→</span> ${b[1]} ${b[0]} ${tags}</div>
     <div class="lmeta">
       <div>Distancia<b>${D(nm)} nm</b></div>
       <div>Tiempo<b>${fmtT(h)}</b></div>
       <div>Época<b>${r.months}</b></div>
       <div>Agua<b>${r.water}</b></div>
     </div>`;
}
function clearLeg(){document.getElementById('legbox').innerHTML=
  `<div class="hint">Pasá el mouse por la ruta o tocá una escala para ver el tramo. <b>Arrastrá cualquier punto</b> para recalcular las millas a escala del mapa.</div>`;}

// ===== Popup de puerto =====
function openPort(i){
  const w=WP[i],r=REGIONS[w[5]];
  const restTxt=w[7]>0?`${w[7]} días`:'escala corta';
  const badge=w[8]?'<span class="badge rec">puerto de recalada</span>':'<span class="badge short">escala de tránsito</span>';
  const html=`<div class="pp"><h3>${w[1]} ${w[0]}</h3>
    <div class="ppc">${r.label} · ${r.months} · agua ${r.water}</div>
    <div class="ppinfo">${w[9]}</div>
    <div class="ppkpi">
      <div class="b">Descanso<b>${restTxt}</b>${badge}</div>
      ${i>0?`<div class="b">Tramo previo<b>${D(legNm[i])} nm</b></div>`:`<div class="b">Punto<b>Salida</b></div>`}
    </div></div>`;
  markers[i].bindPopup(html,{maxWidth:260}).openPopup();
}

// ===== Controles =====
document.getElementById('seg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  speed=parseFloat(b.dataset.s);document.querySelectorAll('#seg button').forEach(x=>x.classList.toggle('on',x===b));renderAll();});
document.getElementById('restSw').addEventListener('change',e=>{includeRest=e.target.checked;renderAll();});

// ===== Animación =====
const boat=L.marker(WP[0][2],{icon:L.divIcon({className:'',html:'<div class="boat">⛵</div>',iconSize:[24,24],iconAnchor:[12,12]})});
let anim=null;
function pointAlong(i,t){const p=legPts(i);let tot=0,segL=[];for(let k=1;k<p.length;k++){const d=hav(p[k-1],p[k]);segL.push(d);tot+=d;}
  let target=t*tot,acc=0;for(let k=1;k<p.length;k++){if(acc+segL[k-1]>=target){const f=(target-acc)/segL[k-1];return[p[k-1][0]+(p[k][0]-p[k-1][0])*f,p[k-1][1]+(p[k][1]-p[k-1][1])*f];}acc+=segL[k-1];}return p[p.length-1];}
function posAtNm(d){for(let i=1;i<N;i++){if(d<=cum[i]){const t=(d-cum[i-1])/(cum[i]-cum[i-1]||1);return{ll:pointAlong(i,t),leg:i};}}return{ll:WP[N-1][2],leg:N-1};}
function stopAnim(){if(anim){cancelAnimationFrame(anim);anim=null;}document.getElementById('playBtn').innerHTML='▶ Reproducir travesía';}
document.getElementById('playBtn').addEventListener('click',()=>{
  if(anim){stopAnim();return;}
  boat.addTo(map);document.getElementById('playBtn').innerHTML='⏸ Pausar';
  const dur=16000;let start=null,last=-1;const T=totalNm();
  const step=ts=>{if(!start)start=ts;let p=(ts-start)/dur;if(p>1)p=1;
    const d=p*T,{ll,leg}=posAtNm(d);boat.setLatLng(ll);
    if(leg!==last){showLeg(leg);last=leg;}
    document.getElementById('totSail').innerHTML=(d/speed/24).toFixed(1).replace('.',',')+' <small>días</small>';
    document.getElementById('totNm').innerHTML=D(Math.round(d))+' <small>nm</small>';
    if(p<1)anim=requestAnimationFrame(step);else{stopAnim();renderTotals();}};
  anim=requestAnimationFrame(step);
});
document.getElementById('resetBtn').addEventListener('click',()=>{stopAnim();map.removeLayer(boat);renderAll();clearLeg();map.fitBounds(bounds,{padding:[40,40]});});

renderAll();
}
