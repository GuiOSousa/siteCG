import { useEffect, useRef } from "react";
import { Canvas } from "../canvas";
import { ShapeCreator } from "../shapes";

export default function PinwheelCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const c = new Canvas(canvasRef.current);
        c.clearCanvas();

        const red = [1.0, 0.25, 0.25, 1.0]
        const grey = [0.1, 0.1, 0.1, 1.0]
        const green = [0.25, 1.0, 0.25, 1.0]
        const blue = [0.2, 0.55, 1.0, 1.0]
        const yellow = [1.0, 1.0, 0.0, 1.0]

        c.shapeCreator.drawShape([
            -0.05, -0.8, -0.05, 0.4,
            0.05, 0.4, 0.05, -0.8,
        ], grey)

        c.shapeCreator.drawShape([
            0.0, 0.4, 0.0, 0.6,
            0.25, 0.6, 0.5, 0.4,
        ], red)

        c.shapeCreator.drawShape([
            -0.1, 0.4, 0.1, 0.4,
            0.1, 0.25, -0.1, 0.0,
        ], green)

        c.shapeCreator.drawShape([
            0.0, 0.4, 0.0, 0.6,
            -0.5, 0.6, -0.25, 0.4,
        ], blue)

        c.shapeCreator.drawShape([
            -0.1, 0.4, 0.1, 0.4,
            0.1, 0.9, -0.1, 0.65,
        ], yellow)

       

    }, []);

    return <canvas ref={canvasRef} width={600} height={600}/>;
}