import { RED, WHITE, wrap } from "../../libraries/habitat-import.js"
import { rotate } from "../utilities/utilities.js"
import { Brain } from "./brain.js"
import { mutateSplash } from "./colour.js"
import { images } from "./image.js"

const INPUT_NAMES = ["speed"]
const OUTPUT_NAMES = ["swim", "turnUp", "turnDown"]

const SHRINK_RATE = 0.999

const MAX_SPEED = 300
const MAX_TURN = 0.1

const ACCELERATION = 0.1 //0.3
const FRICTION = 0.99
const TURN_FRICTION = 0.95
const TURN = 0.003

export const Fish = class {
	constructor(properties = {}) {
		Object.assign(this, {
			colour: RED,
			scale: 0.1,
			position: [500, 500],
			rotation: 0,

			...properties,
		})

		this.brain = new Brain(INPUT_NAMES, OUTPUT_NAMES, {
			swim: {
				speed: 0,
			},
			turnUp: {},
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

	getChildren() {
		const colour1 = new Splash(mutateSplash(this.colour.splash))
		const colour2 = new Splash(mutateSplash(this.colour.splash))
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

		const outputs = this.brain.getOutputs({ speed, speedInDirection })
		this.controls = outputs
	}

	update() {
		this.speed = Math.hypot(...this.velocity)
		//this.think()
		this.applyControls()
		this.applyPhysics()
	}

	applyPhysics() {
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
		let { swim, turnUp, turnDown, slow } = this.controls

		if (swim >= 1.0) {
			// Add accleration in the direction of the fish
			this.acceleration.x = Math.cos(this.rotation + Math.PI) * ACCELERATION
			this.acceleration.y = Math.sin(this.rotation + Math.PI) * ACCELERATION
			//this.scale *= SHRINK_RATE
			this.scale *= 1.01
		} else {
			this.acceleration.x = 0
			this.acceleration.y = 0
		}

		if (turnUp >= 1.0 && turnDown >= 1.0) {
			this.turn = 0
		} else if (turnUp >= 1.0) {
			this.turn = TURN
		} else if (turnDown >= 1.0) {
			this.turn = -TURN
		} else {
			this.turn = 0
		}

		this.speed = Math.hypot(...this.velocity)
	}
}
