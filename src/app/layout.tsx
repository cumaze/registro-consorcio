import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UniversityNameProvider } from "@/context/UniversityNameContext";

export const metadata: Metadata = {
  title: "Consortium Universitas",
  description: "Visualiza tu registro académico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-gray-100">
        <UniversityNameProvider>
          {children}
          <Toaster />
        </UniversityNameProvider>
      </body>
    </html>
  );
}
