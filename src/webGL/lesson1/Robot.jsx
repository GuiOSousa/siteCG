import { useEffect, useRef } from "react";
import { Canvas } from "../canvas.js";
import { ShapeCreator } from "../shapes.js";

export default function RobotCanvas() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const c = new Canvas(canvasRef.current);
		c.clearCanvas();

		c.shapeCreator.drawCircle([0.0, 0.0], 0.5, 4, [0.4, 0.4, 0.4, 1.0], 45.0);
		c.shapeCreator.drawCircle([0.15, 0.15], 0.1, 16, [0.7, 0.1, 0.1, 1.0]);
		c.shapeCreator.drawCircle([-0.15, 0.15], 0.1, 16, [0.7, 0.1, 0.1, 1.0]);

		const square1 = new Float32Array([-0.25, -0.1, -0.25, -0.3, 0.25, -0.3, 0.25, -0.1]);
		const square2 = new Float32Array([-0.15, -0.1, -0.15, -0.3, 0.15, -0.3, 0.15, -0.1]);
		const square3 = new Float32Array([-0.05, -0.1, -0.05, -0.3, 0.05, -0.3, 0.05, -0.1]);

		c.shapeCreator.drawShape(square1, [1.0, 0.1, 0.1, 1.0]);
		c.shapeCreator.drawShape(square2, [1.0, 0.25, 0.25, 1.0]);
		c.shapeCreator.drawShape(square3, [1.0, 0.1, 0.1, 1.0]);
	}, []);

	return <canvas ref={canvasRef} width={600} height={600}/>;
}
