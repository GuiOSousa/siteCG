import { ShapeCreator } from "./shapes.js"

export class Canvas {
    canvas
    gl
    shapeCreator
    constructor(canvas){
        this.canvas = canvas
        this.gl = this.canvas.getContext('webgl');
        this.shapeCreator = new ShapeCreator(this.gl, this.canvas)
    }

    clearCanvas() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }


}