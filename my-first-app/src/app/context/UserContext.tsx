"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useMagic } from "./MagicProvider"



type User = {
  address: string
}

type UserContextType = {
  user: User | null
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  fetchUser: async () => {},
  logout: async () => {},
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { magic } = useMagic()
  const [address, setAddress] = useState<string | null>(null)

  const fetchUserAccount = useCallback(async () => {
    try {
      if (!magic) {
        console.log("Magic SDK not yet initialized")
        return
      }

      console.log("Magic SDK instance exists, fetching metadata...")
  
      const isLoggedIn = await magic.user.isLoggedIn()
      if (!isLoggedIn) {
        console.log("User is not logged in")
        setAddress(null)
        return
      }
  
      const metadata = await magic.user.getInfo()
      console.log("Fetched metadata:", metadata)
  
      const userAddress = metadata.publicAddress
      if (!userAddress) {
        console.log("No user address found")
        return
      }
  
      setAddress(userAddress)
      
    } catch (error) {
      console.error("Error in fetchUserAccount:", error)
      setAddress(null)
    }
  }, [magic])

  const logout = useCallback(async () => {
    try {
      if (!magic) {
        console.error("Magic SDK is not initialized")
        return
      }

      await magic.user.logout()
      setAddress(null)
      localStorage.clear()
      
      console.log("User logged out successfully.")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }, [magic])

  useEffect(() => {
    const initializeUser = async () => {
      if (magic) {
        try {
          const isLoggedIn = await magic.user.isLoggedIn()
          if (isLoggedIn) {
            await fetchUserAccount()
          }
        } catch (error) {
          console.error("Error checking login status:", error)
        }
      }
    }

    initializeUser()
  }, [magic, fetchUserAccount])

  return (
    <UserContext.Provider
      value={{
        user: address ? { address } : null,
        fetchUser: fetchUserAccount,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
