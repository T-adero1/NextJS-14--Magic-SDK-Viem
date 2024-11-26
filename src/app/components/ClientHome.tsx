"use client"
import ConnectButton from "../components/ConnectButton"
import WalletDetail from "../components/WalletDetail"
import DisconnectButton from "../components/DisconnectButton"
import { useUser } from "../context/UserContext"

export default function ClientHome() {
  const { user } = useUser()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-2xl font-bold">Magic Wallet 🧙</h1>
      {user ? (
        <>
          <WalletDetail />
          <DisconnectButton />
        </>
      ) : (
        <ConnectButton />
      )}
    </main>
  )
} 