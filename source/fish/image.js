import { COLOURS } from "../../libraries/habitat-import.js"

const quickLoads = new Set(COLOURS.map((colour) => colour.splash))

const preloadImages = () => {
	const images = new Map()
	for (let splash = 0; splash <= 999; splash++) {
		const source = getSource(splash)
		const image = new Image()
		image.loaded = false
		images.set(splash, image)
		const timer = quickLoads.has(splash) ? 0 : splash * 5
		setTimeout(() => (image.src = source), timer)
		image.onload = () => (image.loaded = true)
	}

	const eyeImage = new Image()
	eyeImage.loaded = false
	images.set("eye", eyeImage)
	eyeImage.src = "./images/eyes.png"
	eyeImage.onload = () => (eyeImage.loaded = true)

	return images
}

const getSource = (splash) => `./images/fish/fish-${splash}.png`
export const images = preloadImages()
