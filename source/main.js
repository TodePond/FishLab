import { Stage, on, keyDown, Habitat } from "../libraries/habitat-import.js"
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
	const { school, keyboard } = shared
	school.update()

	const fish = [...school].at(-1)
	for (const key in keyboardControls) {
		const control = keyboardControls[key]
		fish.controls[control] = keyboard[key] === true ? 1 : 0
	}
}

const keyboardControls = {
	w: "swim",
	d: "turnUp",
	a: "turnDown",
}

Object.assign(window, shared)
Object.assign(window, Habitat)
