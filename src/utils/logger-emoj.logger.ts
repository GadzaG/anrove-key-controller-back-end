import { LoggerService } from '@nestjs/common'
import { bgBlue, bgYellow, black, blue, bold, gray, red, white } from 'chalk'

export class EmojiLogger implements LoggerService {
	public log(message: string) {
		this.writeToFile(gray('📢 ' + message))
	}

	public error(message: string, trace: string) {
		this.writeToFile(red('❌ ' + message))
		this.writeToFile('🔍 Stack Trace: ' + trace)
	}

	public warn(message: string) {
		this.writeToFile(bgYellow(black('⚠️ ' + message)))
	}

	public debug(message: string) {
		this.writeToFile(blue('🐞 ' + message))
	}

	private writeToFile(message: string) {
		console.log(message)
	}
}
export function listenerColorize(text: string): string {
	return bgBlue(black(bold(white(text))))
}
