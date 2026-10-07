import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../context/auth-context";

export const metadata: Metadata = {
  title: "Shop Zero | Everything, less hassle",
  description: "Nigeria's multi-category marketplace — electronics, fashion, groceries, and more delivered to your door.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23f5821f'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='Arial' font-weight='900' font-size='14' fill='white'%3ESZ%3C/text%3E%3C/svg%3E"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
