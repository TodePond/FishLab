export const School = class extends Set {
	draw(context) {
		for (const fish of this) {
			fish.draw(context)
		}
	}

	update() {
		for (const fish of this) {
			fish.update()

			if (fish.isOutOfBounds() && fish.scale < 0.05) {
				this.delete(fish)
			}

			if (fish.scale >= 0.4) {
				this.delete(fish)

				const children = fish.getChildren()
				for (const child of children) {
					this.add(child)
				}
			} else if (fish.scale <= 0.03) {
				if (this.size > 2) {
					this.delete(fish)
				} else {
					fish.scale = 0.03
				}
			}
		}
	}
}
