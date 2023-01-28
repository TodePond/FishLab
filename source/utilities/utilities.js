export const rotate = (vector, angle, origin = [0, 0]) => {
	const [x, y] = vector
	const [ox, oy] = origin
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return [(x - ox) * cos - (y - oy) * sin + ox, (x - ox) * sin + (y - oy) * cos + oy]
}
