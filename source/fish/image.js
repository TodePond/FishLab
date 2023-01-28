import { RED } from "../../libraries/habitat-import.js"

const preloadImages = () => {
	const images = new Map()
	for (let splash = 0; splash <= 999; splash++) {
		const source = getSource(splash)
		const image = new Image()
		image.loaded = false
		images.set(splash, image)
		const timer = splash === RED.splash ? 0 : splash * 5
		setTimeout(() => (image.src = source), timer)
		image.onload = () => (image.loaded = true)
	}
	return images
}

const getSource = (splash) => `./images/fish/fish-${splash}.png`
export const images = preloadImages()
