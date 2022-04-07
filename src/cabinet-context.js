import { createContext } from 'react'

const CabinetContext = createContext({
  client: null,
  // cabinet: null,
  addSubscription: null,
  removeSubscription: null,
})

export default CabinetContext
