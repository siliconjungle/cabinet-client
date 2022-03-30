import { setUsersByKey, clearStore } from './users-store'

const isBrowser = typeof window !== 'undefined'

function CabinetClient (options) {
  this.messages = []
  this.connection = null
  this.cabinet = options.cabinet
  this.accessToken = options.accessToken

  this.onmessage = event => {
    const message = JSON.parse(event.data)

    const { type, data } = message
    if (type === 'get') {
      const { key, patches, users } = data
      setUsersByKey(key, users)
      this.cabinet.applyOps(key, patches)
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
        const existingMessage = this.messages.find(message2 => message.data.key === message2.data.key)
        if (existingMessage) {
          existingMessage.data.patches.push(message.data.patches)
          return
        }
      }
      this.messages.push(message)
    }
  }

  this.subscribe = (key, patches) => {
    this.sendMessage({
      type: 'subscribe',
      accessToken: this.accessToken,
      data: { cabinet: this.cabinet.name, key, patches },
    })
  }

  this.unsubscribe = key => {
    this.sendMessage({
      type: 'unsubscribe',
      accessToken: this.accessToken,
      data: { cabinet: this.cabinet.name, key },
    })
  }

  this.uri = options.uri
}

export default CabinetClient
