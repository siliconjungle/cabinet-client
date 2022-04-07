import { setUsersByKey, clearStore } from './users-store'
import space from './space-singleton'

const isBrowser = typeof window !== 'undefined'

// Stop injecting the cabinet in as an option, instead for every call also hand in a cabinet.
function CabinetClient (options) {
  this.messages = []
  this.connection = null
  // this.cabinet = options.cabinet
  this.accessToken = options.accessToken

  this.onmessage = event => {
    const message = JSON.parse(event.data)

    const { type, data } = message
    if (type === 'get') {
      const { cabinet, key, patches, users } = data
      setUsersByKey(cabinet, key, users)
      const currentCabinet = space.getCabinet(cabinet)
      currentCabinet.applyOps(key, patches)
    }
  }

  this.onopen = event => {
    this.messages.forEach(message => {
      this.sendMessage(message)
    })
  }

  this.onclose = event => {
    clearStore()
    this.createConnection()
  }

  // This is going to cause issues if you're offline on a train or something without internet.
  // Instead, notify the user when you've disconnected OR have a timer based approach that increases
  // If the user hasn't disconnected in a while.
  this.createConnection = () => {
    this.connection = new WebSocket(options.uri)
    this.connection.onmessage = this.onmessage
    this.connection.onopen = this.onopen
    this.connection.onclose = this.onclose
  }

  if (isBrowser) {
    this.createConnection()
  }

  this.sendMessage = message => {
    if (this.connection?.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message))
    } else {
      // If a lot of changes happen all offline, this will cause an explosion of updates to all be sent.
      // Merge messages together
      if (message.type === 'set') {
        const existingMessage = this.messages.find(message2 => message.data.cabinet === message2.data.cabinet && message.data.key === message2.data.key)
        if (existingMessage) {
          existingMessage.data.patches.push(message.data.patches)
          return
        }
      }
      this.messages.push(message)
    }
  }

  this.subscribe = (cabinet, key, patches) => {
    this.sendMessage({
      type: 'subscribe',
      accessToken: this.accessToken,
      data: { cabinet, key, patches },
    })
  }

  this.unsubscribe = (cabinet, key) => {
    this.sendMessage({
      type: 'unsubscribe',
      accessToken: this.accessToken,
      data: { cabinet, key },
    })
  }

  this.uri = options.uri
}

export default CabinetClient
