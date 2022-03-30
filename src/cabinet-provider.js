import React, { useCallback } from 'react'
import CabinetContext from './cabinet-context'

// accessToken
const CabinetProvider = ({ client, children }) => {
  const addSubscription = useCallback((key, callback) => {
    client?.cabinet.getShelf(key).then(shelf => {
      // if (client.cabinet.getSubscriptionCount(key) === 0) {
      client.subscribe(key, shelf.history)
      // }
      client.cabinet.addSubscription(key, callback)
    })
  }, [client])

  const removeSubscription = useCallback((key, callback) => {
    client?.cabinet.removeSubscription(key, callback)
    // if (client?.cabinet.getSubscriptionCount(key) > 0) {
    client?.unsubscribe(key)
    // }
  }, [client])

  const value = {
    client,
    cabinet: client?.cabinet,
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
