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
  title: "SEO Battleground - Compare Website SEO & Meta Tags",
  description: "Free SEO comparison tool to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors. Get instant insights and actionable recommendations.",
  keywords: ["SEO comparison", "meta tag analyzer", "website comparison", "SEO audit", "Open Graph", "Twitter Cards", "Lighthouse scores", "competitor analysis"],
  authors: [{ name: "SEO Battleground" }],
  creator: "SEO Battleground",
  publisher: "SEO Battleground",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SEO Battleground - Compare Website SEO & Meta Tags",
    description: "Free SEO comparison tool to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors.",
    siteName: "SEO Battleground",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Comparison Tool - Compare Website SEO & Meta Tags",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Battleground - Compare Website SEO & Meta Tags",
    description: "Free SEO comparison tool to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors.",
    creator: "@seocomparison",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
