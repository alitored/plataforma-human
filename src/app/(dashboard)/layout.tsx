// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plataforma Human",
  description: "Dashboard de Buenos Pasos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
