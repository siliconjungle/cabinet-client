import EventEmitter from 'events'

const usersEmitter = new EventEmitter()
usersEmitter.setMaxListeners(0)

let usersStore = {}

export const getUsersByKey = (cabinet, key) => {
  return usersStore[cabinet]?.[key]
}

export const setUsersByKey = (cabinet, key, users) => {
  usersStore[cabinet] = usersStore[cabinet] || {}
  usersStore[cabinet][key] = users
  usersEmitter.emit(`${cabinet}${key}`, users)
}

export const clearStore = () => {
  const cabinetKeys = Object.keys(usersStore)
  cabinetKeys.forEach(cabinetKey => {
    const shelfKeys = Object.keys(usersStore[cabinetKey])
    shelfKeys.forEach(shelfKey => {
      usersEmitter.emit(`${cabinetKey}${shelfKey}`, [])
    })
  })

  usersStore = {}
}

export const subscribeToUsersByKey = (cabinet, key, callback) => {
  usersEmitter.addListener(`${cabinet}${key}`, callback)
}

export const unsubscribeFromUsersByKey = (cabinet, key, callback) => {
  usersEmitter.removeListener(`${cabinet}${key}`, callback)
}
