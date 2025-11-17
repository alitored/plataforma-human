// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plusjakarta" });

const selectedFont = process.env.NEXT_PUBLIC_FONT || "inter";
const fontClass = selectedFont === "plusjakarta" ? plusJakarta.variable : inter.variable;

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://plataforma-human.vercel.app";

export const metadata: Metadata = {
  title: "PlataformaHuman",
  description: "Cursos prácticos y programas para profesionalizar tu presencia digital",
  metadataBase: new URL(BASE),
  openGraph: {
    type: "website",
    title: "PlataformaHuman",
    description: "Cursos prácticos y programas para profesionalizar tu presencia digital",
    siteName: "PlataformaHuman",
    images: [
      {
        url: `${BASE}/og/og.webp`,
        alt: "PlataformaHuman",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontClass} font-sans`}>
      <body className="bg-fondo text-texto antialiased min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
