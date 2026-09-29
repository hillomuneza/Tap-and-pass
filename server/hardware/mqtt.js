import mqtt from 'mqtt'

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL
const MQTT_TOPIC_PREFIX = 'tap-and-pass'

let mqttClient = null
let connected = false

export function connectMQTT() {
  if (!MQTT_BROKER_URL) {
    console.log('MQTT disabled: set MQTT_BROKER_URL to enable hardware messaging')
    return Promise.resolve(null)
  }

  if (mqttClient) {
    return Promise.resolve(mqttClient)
  }

  return new Promise((resolve, reject) => {
    mqttClient = mqtt.connect(MQTT_BROKER_URL, {
      clientId: `tap-and-pass-backend-${Date.now()}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 5000
    })

    mqttClient.on('connect', () => {
      connected = true
      console.log('MQTT connected to', MQTT_BROKER_URL)

      mqttClient.subscribe(`${MQTT_TOPIC_PREFIX}/device/+/card-detected`, (err) => {
        if (err) console.error('MQTT subscription error:', err)
        else console.log('MQTT subscribed to card-detected events')
      })

      mqttClient.subscribe(`${MQTT_TOPIC_PREFIX}/device/+/status`, (err) => {
        if (err) console.error('MQTT subscription error:', err)
        else console.log('MQTT subscribed to device status events')
      })

      resolve(mqttClient)
    })

    mqttClient.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString())
        console.log(`MQTT message received on ${topic}:`, payload)
      } catch (err) {
        console.error('Failed to parse MQTT message:', err)
      }
    })

    mqttClient.on('error', (err) => {
      console.warn('MQTT unavailable:', err.message)
      connected = false
    })

    mqttClient.on('offline', () => {
      connected = false
      console.log('MQTT client offline')
    })

    mqttClient.on('reconnect', () => {
      console.log('MQTT client reconnecting...')
    })
  })
}

export function publishSignal(deviceId, command, data = {}) {
  if (!mqttClient || !connected) {
    console.warn('MQTT not connected, cannot publish signal')
    return false
  }

  const topic = `${MQTT_TOPIC_PREFIX}/device/${deviceId}/signal`
  const payload = JSON.stringify({
    command,
    device_id: deviceId,
    timestamp: new Date().toISOString(),
    ...data
  })

  mqttClient.publish(topic, payload, { qos: 1 }, (err) => {
    if (err) console.error('MQTT publish error:', err)
    else console.log(`MQTT signal sent: ${command} to ${deviceId}`)
  })

  return true
}

export function publishAllow(deviceId) {
  return publishSignal(deviceId, 'ALLOW')
}

export function publishDeny(deviceId, reason) {
  return publishSignal(deviceId, 'DENY', { reason })
}

export function publishReset(deviceId) {
  return publishSignal(deviceId, 'RESET')
}

export function isMQTTConnected() {
  return connected
}

export function getMQTTClient() {
  return mqttClient
}
