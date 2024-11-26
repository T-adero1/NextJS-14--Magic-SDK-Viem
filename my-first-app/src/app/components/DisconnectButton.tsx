"use client"
import { useUser } from "../context/UserContext"

const DisconnectButton = () => {
  const { logout } = useUser()

  const handleDisconnect = async () => {
    try {
      await logout()
      localStorage.clear()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  return (
    <button
      onClick={handleDisconnect}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Disconnect Wallet
    </button>
  )
}

export default DisconnectButton
