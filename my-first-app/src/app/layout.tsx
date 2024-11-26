import MagicProvider from "./context/MagicProvider"
import { UserProvider } from "./context/UserContext"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MagicProvider>
          <UserProvider>{children}</UserProvider>
        </MagicProvider>
      </body>
    </html>
  )
}
