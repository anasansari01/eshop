import './global.css';
import {Poppins} from "next/font/google";
import Providers from './Providers';

export const metadata = {
  title: 'Eshop',
  description: 'Welcome to Eshop!',
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-slate-900 font-sans antialiased  ${poppins.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
