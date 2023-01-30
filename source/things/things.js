import { GREEN, RED } from "../../libraries/habitat-import.js"

export const Things = class extends Set {
	constructor() {
		super()
		this.colour = GREEN
		this.secondaryColour = RED
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
