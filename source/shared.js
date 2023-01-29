import { getKeyboard, getPointer } from "../libraries/habitat-import.js"
import { School } from "./fish/school.js"
import { Things } from "./things/things.js"

export const shared = {
	school: new School(),
	things: new Things(),
	keyboard: getKeyboard(),
	pointer: getPointer(),
}

shared.keyboard.d = undefined
