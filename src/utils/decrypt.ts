import * as crypto from 'crypto'

export async function decrypt(data: string, secret_key: string) {
	const [encryptedString, iv] = data.split(':')
	const decipher = crypto.createDecipheriv('aes-256-cbc', secret_key, iv)

	let decrypted = decipher.update(encryptedString, 'hex', 'utf8')
	decrypted += decipher.final('utf8')

	return JSON.parse(decrypted)
}
