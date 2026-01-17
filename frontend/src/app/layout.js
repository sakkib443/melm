import {
  Poppins,
  Outfit,
  Inter,
  Roboto,
  Montserrat,
  Nunito,
  Lato,
  Open_Sans,
  Hind_Siliguri,
  Teko,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

// Load all fonts that can be selected from admin
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-opensans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-teko",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s | CreativeHub Pro",
    default: "CreativeHub Pro | Digital Marketplace & eLearning",
  },
  description:
    "CreativeHub Pro - The ultimate platform for digital creators. Buy & sell graphics, templates, UI kits, courses, and more. Join thousands of creators worldwide.",
  keywords: [
    "digital marketplace",
    "templates",
    "graphics",
    "UI kits",
    "courses",
    "eLearning",
    "design",
    "video templates",
    "fonts",
  ],
  authors: [{ name: "CreativeHub Pro" }],
  creator: "CreativeHub Pro",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CreativeHub Pro",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${poppins.variable} 
        ${outfit.variable} 
        ${inter.variable} 
        ${roboto.variable} 
        ${montserrat.variable} 
        ${nunito.variable} 
        ${lato.variable} 
        ${openSans.variable} 
        ${hindSiliguri.variable}
        ${teko.variable}
        ${dancingScript.variable}
      `}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
