import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/query-provider";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trust Travel - Control Panel",
  description: "Management dashboard for Trust Travel platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
