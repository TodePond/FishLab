import { Habitat, HUES, on, random, Stage, WHITE } from "../libraries/habitat-import.js"
import { Fish } from "./fish/fish.js"
import { shared } from "./shared.js"
import { Thing } from "./things/thing.js"
import { drawWater } from "./water.js"

const stage = new Stage({})
stage.start = (context) => {
	const { school } = shared
	school.add(new Fish())
}

let speeed = 1

on("keydown", (event) => {
	if (event.key === "d") {
		speeed *= 2
	} else if (event.key === "a") {
		speeed /= 2
	} else if (event.key === "w") {
		speeed = 100
	} else if (event.key === "s") {
		speeed = 1
	} else if (event.key === "e") {
		spawnRate *= 2
	} else if (event.key === "q") {
		spawnRate /= 2
	}
})

stage.tick = (context) => {
	const { canvas } = context
	context.clearRect(0, 0, canvas.width, canvas.height)

	drawWater(context)

	const { school, things } = shared
	school.draw(context)
	things.draw(context)
}

let spawnRate = 0.01
stage.update = (context) => {
	for (let i = 0; i < speeed; i++) {
		const { school, keyboard, things } = shared
		school.update()
		things.update()

		if (maybe(spawnRate)) {
			const x = random() % (innerWidth + 300)
			const y = 0
			const position = [x, y]
			const type = "circle"
			const colour = things.colour
			const thing = new Thing({ colour, position, type })
			things.add(thing)
		}

		if (maybe(spawnRate * 0.33)) {
			const x = random() % (innerWidth + 300)
			const y = 0
			const position = [x, y]
			const type = "square"
			const colour = things.secondaryColour
			const thing = new Thing({ colour, position, type })
			things.add(thing)
		}
	}

	/*
	const fish = [...school].at(-1)
	if (fish === undefined) {
		return
	}*/

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

let pointerTimer = performance.now()

let lastClick = "left"
on("pointerdown", (event) => {
	pointerTimer = performance.now()
	const { things } = shared
	let { colour } = things
	const position = [event.clientX, event.clientY]
	const type = event.button === 0 ? "circle" : "square"
	lastClick = type === "circle" ? "left" : "right"
	if (type === "square") {
		colour = things.secondaryColour
	}
	const thing = new Thing({ colour, position, type })
	things.add(thing)
})

on("pointermove", (event) => {
	if (!shared.pointer.down) return
	if (performance.now() - pointerTimer < 100) return
	pointerTimer = performance.now()
	const { things } = shared
	let { colour } = things
	const position = [event.clientX, event.clientY]
	const type = shared.mouse.Left ? "circle" : "square"
	if (type === "square") {
		colour = things.secondaryColour
	}
	const thing = new Thing({ colour, position, type })
	things.add(thing)
})

on("contextmenu", (event) => event.preventDefault(), { passive: false })

on("keydown", (event) => {
	const number = parseInt(event.key)
	if (isNaN(number)) return
	const { things } = shared

	if (lastClick === "right") {
		things.secondaryColour = HUES[number - 1]
		if (number === 0) {
			things.secondaryColour = WHITE
		}
		return
	}

	things.colour = HUES[number - 1]
	if (number === 0) {
		things.colour = WHITE
	}
})

window.stage = stage
Object.assign(window, shared)
Object.assign(window, Habitat)
