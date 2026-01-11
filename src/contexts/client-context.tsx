'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Client {
  id: string
  name: string
  email: string
  company_name: string | null
  logo_url: string | null
  status: string
}

interface ClientContextType {
  selectedClient: Client | null
  setSelectedClient: (client: Client | null) => void
  isViewingAsClient: boolean
  clients: Client[]
  loading: boolean
  refreshClients: () => Promise<void>
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [selectedClient, setSelectedClientState] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch clients on mount
  useEffect(() => {
    fetchClients()
  }, [])

  // Check URL for client_id param on mount
  useEffect(() => {
    const clientId = searchParams.get('client_id')
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId)
      if (client) {
        setSelectedClientState(client)
      }
    }
  }, [searchParams, clients])

  async function fetchClients() {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  function setSelectedClient(client: Client | null) {
    setSelectedClientState(client)

    if (client) {
      // Navigate to client dashboard with client_id param
      router.push(`/dashboard?client_id=${client.id}`)
    } else {
      // Navigate back to admin overview
      router.push('/overview')
    }
  }

  const value: ClientContextType = {
    selectedClient,
    setSelectedClient,
    isViewingAsClient: selectedClient !== null,
    clients,
    loading,
    refreshClients: fetchClients,
  }

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider')
  }
  return context
}
