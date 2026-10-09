import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { fetchWithFallback } from "@/lib/api";
import { Category, Product } from "@/types";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🛒 বাজার দর - প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description: "প্রতিদিনের নিত্যপ্রয়োজনীয় পণ্যের সঠিক বাজার দর জানুন।",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // fetch categories and products for navbar and ticker
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    categories = await fetchWithFallback<Category[]>('/categories');
    products = await fetchWithFallback<Product[]>('/products');
  } catch (error) {
    console.error("Failed to fetch layout data:", error);
  }

  return (
    <html lang="bn" data-theme="light">
      <body className={`${geist.className} min-h-screen bg-base-100 text-base-content antialiased`}>
        {/* top navigation bar with dynamic categories and marquee price ticker */}
        <Navbar categories={categories} tickerProducts={products} />
        
        {/* main page content */}
        {children}
      </body>
    </html>
  );
}