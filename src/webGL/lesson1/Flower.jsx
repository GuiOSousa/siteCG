import { useEffect, useRef } from "react";
import { Canvas } from "../canvas";
import { ShapeCreator } from "../shapes";

export default function FlowerCanvas() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const c = new Canvas(canvasRef.current);
		c.clearCanvas();

		const green = [0.25, 1.0, 0.25, 1.0]
		const pink = [0.9, 0.0, 0.4, 0.8]
		const yellow = [0.95, 0.6, 0.0, 1.0]

		c.shapeCreator.drawShape([-0.025, 0.0, 0.025, 0.0, 0.025, -0.8, -0.025, -0.8], green);

		const circle = c.shapeCreator.getCirclePoints([0.0, 0.0], 0.2, 12, 0);
		for (let i = 0; i < circle.length - 2; i += 2) {
			let x = circle[i];
			let y = circle[i + 1];
			c.shapeCreator.drawCircle([x, y], 0.075, 18, pink, 0);
		}

		c.shapeCreator.drawCircle([0.0, 0.0], 0.15, 18, yellow, 0);
	}, []);

	return <canvas ref={canvasRef} width={600} height={600}/>;
}
