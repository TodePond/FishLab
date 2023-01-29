import { add, clamp, HUES, randomFrom, wrap } from "../../libraries/habitat-import.js"
import { shared } from "../shared.js"
import { iterate, pointInTriangle, rotate } from "../utilities/utilities.js"
import { Brain } from "./brain.js"
import { getSplashDigits, mutateSplash } from "./colour.js"
import { images } from "./image.js"

const INPUT_NAMES = [
	"speed",
	"pointerUp",
	"pointerDown",
	"sin",
	"cos",
	"redUp",
	"redDown",
	"greenUp",
	"greenDown",
	"blueUp",
	"blueDown",
]
const OUTPUT_NAMES = ["swim", "turnUp", "turnDown"]

const SHRINK_RATE = 0.9995
const OUT_BOUNDS_SHRINK_RATE = 0.98
export const OUT_BOUNDS_PITY = 100

const MAX_SPEED = 300
const MAX_TURN = 0.003
const MIN_SPEED = 0.1

const ACCELERATION = 0.3 //0.3
const FRICTION = 0.97
const TURN_FRICTION = 0.95
const TURN = 0.002

const VISION_DISTANCE = 300
const EATING_DISTANCE = 50

const FOOD_GROWTH = 0.08

export const Fish = class {
	constructor(properties = {}) {
		Object.assign(this, {
			colour: randomFrom(HUES),
			scale: 0.1,
			position: [500, 500],
			rotation: 0,

			...properties,
		})

		this.type = "fish"
		this.age = 0
		const splashDigits = getSplashDigits(this.colour.splash)
		const [red, green, blue] = splashDigits
		this.red = red
		this.green = green
		this.blue = blue

		this.brain = new Brain(INPUT_NAMES, OUTPUT_NAMES, {
			swim: {
				pointerUp: 5,
				pointerDown: 5,
				redUp: 5,
				redDown: 5,
			},
			turnUp: {
				pointerDown: 5,
				//speed: -0.01,
				sin: 1.0,
				redDown: 10,
			},
			turnDown: {
				pointerUp: 5,
				cos: 0.5,
				redUp: 10,
			},
		})

		this.controls = {}
		for (const outputName of OUTPUT_NAMES) {
			this.controls[outputName] = 0
		}

		this.velocity = [0, 0]
		this.acceleration = [0, 0]

		this.rotationalVelocity = 0
		this.turn = 0

		this.friction = 1.0
		this.speed = Math.hypot(...this.velocity)
		this.image = images.get(this.colour.splash)
	}

	draw(context) {
		const { image, position, rotation, scale } = this
		const { width, height } = image
		if (!image.loaded) {
			context.fillStyle = this.colour
			context.fillRect(...position, 10, 10)
			return
		}
		context.save()

		// Render the fish's vision
		if (this.controls.swim >= 1.0) {
			context.globalAlpha = 0.5
		} else {
			context.globalAlpha = 0.2
		}
		context.fillStyle = this.colour
		context.beginPath()
		const vision1 = this.getVision()
		context.moveTo(...vision1[0])
		context.lineTo(...vision1[1])
		context.lineTo(...vision1[2])
		context.closePath()
		context.fill()

		if (this.controls.swim >= 1.0) {
			context.globalAlpha = 0.5
		} else {
			context.globalAlpha = 0.2
		}
		context.beginPath()
		const vision2 = this.getVision()
		context.moveTo(...vision2[0])
		context.lineTo(...vision2[2])
		context.lineTo(...vision2[3])
		context.closePath()
		context.fill()

		context.globalAlpha = 1.0

		const flipped = rotation > Math.PI / 2 && rotation < (3 * Math.PI) / 2
		context.translate(...position)
		context.rotate(rotation)
		context.scale(scale, scale)
		if (flipped) {
			context.scale(1, -1)
		}
		context.drawImage(images.get("eye"), -width / 2, -height / 2)
		context.drawImage(image, -width / 2, -height / 2)

		//context.fillStyle = WHITE
		//context.fillRect(0, 0, 10, 10)

		context.restore()
	}

	// Return a triangle that represents the fish's vision
	getVision() {
		const { position, rotation } = this
		const vision = [
			[0, 0],
			rotate([-VISION_DISTANCE * 1.5, VISION_DISTANCE / 1], rotation),
			rotate([-VISION_DISTANCE * 1.5, 0], rotation),
			rotate([-VISION_DISTANCE * 1.5, -VISION_DISTANCE / 1], rotation),
		]
		return vision.map((point) => point.map((coordinate, index) => coordinate + position[index]))
	}

	// Return an array of two boolean values that represent whether the fish is
	// looking at the pointer
	// The array represents the top and bottom halves of the fish's vision
	// [top, bottom]
	seePointer() {
		const vision = this.getVision()
		const pointer = shared.pointer.position
		const top = pointInTriangle(pointer, [vision[0], vision[1], vision[2]])
		if (top) {
			return [true, false]
		}
		const bottom = pointInTriangle(pointer, [vision[0], vision[2], vision[3]])
		return [false, bottom]
	}

	seeColour() {
		const vision = this.getVision()

		let redUp = 0
		let redDown = 0
		let greenUp = 0
		let greenDown = 0
		let blueUp = 0
		let blueDown = 0

		const eat = new Set()

		const everything = iterate(shared.school, shared.things)

		const mouthPosition = rotate([10, 0], this.rotation)
		const mouth = add(this.position, mouthPosition)

		for (const thing of everything) {
			if (thing === this) {
				continue
			}

			// Is the thing within eating distance?
			const distance = Math.hypot(...subtract(thing.position, mouth))
			if (distance <= EATING_DISTANCE) {
				if (thing.type !== "fish" || thing.scale < this.scale / 2) {
					eat.add(thing)
					continue
				}
			}

			const top = pointInTriangle(thing.position, [vision[0], vision[1], vision[2]])

			if (top) {
				redUp += thing.red
				greenUp += thing.green
				blueUp += thing.blue
				continue
			}

			const bottom = pointInTriangle(thing.position, [vision[0], vision[2], vision[3]])
			if (bottom) {
				redDown += thing.red
				greenDown += thing.green
				blueDown += thing.blue
			}
		}

		return {
			redUp,
			redDown,
			greenUp,
			greenDown,
			blueUp,
			blueDown,
			eat,
		}
	}

	getChildren() {
		const colour1 = new Splash(mutateSplash(this.red, this.green, this.blue))
		const colour2 = new Splash(mutateSplash(this.red, this.green, this.blue))
		const scale = this.scale * 0.5
		const rotation = this.rotation
		const position = this.position

		const child1 = new Fish({ colour: colour1, scale, rotation, position: [...position] })
		const child2 = new Fish({ colour: colour2, scale, rotation, position: [...position] })

		const velocity1 = rotate([0, 2], rotation)
		const velocity2 = rotate(velocity1, Math.PI)

		child1.velocity = velocity1
		child2.velocity = velocity2
		child1.rotationalVelocity = this.rotationalVelocity
		child2.rotationalVelocity = this.rotationalVelocity
		return [child1, child2]
	}

	think() {
		const { speed, rotation, velocity } = this
		const speedInDirection = Math.cos(rotation + Math.PI) * velocity.x + Math.sin(rotation + Math.PI) * velocity.y

		const [pointerUp, pointerDown] = this.seePointer()
		const colourSee = this.seeColour()

		for (const thing of colourSee.eat) {
			shared.school.delete(thing)
			shared.things.delete(thing)
			if (thing.type === "circle") {
				this.scale += FOOD_GROWTH
			} else if (thing.type === "square") {
				this.scale -= FOOD_GROWTH
				this.scale = clamp(this.scale, 0, Infinity)
			} else if (thing.type === "fish") {
				this.scale += FOOD_GROWTH
			}
		}

		const sin = Math.sin(this.age)
		const cos = Math.cos(this.age)

		const outputs = this.brain.getOutputs({
			speed,
			speedInDirection,
			pointerUp,
			pointerDown,
			sin,
			cos,
			...colourSee,
		})
		this.controls = outputs
	}

	update() {
		this.age = (this.age + Math.PI / 180) % (2 * Math.PI)
		this.speed = Math.hypot(...this.velocity)
		if (this.speed < MIN_SPEED) {
			this.speed = MIN_SPEED
		}
		this.think()
		this.applyControls()
		this.applyPhysics()
	}

	isOutOfBounds() {
		const { position } = this
		return (
			position.x < -OUT_BOUNDS_PITY ||
			position.x > innerWidth + OUT_BOUNDS_PITY ||
			position.y < -OUT_BOUNDS_PITY ||
			position.y > innerHeight + OUT_BOUNDS_PITY
		)
	}

	applyPhysics() {
		// If off the screen, decrease scale
		/*if (this.isOutOfBounds()) {
			this.scale *= OUT_BOUNDS_SHRINK_RATE
		}*/

		// Wrap around the world
		this.position.x = wrap(this.position.x, 0, innerWidth)
		this.position.y = wrap(this.position.y, 0, innerHeight)

		this.scale *= SHRINK_RATE

		if (this.turn > MAX_TURN) {
			this.turn = MAX_TURN
		}

		this.velocity.x += this.acceleration.x
		this.velocity.y += this.acceleration.y
		this.rotationalVelocity += this.turn

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.rotation += this.rotationalVelocity
		this.rotation = wrap(this.rotation, 0, 2 * Math.PI)

		this.velocity.x *= FRICTION
		this.velocity.y *= FRICTION
		this.rotationalVelocity *= TURN_FRICTION

		const speed = Math.hypot(...this.velocity)
		if (speed > MAX_SPEED) {
			this.velocity.x *= MAX_SPEED / speed
			this.velocity.y *= MAX_SPEED / speed
		}
		this.speed = Math.hypot(...this.velocity)
	}

	applyControls() {
		let { swim, turnUp, turnDown } = this.controls

		if (swim >= 1.0) {
			// Add accleration in the direction of the fish
			this.acceleration.x = Math.cos(this.rotation + Math.PI) * ACCELERATION
			this.acceleration.y = Math.sin(this.rotation + Math.PI) * ACCELERATION
			//this.scale *= SHRINK_RATE
			//this.scale *= 1.005
		} else {
			this.acceleration.x = 0
			this.acceleration.y = 0
		}

		if (turnUp > 0.0 && turnDown > 0.0) {
			this.turn = TURN * (turnUp - turnDown)
		} else if (turnUp > 0.0) {
			this.turn = TURN * turnUp
		} else if (turnDown > 0.0) {
			this.turn = -TURN * turnDown
		} else {
			this.turn = 0
		}

		if (this.turn > MAX_TURN) {
			this.turn = MAX_TURN
		} else if (this.turn < -MAX_TURN) {
			this.turn = -MAX_TURN
		}

		this.speed = Math.hypot(...this.velocity)
	}
}
