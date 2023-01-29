import { Stage, on, keyDown, Habitat } from "../libraries/habitat-import.js"
import { Fish } from "./fish/fish.js"
import { shared } from "./shared.js"
import { Thing } from "./things/thing.js"
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

	const { school, things } = shared
	school.draw(context)
	things.draw(context)
}

stage.update = (context) => {
	const { school, keyboard, things } = shared
	school.update()
	things.update()

	const fish = [...school].at(-1)
	if (fish === undefined) {
		return
	}

	/*
	for (const key in keyboardControls) {
		const control = keyboardControls[key]
		fish.controls[control] = keyboard[key] === true ? 1 : 0
	}
	*/
}

const keyboardControls = {
	w: "swim",
	d: "turnUp",
	a: "turnDown",
}

on(
	"pointerdown",
	(event) => {
		const { things } = shared
		const { colour } = things
		const position = [event.clientX, event.clientY]
		const type = event.button === 0 ? "circle" : "square"
		const thing = new Thing({ colour, position, type })
		things.add(thing)
		event.preventDefault()
	},
	{ passive: false },
)

on("contextmenu", (event) => event.preventDefault(), { passive: false })

Object.assign(window, shared)
Object.assign(window, Habitat)
