import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plusjakarta" });

const selectedFont = process.env.NEXT_PUBLIC_FONT || "inter";
const fontClass = selectedFont === "plusjakarta" ? plusJakarta.variable : inter.variable;

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
