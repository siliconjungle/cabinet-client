import { useContext, useState, useCallback, useEffect } from 'react'
import CabinetContext from './cabinet-context.js'

const useShelf = (key) => {
  const [value, setInnerValue] = useState(null)

  const {
    client,
    cabinet,
    addSubscription,
    removeSubscription,
  } = useContext(CabinetContext)

  const callback = useCallback((cabinet, key, shelf) => {
    if (JSON.stringify(shelf.value) !== JSON.stringify(value)) {
      setInnerValue(shelf.value)
    }
  }, [key])

  const setValue = useCallback(value => {
    cabinet.setState(key, value).then((patches) => {
      client.sendMessage({
        accessToken: client.accessToken,
        type: 'set',
        data: {
          cabinet: cabinet.name,
          key,
          patches,
        },
      })
    })
  }, [key, cabinet, client])

  useEffect(() => {
    addSubscription(key, callback)

    return () => {
      removeSubscription(key, callback)
    }
  }, [key, callback])

  return [
    value,
    setValue,
  ]
}

export default useShelf
