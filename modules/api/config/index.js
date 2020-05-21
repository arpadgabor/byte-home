require('dotenv').config()
const convict = require('convict')

const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  host: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  dbUrl: {
    doc: 'PostgreSQL connection string',
    format: String,
    default: 'postgres://username:password@localhost:5432/database',
    env: 'CONNECTION_URL'
  },
  jwtSecret: {
    doc: 'Access Token Secret Key',
    format: String,
    default: '1234567890abcdefghijklmnopqrstuvwxyz',
    env: 'JWT_SECRET'
  },
  refreshSecret: {
    doc: 'Refresh Token Secret Key',
    format: String,
    default: '1234567890abcdefghijklmnopqrstuvwxyz1',
    env: 'REFRESH_SECRET'
  },
  smtpUsername: {
    doc: 'SMTP Username',
    format: String,
    default: '1234567890987654321',
    env: 'SMTP_USERNAME'
  },
  smtpPassword: {
    doc: 'SMTP Password (Secret Key)',
    format: String,
    default: '1234567890987654321',
    env: 'SMTP_PASSWORD'
  },
  smtpSender: {
    doc: 'SMTP Sender Email',
    format: 'email',
    default: 'no-reply@localhost.com',
    env: 'SMTP_SENDER'
  },
  smtpServer: {
    doc: 'SMTP Server',
    format: String,
    default: 'smtp.gmail.com',
    env: 'SMTP_SERVER'
  },
  smtpTLS: {
    doc: 'SMTP Server TLS Enable',
    format: Boolean,
    default: 'postgres://username:password@localhost:5432/database',
    env: 'SMTP_TLS'
  },
  smtpPort: {
    doc: 'SMTP Server Port',
    format: 'port',
    default: '587',
    env: 'SMTP_PORT'
  },
  mqttUrl: {
    doc: 'MQTT Connection URL',
    format: 'url',
    default: 'mqtt://localhost:1883',
    env: 'MQTT_URL'
  },
})

module.exports = conf
