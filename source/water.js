import { BLACK, VOID } from "../libraries/habitat-import.js"

export const drawWater = (context) => {
	return
	const { canvas } = context
	const { width, height } = canvas
	const gradient = context.createLinearGradient(0, 0, 0, height)
	gradient.addColorStop(0, BLACK)
	gradient.addColorStop(1, VOID)
	context.fillStyle = gradient
	context.fillRect(0, 0, width, height)
}
