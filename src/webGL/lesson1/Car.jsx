import { useEffect, useRef } from "react";
import { Canvas } from "../canvas";
import { ShapeCreator } from "../shapes";

export default function CarCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const c = new Canvas(canvasRef.current);
        c.clearCanvas();

        const red = [1.0, 0.25, 0.25, 1.0]
        const grey1 = [0.1, 0.1, 0.1, 1.0]
        const grey2 = [0.5, 0.5, 0.5, 1.0]
        const blue = [0.2, 0.55, 1.0, 1.0]

        c.shapeCreator.drawShape([
            -0.75, -0.25, -0.75, 0.0,
            0.75, 0.0, 0.75, -0.25,
        ], red)

        c.shapeCreator.drawShape([
            -0.5, 0.0, -0.25, 0.25,
            0.25, 0.25, 0.5, 0.0,
        ], red)

        c.shapeCreator.drawCircle([0.4, -0.25], 0.15, 16, grey1)
        c.shapeCreator.drawCircle([0.4, -0.25], 0.1, 16, grey2)

        c.shapeCreator.drawCircle([-0.4, -0.25], 0.15, 16, grey1)
        c.shapeCreator.drawCircle([-0.4, -0.25], 0.1, 16, grey2)
        
        c.shapeCreator.drawShape([
            -0.4, 0.0, -0.15, 0.225,
            -0.15, 0.0,
        ], blue)

        c.shapeCreator.drawShape([
            0.4, 0.0, 0.15, 0.225,
            0.15, 0.0,
        ], blue)

    }, []);

    return <canvas ref={canvasRef} width={600} height={600}/>;
}