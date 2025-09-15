import { GLController } from "./gl.js";

export class ShapeCreator {
    gl
    glController
    canvas

    constructor(gl, canvas){
        this.gl = gl
        this.glController = new GLController(this.gl)
        this.canvas = canvas
    }

    getColorAsString(color){
        return `${color[0]}, ${color[1]}, ${color[2]}, ${color[3]}`
    }
    
    clearCanvas() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Preto
        // Limpar o buffer de cor
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    drawTriangle(vertices, color = [1.0, 0.0, 0.0, 1.0]) {
        const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(${this.getColorAsString(color)});
            }
        `;

        const vertexShader = this.glController.createVertexShader(vertexShaderSource)
        const fragmentShader = this.glController.createFragmentShader(fragmentShaderSource)

        const buffer = this.glController.createBuffer(vertices)
        
        const program = this.glController.createProgram(vertexShader, fragmentShader)

        const positionLocation = this.gl.getAttribLocation(program, 'a_position');

        // Configurar como os dados serão lidos do buffer
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Definir área de visualização (viewport)
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        // Definir cor de fundo
        

        // Ativar o programa de shader
        this.gl.useProgram(program);

        // Executar o desenho usando a primitiva desejada
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    drawShape(v, color = [1.0, 0.0, 0.0, 1.0]) {
        const vertices = this.getTrianglePoints(v)
        const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(${this.getColorAsString(color)});
            }
        `;

        const vertexShader = this.glController.createVertexShader(vertexShaderSource)
        const fragmentShader = this.glController.createFragmentShader(fragmentShaderSource)

        const buffer = this.glController.createBuffer(vertices)
        
        const program = this.glController.createProgram(vertexShader, fragmentShader)

        const positionLocation = this.gl.getAttribLocation(program, 'a_position');

        // Configurar como os dados serão lidos do buffer
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Definir área de visualização (viewport)
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        // Definir cor de fundo
        

        // Ativar o programa de shader
        this.gl.useProgram(program);

        // Executar o desenho usando a primitiva desejada
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length);
    }

    drawCircle(center, radius, divisions, color, defaultAngle = 0.0) {
        const vertices = this.getCirclePoints(center, radius, divisions, defaultAngle)

        const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(${this.getColorAsString(color)});
            }
        `;

        const vertexShader = this.glController.createVertexShader(vertexShaderSource)
        const fragmentShader = this.glController.createFragmentShader(fragmentShaderSource)

        const buffer = this.glController.createBuffer(vertices)
        
        const program = this.glController.createProgram(vertexShader, fragmentShader)

        const positionLocation = this.gl.getAttribLocation(program, 'a_position');

        // Configurar como os dados serão lidos do buffer
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Definir área de visualização (viewport)
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.useProgram(program);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, divisions + 2);

    }

    getCirclePoints(center, radius, divisions, defaultAngle = 0.0) {
        const vertices = [...center]

        for (let i = 0; i <= divisions; i++) {
        const angle = (i * 2 * Math.PI / divisions) + this.getAngleAsRadians(defaultAngle);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        vertices.push(x + center[0], y + center[1]);
        }

        vertices.push(vertices[2])
        vertices.push(vertices[3])

    return new Float32Array(vertices);
    }
    
    getTrianglePoints(vertices) {
        console.log(vertices.length)
        const res = []
        for (let i=0; i <= vertices.length - 4; i += 4) {
            if (vertices[i +4] == undefined && vertices[i + 5] == undefined) {
                res.push(vertices[i], vertices[i+1], vertices[i+2], vertices[i+3], vertices[0], vertices[1])
                break
            } else {
                res.push(vertices[i], vertices[i+1], vertices[i+2], vertices[i+3], vertices[i+4], vertices[i+5])
            }
            
            
        }
        
        console.log(res)
        return new Float32Array(res)
    }

    getAngleAsRadians(angle) {
        return angle * 2 * Math.PI / 360;
    }
}