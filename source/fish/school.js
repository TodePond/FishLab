export const School = class extends Set {
	draw(context) {
		for (const fish of this) {
			fish.draw(context)
		}
	}

	update() {
		for (const fish of this) {
			fish.update()
		}
	}
}
