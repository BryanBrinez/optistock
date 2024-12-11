import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../app/components/NavBar"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-ECHELK4K1oKE54g+lgA+b9aOtjEILvjS/aeG8+XNyZQzJ/NWEVAt0ayEk9kgEnN"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}