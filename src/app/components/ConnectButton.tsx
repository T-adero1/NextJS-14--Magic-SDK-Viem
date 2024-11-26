"use client"
import { useMagic } from "../context/MagicProvider"
import { useUser } from "../context/UserContext"

const ConnectButton = () => {
  const { magic } = useMagic()
  const { fetchUser } = useUser()

  const handleConnect = async () => {
    try {
      await magic?.wallet.connectWithUI()
      await fetchUser()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  )
}

export default ConnectButton
