import React, { useCallback } from 'react'
import CabinetContext from './cabinet-context'
import space from './space-singleton'

// accessToken
const CabinetProvider = ({ client, children }) => {
  const addSubscription = useCallback((cabinet, key, callback) => {
    // Update this to include the "cabinet"
    const currentCabinet = space.getCabinet(cabinet)
    currentCabinet.getShelf(key).then(shelf => {
      // if (client.cabinet.getSubscriptionCount(key) === 0) {
      client.subscribe(cabinet, key, shelf.history)
      // }
      currentCabinet.addSubscription(key, callback)
    })
  }, [client])

  const removeSubscription = useCallback((cabinet, key, callback) => {
    const currentCabinet = space.getCabinet(cabinet)
    currentCabinet.removeSubscription(key, callback)
    // if (client?.cabinet.getSubscriptionCount(key) > 0) {
    client?.unsubscribe(cabinet, key)
    // }
  }, [client])

  const value = {
    client,
    // cabinet: client?.cabinet,
    addSubscription,
    removeSubscription,
  }

  return (
    <CabinetContext.Provider value={value}>
      {children}
    </CabinetContext.Provider>
  )
}

export default CabinetProvider
