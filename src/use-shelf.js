import { useContext, useState, useCallback, useEffect } from 'react'
import CabinetContext from './cabinet-context'
import space from './space-singleton'

const useShelf = (cabinet, key) => {
  const [value, setInnerValue] = useState(null)

  const {
    client,
    // cabinet,
    addSubscription,
    removeSubscription,
  } = useContext(CabinetContext)

  const callback = useCallback((cabinet, key, shelf) => {
    if (JSON.stringify(shelf.value) !== JSON.stringify(value)) {
      setInnerValue(shelf.value)
    }
  }, [cabinet, key])

  const setValue = useCallback(value => {
    const currentCabinet = space.getCabinet(cabinet)
    currentCabinet.setState(key, value).then((patches) => {
      client.sendMessage({
        accessToken: client.accessToken,
        type: 'set',
        data: {
          cabinet,
          key,
          patches,
        },
      })
    })
  }, [cabinet, key, client])

  useEffect(() => {
    addSubscription(cabinet, key, callback)

    return () => {
      removeSubscription(cabinet, key, callback)
    }
  }, [cabinet, key, callback])

  return [
    value,
    setValue,
  ]
}

export default useShelf
