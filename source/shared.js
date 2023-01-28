import { getKeyboard, getPointer } from "../libraries/habitat-import.js"
import { School } from "./fish/school.js"

export const shared = {
	school: new School(),
	keyboard: getKeyboard(),
	pointer: getPointer(),
}

shared.keyboard.d = undefined
