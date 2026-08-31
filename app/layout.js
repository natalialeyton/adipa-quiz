import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Descubre tu Especialidad en Psicología con ADIPA",
  description:
    "Encuentra la especialidad de psicología que mejor se ajusta a tu perfil profesional con el test interactivo de ADIPA.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-screen bg-primary-gray font-sans text-secondary-navy antialiased">
        {children}
      </body>
    </html>
  );
}
