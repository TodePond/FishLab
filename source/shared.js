import { getKeyboard } from "../libraries/habitat-import.js"
import { School } from "./fish/school.js"

export const shared = {
	school: new School(),
	keyboard: getKeyboard(),
}

shared.keyboard.d = undefined
