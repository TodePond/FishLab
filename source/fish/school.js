import { Fish } from "./fish.js"
import { add } from "../../libraries/habitat-import.js"
import { rotate } from "../utilities/utilities.js"

export const School = class extends Set {
	draw(context) {
		for (const fish of this) {
			fish.draw(context)
		}
	}

	update() {
		for (const fish of this) {
			fish.update()
			if (fish.scale >= 0.4) {
				this.delete(fish)

				const children = fish.getChildren()
				for (const child of children) {
					this.add(child)
				}
			}
		}
	}
}
