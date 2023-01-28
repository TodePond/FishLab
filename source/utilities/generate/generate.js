import { _, Stage, HTML, VOID, WHITE, Splash } from "../../../libraries/habitat-import.js"

export const generateFishImages = () => {
	const MAX_SPLASH = 999
	const STATE = {}

	print("Loading...")
	STATE.loading = {
		enter() {
			print("Loading...")
		},
	}

	STATE.initialising = {
		enter() {
			print("Initialising...")
		},
		update(context) {
			const { canvas } = context
			context.clearRect(0, 0, canvas.width, canvas.height)
			context.drawImage(template, 0, 0)
			const imageData = context.getImageData(0, 0, template.width, template.height)
			state.set(STATE.generating, imageData)
		},
	}

	STATE.generating = {
		enter(imageData) {
			this.splash = 0
			this.template = imageData
			this.fishes = {}
		},

		update(context) {
			if (performance.now() - this.timeStamp < 1000) {
				return
			}

			const { canvas } = context
			context.clearRect(0, 0, canvas.width, canvas.height)
			context.putImageData(this.template, 0, 0)

			const colour = new Splash(this.splash)
			const { data, width, height } = this.template

			for (let i = 0; i < data.length; i += 4) {
				data[i] = colour.red
				data[i + 1] = colour.green
				data[i + 2] = colour.blue
			}

			context.putImageData(this.template, 0, 0)
			const imageData = context.getImageData(0, 0, width, height)
			this.fishes[this.splash] = {
				splash: this.splash,
				imageData: imageData,
			}

			context.fillStyle = WHITE
			context.font = "24px sans-serif"
			context.textAlign = "center"
			context.textBaseline = "middle"
			context.fillText("GENERATING FISH...", canvas.width / 2, canvas.height / 2)
			context.fillText(`SPLASH ${this.splash}`, canvas.width / 2, canvas.height / 2 + 30)

			this.splash++
			if (this.splash > MAX_SPLASH) {
				state.set(STATE.downloading, this.fishes)
				return
			}
		},
	}

	STATE.downloading = {
		enter(fishes) {
			print("Fish", fishes)
			this.fishes = fishes
			this.splash = 0

			this.queue = 0
			this.timeStamp = performance.now()

			this.link = document.createElement("a")
		},
		update(context) {
			if (this.queue > 0) {
				this.queue--
			} else if (performance.now() - this.timeStamp < 1500) {
				return
			} else {
				this.timeStamp = performance.now()
				this.queue = 5
			}

			const { canvas } = context
			const fish = this.fishes[this.splash]
			canvas.width = fish.imageData.width
			canvas.height = fish.imageData.height

			context.putImageData(fish.imageData, 0, 0)
			this.link.href = canvas.toDataURL()
			this.link.download = `fish-${fish.splash}.png`
			this.link.click()

			context.fillStyle = WHITE
			context.strokeStyle = VOID
			context.font = "24px sans-serif"
			context.textAlign = "center"
			context.textBaseline = "middle"
			context.strokeText("DOWNLOADING FISH...", canvas.width / 2, canvas.height / 2)
			context.fillText("DOWNLOADING FISH...", canvas.width / 2, canvas.height / 2)
			context.strokeText(`SPLASH ${this.splash}`, canvas.width / 2, canvas.height / 2 + 30)
			context.fillText(`SPLASH ${this.splash}`, canvas.width / 2, canvas.height / 2 + 30)

			this.splash++
			if (this.splash > MAX_SPLASH) {
				state.set(STATE.complete)
				return
			}
		},
	}

	STATE.complete = {
		update(context) {
			const { canvas } = context
			canvas.width = innerWidth
			canvas.height = innerHeight
			context.clearRect(0, 0, canvas.width, canvas.height)
			context.fillStyle = WHITE
			context.font = "24px sans-serif"
			context.textAlign = "center"
			context.textBaseline = "middle"
			context.fillText("FISH DOWNLOADED", canvas.width / 2, canvas.height / 2)
		},
	}

	const state = {
		_value: STATE.loading,
		get value() {
			return this._value
		},
		set value(v) {
			this.set(v)
		},
		set(state, event) {
			this.fire("exit", event)
			this._value = state
			this.fire("enter", event)
		},
		get() {
			return this._value
		},
		fire(eventName, event) {
			const callback = this.value[eventName]
			if (callback === undefined) return
			callback.apply(this.value, [event])
		},
	}

	const stage = new Stage({ paused: false, speed: 3.0 })
	stage.start = (context) => {
		const { canvas } = context
		canvas.style["background-color"] = VOID
	}

	const template = new Image()
	template.src = "images/template.png"
	template.onload = () => {
		state.set(STATE.initialising)
	}

	stage.tick = (context) => {
		state.fire("tick", context)
	}

	stage.update = (context) => {
		state.fire("update", context)
	}
}
