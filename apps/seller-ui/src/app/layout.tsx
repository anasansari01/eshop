import './global.css';
import Providers from './Providers';

export const metadata = {
  title: 'Eshop Seller',
  description: 'Sell product through Eshop seller.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
