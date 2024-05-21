export function randomFileName(symbolsCurrent?: number) {
	const abc = 'abcdefghijklmnopqrstuvwxyz'
	let randomName = ''
	while (randomName.length < symbolsCurrent ? symbolsCurrent : 20) {
		randomName += abc[Math.floor(Math.random() * abc.length)]
	}
	return randomName
}
