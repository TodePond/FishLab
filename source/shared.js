import { getKeyboard, getMouse, getPointer } from "../libraries/habitat-import.js"
import { School } from "./fish/school.js"
import { Things } from "./things/things.js"

export const shared = {
	school: new School(),
	things: new Things(),
	keyboard: getKeyboard(),
	pointer: getPointer(),
	mouse: getMouse(),
}

shared.keyboard.d = undefined
