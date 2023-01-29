export const mutateSplash = (red, green, blue) => {
	const newRed = red + Math.floor(Math.random() * 3) - 1
	const newGreen = green + Math.floor(Math.random() * 3) - 1
	const newBlue = blue + Math.floor(Math.random() * 3) - 1

	const newDigits = [newRed, newGreen, newBlue].map((v) => Math.max(0, Math.min(9, v)))

	return parseInt(newDigits.join(""))
}

export const getSplashDigits = (splash) => {
	const digits = splash
		.toString()
		.padStart(3, "0")
		.split("")
		.map((v) => parseInt(v))

	return digits
}
