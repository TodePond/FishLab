export const School = class extends Set {
	draw(context) {
		for (const fish of this) {
			fish.draw(context)
		}
	}

	update() {
		for (const fish of this) {
			fish.update()
			if (fish.scale >= 0.9) {
				this.delete(fish)
			}
		}
	}
}
