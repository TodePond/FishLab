import { HUES, randomFrom, RED } from "../../libraries/habitat-import.js"

export const Things = class extends Set {
	constructor() {
		super()
		this.colour = randomFrom(HUES)
		this.secondaryColour = randomFrom(HUES)
		this.shape = "circle"
	}

	draw(context) {
		for (const thing of this) {
			thing.draw(context)
		}
	}

	update() {
		for (const thing of this) {
			thing.update()
		}
	}
}
