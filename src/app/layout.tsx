import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "తెలుగు పంచాంగం — Telugu Panchangam",
  description:
    "Free, open-source Telugu Panchangam — any city, any date, no limit. Accurate Tithi, Nakshatra, Yoga, Karana, sunrise, moonrise, Rahukalam for cities worldwide.",
  openGraph: {
    title: "తెలుగు పంచాంగం — Telugu Panchangam",
    description:
      "Free Telugu Panchangam for any city, any date. Accurate astronomical calculations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Sans+Telugu:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-cream text-text-primary font-lora min-h-screen">
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
