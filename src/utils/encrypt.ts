import * as crypto from 'crypto'

export async function encrypt(data: string, secret_key: string) {
	const iv = crypto.randomBytes(8).toString('hex')
	const cipher = crypto.createCipheriv('aes-256-cbc', secret_key, iv)

	let encrypted = cipher.update(data, 'utf8', 'hex')
	encrypted += cipher.final('hex')

	return `${encrypted}:${iv}`
}
