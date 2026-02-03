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
  title: "Weather Forecast",
  description: "Get accurate real-time weather forecasts with beautiful visualizations. Track temperature, wind, humidity, and outdoor activity conditions for your location.",
  keywords: ["weather", "forecast", "real-time weather", "temperature", "weather app", "outdoor activities"],
  authors: [{ name: "Sreedev Rajendran" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Weather Forecast",
    description: "Beautiful, real-time weather forecasts with activity recommendations",
    type: "website",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f172a] text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
