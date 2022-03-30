// This is going to be annoying to implement? but then again do I really need it?
// I think I'd need to store all the indices in local storage somewhere.
const getKeys = async (cabinet) => []

const getShelfByKey = async (cabinet, key) => {
  if (typeof window === 'undefined') {
    return null
  }
  const storedValue = window.localStorage.getItem(`${cabinet}${key}`)
  return storedValue && JSON.parse(storedValue) || null
}

const setShelfByKey = async (cabinet, key, shelf) => {
  if (typeof window === 'undefined') {
    return null
  }
  localStorage.setItem(`${cabinet}${key}`, JSON.stringify(shelf))
}

export default {
  getKeys,
  getShelfByKey,
  setShelfByKey,
}
