# Ruta de navegación · EEUU → Brasil

Mapa interactivo (Next.js + Leaflet) de la travesía a vela desde **Tracys Landing (Maryland)** hasta **Angra dos Reis (Brasil)**, con llegada prevista en **septiembre de 2027**.

## Funcionalidades

- Ruta costera realista sobre un mapa estilo Google Maps (basemap CARTO Voyager).
- Distancia y tiempo por tramo y por región, a **5 / 5,5 / 6 nudos**.
- Etapas con **mes del cronograma, temperatura del agua y avisos de temporada de huracanes**.
- **Días de descanso** por puerto de recalada con switch para incluirlos en el total.
- **Checkpoints arrastrables**: al mover un punto se recalculan las millas a escala del mapa.
- Animación de la travesía completa.

## Desarrollo local

```bash
cd ruta-velero-app
npm install
npm run dev
```

Abrí http://localhost:3000

## Deploy en Vercel

Como este proyecto vive en una subcarpeta del repo, al importar el repositorio en Vercel configurá:

- **Root Directory:** `ruta-velero-app`
- **Framework Preset:** Next.js (autodetectado)
- Build command y output: por defecto (`next build`).

Alternativa por CLI:

```bash
cd ruta-velero-app
npx vercel        # preview
npx vercel --prod # producción
```

## Estructura

```
ruta-velero-app/
├─ app/
│  ├─ layout.jsx        # html/body + metadata
│  ├─ page.jsx          # renderiza el mapa
│  └─ globals.css       # estilos
└─ components/
   ├─ RutaVelero.jsx    # componente cliente (carga Leaflet, monta el mapa)
   └─ map-logic.js      # lógica del mapa (datos, KPIs, drag, animación)
```

Leaflet se carga desde CDN en el cliente; no requiere dependencias extra de npm.
# dreams-route
