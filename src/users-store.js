import EventEmitter from 'events'

const usersEmitter = new EventEmitter()
usersEmitter.setMaxListeners(0)

let usersStore = {}

export const getUsersByKey = (key) => {
  return usersStore[key]
}

export const setUsersByKey = (key, users) => {
  usersStore[key] = users
  usersEmitter.emit(key, users)
}

export const clearStore = () => {
  const keys = Object.keys(usersStore)
  keys.forEach(key => {
    usersEmitter.emit(key, [])
  })
  usersStore = {}
}

export const subscribeToUsersByKey = (key, callback) => {
  usersEmitter.addListener(key, callback)
}

export const unsubscribeFromUsersByKey = (key, callback) => {
  usersEmitter.removeListener(key, callback)
}
