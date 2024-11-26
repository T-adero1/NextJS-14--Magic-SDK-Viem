"use client"
import { Magic } from "magic-sdk"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { createPublicClient, http } from "viem"
import { arbitrum } from "viem/chains"

type MagicContextType = {
  magic: Magic | null
  client: ReturnType<typeof createPublicClient> | null
}

const MagicContext = createContext<MagicContextType>({
  magic: null,
  client: null,
})

export const useMagic = () => useContext(MagicContext)

const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null)
  const [client, setClient] = useState<ReturnType<typeof createPublicClient> | null>(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      console.warn("Magic API key is missing. Magic SDK will not be initialized.");
      return;
    }
  
    const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
      network: {
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        chainId: arbitrum.id,
      },
    });
  
    setMagic(magicInstance);
  
    const publicClient = createPublicClient({
      chain: arbitrum,
      transport: http("https://arb1.arbitrum.io/rpc"),
    });
    setClient(publicClient);
  }, []);
  

  const value = useMemo(() => ({ magic, client }), [magic, client])

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
}

export default MagicProvider
