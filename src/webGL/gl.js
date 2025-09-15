export class GLController {
    gl
    constructor(gl){
        this.gl = gl
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Erro ao compilar shader:", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createVertexShader(source) {
        return this.compileShader(this.gl.VERTEX_SHADER, source);

    }

    createFragmentShader(source) {
        return this.compileShader(this.gl.FRAGMENT_SHADER, source);
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Erro ao vincular programa:', this.gl.getProgramInfoLog(program));
        }

        return program
    }

    createBuffer(vertices) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        return buffer
    }


}
