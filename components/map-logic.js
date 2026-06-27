// Imperative Leaflet map — ruta de navegación EEUU → Brasil.
// Inyecta su propia UI y estilos. Popups con galería de fotos + ficha náutica + links.
export default function initRutaVelero() {
  const L = window.L;

  // ===== Estilos extra =====
  const css = document.createElement("style");
  css.textContent = `
    .pp .ppgal{margin-bottom:8px}
    .pp .hero{width:100%;height:140px;border-radius:9px;object-fit:cover;background:#eef0f3;display:block}
    .pp .heroph{width:100%;height:140px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#9aa0a6;background:linear-gradient(135deg,#eef2f7,#e1e7f0);font-size:12px}
    .pp .thumbs{display:flex;gap:5px;margin-top:5px;overflow-x:auto;padding-bottom:2px}
    .pp .thumbs img{width:48px;height:36px;object-fit:cover;border-radius:5px;cursor:pointer;flex:0 0 auto;border:2px solid transparent}
    .pp .thumbs img.sel{border-color:#1a73e8}
    .pp h3{margin:0 0 1px;font-size:14px;font-weight:600}
    .pp .ppc{font-size:11px;color:#5f6368;margin-bottom:6px}
    .pp .ppinfo{font-size:12px;line-height:1.4;margin-bottom:6px}
    .pp .nav{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0}
    .pp .nav .c{background:#f1f3f4;border-radius:7px;padding:5px 8px;font-size:10px;color:#5f6368;text-transform:uppercase;letter-spacing:.3px}
    .pp .nav .c b{display:block;color:#202124;font-size:12px;font-weight:600;margin-top:2px;text-transform:none;letter-spacing:0}
    .pp .serv{font-size:11px;color:#5f6368;margin:2px 0;line-height:1.35}
    .pp .price{font-size:12px;color:#202124;font-weight:600;margin:5px 0 2px}
    .pp .price b{color:#1e8e3e}
    .pp .ppkpi{display:flex;gap:8px;margin-top:7px}
    .pp .ppkpi .b{flex:1;background:#f1f3f4;border-radius:8px;padding:6px 8px;font-size:11px;color:#5f6368}
    .pp .ppkpi .b b{display:block;color:#202124;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
    .pp .links{display:flex;gap:6px;margin-top:8px}
    .pp .links a{flex:1;text-align:center;text-decoration:none;font-size:11px;font-weight:600;padding:7px 4px;border-radius:8px;border:1px solid #d7dce5;color:#1a73e8;background:#fff}
    .pp .links a:hover{background:#f1f3f4}
    .pp .badge{display:inline-block;font-size:10px;font-weight:600;border-radius:5px;padding:1px 5px;margin-top:3px}
    .pp .badge.rec{background:rgba(30,142,62,.12);color:#1e8e3e}
    .pp .badge.short{background:#eef0f3;color:#5f6368}
    .pp .rm{margin-top:8px;width:100%;border:1px solid #f3c0c0;background:#fff5f5;color:#d93025;font-weight:600;font-size:12px;padding:7px;border-radius:9px;cursor:pointer}
    .pp .ppcredit{font-size:9px;color:#9aa0a6;margin-top:7px;text-align:right}
    .addctrl{margin-top:9px}
    .addbtn{width:100%;border:1px dashed #9aa6c2;background:#f6f8ff;color:#1a73e8;font-size:13px;font-weight:600;padding:10px;border-radius:11px;cursor:pointer;transition:.15s}
    .addbtn:hover{background:#eef3ff}
    .addbtn.arming{border-style:solid;background:#1a73e8;color:#fff}
    .addhint{font-size:10.5px;color:#5f6368;margin-top:5px;line-height:1.35}
  `;
  document.head.appendChild(css);

  // ===== Datos: name, flag, [lat,lng], nm, est?, region, via[], rest, recalada?, info, wiki, reseña, nav{} =====
  // nav: t=tipo, p=profundidad, f=fondo, h=tenedero, v=VHF, s=servicios, pr=precio (orientativo)
  const WP = [
    ["Tracys Landing","🇺🇸",[38.72,-76.55], null,0,"us",[], 0,0,"Herrington Harbour, base de salida en la Bahía de Chesapeake.","Tracys Landing, Maryland","Pequeña comunidad náutica sobre la Bahía de Chesapeake, en Maryland.",{t:"Marina (río)",p:"2–4 m",f:"fango",h:"bueno",v:"16",s:"Agua, combustible, varadero, rampa, provisión",pr:"~US$2/pie/noche"}],
    ["Norfolk","🇺🇸",[36.85,-76.29], 180,0,"us",[[37.95,-76.18],[37.05,-76.02]], 3,0,"Milla 0 del ICW; último gran puerto para pertrechar antes del océano.","Norfolk (Virginia)","Ciudad portuaria de Virginia, sede de la mayor base naval del mundo.",{t:"Marina / fondeo",p:"3–5 m",f:"fango",h:"bueno",v:"16",s:"Talleres, combustible, provisión completa",pr:"Marina ~US$2–2,5/pie; fondeo gratis en Hospital Point"}],
    ["Beaufort","🇺🇸",[34.72,-76.66], 205,0,"us",[[36.10,-75.30],[35.20,-75.35]], 1,0,"Beaufort Docks; salto offshore rodeando el Cabo Hatteras.","Beaufort (Carolina del Norte)","Histórico pueblo costero de Carolina del Norte, de calles coloniales y vida náutica.",{t:"Marina / fondeo",p:"3–6 m",f:"arena/fango",h:"regular (mucha corriente)",v:"16",s:"Muelles, combustible, provisión",pr:"Marina ~US$2–3/pie; fondeo libre en Taylor Creek"}],
    ["Charleston","🇺🇸",[32.78,-79.93], 210,0,"us",[[33.75,-77.75],[33.00,-78.95]], 3,0,"Charleston City Marina (the MegaDock); parada histórica y abrigada.","Charleston (Carolina del Sur)","Elegante ciudad sureña de Carolina del Sur, con casas coloniales y puerto histórico.",{t:"Marina / fondeo",p:"4–8 m (canal)",f:"fango",h:"variable",v:"16",s:"MegaDock, combustible, talleres, provisión",pr:"Marina ~US$3–5/pie/noche; fondeo libre frente a la ciudad"}],
    ["St. Augustine","🇺🇸",[29.90,-81.31], 190,0,"us",[[31.40,-80.30],[30.50,-81.00]], 2,0,"Municipal Marina; ciudad más antigua de EEUU, buen refugio.","San Agustín (Florida)","La ciudad más antigua de EEUU, fundada por España en 1565, en Florida.",{t:"Campo de boyas",p:"3–4 m",f:"fango (corriente fuerte)",h:"boyas municipales",v:"16",s:"Boyas, dinghy dock, duchas, combustible",pr:"Boya US$25/noche · US$132/sem · US$396/mes"}],
    ["West Palm Beach","🇺🇸",[26.71,-80.05], 220,0,"us",[[28.40,-80.45],[27.30,-80.05]], 7,1,"Lake Worth; punto de salto a Bahamas. Cruce del Gulf Stream.","West Palm Beach","Centro náutico del sur de Florida, frente al lujoso Palm Beach.",{t:"Fondeo / marina",p:"2–4 m",f:"arena/fango",h:"bueno",v:"16",s:"Fondeo gratis en Lake Worth, provisión, combustible",pr:"Fondeo gratis; marinas ~US$3/pie"}],
    ["Bimini","🇧🇸",[25.73,-79.30], 55,0,"bah",[[26.15,-79.70]], 2,0,"Primera entrada a Bahamas; despacho de aduana tras cruzar la corriente.","Bimini","Islas bajas y de aguas cristalinas, las más cercanas de Bahamas a Florida.",{t:"Marina / canal",p:"2–3 m",f:"arena",h:"bueno",v:"16/68",s:"Marinas, aduana, combustible",pr:"Marina ~US$1,5–2,5/pie/noche"}],
    ["Nassau","🇧🇸",[25.06,-77.34], 90,0,"bah",[[25.55,-78.45]], 7,1,"Nassau Harbour; reabastecimiento completo de víveres y combustible.","Nassau (Bahamas)","Capital de Bahamas, animada y colonial, en la isla de Nueva Providencia.",{t:"Marina / fondeo",p:"3–4 m (mín. 12 ft)",f:"arena con algo de pasto",h:"regular",v:"16 · 14 (Cruisers Net 07:15)",s:"Marinas, provisión completa, combustible",pr:"Marina ~US$2–4/pie; Atlantis premium"}],
    ["Georgetown (Exumas)","🇧🇸",[23.51,-75.76], 165,0,"bah",[[24.55,-76.75],[23.90,-76.15]], 7,1,"Elizabeth Harbour; gran fondeadero cruisero, agua y comunidad.","Exuma","Fondeadero icónico de los cayos Exuma, punto de encuentro de cruceros.",{t:"Fondeo",p:"2–4 m",f:"arena",h:"bueno",v:"16/72",s:"Fondeo gratis, agua, provisión, comunidad cruisera",pr:"Fondeo gratis"}],
    ["Long Island","🇧🇸",[23.18,-75.10], 230,0,"bah",[[23.35,-75.40]], 1,0,"Thompson Bay; fondeo tranquilo antes del salto al sudeste.","Long Island (Bahamas)","Isla bahamesa estrecha y tranquila, de playas y acantilados rosados.",{t:"Fondeo",p:"2–3 m",f:"arena",h:"bueno",v:"16",s:"Fondeo, provisión básica",pr:"Fondeo gratis"}],
    ["Mayaguana","🇧🇸",[22.37,-73.01], 220,0,"bah",[[22.85,-74.05]], 1,0,"Abraham's Bay; última escala bahamesa, espera de ventana de viento.","Mayaguana","La isla más oriental y remota de Bahamas, casi virgen.",{t:"Fondeo abierto",p:"3–5 m",f:"arena/coral",h:"regular",v:"16",s:"Sin servicios; espera de ventana",pr:"Fondeo gratis"}],
    ["Providenciales","🇹🇨",[21.77,-72.27], 52,1,"bah",[[22.10,-72.65]], 3,0,"Sapodilla Bay; despacho de Turks & Caicos.","Providenciales","Isla principal de Turks & Caicos, de playas turquesa famosas.",{t:"Fondeo / marina",p:"2–4 m",f:"arena",h:"bueno",v:"16",s:"Sapodilla Bay, marinas, aduana, provisión",pr:"Fondeo gratis; marina variable"}],
    ["Grand Turk","🇹🇨",[21.47,-71.14], 130,0,"bah",[[21.62,-71.62]], 1,0,"Fondeo abierto; salto al Paso de los Vientos hacia La Española.","Cockburn Town","Pequeña isla capital de Turks & Caicos, de ambiente colonial y gran buceo.",{t:"Fondeo abierto",p:"5–10 m",f:"arena/coral",h:"regular (rolido)",v:"16",s:"Buceo, despacho",pr:"Fondeo gratis"}],
    ["Luperón","🇩🇴",[19.90,-70.96], 95,1,"anti",[[20.75,-71.00]], 7,1,"Bahía cerrada: 'agujero de huracán' clásico y aduana de Rep. Dominicana.","Luperón","Pueblo pesquero del norte dominicano, refugio natural y seguro para veleros.",{t:"Fondeo / boyas",p:"2–4 m",f:"fango espeso",h:"muy bueno (cuesta clavar)",v:"68",s:"Agujero de huracán, boyas, aduana, Puerto Blanco Marina",pr:"Boya US$2/día o US$50/mes"}],
    ["Samaná","🇩🇴",[19.21,-69.34], 135,0,"anti",[[19.60,-70.25],[19.32,-69.55]], 3,0,"Bahía de Samaná; salida hacia el exigente Paso de la Mona.","Santa Bárbara de Samaná","Bahía dominicana de montañas verdes y famoso avistaje de ballenas jorobadas.",{t:"Marina / fondeo",p:"3–6 m",f:"fango",h:"bueno",v:"16",s:"Puerto Bahía marina, combustible, ballenas (ene–mar)",pr:"Marina media; fondeo posible"}],
    ["Boquerón","🇵🇷",[18.03,-67.18], 135,1,"anti",[[18.75,-68.35],[18.25,-67.55]], 5,1,"Bahía abrigada; entrada a Puerto Rico y despacho de EEUU.","Boquerón (Cabo Rojo)","Bahía y balneario del oeste de Puerto Rico, de aguas calmas y atardeceres.",{t:"Fondeo",p:"3–5 m",f:"arena/pasto",h:"bueno",v:"16",s:"Fondeo amplio, aduana CBP, pueblo",pr:"Fondeo gratis"}],
    ["Ponce","🇵🇷",[17.98,-66.61], 90,0,"anti",[[17.88,-66.95]], 2,0,"Ponce Yacht Club; costa sur protegida de PR.","Ponce (Puerto Rico)","La 'Perla del Sur' de Puerto Rico, de arquitectura señorial y plaza histórica.",{t:"Marina / fondeo",p:"3–4 m",f:"fango/arena",h:"bueno",v:"16",s:"Ponce Yacht Club, combustible",pr:"Marina media"}],
    ["Fajardo","🇵🇷",[18.33,-65.63], 70,0,"anti",[[17.93,-65.78],[18.18,-65.58]], 3,0,"Puerto del Rey, la mayor marina del Caribe; salto a las Vírgenes.","Fajardo (Puerto Rico)","Puerto del este de Puerto Rico, puerta a las islas y bahías bioluminiscentes.",{t:"Marina",p:"3–4 m",f:"arena",h:"bueno",v:"16/71",s:"Puerto del Rey (mayor del Caribe), varadero, provisión",pr:"Marina media-alta"}],
    ["St. Thomas","🇻🇮",[18.34,-64.93], 42,1,"anti",[[18.35,-65.28]], 3,0,"Charlotte Amalie (USVI); gran centro náutico y de servicios.","Charlotte Amalie","Isla de las Vírgenes estadounidenses, con su capital y puerto franco histórico.",{t:"Fondeo / marina",p:"3–8 m",f:"arena/fango",h:"bueno",v:"16",s:"Provisión, combustible, talleres",pr:"Fondeo gratis; marinas altas"}],
    ["St. Croix","🇻🇮",[17.73,-64.78], 40,0,"anti",[[18.02,-64.82]], 1,0,"Christiansted; salto al este hacia las Antillas Menores.","Christiansted","La mayor de las Vírgenes de EEUU, de herencia danesa y arrecifes coralinos.",{t:"Boyas / fondeo",p:"3–6 m",f:"arena",h:"bueno",v:"16",s:"Boyas en Christiansted, buceo",pr:"Boyas/fondeo económico"}],
    ["St. Martin","🇸🇽",[18.07,-63.08], 95,1,"menor",[[17.85,-63.85]], 7,1,"Simpson Bay Lagoon; hub de reparaciones y compras libres de impuestos.","San Martín (isla)","Isla compartida por Francia y Países Bajos, gran hub náutico del Caribe.",{t:"Laguna / marina",p:"2–4 m (puentes ~2 m)",f:"fango",h:"regular (arrastra)",v:"16/12",s:"Simpson Bay Lagoon, varias marinas, duty-free, talleres",pr:"Fondeo gratis en la laguna; marinas variables"}],
    ["Guadalupe","🇬🇵",[16.24,-61.53], 90,0,"menor",[[17.00,-62.15],[16.65,-61.70]], 3,0,"Pointe-à-Pitre / Marina Bas-du-Fort.","Pointe-à-Pitre","Archipiélago francés con forma de mariposa, en el corazón de las Antillas Menores.",{t:"Marina / fondeo",p:"3–5 m",f:"arena/fango",h:"bueno",v:"16/09",s:"Marina Bas-du-Fort, talleres, provisión",pr:"Marina media"}],
    ["Martinica","🇲🇶",[14.60,-61.07], 110,0,"menor",[[15.40,-61.25]], 7,1,"Le Marin, la mayor marina de las Antillas francesas.","Fort-de-France","Isla francesa volcánica, verde y montañosa, de intensa cultura criolla.",{t:"Marina / fondeo",p:"~4 m",f:"fango blando pegajoso",h:"malo (mucha cadena)",v:"16/09",s:"Marina du Marin (830 puestos), talleres, provisión",pr:"Marina media; fondeo gratis"}],
    ["Santa Lucía","🇱🇨",[13.91,-60.98], 25,0,"menor",[[14.25,-60.98]], 3,0,"Rodney Bay Marina; servicios completos, fin de la ARC.","Santa Lucía","Isla de los icónicos picos Pitons, volcánica y exuberante.",{t:"Marina / fondeo",p:"3–4 m (calado máx. 3,9 m)",f:"arena/fango",h:"bueno",v:"16",s:"IGY Rodney Bay, combustible, duty-free, varadero",pr:"Marina media-alta"}],
    ["San Vicente","🇻🇨",[13.16,-61.23], 55,0,"menor",[[13.52,-61.12]], 2,0,"Blue Lagoon; Bequia y los Granadinos a un salto.","Kingstown","Cabecera de San Vicente y las Granadinas, de naturaleza intensa y veleo.",{t:"Fondeo / marina",p:"4–8 m",f:"arena",h:"regular",v:"16/68",s:"Blue Lagoon, Bequia cerca",pr:"Boya/fondeo económico"}],
    ["Granada","🇬🇩",[12.05,-61.75], 40,0,"menor",[[12.60,-61.50]], 7,1,"Prickly Bay / Port Louis; refugio clásico de temporada de huracanes (~12°N).","Saint George (Granada)","La 'Isla de las Especias', refugio clásico al sur del cinturón de huracanes.",{t:"Marina / fondeo",p:"5–15 m (Prickly Bay)",f:"arena/fango",h:"bueno",v:"16",s:"Port Louis (C&N), Prickly Bay, aduana, varadero",pr:"Marina media; fondeo gratis"}],
    ["Chaguaramas","🇹🇹",[10.68,-61.64], 80,1,"guay",[[11.35,-61.72]], 10,1,"Hub de varadero y reparación de Trinidad, bajo el cinturón de huracanes.","Chaguaramas (Trinidad y Tobago)","Bahía al noroeste de Trinidad, gran centro de astilleros y servicios del Caribe.",{t:"Fondeo / varadero",p:"10 m +",f:"fango",h:"regular (contracorriente)",v:"16/69",s:"Varaderos top (Power Boats, Peake), talleres",pr:"Varada ~US$7/pie; guardería ~US$0,43/pie/día"}],
    ["Georgetown","🇬🇾",[6.80,-58.16], 240,0,"guay",[[9.90,-60.10],[8.20,-58.90]], 3,0,"Río Demerara; fondeo fluvial, trámites con agente local.","Georgetown (Guyana)","Capital de Guyana sobre el río Demerara, de arquitectura colonial en madera.",{t:"Fondeo fluvial",p:"río (marea)",f:"fango",h:"regular",v:"16",s:"Río Demerara, agente obligatorio",pr:"Fondeo; tasas vía agente"}],
    ["Paramaribo","🇸🇷",[5.82,-55.17], 420,0,"guay",[[6.95,-57.05],[6.30,-55.95]], 3,0,"Río Suriname / Domburg; entrada coordinada con la marea.","Paramaribo","Capital de Surinam, de casco histórico holandés Patrimonio de la Humanidad.",{t:"Río / boyas",p:"~10 m fondeo (canal ≥8 m)",f:"fango blando",h:"malo (corriente 3–5 kn)",v:"16",s:"Boyas Domburg, Waterland marina (calado 4 m)",pr:"Boya económica; marina media"}],
    ["Cayenne","🇬🇫",[4.94,-52.30], 210,0,"guay",[[5.90,-54.00],[5.40,-53.00]], 3,0,"Dégrad des Cannes; Islas de la Salvación (Île Royale) cerca.","Cayena","Capital de la Guayana Francesa, mezcla criolla, frente a las Islas de la Salvación.",{t:"Río / fondeo",p:"río (marea)",f:"fango",h:"regular",v:"16",s:"Dégrad des Cannes; fondeo en Îles du Salut",pr:"Fondeo gratis en Îles du Salut"}],
    ["Belém","🇧🇷",[-1.46,-48.50], 320,0,"br",[[3.60,-50.80],[1.40,-49.10],[-0.30,-48.30]], 4,0,"Entrada por el río; Marina Belém, puerta de la Amazonia.","Belém","Puerta de la Amazonia, en la desembocadura del río, de mercados y mango.",{t:"Río / marina",p:"río (marea fuerte)",f:"fango",h:"regular",v:"16",s:"Marina Belém, provisión, clearance",pr:"Marina media"}],
    ["Fortaleza","🇧🇷",[-3.72,-38.54], 430,0,"br",[[-1.00,-45.00],[-1.70,-41.30],[-2.85,-39.40]], 7,1,"Marina Park; gran parada del nordeste tras el tramo más largo.","Fortaleza","Gran ciudad playera del nordeste brasileño, soleada y muy animada.",{t:"Marina (Med-moor)",p:"~3–4 m",f:"pantalán",h:"amarre Med",v:"16",s:"Marina Park (pileta, wifi; SIN agua/luz/gasoil), clearance",pr:"~US$40/día"}],
    ["Natal","🇧🇷",[-5.79,-35.21], 370,0,"br",[[-4.40,-37.10],[-4.85,-35.45]], 3,0,"Iate Clube do Natal; esquina nordeste de Brasil.","Natal (Río Grande del Norte)","Ciudad de dunas y sol del nordeste de Brasil, en 'la esquina' del continente.",{t:"Marina / río",p:"3–5 m",f:"arena/fango",h:"bueno",v:"16",s:"Iate Clube do Natal, provisión",pr:"Marina media"}],
    ["Recife","🇧🇷",[-8.05,-34.88], 160,0,"br",[[-6.90,-34.78]], 4,0,"Cabanga Iate Clube; ciudad histórica.","Recife","La 'Venecia brasileña', de ríos, puentes y un rico casco histórico.",{t:"Marina / fondeo",p:"3–5 m (río ~5 m)",f:"fango",h:"bueno",v:"16",s:"Cabanga IC; Jacaré/Cabedelo cerca (corriente hasta 5 kn)",pr:"Marina media"}],
    ["Salvador","🇧🇷",[-12.97,-38.51], 420,0,"br",[[-9.50,-35.10],[-11.50,-37.10]], 7,1,"Bahía de Todos os Santos; Terminal Náutico.","Salvador (Bahía)","Primera capital de Brasil, corazón afrobrasileño, sobre la Bahía de Todos os Santos.",{t:"Marina",p:"profundo (canal Pier 1,4 m BM)",f:"fango",h:"bueno",v:"16",s:"Terminal Náutico / Bahia Marina (admiten extranjeros). ⚠ No fondear en zona portuaria (robos)",pr:"Marina media-alta"}],
    ["Abrolhos","🇧🇷",[-17.96,-38.70], 560,0,"br",[[-14.40,-38.75],[-16.50,-38.60]], 2,0,"Parque Marino de Abrolhos; fondeo y ballenas jorobadas (jul–nov).","Archipiélago de Abrolhos","Archipiélago y parque marino, santuario de ballenas jorobadas en invierno.",{t:"Fondeo (parque)",p:"5–10 m",f:"arena/coral",h:"regular",v:"16",s:"Parque marino, permiso ICMBio, ballenas (jul–nov)",pr:"Fondeo; tasa de parque"}],
    ["Vitória","🇧🇷",[-20.32,-40.34], 260,0,"br",[[-19.00,-39.40],[-20.05,-40.00]], 4,0,"Iate Clube do Espírito Santo.","Vitória (Espírito Santo)","Capital isleña de Espírito Santo, de bahías y puerto muy activo.",{t:"Marina / fondeo",p:"4–8 m",f:"fango",h:"bueno",v:"16",s:"Iate Clube ES, provisión",pr:"Marina media"}],
    ["Búzios","🇧🇷",[-22.75,-41.88], 260,0,"br",[[-21.50,-40.70],[-22.45,-41.40]], 3,0,"Fondeo en bahías; balneario clásico.","Armação dos Búzios","Elegante península balnearia de decenas de playas, al este de Río.",{t:"Fondeo",p:"4–8 m",f:"arena",h:"bueno",v:"16",s:"Fondeo en bahías, balneario",pr:"Fondeo gratis"}],
    ["Ilha Grande","🇧🇷",[-23.14,-44.23], 90,0,"br",[[-23.05,-43.10]], 4,1,"Vila do Abraão; bahías protegidas, antesala de Angra.","Ilha Grande","Isla de selva atlántica y playas vírgenes, sin autos, frente a Angra.",{t:"Fondeo",p:"5–12 m",f:"arena/fango",h:"bueno",v:"16",s:"Abraão y caletas, selva, sin autos",pr:"Fondeo gratis"}],
    ["Angra dos Reis","🇧🇷",[-23.01,-44.32], 35,0,"br",[[-23.12,-44.27]], 0,0,"Destino final: bahía con 365 islas. Llegada prevista septiembre 2027.","Angra dos Reis","Bahía paradisíaca con 365 islas verdes, destino final de la travesía.",{t:"Marina / fondeo",p:"5–15 m",f:"arena/fango",h:"bueno",v:"16",s:"Marinas (Verolme/Piccola), 365 islas, provisión",pr:"Marina media; fondeo gratis"}],
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

  // ===== Capas =====
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
      if(nm===0)return;
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

  // ===== Tramo =====
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

  // ===== Galería de imágenes (Wikipedia REST media-list, CORS abierto) =====
  async function cityImages(title){
    if(!title) return [];
    const base=title.replace(/\s*\(.*?\)\s*/,'').trim();
    const variants=[['es',title],['en',title]];
    if(base&&base!==title){variants.push(['es',base],['en',base]);}
    for(const [lang,t] of variants){
      try{
        const r=await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(t)}`);
        if(!r.ok) continue;
        const j=await r.json();
        const out=[],seen=new Set();
        (j.items||[]).forEach(it=>{
          if(out.length>=6) return;
          if(it.type!=='image'||!it.srcset||!it.srcset.length) return;
          let src=it.srcset[0].src; if(src.startsWith('//')) src='https:'+src;
          if(/\.svg/i.test(src)) return;            // descartar íconos/banderas
          if(seen.has(src)) return; seen.add(src); out.push(src);
        });
        if(out.length) return out;
      }catch(e){/* siguiente */}
    }
    // fallback: imagen única del resumen
    for(const [lang,t] of variants){
      try{
        const r=await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`);
        if(!r.ok) continue;
        const j=await r.json();
        const s=(j.originalimage&&j.originalimage.source)||(j.thumbnail&&j.thumbnail.source);
        if(s) return [s];
      }catch(e){}
    }
    return [];
  }

  // ===== Popup de puerto (galería + ficha náutica + links) =====
  function openPort(i){
    const w=WP[i],r=REGIONS[w[5]],custom=w[5]==='custom',nav=w[12];
    const restTxt=w[7]>0?`${w[7]} días`:'escala corta';
    const badge=w[8]?'<span class="badge rec">puerto de recalada</span>':(custom?'<span class="badge short">parada propia</span>':'<span class="badge short">escala de tránsito</span>');
    const climate=custom?'Parada personalizada · ruta local':`${r.label} · ${r.months} · agua ${r.water}`;
    const q=encodeURIComponent((w[10]||w[0]).replace(/\s*\(.*?\)\s*/,' ').trim());
    const noon=`https://www.noonsite.com/?s=${q}`;
    const navi=`https://www.google.com/search?q=site:navily.com+${q}`;
    const maps=`https://www.google.com/maps/search/?api=1&query=${w[2][0]},${w[2][1]}`;
    const navBlock = nav ? `
      <div class="nav">
        <div class="c">Tipo<b>${nav.t}</b></div>
        <div class="c">Profundidad<b>${nav.p}</b></div>
        <div class="c">Fondo<b>${nav.f}</b></div>
        <div class="c">Tenedero<b>${nav.h}</b></div>
        <div class="c">VHF<b>${nav.v}</b></div>
        <div class="c">Precio<b>${nav.pr}</b></div>
      </div>
      <div class="serv">⚓ ${nav.s}</div>` : '';
    const rm=custom?`<button class="rm" id="rmBtn">✕ Quitar esta parada</button>`:'';
    const links=`<div class="links">
        <a href="${noon}" target="_blank" rel="noopener">Noonsite</a>
        <a href="${navi}" target="_blank" rel="noopener">Navily</a>
        <a href="${maps}" target="_blank" rel="noopener">📍 Mapa</a>
      </div>`;
    const html=`<div class="pp">
      <div class="ppgal" id="ppgal"><div class="heroph">📷 cargando fotos…</div></div>
      <h3>${w[1]} ${w[0]}</h3>
      <div class="ppc">${climate}</div>
      <div class="ppinfo">${w[11]||''}</div>
      ${navBlock}
      <div class="ppkpi">
        <div class="b">Descanso<b>${restTxt}</b>${badge}</div>
        ${i>0?`<div class="b">Tramo previo<b>${D(legNm[i])} nm</b></div>`:`<div class="b">Punto<b>Salida</b></div>`}
      </div>
      ${links}
      ${rm}
      ${nav?'<div class="ppcredit">Datos orientativos · fotos Wikipedia · confirmá en los links</div>':''}
    </div>`;
    markers[i].bindPopup(html,{maxWidth:300,minWidth:260}).openPopup();
    if(custom) setTimeout(()=>{const b=document.getElementById('rmBtn');if(b)b.onclick=()=>removeWaypoint(i);},0);
    if(w[10]) cityImages(w[10]).then(imgs=>{
      const gal=document.getElementById('ppgal'); if(!gal) return;
      if(!imgs.length){ gal.innerHTML='<div class="heroph">sin imagen disponible</div>'; return; }
      gal.innerHTML=`<img class="hero" id="heroimg" src="${imgs[0]}" alt="">`+
        (imgs.length>1?`<div class="thumbs">${imgs.map((s,k)=>`<img data-i="${k}" class="${k===0?'sel':''}" src="${s}">`).join('')}</div>`:'');
      const hero=document.getElementById('heroimg');
      gal.querySelectorAll('.thumbs img').forEach(t=>t.onclick=()=>{
        hero.src=imgs[+t.dataset.i];
        gal.querySelectorAll('.thumbs img').forEach(x=>x.classList.remove('sel')); t.classList.add('sel');
      });
    });
  }

  // ===== Agregar / quitar paradas =====
  function addWaypoint(latlng){
    customCount++;
    WP.push([`Parada ${customCount}`,"📍",[latlng.lat,latlng.lng], null,0,"custom",[], 0,0,
      "Parada agregada por vos (ruta local).","","Escala personalizada que sumaste para extender la ruta.",null]);
    const i=WP.length-1;
    givenNm[i]=Math.round(geomLen(i)); geom0[i]=geomLen(i); legNm[i]=givenNm[i]; moved[i]=false;
    buildLayers(); buildCumulative(); renderAll(); showLeg(i); openPort(i);
  }
  function removeWaypoint(i){
    if(WP[i][5]!=='custom')return;
    map.closePopup();
    WP.splice(i,1); givenNm.splice(i,1); geom0.splice(i,1); legNm.splice(i,1); moved.splice(i,1);
    if(i>=1&&i<WP.length){ givenNm[i]=Math.round(geomLen(i)); geom0[i]=geomLen(i); legNm[i]=givenNm[i]; moved[i]=false; }
    buildLayers(); buildCumulative(); renderAll(); clearLeg();
  }

  // ===== Botón "Agregar parada" =====
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
