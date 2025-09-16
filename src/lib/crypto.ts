import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32)
const iv = crypto.randomBytes(16)

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(text: string): string {
  const parts = text.split(':')
  const iv = Buffer.from(parts.shift()!, 'hex')
  const encryptedText = Buffer.from(parts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedText, undefined, 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
