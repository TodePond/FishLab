export const rotate = (vector, angle, origin = [0, 0]) => {
	const [x, y] = vector
	const [ox, oy] = origin
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return [(x - ox) * cos - (y - oy) * sin + ox, (x - ox) * sin + (y - oy) * cos + oy]
}

export const pointInTriangle = (point, triangle) => {
	const [x, y] = point
	const [[x1, y1], [x2, y2], [x3, y3]] = triangle
	const dX = x - x1
	const dY = y - y1
	const dX21 = x2 - x1
	const dY12 = y1 - y2
	const D = dY12 * (x3 - x1) + dX21 * (y3 - y1)
	const s = dY12 * dX + dX21 * dY
	const t = (y3 - y1) * dX + (x1 - x3) * dY
	return s >= 0 && t >= 0 && s + t <= D
}
