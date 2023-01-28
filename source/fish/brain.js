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
}
