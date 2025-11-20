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

export const metadata = {
  title: "SEO Comparison Tool - Compare Website SEO & Meta Tags",
  description: "Free SEO comparison tool to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors. Get instant insights and actionable recommendations.",
  keywords: ["SEO comparison", "meta tag analyzer", "website comparison", "SEO audit", "Open Graph", "Twitter Cards", "Lighthouse scores", "competitor analysis"],
  authors: [{ name: "SEO Comparison Tool" }],
  creator: "SEO Comparison Tool",
  publisher: "SEO Comparison Tool",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SEO Comparison Tool - Compare Website SEO & Meta Tags",
    description: "Free SEO comparison tool to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors.",
    siteName: "SEO Comparison Tool",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Comparison Tool - Compare Website SEO & Meta Tags",
    description: "Free SEO comparison tool to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors.",
    creator: "@seocomparison",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
