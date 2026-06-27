import "./globals.css";

export const metadata = {
  title: "Ruta de navegación · EEUU → Brasil · Sept 2027",
  description:
    "Mapa interactivo de la travesía a vela desde Tracys Landing (EEUU) hasta Angra dos Reis (Brasil): distancias, tiempos, clima y temporada de huracanes.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
