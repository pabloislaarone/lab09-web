import type { Metadata } from "next";
import { Geist, Geist_Mono, Big_Shoulders, Instrument_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tipografías de la portada y la cartelera: letras de marquesina + texto
const marquee = Big_Shoulders({
  variable: "--font-marquee-src",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});

const texto = Instrument_Sans({
  variable: "--font-texto-src",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laboratorio 09 - Introducción a Next.js",
  description: "Ejercicios de CSR y SSR con Next.js y la tarea Cartelera con la API de OMDb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${marquee.variable} ${texto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
