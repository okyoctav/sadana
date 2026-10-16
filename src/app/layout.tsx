import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pengalihan Layanan | Satu Data Bencana Bappenas",
  description:
    "Website ini sedang ditutup sementara dan seluruh layanan serta data dialihkan ke portal resmi Satu Data Bencana Bappenas (satudatabencana.bappenas.go.id).",
  keywords: [
    "Satu Data Bencana",
    "Bappenas",
    "Kementerian PPN",
    "Data Bencana Indonesia",
    "Geospasial",
    "Pemberitahuan Migrasi",
  ],
  authors: [{ name: "Kementerian PPN / Bappenas Republik Indonesia" }],
  openGraph: {
    title: "Pengalihan Layanan | Satu Data Bencana Bappenas",
    description:
      "Website ini sedang ditutup sementara dan seluruh layanan dialihkan ke https://satudatabencana.bappenas.go.id",
    url: "https://satudatabencana.bappenas.go.id",
    siteName: "Satu Data Bencana Bappenas",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
