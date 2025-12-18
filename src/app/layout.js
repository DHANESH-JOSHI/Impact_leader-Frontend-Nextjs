import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApiClientProvider from "@/components/ApiClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Impact Leader Admin Portal",
  description: "Developed by Impact Leader | TechWithJoshi Private Limited",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApiClientProvider>
          {children}
        </ApiClientProvider>
      </body>
    </html>
  );
}
