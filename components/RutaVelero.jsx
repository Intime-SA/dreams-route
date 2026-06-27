"use client";

import { useEffect, useRef } from "react";
import initRutaVelero from "./map-logic";

function loadLeaflet() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.L) return resolve();
    if (!document.getElementById("leaflet-css")) {
      const css = document.createElement("link");
      css.id = "leaflet-css";
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
    }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export default function RutaVelero() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // guard against React 18 strict-mode double mount
    started.current = true;
    loadLeaflet().then(() => initRutaVelero());
  }, []);

  return (
    <>
      <div id="map"></div>

      <div className="topbar">
        <span className="dot"></span>
        <b>Travesía a vela · EEUU → Brasil</b>
        <span className="sub">Tracys Landing → Angra dos Reis · llegada sept 2027</span>
      </div>

      <div className="panel card">
        <div className="pad">
          <h1>Plan de navegación</h1>
          <div className="route">40 escalas · 7 países · costeando el Atlántico oeste</div>

          <div className="stats">
            <div className="stat">
              <div className="k">Distancia total</div>
              <div className="v" id="totNm">– <small>nm</small></div>
            </div>
            <div className="stat">
              <div className="k">Días navegando</div>
              <div className="v" id="totSail">–</div>
            </div>
          </div>

          <div className="speedrow">
            <span className="lbl">Velocidad promedio</span>
            <div className="seg" id="seg">
              <button data-s="5">5 kn</button>
              <button data-s="5.5" className="on">5,5 kn</button>
              <button data-s="6">6 kn</button>
            </div>
          </div>

          <div className="toggle">
            <label className="sw">
              <input type="checkbox" id="restSw" />
              <span className="track"></span>
              <span className="knob"></span>
            </label>
            <div className="t-txt">
              Sumar días en puerto
              <br />
              <small>~7 d en cada puerto de recalada</small>
            </div>
            <div className="t-val" id="restVal">+0 d</div>
          </div>

          <div className="arrival" id="arrival">
            Objetivo: llegar a <b>Brasil en septiembre 2027</b>.
          </div>

          <div className="play">
            <button className="primary" id="playBtn">▶ Reproducir travesía</button>
            <button id="resetBtn">Inicio</button>
          </div>
        </div>

        <div className="legbox" id="legbox">
          <div className="hint">
            Pasá el mouse por la ruta o tocá una escala para ver el tramo. <b>Arrastrá cualquier punto</b> para recalcular las millas a escala del mapa.
          </div>
        </div>
      </div>

      <div className="regions card">
        <div className="rhead">
          🗓️ Etapas · clima · distancias <small id="rspeed">a 5,5 kn</small>
        </div>
        <div id="rrows"></div>
        <div className="rfoot" id="rfoot"></div>
      </div>

      <div className="legend-mini">Arrastrá los puntos para ajustar la ruta · clic para ver el puerto</div>
      <div className="hideMsg">
        Atlántico Sur (Brasil): prácticamente sin huracanes · el Caribe se cruza en ventana segura (nov–may)
      </div>
    </>
  );
}
