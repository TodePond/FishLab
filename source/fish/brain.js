export const Brain = class {
	constructor(inputNames, outputNames, neurons = {}) {
		this.inputNames = inputNames
		this.outputNames = outputNames

		this.neurons = {}

		for (const outputName of this.outputNames) {
			const neuron = {}
			for (const inputName of this.inputNames) {
				neuron[inputName] = 0
				if (neurons[outputName] && neurons[outputName][inputName]) {
					neuron[inputName] = neurons[outputName][inputName]
				}
			}
			this.neurons[outputName] = neuron
		}
	}

	getOutputs(inputs) {
		const outputs = {}
		for (const outputName of this.outputNames) {
			let output = 0.0
			const neuron = this.neurons[outputName]
			for (const inputName of this.inputNames) {
				if (neuron[inputName] >= 0) {
					output += neuron[inputName] * inputs[inputName]
				} else {
					output += Math.abs(neuron[inputName]) / inputs[inputName]
				}
			}
			outputs[outputName] = output
		}
		return outputs
	}

	clone() {
		const neurons = {}
		for (const outputName of this.outputNames) {
			const neuron = {}
			for (const inputName of this.inputNames) {
				neuron[inputName] = this.neurons[outputName][inputName]
			}
			neurons[outputName] = neuron
		}
		return new Brain(this.inputNames, this.outputNames, neurons)
	}

	mutate() {
		for (const neuronName in this.neurons) {
			const neuron = this.neurons[neuronName]
			for (const inputName of this.inputNames) {
				switch (neuronName) {
					case "swim": {
						neuron[inputName] += Math.random() * 0.5 - 0.25
						neuron[inputName] = Math.max(0, neuron[inputName])
						break
					}
					case "turnUp":
					case "turnDown": {
						neuron[inputName] += Math.random() * 0.5 - 0.25
						neuron[inputName] = Math.max(0, neuron[inputName])
						break
					}
				}
			}
		}

		print(this.neurons)
	}
}
