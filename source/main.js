import { Stage, on } from "../libraries/habitat-import.js"
import { Fish } from "./fish/fish.js"
import { shared } from "./shared.js"
import { drawWater } from "./water.js"

const stage = new Stage({})
stage.start = (context) => {
	const { school } = shared
	school.add(new Fish())
}

stage.tick = (context) => {
	const { canvas } = context
	context.clearRect(0, 0, canvas.width, canvas.height)

	drawWater(context)

	const { school } = shared
	school.draw(context)
}

stage.update = (context) => {
	const { school } = shared
	school.update()
}

on("keydown", (event) => {
	const { school } = shared
	for (const fish of school) {
		if (event.key === "d") {
			fish.controls.turnUp = 1.0
		} else if (event.key === "a") {
			fish.controls.turnDown = 1.0
		} else if (event.key === "w") {
			fish.controls.swim = 1.0
		} else if (event.key === "s") {
			fish.controls.slow = 1.0
		}
	}
})

on("keyup", (event) => {
	const { school } = shared
	for (const fish of school) {
		if (event.key === "d") {
			fish.controls.turnUp = 0.0
		} else if (event.key === "a") {
			fish.controls.turnDown = 0.0
		} else if (event.key === "w") {
			fish.controls.swim = 0.0
		} else if (event.key === "s") {
			fish.controls.slow = 0.0
		}
	}
})
