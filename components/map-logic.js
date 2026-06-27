// Imperative Leaflet map — ruta de navegación EEUU → Brasil.
// Drop-in replacement for components/map-logic.js (inyecta su propia UI y estilos).
export default function initRutaVelero() {
  const L = window.L;

  // ===== Estilos extra (popup con imagen, botón de agregar parada) =====
  const css = document.createElement("style");
  css.textContent = `
    .pp .ppimg{width:100%;height:128px;border-radius:9px;overflow:hidden;background:#eef0f3;margin-bottom:8px;position:relative}
    .pp .ppimg img{width:100%;height:100%;object-fit:cover;display:block}
    .pp .ppimg .phold{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:#9aa0a6;background:linear-gradient(135deg,#eef2f7,#e1e7f0)}
    .pp .ppinfo2{font-size:11px;color:#5f6368;margin:6px 0 8px;line-height:1.35}
    .pp .ppcredit{font-size:9px;color:#9aa0a6;margin-top:6px;text-align:right}
    .pp .rm{margin-top:9px;width:100%;border:1px solid #f3c0c0;background:#fff5f5;color:#d93025;font-weight:600;font-size:12px;padding:7px;border-radius:9px;cursor:pointer}
    .pp .rm:hover{background:#ffecec}
    .addctrl{margin-top:9px}
    .addbtn{width:100%;border:1px dashed #9aa6c2;background:#f6f8ff;color:#1a73e8;font-size:13px;font-weight:600;padding:10px;border-radius:11px;cursor:pointer;transition:.15s}
    .addbtn:hover{background:#eef3ff}
    .addbtn.arming{border-style:solid;background:#1a73e8;color:#fff}
    .addhint{font-size:10.5px;color:#5f6368;margin-top:5px;line-height:1.35}
  `;
  document.head.appendChild(css);

  // ===== Datos: name, flag, [lat,lng], nm, est?, region, via[], rest, recalada?, info(puerto), wiki, reseña(city) =====
  const WP = [
    ["Tracys Landing","🇺🇸",[38.72,-76.55], null,0,"us",[], 0,0,"Herrington Harbour, base de salida en la Bahía de Chesapeake.","Tracys Landing, Maryland","Pequeña comunidad náutica sobre la Bahía de Chesapeake, en Maryland."],
    ["Norfolk","🇺🇸",[36.85,-76.29], 180,0,"us",[[37.95,-76.18],[37.05,-76.02]], 3,0,"Milla 0 del ICW; último gran puerto para pertrechar antes del océano.","Norfolk (Virginia)","Ciudad portuaria de Virginia, sede de la mayor base naval del mundo."],
    ["Beaufort","🇺🇸",[34.72,-76.66], 205,0,"us",[[36.10,-75.30],[35.20,-75.35]], 1,0,"Beaufort Docks; salto offshore rodeando el Cabo Hatteras.","Beaufort (Carolina del Norte)","Histórico pueblo costero de Carolina del Norte, de calles coloniales y vida náutica."],
    ["Charleston","🇺🇸",[32.78,-79.93], 210,0,"us",[[33.75,-77.75],[33.00,-78.95]], 3,0,"Charleston City Marina (the MegaDock); parada histórica y abrigada.","Charleston (Carolina del Sur)","Elegante ciudad sureña de Carolina del Sur, con casas coloniales y puerto histórico."],
    ["St. Augustine","🇺🇸",[29.90,-81.31], 190,0,"us",[[31.40,-80.30],[30.50,-81.00]], 2,0,"Municipal Marina; ciudad más antigua de EEUU, buen refugio.","San Agustín (Florida)","La ciudad más antigua de EEUU, fundada por España en 1565, en Florida."],
    ["West Palm Beach","🇺🇸",[26.71,-80.05], 220,0,"us",[[28.40,-80.45],[27.30,-80.05]], 7,1,"Lake Worth; punto de salto a Bahamas. Cruce del Gulf Stream.","West Palm Beach","Centro náutico del sur de Florida, frente al lujoso Palm Beach."],
    ["Bimini","🇧🇸",[25.73,-79.30], 55,0,"bah",[[26.15,-79.70]], 2,0,"Primera entrada a Bahamas; despacho de aduana tras cruzar la corriente.","Bimini","Islas bajas y de aguas cristalinas, las más cercanas de Bahamas a Florida."],
    ["Nassau","🇧🇸",[25.06,-77.34], 90,0,"bah",[[25.55,-78.45]], 7,1,"Nassau Harbour; reabastecimiento completo de víveres y combustible.","Nassau (Bahamas)","Capital de Bahamas, animada y colonial, en la isla de Nueva Providencia."],
    ["Georgetown (Exumas)","🇧🇸",[23.51,-75.76], 165,0,"bah",[[24.55,-76.75],[23.90,-76.15]], 7,1,"Elizabeth Harbour; gran fondeadero cruisero, agua y comunidad.","Exuma","Fondeadero icónico de los cayos Exuma, punto de encuentro de cruceros."],
    ["Long Island","🇧🇸",[23.18,-75.10], 230,0,"bah",[[23.35,-75.40]], 1,0,"Thompson Bay; fondeo tranquilo antes del salto al sudeste.","Long Island (Bahamas)","Isla bahamesa estrecha y tranquila, de playas y acantilados rosados."],
    ["Mayaguana","🇧🇸",[22.37,-73.01], 220,0,"bah",[[22.85,-74.05]], 1,0,"Abraham's Bay; última escala bahamesa, espera de ventana de viento.","Mayaguana","La isla más oriental y remota de Bahamas, casi virgen."],
    ["Providenciales","🇹🇨",[21.77,-72.27], 52,1,"bah",[[22.10,-72.65]], 3,0,"Sapodilla Bay; despacho de Turks & Caicos.","Providenciales","Isla principal de Turks & Caicos, de playas turquesa famosas."],
    ["Grand Turk","🇹🇨",[21.47,-71.14], 130,0,"bah",[[21.62,-71.62]], 1,0,"Fondeo abierto; salto al Paso de los Vientos hacia La Española.","Cockburn Town","Pequeña isla capital de Turks & Caicos, de ambiente colonial y gran buceo."],
    ["Luperón","🇩🇴",[19.90,-70.96], 95,1,"anti",[[20.75,-71.00]], 7,1,"Bahía cerrada: 'agujero de huracán' clásico y aduana de Rep. Dominicana.","Luperón","Pueblo pesquero del norte dominicano, refugio natural y seguro para veleros."],
    ["Samaná","🇩🇴",[19.21,-69.34], 135,0,"anti",[[19.60,-70.25],[19.32,-69.55]], 3,0,"Bahía de Samaná; salida hacia el exigente Paso de la Mona.","Santa Bárbara de Samaná","Bahía dominicana de montañas verdes y famoso avistaje de ballenas jorobadas."],
    ["Boquerón","🇵🇷",[18.03,-67.18], 135,1,"anti",[[18.75,-68.35],[18.25,-67.55]], 5,1,"Bahía abrigada; entrada a Puerto Rico y despacho de EEUU.","Boquerón (Cabo Rojo)","Bahía y balneario del oeste de Puerto Rico, de aguas calmas y atardeceres."],
    ["Ponce","🇵🇷",[17.98,-66.61], 90,0,"anti",[[17.88,-66.95]], 2,0,"Ponce Yacht Club; costa sur protegida de PR.","Ponce (Puerto Rico)","La 'Perla del Sur' de Puerto Rico, de arquitectura señorial y plaza histórica."],
    ["Fajardo","🇵🇷",[18.33,-65.63], 70,0,"anti",[[17.93,-65.78],[18.18,-65.58]], 3,0,"Puerto del Rey, la mayor marina del Caribe; salto a las Vírgenes.","Fajardo (Puerto Rico)","Puerto del este de Puerto Rico, puerta a las islas y bahías bioluminiscentes."],
    ["St. Thomas","🇻🇮",[18.34,-64.93], 42,1,"anti",[[18.35,-65.28]], 3,0,"Charlotte Amalie (USVI); gran centro náutico y de servicios.","Charlotte Amalie","Isla de las Vírgenes estadounidenses, con su capital y puerto franco histórico."],
    ["St. Croix","🇻🇮",[17.73,-64.78], 40,0,"anti",[[18.02,-64.82]], 1,0,"Christiansted; salto al este hacia las Antillas Menores.","Christiansted","La mayor de las Vírgenes de EEUU, de herencia danesa y arrecifes coralinos."],
    ["St. Martin","🇸🇽",[18.07,-63.08], 95,1,"menor",[[17.85,-63.85]], 7,1,"Simpson Bay Lagoon; hub de reparaciones y compras libres de impuestos.","San Martín (isla)","Isla compartida por Francia y Países Bajos, gran hub náutico del Caribe."],
    ["Guadalupe","🇬🇵",[16.24,-61.53], 90,0,"menor",[[17.00,-62.15],[16.65,-61.70]], 3,0,"Pointe-à-Pitre / Marina Bas-du-Fort.","Pointe-à-Pitre","Archipiélago francés con forma de mariposa, en el corazón de las Antillas Menores."],
    ["Martinica","🇲🇶",[14.60,-61.07], 110,0,"menor",[[15.40,-61.25]], 7,1,"Le Marin, la mayor marina de las Antillas francesas.","Fort-de-France","Isla francesa volcánica, verde y montañosa, de intensa cultura criolla."],
    ["Santa Lucía","🇱🇨",[13.91,-60.98], 25,0,"menor",[[14.25,-60.98]], 3,0,"Rodney Bay Marina; servicios completos, fin de la ARC.","Santa Lucía","Isla de los icónicos picos Pitons, volcánica y exuberante."],
    ["San Vicente","🇻🇨",[13.16,-61.23], 55,0,"menor",[[13.52,-61.12]], 2,0,"Blue Lagoon; Bequia y los Granadinos a un salto.","Kingstown","Cabecera de San Vicente y las Granadinas, de naturaleza intensa y veleo."],
    ["Granada","🇬🇩",[12.05,-61.75], 40,0,"menor",[[12.60,-61.50]], 7,1,"Prickly Bay / Port Louis; refugio clásico de temporada de huracanes (~12°N).","Saint George (Granada)","La 'Isla de las Especias', refugio clásico al sur del cinturón de huracanes."],
    ["Chaguaramas","🇹🇹",[10.68,-61.64], 80,1,"guay",[[11.35,-61.72]], 10,1,"Hub de varadero y reparación de Trinidad, bajo el cinturón de huracanes.","Chaguaramas (Trinidad y Tobago)","Bahía al noroeste de Trinidad, gran centro de astilleros y servicios del Caribe."],
    ["Georgetown","🇬🇾",[6.80,-58.16], 240,0,"guay",[[9.90,-60.10],[8.20,-58.90]], 3,0,"Río Demerara; fondeo fluvial, trámites con agente local.","Georgetown (Guyana)","Capital de Guyana sobre el río Demerara, de arquitectura colonial en madera."],
    ["Paramaribo","🇸🇷",[5.82,-55.17], 420,0,"guay",[[6.95,-57.05],[6.30,-55.95]], 3,0,"Río Suriname / Domburg; entrada coordinada con la marea.","Paramaribo","Capital de Surinam, de casco histórico holandés Patrimonio de la Humanidad."],
    ["Cayenne","🇬🇫",[4.94,-52.30], 210,0,"guay",[[5.90,-54.00],[5.40,-53.00]], 3,0,"Dégrad des Cannes; Islas de la Salvación (Île Royale) cerca.","Cayena","Capital de la Guayana Francesa, mezcla criolla, frente a las Islas de la Salvación."],
    ["Belém","🇧🇷",[-1.46,-48.50], 320,0,"br",[[3.60,-50.80],[1.40,-49.10],[-0.30,-48.30]], 4,0,"Entrada por el río; Marina Belém, puerta de la Amazonia.","Belém","Puerta de la Amazonia, en la desembocadura del río, de mercados y mango."],
    ["Fortaleza","🇧🇷",[-3.72,-38.54], 430,0,"br",[[-1.00,-45.00],[-1.70,-41.30],[-2.85,-39.40]], 7,1,"Marina Park; gran parada del nordeste tras el tramo más largo.","Fortaleza","Gran ciudad playera del nordeste brasileño, soleada y muy animada."],
    ["Natal","🇧🇷",[-5.79,-35.21], 370,0,"br",[[-4.40,-37.10],[-4.85,-35.45]], 3,0,"Iate Clube do Natal; esquina nordeste de Brasil.","Natal (Río Grande del Norte)","Ciudad de dunas y sol del nordeste de Brasil, en 'la esquina' del continente."],
    ["Recife","🇧🇷",[-8.05,-34.88], 160,0,"br",[[-6.90,-34.78]], 4,0,"Cabanga Iate Clube; ciudad histórica.","Recife","La 'Venecia brasileña', de ríos, puentes y un rico casco histórico."],
    ["Salvador","🇧🇷",[-12.97,-38.51], 420,0,"br",[[-9.50,-35.10],[-11.50,-37.10]], 7,1,"Bahía de Todos os Santos; Terminal Náutico.","Salvador (Bahía)","Primera capital de Brasil, corazón afrobrasileño, sobre la Bahía de Todos os Santos."],
    ["Abrolhos","🇧🇷",[-17.96,-38.70], 560,0,"br",[[-14.40,-38.75],[-16.50,-38.60]], 2,0,"Parque Marino de Abrolhos; fondeo y ballenas jorobadas (jul–nov).","Archipiélago de Abrolhos","Archipiélago y parque marino, santuario de ballenas jorobadas en invierno."],
    ["Vitória","🇧🇷",[-20.32,-40.34], 260,0,"br",[[-19.00,-39.40],[-20.05,-40.00]], 4,0,"Iate Clube do Espírito Santo.","Vitória (Espírito Santo)","Capital isleña de Espírito Santo, de bahías y puerto muy activo."],
    ["Búzios","🇧🇷",[-22.75,-41.88], 260,0,"br",[[-21.50,-40.70],[-22.45,-41.40]], 3,0,"Fondeo en bahías; balneario clásico.","Armação dos Búzios","Elegante península balnearia de decenas de playas, al este de Río."],
    ["Ilha Grande","🇧🇷",[-23.14,-44.23], 90,0,"br",[[-23.05,-43.10]], 4,1,"Vila do Abraão; bahías protegidas, antesala de Angra.","Ilha Grande","Isla de selva atlántica y playas vírgenes, sin autos, frente a Angra."],
    ["Angra dos Reis","🇧🇷",[-23.01,-44.32], 35,0,"br",[[-23.12,-44.27]], 0,0,"Destino final: bahía con 365 islas. Llegada prevista septiembre 2027.","Angra dos Reis","Bahía paradisíaca con 365 islas verdes, destino final de la travesía."],
  ];

  const REGIONS = {
    us:   {label:"EEUU costa este",  color:"#1a73e8", months:"Nov 2026",        water:"12–25 °C", note:"Salida tras el fin de la temporada (30 nov); aprovechá los frentes fríos del otoño.", warn:false},
    bah:  {label:"Bahamas · Turks",  color:"#12b5cb", months:"Dic 2026 – Ene 2027", water:"24–26 °C", note:"Camino espinoso (thorny path): avanzá en las ventanas que abren los frentes. Fuera de temporada de huracanes.", warn:false},
    anti: {label:"Antillas Mayores", color:"#1e8e3e", months:"Feb 2027",        water:"26 °C",    note:"Luperón (RD) es el 'agujero de huracán' clásico si hay que esperar mal tiempo.", warn:false},
    menor:{label:"Antillas Menores", color:"#f9ab00", months:"Mar – Abr 2027",  water:"27 °C",    note:"Los mejores meses del Caribe. ⚠ Hay que bajar al sur de ~12°N antes del 1 de junio.", warn:true},
    guay: {label:"Trinidad · Guayanas",color:"#a142f4",months:"May – Jul 2027", water:"28 °C",    note:"Trinidad/Granada quedan bajo el cinturón: refugio para la temporada. Tramo contra alisios y corriente.", warn:false},
    br:   {label:"Brasil",           color:"#c026d3", months:"Ago – Sep 2027",  water:"23–29 °C", note:"Atlántico Sur prácticamente sin huracanes (solo Catarina, 2004). Tramo seguro todo el año.", warn:false},
    custom:{label:"Paradas propias", color:"#5f6368", months:"—",              water:"—",        note:"Tramos que agregaste localmente para extender la ruta.", warn:false},
  };
  const RORDER = ["us","bah","anti","menor","guay","br","custom"];

  let speed = 5.5, includeRest = false, addMode = false, customCount = 0;

  // ===== Geometría =====
  function hav(a,b){const R=3440.065,r=Math.PI/180;const dLa=(b[0]-a[0])*r,dLo=(b[1]-a[1])*r,la1=a[0]*r,la2=b[0]*r;
    const x=Math.sin(dLa/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
  function legPts(i){return [WP[i-1][2], ...WP[i][6], WP[i][2]];}
  function geomLen(i){const p=legPts(i);let s=0;for(let k=1;k<p.length;k++)s+=hav(p[k-1],p[k]);return s;}

  const givenNm=[null], geom0=[null], legNm=[null], moved=[null];
  for(let i=1;i<WP.length;i++){givenNm[i]=WP[i][3];geom0[i]=geomLen(i);legNm[i]=WP[i][3];moved[i]=false;}

  // ===== Mapa =====
  const map = L.map('map',{zoomControl:true,minZoom:3}).setView([12,-58],4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
    attribution:'© OpenStreetMap © CARTO',subdomains:'abcd',maxZoom:19}).addTo(map);
  function curBounds(){const b=L.latLngBounds(WP.map(w=>w[2]));b.extend([41.5,-74]);b.extend([-38,-60]);return b;}
  map.fitBounds(curBounds(),{padding:[40,40]});

  function fullPath(){const fp=[WP[0][2]];for(let i=1;i<WP.length;i++)legPts(i).slice(1).forEach(p=>fp.push(p));return fp;}

  // ===== Capas (reconstruibles para agregar/quitar paradas) =====
  let segs=[null], hits=[null], markers=[], casing=null;
  function buildLayers(){
    if(casing) map.removeLayer(casing);
    segs.forEach(s=>s&&map.removeLayer(s));
    hits.forEach(h=>h&&map.removeLayer(h));
    markers.forEach(m=>m&&map.removeLayer(m));
    segs=[null]; hits=[null]; markers=[];
    casing=L.polyline(fullPath(),{color:'#fff',weight:7,opacity:.95,lineJoin:'round',lineCap:'round'}).addTo(map);
    for(let i=1;i<WP.length;i++){
      segs[i]=L.polyline(legPts(i),{color:REGIONS[WP[i][5]].color,weight:3.4,opacity:1,lineJoin:'round',lineCap:'round'}).addTo(map);
      hits[i]=L.polyline(legPts(i),{color:'#000',weight:16,opacity:0}).addTo(map);
      (j=>{hits[j].on('mouseover',()=>{segs[j].setStyle({weight:6});showLeg(j);});
           hits[j].on('mouseout',()=>segs[j].setStyle({weight:3.4}));
           hits[j].on('click',()=>showLeg(j));})(i);
    }
    WP.forEach((w,i)=>{
      const end=i===0||i===WP.length-1, sz=end?15:11, c=REGIONS[w[5]].color;
      const icon=L.divIcon({className:'',html:`<div class="wpdot ${end?'big':''}" style="width:${sz}px;height:${sz}px;background:${c}"></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});
      const m=L.marker(w[2],{icon,draggable:true,autoPan:false}).addTo(map);
      m.bindTooltip(`${w[1]} ${w[0]}`,{className:'wp',direction:'top',offset:[0,-8]});
      m.on('click',()=>{openPort(i);if(i>0)showLeg(i);});
      m.on('mouseover',()=>{if(i>0)showLeg(i);});
      m.on('drag',e=>onDrag(i,e.target.getLatLng()));
      m.on('dragend',e=>{onDrag(i,e.target.getLatLng());if(i>0)showLeg(i);});
      markers[i]=m;
    });
    // etiquetas salida / llegada
    const mk=(ll,txt)=>L.marker(ll,{interactive:false,icon:L.divIcon({className:'',html:`<div style="font-size:11px;font-weight:700;color:#202124;text-shadow:0 1px 3px #fff,0 0 2px #fff;white-space:nowrap">${txt}</div>`,iconSize:[0,0]})}).addTo(map);
    markers.push(mk(WP[0][2],'⚓ Salida'));
    markers.push(mk(WP[WP.length-1][2],'🏁 Llegada'));
  }

  function redrawLeg(i){if(i<1||i>=WP.length)return;const p=legPts(i);segs[i].setLatLngs(p);hits[i].setLatLngs(p);}
  function onDrag(i,latlng){
    WP[i][2]=[latlng.lat,latlng.lng];
    [i,i+1].forEach(j=>{ if(j>=1&&j<WP.length){
      const delta=geomLen(j)-geom0[j];
      legNm[j]=Math.max(1,Math.round(givenNm[j]+delta));
      moved[j]=Math.abs(legNm[j]-givenNm[j])>=1;
      redrawLeg(j);
    }});
    casing.setLatLngs(fullPath());
    buildCumulative(); renderAll();
  }

  // ===== KPIs =====
  let cum=[0];
  function buildCumulative(){cum=[0];let s=0;for(let i=1;i<WP.length;i++){s+=legNm[i];cum.push(s);}}
  const D=v=>v.toLocaleString('es-AR');
  function totalNm(){return cum[cum.length-1];}
  function totalRest(){let s=0;for(let i=0;i<WP.length;i++)s+=WP[i][8]?WP[i][7]:0;return s;}
  function fmtT(h){const d=Math.floor(h/24),hh=Math.round(h-d*24);return d<=0?hh+" h":d+" d "+hh+" h";}
  function dShort(h){const d=h/24;return d<1?Math.round(h)+" h":d.toFixed(1).replace('.',',')+" d";}

  function renderTotals(){
    document.getElementById('totNm').innerHTML=D(totalNm())+' <small>nm</small>';
    const sail=totalNm()/speed/24;
    document.getElementById('totSail').innerHTML=sail.toFixed(0)+' <small>días</small>';
    const rest=totalRest();
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
      let nm=0;for(let i=1;i<WP.length;i++)if(WP[i][5]===rk)nm+=legNm[i];
      if(nm===0)return; // no mostrar regiones sin tramos (ej. 'custom' hasta que agregues)
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
  function highlightRegion(rk,on){for(let i=1;i<WP.length;i++)if(WP[i][5]===rk&&segs[i])segs[i].setStyle({weight:on?6:3.4});}
  function zoomRegion(rk){const pts=[];WP.forEach(w=>{if(w[5]===rk)pts.push(w[2]);});if(pts.length)map.fitBounds(L.latLngBounds(pts),{padding:[60,60]});}

  // ===== Tramo (readout) =====
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

  // ===== Imagen de la ciudad (Wikipedia REST, CORS abierto) =====
  async function cityImage(title){
    if(!title) return null;
    const base=title.replace(/\s*\(.*?\)\s*/,'').trim();
    const tries=[['es',title],['en',title]];
    if(base&&base!==title){tries.push(['es',base]);tries.push(['en',base]);}
    for(const [lang,t] of tries){
      try{
        const res=await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`);
        if(!res.ok) continue;
        const j=await res.json();
        const src=(j.originalimage&&j.originalimage.source)||(j.thumbnail&&j.thumbnail.source);
        if(src) return {src};
      }catch(e){/* siguiente intento */}
    }
    return null;
  }

  // ===== Popup de puerto (imagen + reseña) =====
  function openPort(i){
    const w=WP[i],r=REGIONS[w[5]],custom=w[5]==='custom';
    const restTxt=w[7]>0?`${w[7]} días`:'escala corta';
    const badge=w[8]?'<span class="badge rec">puerto de recalada</span>':(custom?'<span class="badge short">parada propia</span>':'<span class="badge short">escala de tránsito</span>');
    const climate=custom?'Parada personalizada · ruta local':`${r.label} · ${r.months} · agua ${r.water}`;
    const rm=custom?`<button class="rm" id="rmBtn">✕ Quitar esta parada</button>`:'';
    const html=`<div class="pp">
      <div class="ppimg" id="ppimg"><div class="phold">${w[10]?'📷 cargando imagen…':'📍 parada propia'}</div></div>
      <h3>${w[1]} ${w[0]}</h3>
      <div class="ppc">${climate}</div>
      <div class="ppinfo">${w[11]||''}</div>
      <div class="ppinfo2">Puerto: ${w[9]}</div>
      <div class="ppkpi">
        <div class="b">Descanso<b>${restTxt}</b>${badge}</div>
        ${i>0?`<div class="b">Tramo previo<b>${D(legNm[i])} nm</b></div>`:`<div class="b">Punto<b>Salida</b></div>`}
      </div>
      ${rm}
      ${w[10]?'<div class="ppcredit">Imagen: Wikipedia</div>':''}
    </div>`;
    markers[i].bindPopup(html,{maxWidth:280,minWidth:240}).openPopup();
    if(custom) setTimeout(()=>{const b=document.getElementById('rmBtn');if(b)b.onclick=()=>removeWaypoint(i);},0);
    if(w[10]) cityImage(w[10]).then(img=>{
      const c=document.getElementById('ppimg');if(!c)return;
      c.innerHTML=(img&&img.src)?`<img src="${img.src}" alt="${w[0]}">`:'<div class="phold">sin imagen disponible</div>';
    });
  }

  // ===== Agregar / quitar paradas (local) =====
  function addWaypoint(latlng){
    customCount++;
    WP.push([`Parada ${customCount}`,"📍",[latlng.lat,latlng.lng], null,0,"custom",[], 0,0,
      "Parada agregada por vos (ruta local).","","Escala personalizada que sumaste para extender la ruta."]);
    const i=WP.length-1;
    givenNm[i]=Math.round(geomLen(i)); geom0[i]=geomLen(i); legNm[i]=givenNm[i]; moved[i]=false;
    buildLayers(); buildCumulative(); renderAll(); showLeg(i);
    openPort(i);
  }
  function removeWaypoint(i){
    if(WP[i][5]!=='custom')return;
    map.closePopup();
    WP.splice(i,1); givenNm.splice(i,1); geom0.splice(i,1); legNm.splice(i,1); moved.splice(i,1);
    if(i>=1&&i<WP.length){ // recomputar el tramo puente que queda
      givenNm[i]=Math.round(geomLen(i)); geom0[i]=geomLen(i); legNm[i]=givenNm[i]; moved[i]=false;
    }
    buildLayers(); buildCumulative(); renderAll(); clearLeg();
  }

  // ===== Botón "Agregar parada" (inyectado en el panel) =====
  const playDiv=document.querySelector('.panel .play');
  if(playDiv){
    const wrap=document.createElement('div');wrap.className='addctrl';
    wrap.innerHTML=`<button class="addbtn" id="addBtn">➕ Agregar parada</button>
      <div class="addhint">Activá y tocá el mapa para sumar una escala. Recalcula millas y días al instante (queda en tu sesión).</div>`;
    playDiv.insertAdjacentElement('afterend',wrap);
    const addBtn=document.getElementById('addBtn');
    const setArmed=on=>{addMode=on;addBtn.classList.toggle('arming',on);addBtn.textContent=on?'📍 Tocá el mapa para ubicarla…':'➕ Agregar parada';map.getContainer().style.cursor=on?'crosshair':'';};
    addBtn.onclick=()=>setArmed(!addMode);
    map.on('click',e=>{ if(!addMode)return; addWaypoint(e.latlng); setArmed(false); });
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
  function posAtNm(d){for(let i=1;i<WP.length;i++){if(d<=cum[i]){const t=(d-cum[i-1])/(cum[i]-cum[i-1]||1);return{ll:pointAlong(i,t),leg:i};}}return{ll:WP[WP.length-1][2],leg:WP.length-1};}
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
  document.getElementById('resetBtn').addEventListener('click',()=>{stopAnim();map.removeLayer(boat);renderAll();clearLeg();map.fitBounds(curBounds(),{padding:[40,40]});});

  // ===== Init =====
  buildLayers();
  buildCumulative();
  renderAll();
}
