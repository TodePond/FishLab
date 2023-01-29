import { HUES, randomFrom, scale, wrap } from "../../libraries/habitat-import.js"
import { getSplashDigits } from "../fish/colour.js"
import { OUT_BOUNDS_PITY } from "../fish/fish.js"

const THING_SIZE = 20

export const Thing = class {
	constructor(properties) {
		Object.assign(this, {
			colour: randomFrom(HUES),
			scale: 1.0,
			position: [500, 500],
			rotation: 0,
			type: "circle",

			...properties,
		})

		const [red, green, blue] = getSplashDigits(this.colour.splash)
		this.red = red
		this.green = green
		this.blue = blue

		this.velocity = [0, 0]
	}

	draw(context) {
		if (this.type === "circle") {
			const [x, y] = this.position
			context.fillStyle = this.colour
			context.beginPath()
			context.arc(x, y, Math.sqrt((THING_SIZE * THING_SIZE) / Math.PI), 0, 2 * Math.PI)
			context.fill()
		} else if (this.type === "square") {
			const [x, y] = this.position
			context.fillStyle = this.colour
			context.fillRect(x - THING_SIZE / 2, y - THING_SIZE / 2, THING_SIZE, THING_SIZE)
		}
	}

	update() {
		this.position = add(this.position, this.velocity)

		this.velocity = scale(this.velocity, 0.95)
		this.velocity = add(this.velocity, [0, 0.05])

		//this.position.x = wrap(this.position.x, 0, innerWidth)
		//this.position.y = wrap(this.position.y, 0, innerHeight)
	}

	isOutOfBounds() {
		const { position } = this
		return (
			position.x < -OUT_BOUNDS_PITY ||
			position.x > innerWidth + OUT_BOUNDS_PITY ||
			position.y < -OUT_BOUNDS_PITY ||
			position.y > innerHeight + OUT_BOUNDS_PITY
		)
	}
}
