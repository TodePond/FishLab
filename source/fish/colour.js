export const mutateSplash = (red, green, blue) => {
	const redMod = maybe(0.25) ? randomFrom([-1, 1]) : 0
	const greenMod = maybe(0.25) ? randomFrom([-1, 1]) : 0
	const blueMod = maybe(0.25) ? randomFrom([-1, 1]) : 0

	const newRed = red + redMod
	const newGreen = green + greenMod
	const newBlue = blue + blueMod

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
