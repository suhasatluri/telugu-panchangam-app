import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "తెలుగు పంచాంగం — Telugu Panchangam",
  description:
    "Free, open-source Telugu Panchangam — any city, any date, no limit. Accurate Tithi, Nakshatra, Yoga, Karana, sunrise, moonrise, Rahukalam for cities worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream text-text-primary font-lora">
        {children}
      </body>
    </html>
  );
}
