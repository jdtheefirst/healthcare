import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Clinics + Hotels Demo | Northwind Systems",
  description:
    "Experience Northwind's versatility with our Clinics + Hotels demo, showcasing a seamless booking journey that transforms medical appointments into hotel reservations using the same robust Appwrite backend and SMS notifications.",
  metadataBase: new URL("https://healthcare.yunobase.com"),
  openGraph: {
    title: "Clinics + Hotels Demo | Northwind Systems",
    description:
      "Experience Northwind's versatility with our Clinics + Hotels demo, showcasing a seamless booking journey that transforms medical appointments into hotel reservations using the same robust Appwrite backend and SMS notifications.",
    url: "https://healthcare.yunobase.com",
    siteName: "Northwind Systems",
    images: [
      {
        url: "/assets/clinic-hotel-demo/clinic-hotel-demo-thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Clinics + Hotels Demo Thumbnail",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clinics + Hotels Demo | Northwind Systems",
    description:
      "Experience Northwind's versatility with our Clinics + Hotels demo, showcasing a seamless booking journey that transforms medical appointments into hotel reservations using the same robust Appwrite backend and SMS notifications.",
    images: ["/assets/clinic-hotel-demo/clinic-hotel-demo-thumbnail.jpg"],
    creator: "@yunobase",
  },
  keywords: [
    "Northwind Systems",
    "Clinics + Hotels Demo",
    "booking system demo",
    "medical appointment booking",
    "hotel reservation system",
    "Appwrite backend demo",
    "SMS notification demo",
    "healthcare booking system",
    "hospitality booking system",
  ],
  authors: [
    { name: "Northwind Systems", url: "https://northwind.yunobase.com/about" },
  ],
  creator: "Northwind Systems",
  icons: {
    icon: "/assets/icons/logo-icon.svg",
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
        {/* Basic favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Modern browsers */}
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />

        {/* Android Chrome */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
