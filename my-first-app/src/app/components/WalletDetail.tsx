"use client"
import { useEffect, useState } from "react"
import { useMagic } from "../context/MagicProvider"
import { useUser } from "../context/UserContext"
import { formatEther } from "viem"

const WalletDetail = () => {
  const { user } = useUser()
  const { client } = useMagic()
  const [balance, setBalance] = useState<string | null>(null)
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (client && user?.address) {
        try {
          setIsLoading(true)
          const address = user.address as `0x${string}`
          
          const [balanceWei, currentBlock] = await Promise.all([
            client.getBalance({ address }),
            client.getBlockNumber()
          ])

          const balanceEth = formatEther(balanceWei)
          const formattedBalance = balanceWei === 0n ? "0.0" : balanceEth
          
          setBalance(formattedBalance)
          setBlockNumber(currentBlock)
          console.log(`Fetched data - Balance: ${formattedBalance} ETH, Block: ${currentBlock}`)
        } catch (error) {
          console.error("Error fetching wallet data:", error)
          setBalance(null)
          setBlockNumber(null)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()

    const interval = setInterval(async () => {
      if (client) {
        try {
          const currentBlock = await client.getBlockNumber()
          setBlockNumber(currentBlock)
          console.log(`Updated block number: ${currentBlock}`)
        } catch (error) {
          console.error("Error updating block number:", error)
        }
      }
    }, 12000)

    return () => clearInterval(interval)
  }, [client, user])

  const renderBalance = () => {
    if (isLoading) return "Loading..."
    if (balance === null) return "Error fetching balance"
    if (balance === "0.0") return "0.0 ETH (Wallet not funded)"
    return `${balance} ETH`
  }

  const renderBlockNumber = () => {
    if (isLoading) return "Loading..."
    if (blockNumber === null) return "Error fetching block number"
    return blockNumber.toString()
  }

  return (
    <div className="p-4 border rounded bg-gray-100">
      <h2 className="text-lg font-bold mb-4">Wallet Information</h2>
      {user ? (
        <div className="space-y-2">
          <p>Network: <strong>Arbitrum</strong></p>
          <p>Connected Address: <strong>{user.address}</strong></p>
          <p>Balance: <strong>{renderBalance()}</strong></p>
          <p>Current Block: <strong>{renderBlockNumber()}</strong></p>
          {balance === "0.0" && (
            <p className="text-amber-600 text-sm mt-2">
              ⚠️ To use this wallet, you'll need to bridge some ETH to Arbitrum and send it to this address
            </p>
          )}
        </div>
      ) : (
        <p>No wallet connected</p>
      )}
    </div>
  )
}

export default WalletDetail
